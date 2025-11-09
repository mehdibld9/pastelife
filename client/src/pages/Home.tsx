import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import CreatePaste from "@/components/CreatePaste";
import PasteSuccess from "@/components/PasteSuccess";
import Header from "@/components/Header";

export default function Home() {
  const [successData, setSuccessData] = useState<{ slug: string; secretToken: string } | null>(null);
  const [, setLocation] = useLocation();

  // Check if we're in edit mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editSlug = urlParams.get("edit");
    const token = urlParams.get("token");
    
    if (editSlug && token) {
      // TODO: Implement edit mode - for now just show create form
      console.log("Edit mode:", editSlug, token);
    }
  }, []);

  const handleSuccess = (data: { slug: string; secretToken: string }) => {
    setSuccessData(data);
    // Scroll to top to show success message
    window.scrollTo(0, 0);
  };

  const handleNewPaste = () => {
    setSuccessData(null);
    setLocation("/");
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
