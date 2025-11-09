import CreatePaste from '../CreatePaste';

export default function CreatePasteExample() {
  return <CreatePaste onSuccess={(data) => console.log("Paste created:", data)} />;
}
