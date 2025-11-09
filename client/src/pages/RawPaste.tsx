import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function RawPaste() {
  const [, params] = useRoute("/raw/:slug");
  const slug = params?.slug || "";

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/pastes", slug, "raw"],
    queryFn: async () => {
      const url = token 
        ? `/api/pastes/${slug}/raw?token=${token}`
        : `/api/pastes/${slug}/raw`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      return response.text();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <pre className="p-4 font-mono text-sm">
        Loading...
      </pre>
    );
  }

  if (error) {
    return (
      <pre className="p-4 font-mono text-sm">
        {error instanceof Error ? error.message : "Error loading paste"}
      </pre>
    );
  }

  return (
    <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
      {data}
    </pre>
  );
}
