import api from './api';
import type {
  Student,
  Report,
  PEI,
  AudioFile,
  ResourceLink,
  WorkflowExecution,
  CreateStudentDTO,
  GeneratePEIDTO,
  UpdatePEIStatusDTO,
  TextToSpeechDTO,
  SearchResourcesDTO,
  TriggerWorkflowDTO,
  ApiResponse,
} from '../types/api';

// Students & Reports Service
export const studentsService = {
  // Crear estudiante
  create: (data: CreateStudentDTO): Promise<ApiResponse<Student>> =>
    api.post('/uploads/students', data).then(res => res.data),

  // Listar estudiantes
  getAll: (): Promise<ApiResponse<Student[]>> =>
    api.get('/uploads/students').then(res => res.data),

  // Obtener estudiante por ID
  getById: (id: string): Promise<ApiResponse<Student>> =>
    api.get(`/uploads/students/${id}`).then(res => res.data),

  // Subir reporte médico
  uploadReport: (studentId: string, file: File): Promise<ApiResponse<Report>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId); // studentId es string (UUID)
    
    return api.post(`/uploads/reports`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  // Descargar reporte
  downloadReport: (reportId: string): Promise<Blob> =>
    api.get(`/uploads/reports/${reportId}/download`, {
      responseType: 'blob',
    }).then(res => res.data),
};

// PEIs Service
export const peisService = {
  // Generar PEI desde diagnóstico directo (sin archivo)
  generateFromDiagnosis: (data: {
    studentId: string;
    diagnosis: string[];
    symptoms?: string[];
    strengths?: string[];
    additionalNotes?: string;
  }): Promise<ApiResponse<PEI>> =>
    api.post('/peis/generate-from-diagnosis', data).then(res => res.data),

  // Generar PEI desde reporte
  generate: (data: GeneratePEIDTO): Promise<ApiResponse<PEI>> =>
    api.post('/peis/generate', data).then(res => res.data),

  // Listar PEIs
  getAll: (filters?: { status?: string; studentId?: string }): Promise<ApiResponse<PEI[]>> =>
    api.get('/peis', { params: filters }).then(res => res.data),

  // Obtener PEI por ID
  getById: (id: string): Promise<ApiResponse<PEI>> =>
    api.get(`/peis/${id}`).then(res => res.data),

  // Actualizar estado del PEI
  updateStatus: (id: string, data: UpdatePEIStatusDTO): Promise<ApiResponse<PEI>> =>
    api.patch(`/peis/${id}/status`, data).then(res => res.data),

  // Descargar PEI como PDF
  downloadPDF: (id: string): Promise<Blob> =>
    api.get(`/peis/${id}/pdf`, {
      responseType: 'blob',
    }).then(res => res.data),
};

// ElevenLabs Service
export const audioService = {
  // Convertir texto a audio
  textToSpeech: (data: TextToSpeechDTO): Promise<ApiResponse<AudioFile>> =>
    api.post('/elevenlabs/text-to-speech', data).then(res => res.data),

  // Generar audio completo del PEI
  generatePEIAudio: (peiId: string): Promise<ApiResponse<AudioFile>> =>
    api.post(`/elevenlabs/pei/${peiId}/audio`).then(res => res.data),

  // Generar resumen en audio del PEI
  generatePEISummaryAudio: (peiId: string): Promise<ApiResponse<AudioFile>> =>
    api.get(`/elevenlabs/pei/${peiId}/summary-audio`).then(res => res.data),

  // Listar todos los audios de un PEI específico
  listPEIAudios: (peiId: string): Promise<ApiResponse<AudioFile[]>> =>
    api.get(`/elevenlabs/pei/${peiId}/audios`).then(res => res.data),

  // Listar voces disponibles
  getVoices: (): Promise<ApiResponse<any[]>> =>
    api.get('/elevenlabs/voices').then(res => res.data),
};

// Linkup Service
export const resourcesService = {
  // Buscar recursos educativos
  search: (data: SearchResourcesDTO): Promise<ApiResponse<ResourceLink[]>> =>
    api.post('/linkup/search', data).then(res => res.data),

  // Generar recursos automáticos para un PEI
  generateForPEI: (peiId: string, options?: {
    limit?: number;
    categories?: string[];
    grade?: string;
  }): Promise<ApiResponse<any>> =>
    api.post(`/linkup/pei/${peiId}/resources`, options || {}).then(res => res.data),

  // Obtener recursos recomendados para un PEI
  getForPEI: (peiId: string): Promise<ApiResponse<ResourceLink[]>> =>
    api.get(`/linkup/pei/${peiId}/resources`).then(res => res.data),

  // Búsqueda rápida
  quickSearch: (query: string): Promise<ApiResponse<ResourceLink[]>> =>
    api.get(`/linkup/search/${encodeURIComponent(query)}`).then(res => res.data),
};

// n8n Service
export const workflowService = {
  // Disparar workflow personalizado
  trigger: (data: TriggerWorkflowDTO): Promise<ApiResponse<WorkflowExecution>> =>
    api.post('/n8n/trigger-workflow', data).then(res => res.data),

  // Notificar generación de PEI
  notifyPEIGenerated: (peiId: string): Promise<ApiResponse<WorkflowExecution>> =>
    api.post(`/n8n/pei/${peiId}/generated`).then(res => res.data),

  // Notificar aprobación de PEI
  notifyPEIApproved: (peiId: string): Promise<ApiResponse<WorkflowExecution>> =>
    api.post(`/n8n/pei/${peiId}/approved`).then(res => res.data),

  // Obtener historial de ejecuciones
  getExecutions: (): Promise<ApiResponse<WorkflowExecution[]>> =>
    api.get('/n8n/executions').then(res => res.data),

  // Obtener detalles de ejecución específica
  getExecution: (executionId: string): Promise<ApiResponse<WorkflowExecution>> =>
    api.get(`/n8n/execution/${executionId}`).then(res => res.data),

  // Obtener estadísticas de workflows
  getStats: (): Promise<ApiResponse<any>> =>
    api.get('/n8n/stats').then(res => res.data),
};

// Health Check Service
export const healthService = {
  // Verificar estado del servidor (endpoint sin prefijo /api)
  check: async (): Promise<ApiResponse<{ status: string; timestamp: string }>> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  },
};

// AWS Bedrock Service
export const bedrockService = {
  // Listar modelos disponibles
  getModels: (): Promise<ApiResponse<any[]>> =>
    api.get('/aws/bedrock/models').then(res => res.data),

  // Simplificar contenido con Bedrock
  simplifyContent: (data: { text: string; targetLevel?: string }): Promise<ApiResponse<any>> =>
    api.post('/aws/bedrock/simplify-content', data).then(res => res.data),

  // Generar PEI completo con Bedrock
  generatePEI: (data: {
    diagnosis: string[];
    symptoms: string[];
    strengths: string[];
    studentName: string;
    gradeLevel: string;
  }): Promise<ApiResponse<any>> =>
    api.post('/aws/bedrock/generate-pei', data).then(res => res.data),
};

// Auth Service (si se implementa más adelante)
export const authService = {
  // Login placeholder (para futura implementación)
  login: (email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> =>
    api.post('/auth/login', { email, password }).then(res => res.data),

  // Register placeholder
  register: (userData: any): Promise<ApiResponse<{ token: string; user: any }>> =>
    api.post('/auth/register', userData).then(res => res.data),

  // Logout
  logout: (): Promise<void> => {
    localStorage.removeItem('authToken');
    return Promise.resolve();
  },
};

// AWS Services Completo
export const awsService = {
  // ==========================================
  // AWS TEXTRACT - OCR
  // ==========================================
  
  // Extraer texto de documento usando Textract
  extractText: (file: File): Promise<ApiResponse<{ 
    text: string; 
    confidence: number;
    pages: number;
  }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/aws/textract/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  // ==========================================
  // AWS S3 - STORAGE
  // ==========================================
  
  // Subir archivo a S3
  uploadToS3: (file: File, folder?: string): Promise<ApiResponse<{ 
    url: string; 
    key: string;
    bucket: string;
    size: number;
  }>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    return api.post('/aws/s3/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  // Obtener URL firmada para descarga
  getDownloadUrl: (key: string): Promise<ApiResponse<{ url: string }>> =>
    api.get(`/aws/s3/download/${key}`).then(res => res.data),

  // ==========================================
  // AWS COMPREHEND - NLP
  // ==========================================
  
  // Analizar sentimiento del texto
  analyzeSentiment: (text: string): Promise<ApiResponse<any>> =>
    api.post('/aws/comprehend/analyze-sentiment', { text }).then(res => res.data),

  // Detectar entidades en el texto
  detectEntities: (text: string): Promise<ApiResponse<any>> =>
    api.post('/aws/comprehend/detect-entities', { text }).then(res => res.data),

  // Detectar información médica protegida (PHI)
  detectPHI: (text: string): Promise<ApiResponse<any>> =>
    api.post('/aws/comprehend/detect-phi', { text }).then(res => res.data),

  // ==========================================
  // AWS POLLY - TTS (Backup)
  // ==========================================
  
  // Sintetizar voz con Polly
  synthesizeSpeech: (text: string, voiceId?: string): Promise<Blob> =>
    api.post('/aws/polly/synthesize', 
      { text, voiceId: voiceId || 'Lucia' },
      { responseType: 'blob' }
    ).then(res => res.data),

  // Listar voces disponibles en Polly
  listPollyVoices: (): Promise<ApiResponse<any[]>> =>
    api.get('/aws/polly/voices').then(res => res.data),

  // ==========================================
  // AWS PIPELINE COMPLETO
  // ==========================================
  
  // Procesar informe completo (OCR + NLP + Storage + Análisis)
  processReport: (file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/aws/process-report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  // Health check de servicios AWS
  checkHealth: (): Promise<ApiResponse<any>> =>
    api.get('/aws/health').then(res => res.data),
};

// Vonage Service (SMS/Video)
export const vonageService = {
  // Enviar SMS
  sendSMS: (to: string, text: string): Promise<ApiResponse<any>> =>
    api.post('/vonage/sms/send', { to, text }).then(res => res.data),

  // Obtener estado de SMS
  getSMSStatus: (messageId: string): Promise<ApiResponse<any>> =>
    api.get(`/vonage/sms/status/${messageId}`).then(res => res.data),

  // Obtener balance de la cuenta
  getBalance: (): Promise<ApiResponse<any>> =>
    api.get('/vonage/balance').then(res => res.data),
};