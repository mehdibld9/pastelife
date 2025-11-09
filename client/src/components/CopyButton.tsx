import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  size?: "default" | "sm" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
}

export default function CopyButton({ text, size = "sm", variant = "outline", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleCopy}
      className={className}
      data-testid="button-copy"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 mr-2" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 mr-2" />
          Copy
        </>
      )}
    </Button>
  );
}
