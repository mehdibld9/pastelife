import CodeBlock from '../CodeBlock';

export default function CodeBlockExample() {
  const sampleCode = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`;

  return (
    <div className="p-4">
      <CodeBlock code={sampleCode} language="typescript" />
    </div>
  );
}
