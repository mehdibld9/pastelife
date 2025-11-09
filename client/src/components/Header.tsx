import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 sticky top-0 bg-background z-50">
      <Link href="/">
        <span className="text-xl font-bold hover-elevate active-elevate-2 px-3 py-2 rounded-md -ml-3 cursor-pointer" data-testid="link-home">
          Paste-Life
        </span>
      </Link>
      
      <div className="flex items-center gap-2">
        <Link href="/">
          <span>
            <Button size="default" data-testid="button-new-paste">
              <Plus className="w-4 h-4 mr-2" />
              New Paste
            </Button>
          </span>
        </Link>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
