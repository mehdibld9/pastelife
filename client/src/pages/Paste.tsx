import { useRoute } from "wouter";
import Header from "@/components/Header";
import ViewPaste from "@/components/ViewPaste";
import ExpiredPaste from "@/components/ExpiredPaste";

export default function Paste() {
  const [, params] = useRoute("/:slug");
  
  const isExpired = false;

  const samplePaste = {
    slug: params?.slug || "",
    title: "Example TypeScript Function",
    content: `function calculateFactorial(n: number): number {
  if (n <= 1) return 1;
  return n * calculateFactorial(n - 1);
}

const result = calculateFactorial(5);
console.log(\`Factorial of 5 is \${result}\`);

export { calculateFactorial };`,
    language: "typescript",
    privacy: "public" as const,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    views: 47
  };

  if (isExpired) {
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
      <ViewPaste
        {...samplePaste}
        onEdit={() => console.log("Edit paste")}
        onDelete={() => console.log("Delete paste")}
      />
    </div>
  );
}
