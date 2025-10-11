import { Card } from "@/components/ui/card";
import { Brain, BookOpen, Target, Users, LineChart, Sparkles } from "lucide-react";
import learningPathIcon from "@/assets/learning-path-icon.png";

const features = [
  {
    icon: Brain,
    title: "Perfil Neuroacadémico",
    description: "Análisis personalizado de fortalezas cognitivas, estilo de aprendizaje y necesidades específicas.",
    gradient: "from-primary to-primary-dark",
  },
  {
    icon: Target,
    title: "Itinerario Personalizado",
    description: "Planes educativos completos desde ESO hasta Universidad, adaptados a tu ritmo y objetivos.",
    gradient: "from-secondary to-success",
  },
  {
    icon: BookOpen,
    title: "Recursos Adaptados",
    description: "Materiales educativos diseñados específicamente para diferentes estilos de aprendizaje.",
    gradient: "from-accent to-destructive",
  },
  {
    icon: LineChart,
    title: "Seguimiento Continuo",
    description: "Monitoreo del progreso con ajustes dinámicos del itinerario según tu evolución.",
    gradient: "from-primary-light to-secondary",
  },
  {
    icon: Users,
    title: "Apoyo Colaborativo",
    description: "Coordinación entre estudiantes, familias y docentes para un acompañamiento integral.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Sparkles,
    title: "IA Educativa",
    description: "Asistente inteligente disponible 24/7 para responder dudas y sugerir actividades.",
    gradient: "from-accent to-primary",
  },
];

export const Features = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-1000">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Todo lo que necesitas para{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              brillar
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Herramientas diseñadas con pedagogía inclusiva y tecnología de vanguardia
          </p>
        </div>

        {/* Imagen central */}
        <div className="flex justify-center mb-16 animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-full blur-3xl animate-pulse" />
            <img
              src={learningPathIcon}
              alt="Itinerario de aprendizaje personalizado"
              className="relative w-64 h-64 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Grid de características */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 space-y-4 hover:shadow-glow transition-spring cursor-pointer group animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-elegant`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold group-hover:text-primary transition-smooth">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
