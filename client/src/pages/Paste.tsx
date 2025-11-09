import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ViewPaste from "@/components/ViewPaste";
import ExpiredPaste from "@/components/ExpiredPaste";
import { Card, CardContent } from "@/components/ui/card";

export default function Paste() {
  const [, params] = useRoute("/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug || "";

  // Get token from URL query params if present
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const { data: paste, isLoading, error } = useQuery<any>({
    queryKey: ["/api/pastes", slug, token],
    queryFn: async () => {
      const url = token 
        ? `/api/pastes/${slug}?token=${token}`
        : `/api/pastes/${slug}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const error: any = new Error("Failed to fetch paste");
        error.response = { status: response.status };
        throw error;
      }
      
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading paste...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !paste) {
    const errorResponse = error as any;
    const status = errorResponse?.response?.status;

    if (status === 410) {
      return (
        <div className="min-h-screen">
          <Header />
          <ExpiredPaste />
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-lg font-semibold">Paste Not Found</p>
              <p className="text-muted-foreground">
                {status === 403 
                  ? "This paste is private. You need the secret token to view it."
                  : "The paste you're looking for doesn't exist or has been deleted."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <ViewPaste
        slug={paste.slug}
        title={paste.title}
        content={paste.content}
        language={paste.language || "plaintext"}
        privacy={paste.privacy}
        createdAt={paste.created_at}
        expiresAt={paste.expires_at}
        views={paste.views}
        onEdit={() => setLocation(`/?edit=${slug}`)}
        onDelete={() => setLocation("/")}
      />
    </div>
  );
}
