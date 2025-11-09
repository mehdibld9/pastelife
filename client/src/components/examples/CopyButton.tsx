import CopyButton from '../CopyButton';

export default function CopyButtonExample() {
  return (
    <div className="p-4 space-y-4">
      <CopyButton text="https://paste.life/abc123" />
      <CopyButton text="secret-token-xyz" variant="ghost" />
    </div>
  );
}
