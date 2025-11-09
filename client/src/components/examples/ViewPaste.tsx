import ViewPaste from '../ViewPaste';

export default function ViewPasteExample() {
  const sampleCode = `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`;

  return (
    <ViewPaste
      slug="abc123"
      title="React Counter Component"
      content={sampleCode}
      language="typescript"
      privacy="public"
      createdAt={new Date().toISOString()}
      expiresAt={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
      views={142}
      onEdit={() => console.log("Edit clicked")}
      onDelete={() => console.log("Delete clicked")}
    />
  );
}
