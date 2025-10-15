// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  ORIENTADOR = 'ORIENTADOR',
  PROFESOR = 'PROFESOR',
  DIRECTOR_CENTRO = 'DIRECTOR_CENTRO',
  ESTUDIANTE_FAMILIA = 'ESTUDIANTE_FAMILIA'
}

export enum ReportType {
  MEDICAL = 'MEDICAL',
  PSYCHOLOGICAL = 'PSYCHOLOGICAL',
  EDUCATIONAL = 'EDUCATIONAL',
  OTHER = 'OTHER'
}

export enum PEIStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  IN_IMPLEMENTATION = 'in_implementation',
  ARCHIVED = 'archived'
}

export enum AudioType {
  FULL_PEI = 'full_pei',
  SUMMARY = 'summary',
  SECTION = 'section'
}

export enum WorkflowStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Interfaces principales
export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  rol: UserRole;
  centroId?: string;
  centro?: {
    id: string;
    nombre: string;
    codigo: string;
  };
  activo: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string; // Backend usa string (UUID)
  name: string;
  lastName: string; // Backend usa lastName, no separado
  birthDate: string; // Backend usa birthDate
  grade: string; // Backend usa grade, no gradeLevel
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  school?: string;
  createdAt: string;
  updatedAt: string;
  reports?: Report[];
  peis?: PEI[];
}

export interface Report {
  id: string; // Backend usa string (UUID)
  studentId: string; // Backend usa string (UUID)
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  type: ReportType;
  uploadedAt: string;
  processedAt?: string;
  extractedText?: string;
  student?: Student;
}

export interface PEI {
  id: string; // Backend usa string (UUID)
  studentId: string; // Backend usa string (UUID)
  reportId: string; // Backend usa string (UUID)
  content: any; // JSON object con la estructura del PEI
  status: PEIStatus;
  generatedAt: string;
  lastModified: string;
  student?: Student;
  report?: Report;
  audioFiles?: AudioFile[];
  resourceLinks?: ResourceLink[];
}

export interface AudioFile {
  id: string; // Backend usa string (UUID)
  peiId: string; // Backend usa string (UUID)
  filename: string;
  originalText: string;
  type: AudioType;
  voiceId: string;
  duration: number;
  size: number;
  createdAt: string;
  pei?: PEI;
}

export interface ResourceLink {
  id: string; // Backend usa string (UUID)
  peiId: string; // Backend usa string (UUID)
  title: string;
  url: string;
  description?: string;
  category: string;
  difficulty?: string;
  rating?: number;
  popularity?: number;
  createdAt: string;
  pei?: PEI;
}

export interface WorkflowExecution {
  id: string; // Backend usa string (UUID)
  workflowName: string;
  status: WorkflowStatus;
  inputData: any;
  outputData?: any;
  executedAt: string;
  completedAt?: string;
  duration?: number;
  errorMessage?: string;
}

export interface ActivityLog {
  id: string; // Backend usa string (UUID)
  actor: string;
  action: string;
  entityType?: string;
  entityId?: string; // Cambiado a string
  details?: any;
  timestamp: string;
}

// DTOs para requests
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
  rol: UserRole;
  centroId?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface CreateStudentDTO {
  name: string;
  lastName: string; // Backend requiere lastName
  birthDate: string; // Backend requiere birthDate (formato: YYYY-MM-DD)
  grade: string; // Backend requiere grade
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  school?: string;
}

export interface GeneratePEIDTO {
  reportId: string; // Backend usa string (UUID)
  studentId?: string; // Backend usa string (UUID)
}

export interface GeneratePEIFromDiagnosisDTO {
  studentId: string;
  diagnosis: string[];
  symptoms?: string[];
  strengths?: string[];
  additionalNotes?: string;
}

export interface UpdatePEIStatusDTO {
  status: PEIStatus;
}

export interface TextToSpeechDTO {
  text: string;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface SearchResourcesDTO {
  query: string;
  filters?: {
    category?: string;
    difficulty?: string;
    minRating?: number;
  };
  limit?: number;
}

export interface TriggerWorkflowDTO {
  workflowName: string;
  data: any;
}

// Tipos adicionales para servicios avanzados
export interface GeneratePEIResourcesDTO {
  limit?: number;
  categories?: string[];
  grade?: string;
}

export interface WorkflowExecutionDetail extends WorkflowExecution {
  pei?: {
    id: string;
    student: {
      name: string;
      lastName: string;
    };
  };
  actions?: string[];
}

export interface TextractResult {
  text: string;
  confidence: number;
  pages: number;
  blocks?: any[];
}

export interface S3UploadResult {
  url: string;
  key: string;
  bucket: string;
  size: number;
}

export interface SentimentAnalysis {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  scores: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
}

export interface EntityDetection {
  entities: Array<{
    text: string;
    type: string;
    score: number;
  }>;
}

// Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Error response
export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  details?: any;
}