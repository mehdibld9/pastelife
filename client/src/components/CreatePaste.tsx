import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface CreatePasteProps {
  onSuccess?: (data: { slug: string; secretToken: string }) => void;
}

export default function CreatePaste({ onSuccess }: CreatePasteProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [expiration, setExpiration] = useState("never");
  const [privacy, setPrivacy] = useState("unlisted");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Content is required");
      return;
    }
    
    console.log("Creating paste:", { title, content, language, expiration, privacy });
    
    if (onSuccess) {
      onSuccess({
        slug: "abc123",
        secretToken: "secret-token-xyz789"
      });
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setLanguage("plaintext");
    setExpiration("never");
    setPrivacy("unlisted");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-medium uppercase tracking-wide">
                Title (optional)
              </Label>
              <Input
                id="title"
                placeholder="Untitled paste"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="input-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs font-medium uppercase tracking-wide">
                Content *
              </Label>
              <Textarea
                id="content"
                placeholder="Paste your code here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-96 font-mono text-sm resize-none"
                data-testid="input-content"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-xs font-medium uppercase tracking-wide">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plaintext">Plain Text</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="yaml">YAML</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="bash">Bash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration" className="text-xs font-medium uppercase tracking-wide">
                  Expiration
                </Label>
                <Select value={expiration} onValueChange={setExpiration}>
                  <SelectTrigger id="expiration" data-testid="select-expiration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacy" className="text-xs font-medium uppercase tracking-wide">
                  Privacy
                </Label>
                <Select value={privacy} onValueChange={setPrivacy}>
                  <SelectTrigger id="privacy" data-testid="select-privacy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wide opacity-0">
                  Actions
                </Label>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" data-testid="button-create">
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClear}
            className="flex-1"
            data-testid="button-clear"
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}
