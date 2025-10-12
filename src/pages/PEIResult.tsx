import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Download, 
  Share2, 
  Eye, 
  FileText, 
  Target, 
  BookOpen,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  GraduationCap,
  Star,
  ArrowLeft,
  Print,
  Mail,
  Calendar,
  MapPin,
  Award,
  Lightbulb,
  BarChart3,
  Settings
} from "lucide-react";

const PEIResult = () => {
  const navigate = useNavigate();
  
  // Datos del PEI (en una implementación real, estos vendrían de la API)
  const [peiData] = useState({
    id: "PEI-2024-001",
    studentName: "María González López",
    grade: "4º ESO",
    generatedDate: "2024-01-15",
    validUntil: "2025-01-15",
    status: "active",
    
    // Perfil Neurocognitivo
    neurocognitiveProfile: {
      strengths: [
        { area: "Memoria Visual", score: 85, description: "Excelente capacidad para recordar información visual" },
        { area: "Pensamiento Lógico", score: 78, description: "Buena capacidad de razonamiento matemático" },
        { area: "Creatividad", score: 92, description: "Alta capacidad creativa y artística" },
        { area: "Atención Sostenida", score: 65, description: "Capacidad moderada de concentración" }
      ],
      challenges: [
        { area: "Velocidad de Procesamiento", score: 45, description: "Necesita más tiempo para procesar información" },
        { area: "Memoria de Trabajo", score: 52, description: "Dificultades con tareas que requieren múltiples pasos" }
      ],
      recommendations: [
        "Usar ayudas visuales y mapas mentales",
        "Permitir tiempo extra para exámenes",
        "Dividir tareas complejas en pasos más pequeños",
        "Fomentar el uso de tecnología asistiva"
      ]
    },
    
    // Itinerario Personalizado
    personalizedItinerary: {
      subjects: [
        {
          name: "Matemáticas",
          level: "Adaptado",
          adaptations: ["Calculadora permitida", "Tiempo extra", "Ejercicios visuales"],
          progress: 75
        },
        {
          name: "Lengua Castellana",
          level: "Estándar",
          adaptations: ["Lectura asistida", "Dictado por voz"],
          progress: 85
        },
        {
          name: "Ciencias Naturales",
          level: "Adaptado",
          adaptations: ["Experimentos virtuales", "Resúmenes visuales"],
          progress: 70
        },
        {
          name: "Historia",
          level: "Estándar",
          adaptations: ["Líneas de tiempo interactivas"],
          progress: 80
        }
      ],
      totalProgress: 77
    },
    
    // Adaptaciones Curriculares
    curricularAdaptations: {
      general: [
        "Tiempo extra del 25% en evaluaciones",
        "Uso de tecnología asistiva",
        "Materiales en formato digital",
        "Evaluación continua y formativa"
      ],
      specific: [
        "Matemáticas: Calculadora científica permitida",
        "Lengua: Software de lectura asistida",
        "Ciencias: Laboratorios virtuales",
        "Historia: Mapas interactivos y líneas de tiempo"
      ]
    },
    
    // Metas y Objetivos
    goals: [
      {
        id: 1,
        title: "Mejorar velocidad de procesamiento",
        description: "Aumentar la velocidad de resolución de problemas matemáticos",
        target: "3 meses",
        progress: 60,
        status: "en_progress"
      },
      {
        id: 2,
        title: "Desarrollar estrategias de memoria",
        description: "Implementar técnicas de memorización visual",
        target: "2 meses",
        progress: 80,
        status: "en_progress"
      },
      {
        id: 3,
        title: "Fortalecer atención sostenida",
        description: "Aumentar el tiempo de concentración en tareas",
        target: "4 meses",
        progress: 45,
        status: "en_progress"
      }
    ],
    
    // Documentos y Certificaciones
    documents: [
      {
        name: "PEI Completo",
        type: "PDF",
        size: "2.3 MB",
        date: "2024-01-15"
      },
      {
        name: "Informe Neurocognitivo",
        type: "PDF",
        size: "1.8 MB",
        date: "2024-01-15"
      },
      {
        name: "Itinerario Personalizado",
        type: "PDF",
        size: "1.2 MB",
        date: "2024-01-15"
      }
    ]
  });

  const handleDownload = (documentName: string) => {
    // Simular descarga
    console.log(`Descargando: ${documentName}`);
  };

  const handleShare = () => {
    // Simular compartir
    console.log("Compartiendo PEI");
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Debug: Verificar que la página se está renderizando */}
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded">
          <p className="text-red-800">DEBUG: Página PEIResult se está renderizando correctamente</p>
        </div>
        {/* Header de la página */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PEI Generado
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Pasaporte Educativo Inteligente - {peiData.studentName}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Print className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Información general del PEI */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  PEI #{peiData.id}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Pasaporte Educativo Inteligente generado automáticamente
                </CardDescription>
              </div>
              <Badge className={getStatusColor(peiData.status)}>
                {peiData.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Estudiante</p>
                  <p className="font-medium">{peiData.studentName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Grado</p>
                  <p className="font-medium">{peiData.grade}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Generado</p>
                  <p className="font-medium">{new Date(peiData.generatedDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Válido hasta</p>
                  <p className="font-medium">{new Date(peiData.validUntil).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs con información detallada */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerario</TabsTrigger>
            <TabsTrigger value="adaptations">Adaptaciones</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          {/* Tab: Perfil Neurocognitivo */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Perfil Neurocognitivo
                </CardTitle>
                <CardDescription>
                  Análisis completo de fortalezas y áreas de mejora
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fortalezas */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Fortalezas Identificadas
                  </h3>
                  <div className="grid gap-4">
                    {peiData.neurocognitiveProfile.strengths.map((strength, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-green-800">{strength.area}</h4>
                          <span className={`font-bold ${getScoreColor(strength.score)}`}>
                            {strength.score}%
                          </span>
                        </div>
                        <p className="text-sm text-green-700">{strength.description}</p>
                        <Progress value={strength.score} className="mt-2 h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Áreas de mejora */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Áreas de Mejora
                  </h3>
                  <div className="grid gap-4">
                    {peiData.neurocognitiveProfile.challenges.map((challenge, index) => (
                      <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-yellow-800">{challenge.area}</h4>
                          <span className={`font-bold ${getScoreColor(challenge.score)}`}>
                            {challenge.score}%
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700">{challenge.description}</p>
                        <Progress value={challenge.score} className="mt-2 h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Recomendaciones */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    Recomendaciones
                  </h3>
                  <div className="grid gap-2">
                    {peiData.neurocognitiveProfile.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Itinerario Personalizado */}
          <TabsContent value="itinerary" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Itinerario Personalizado
                </CardTitle>
                <CardDescription>
                  Plan de estudios adaptado a las necesidades específicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progreso General</span>
                    <span className="text-sm font-bold text-primary">{peiData.personalizedItinerary.totalProgress}%</span>
                  </div>
                  <Progress value={peiData.personalizedItinerary.totalProgress} className="h-3" />
                </div>

                <div className="grid gap-4">
                  {peiData.personalizedItinerary.subjects.map((subject, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{subject.name}</h3>
                        <Badge variant={subject.level === "Adaptado" ? "default" : "secondary"}>
                          {subject.level}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Progreso</span>
                          <span className="text-sm font-medium">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Adaptaciones:</h4>
                        <div className="flex flex-wrap gap-2">
                          {subject.adaptations.map((adaptation, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {adaptation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Adaptaciones Curriculares */}
          <TabsContent value="adaptations" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Adaptaciones Curriculares
                </CardTitle>
                <CardDescription>
                  Modificaciones y apoyos para el aprendizaje
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Adaptaciones Generales</h3>
                  <div className="grid gap-3">
                    {peiData.curricularAdaptations.general.map((adaptation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{adaptation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Adaptaciones Específicas por Materia</h3>
                  <div className="grid gap-3">
                    {peiData.curricularAdaptations.specific.map((adaptation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{adaptation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Metas y Objetivos */}
          <TabsContent value="goals" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Metas y Objetivos
                </CardTitle>
                <CardDescription>
                  Objetivos específicos y seguimiento del progreso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {peiData.goals.map((goal) => (
                    <div key={goal.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Meta: {goal.target}
                            </span>
                            <Badge variant={goal.status === "completed" ? "default" : "secondary"}>
                              {goal.status === "completed" ? "Completado" : "En Progreso"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Progreso</span>
                          <span className="text-sm font-bold text-primary">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Documentos */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documentos del PEI
                </CardTitle>
                <CardDescription>
                  Descarga todos los documentos relacionados con tu PEI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {peiData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {doc.size} • {new Date(doc.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc.name)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button size="sm" onClick={() => handleDownload(doc.name)}>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default PEIResult;
