import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
          {/* Contenido */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium shadow-elegant">
              <Sparkles className="h-4 w-4" />
              <span>Plataforma educativa inclusiva</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Itinerarios educativos{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                personalizados
              </span>{" "}
              para cada estudiante
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Creamos planes académicos adaptados a las necesidades de estudiantes neurodivergentes,
              alineados con LOMLOE, CRUE y MECES. De ESO a Universidad, tu camino educativo personalizado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Comenzar ahora
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                Ver demo
              </Button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Estudiantes activos</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-secondary">95%</div>
                <div className="text-sm text-muted-foreground">Satisfacción</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Soporte IA</div>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="Estudiantes colaborando en un ambiente educativo inclusivo"
              className="relative rounded-3xl shadow-glow w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
