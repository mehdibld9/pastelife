import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import CodeBlock from "@/components/CodeBlock";

export default function EmbedPaste() {
  const [, params] = useRoute("/embed/:slug");
  const slug = params?.slug || "";

  const { data: paste, isLoading, error } = useQuery<any>({
    queryKey: ["/api/pastes", slug],
    queryFn: async () => {
      const response = await fetch(`/api/pastes/${slug}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch paste");
      }
      
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="p-4 text-sm text-destructive">
        Failed to load paste
      </div>
    );
  }

  return (
    <div className="p-2">
      <CodeBlock 
        code={paste.content} 
        language={paste.language || "plaintext"} 
        showLineNumbers={false} 
      />
    </div>
  );
}
