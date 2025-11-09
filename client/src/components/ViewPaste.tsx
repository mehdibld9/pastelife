import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, FileText, Code, Eye, Lock, Globe, Users } from "lucide-react";
import CodeBlock from "./CodeBlock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CopyButton from "./CopyButton";

interface ViewPasteProps {
  slug: string;
  title?: string;
  content: string;
  language: string;
  privacy: "public" | "unlisted" | "private";
  createdAt: string;
  expiresAt?: string;
  views: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ViewPaste({
  slug,
  title,
  content,
  language,
  privacy,
  createdAt,
  expiresAt,
  views,
  onEdit,
  onDelete
}: ViewPasteProps) {
  const [tokenDialog, setTokenDialog] = useState<"edit" | "delete" | null>(null);
  const [token, setToken] = useState("");
  const [embedDialog, setEmbedDialog] = useState(false);

  const rawUrl = `${window.location.origin}/raw/${slug}`;
  const embedCode = `<iframe src="${window.location.origin}/embed/${slug}" width="100%" height="400" frameborder="0"></iframe>`;

  const handleTokenSubmit = () => {
    console.log(`${tokenDialog} with token:`, token);
    if (tokenDialog === "edit" && onEdit) {
      onEdit();
    } else if (tokenDialog === "delete" && onDelete) {
      onDelete();
    }
    setTokenDialog(null);
    setToken("");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const privacyIcon = {
    public: Globe,
    unlisted: Users,
    private: Lock
  }[privacy];

  const PrivacyIcon = privacyIcon;

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {title && (
                <h1 className="text-lg font-semibold" data-testid="text-paste-title">
                  {title}
                </h1>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="uppercase text-xs">
                  <Code className="w-3 h-3 mr-1" />
                  {language}
                </Badge>
                <Badge variant="secondary" className="uppercase text-xs">
                  <PrivacyIcon className="w-3 h-3 mr-1" />
                  {privacy}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  {views} views
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open(rawUrl, "_blank")}
                data-testid="button-raw"
              >
                <FileText className="w-3 h-3 mr-2" />
                Raw
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setEmbedDialog(true)}
                data-testid="button-embed"
              >
                <Code className="w-3 h-3 mr-2" />
                Embed
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setTokenDialog("edit")}
                data-testid="button-edit"
              >
                <Edit className="w-3 h-3 mr-2" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setTokenDialog("delete")}
                data-testid="button-delete"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
            <span data-testid="text-created-at">Created {formatDate(createdAt)}</span>
            {expiresAt && (
              <>
                <span>•</span>
                <span data-testid="text-expires-at">Expires {formatDate(expiresAt)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <CodeBlock code={content} language={language} />
      </div>

      <Dialog open={tokenDialog !== null} onOpenChange={(open) => !open && setTokenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {tokenDialog === "edit" ? "Edit Paste" : "Delete Paste"}
            </DialogTitle>
            <DialogDescription>
              Enter your secret token to {tokenDialog} this paste.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Secret Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="Enter your secret token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                data-testid="input-token"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setTokenDialog(null)}>
                Cancel
              </Button>
              <Button onClick={handleTokenSubmit} data-testid="button-submit-token">
                {tokenDialog === "edit" ? "Edit" : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={embedDialog} onOpenChange={setEmbedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Embed Paste</DialogTitle>
            <DialogDescription>
              Copy this code to embed the paste in your website.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <code className="text-xs font-mono break-all" data-testid="text-embed-code">
                  {embedCode}
                </code>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <CopyButton text={embedCode} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
