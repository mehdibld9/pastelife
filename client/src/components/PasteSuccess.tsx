import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CopyButton from "./CopyButton";

interface PasteSuccessProps {
  slug: string;
  secretToken: string;
}

export default function PasteSuccess({ slug, secretToken }: PasteSuccessProps) {
  const pasteUrl = `${window.location.origin}/${slug}`;
  const rawUrl = `${window.location.origin}/raw/${slug}`;
  const editUrl = `${window.location.origin}/${slug}?token=${secretToken}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Paste Created Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Save your secret token! You'll need it to edit or delete this paste.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Paste URL
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono border" data-testid="text-paste-url">
                  {pasteUrl}
                </code>
                <CopyButton text={pasteUrl} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Raw URL
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono border" data-testid="text-raw-url">
                  {rawUrl}
                </code>
                <CopyButton text={rawUrl} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Secret Token (for editing/deleting)
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-destructive/10 rounded-md text-sm font-mono border border-destructive/20" data-testid="text-secret-token">
                  {secretToken}
                </code>
                <CopyButton text={secretToken} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Edit URL (includes token)
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono border break-all" data-testid="text-edit-url">
                  {editUrl}
                </code>
                <CopyButton text={editUrl} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
