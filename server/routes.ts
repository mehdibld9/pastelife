import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabaseAdmin } from "./supabase";
import { generateSlug, generateSecretToken } from "./utils/slug";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 pastes per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // Filter out old requests
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create paste
  app.post("/api/pastes", async (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      
      if (!checkRateLimit(ip)) {
        return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
      }

      const { title, content, language, privacy, expiration } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "Content is required" });
      }

      const slug = generateSlug();
      const secretToken = generateSecretToken();

      let expiresAt = null;
      if (expiration && expiration !== 'never') {
        const now = new Date();
        switch (expiration) {
          case '1h':
            expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
            break;
          case '1d':
            expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            break;
          case '1w':
            expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
        }
      }

      const { data, error } = await supabaseAdmin
        .from('pastes')
        .insert({
          slug,
          title: title || null,
          content,
          language: language || 'plaintext',
          privacy: privacy || 'unlisted',
          secret_token: secretToken,
          expires_at: expiresAt,
          views: 0
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: "Failed to create paste" });
      }

      res.json({
        slug: data.slug,
        secretToken
      });
    } catch (error) {
      console.error("Error creating paste:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get paste by slug
  app.get("/api/pastes/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { token } = req.query;

      const { data, error } = await supabaseAdmin
        .from('pastes')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: "Paste not found" });
      }

      // Check if expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return res.status(410).json({ error: "Paste has expired" });
      }

      // Check privacy
      if (data.privacy === 'private') {
        if (!token || token !== data.secret_token) {
          return res.status(403).json({ error: "Access denied. Secret token required." });
        }
      }

      // Increment view count (fire and forget)
      supabaseAdmin
        .from('pastes')
        .update({ views: data.views + 1 })
        .eq('slug', slug)
        .then();

      // Don't send secret_token to client
      const { secret_token, ...pasteData } = data;
      
      res.json({
        ...pasteData,
        views: data.views + 1 // Return incremented count
      });
    } catch (error) {
      console.error("Error fetching paste:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Edit paste
  app.patch("/api/pastes/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { token, title, content, language, privacy, expiration } = req.body;

      if (!token) {
        return res.status(401).json({ error: "Secret token required" });
      }

      // Verify token
      const { data: existingPaste, error: fetchError } = await supabaseAdmin
        .from('pastes')
        .select('*')
        .eq('slug', slug)
        .single();

      if (fetchError || !existingPaste) {
        return res.status(404).json({ error: "Paste not found" });
      }

      if (existingPaste.secret_token !== token) {
        return res.status(403).json({ error: "Invalid secret token" });
      }

      let expiresAt = existingPaste.expires_at;
      if (expiration !== undefined) {
        if (expiration === 'never') {
          expiresAt = null;
        } else {
          const now = new Date();
          switch (expiration) {
            case '1h':
              expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
              break;
            case '1d':
              expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
              break;
            case '1w':
              expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
              break;
          }
        }
      }

      const { data, error } = await supabaseAdmin
        .from('pastes')
        .update({
          title: title !== undefined ? title : existingPaste.title,
          content: content !== undefined ? content : existingPaste.content,
          language: language !== undefined ? language : existingPaste.language,
          privacy: privacy !== undefined ? privacy : existingPaste.privacy,
          expires_at: expiresAt
        })
        .eq('slug', slug)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: "Failed to update paste" });
      }

      const { secret_token, ...pasteData } = data;
      res.json(pasteData);
    } catch (error) {
      console.error("Error updating paste:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete paste
  app.delete("/api/pastes/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { token } = req.body;

      if (!token) {
        return res.status(401).json({ error: "Secret token required" });
      }

      // Verify token
      const { data: existingPaste, error: fetchError } = await supabaseAdmin
        .from('pastes')
        .select('secret_token')
        .eq('slug', slug)
        .single();

      if (fetchError || !existingPaste) {
        return res.status(404).json({ error: "Paste not found" });
      }

      if (existingPaste.secret_token !== token) {
        return res.status(403).json({ error: "Invalid secret token" });
      }

      const { error } = await supabaseAdmin
        .from('pastes')
        .delete()
        .eq('slug', slug);

      if (error) {
        return res.status(500).json({ error: "Failed to delete paste" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting paste:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get raw paste content
  app.get("/api/pastes/:slug/raw", async (req, res) => {
    try {
      const { slug } = req.params;
      const { token } = req.query;

      const { data, error } = await supabaseAdmin
        .from('pastes')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return res.status(404).send("Paste not found");
      }

      // Check if expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return res.status(410).send("Paste has expired");
      }

      // Check privacy
      if (data.privacy === 'private') {
        if (!token || token !== data.secret_token) {
          return res.status(403).send("Access denied");
        }
      }

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(data.content);
    } catch (error) {
      console.error("Error fetching raw paste:", error);
      res.status(500).send("Internal server error");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
