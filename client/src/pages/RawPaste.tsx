import { useRoute } from "wouter";

export default function RawPaste() {
  const [, params] = useRoute("/raw/:slug");

  const sampleContent = `function calculateFactorial(n: number): number {
  if (n <= 1) return 1;
  return n * calculateFactorial(n - 1);
}

const result = calculateFactorial(5);
console.log(\`Factorial of 5 is \${result}\`);

export { calculateFactorial };`;

  return (
    <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
      {sampleContent}
    </pre>
  );
}
