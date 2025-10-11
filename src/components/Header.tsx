import { Button } from "@/components/ui/button";
import { GraduationCap, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <div className="rounded-lg bg-gradient-hero p-2 shadow-elegant">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            NeuroEducar
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth">
            Inicio
          </Link>
          <Link to="/perfil" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth">
            Perfil
          </Link>
          <Link to="/itinerario" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth">
            Itinerario
          </Link>
          <Link to="/recursos" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-smooth">
            Recursos
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="hero" size="sm" className="hidden md:inline-flex">
            Crear Perfil
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
