import { useRoute } from "wouter";
import CodeBlock from "@/components/CodeBlock";

export default function EmbedPaste() {
  const [, params] = useRoute("/embed/:slug");

  const sampleContent = `function calculateFactorial(n: number): number {
  if (n <= 1) return 1;
  return n * calculateFactorial(n - 1);
}

const result = calculateFactorial(5);
console.log(\`Factorial of 5 is \${result}\`);

export { calculateFactorial };`;

  return (
    <div className="p-2">
      <CodeBlock code={sampleContent} language="typescript" showLineNumbers={false} />
    </div>
  );
}
