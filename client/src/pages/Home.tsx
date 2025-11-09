import { useState } from "react";
import CreatePaste from "@/components/CreatePaste";
import PasteSuccess from "@/components/PasteSuccess";
import Header from "@/components/Header";

export default function Home() {
  const [successData, setSuccessData] = useState<{ slug: string; secretToken: string } | null>(null);

  const handleSuccess = (data: { slug: string; secretToken: string }) => {
    setSuccessData(data);
  };

  const handleNewPaste = () => {
    setSuccessData(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      {successData ? (
        <PasteSuccess slug={successData.slug} secretToken={successData.secretToken} />
      ) : (
        <CreatePaste onSuccess={handleSuccess} />
      )}
    </div>
  );
}
