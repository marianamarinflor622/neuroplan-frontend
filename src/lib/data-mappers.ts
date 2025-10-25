/**
 * Mappers para convertir datos entre frontend y backend
 * Resuelve las diferencias de nomenclatura entre ambos sistemas
 */

import type { Student, AuthUser } from '@/types/api';
import { UserRole } from '@/types/api';

// ==========================================
// BACKEND → FRONTEND MAPPERS
// ==========================================

/**
 * Mapea un estudiante del backend al formato del frontend
 */
export const mapBackendStudent = (backendStudent: any): Student => ({
  id: backendStudent.id,
  firstName: backendStudent.firstName,
  lastName: backendStudent.lastName,
  birthDate: backendStudent.birthDate,
  grade: backendStudent.grade,
  parentName: backendStudent.parentName,
  parentEmail: backendStudent.parentEmail,
  parentPhone: backendStudent.parentPhone,
  school: backendStudent.school,
  createdAt: backendStudent.createdAt,
  updatedAt: backendStudent.updatedAt,
  reports: backendStudent.reports?.map(mapBackendReport) || [],
  peis: backendStudent.peis?.map(mapBackendPEI) || [],
});

/**
 * Mapea un reporte del backend al formato del frontend
 */
export const mapBackendReport = (backendReport: any) => ({
  id: backendReport.id,
  studentId: backendReport.studentId,
  filename: backendReport.filename,
  originalName: backendReport.originalName,
  mimetype: backendReport.mimetype,
  size: backendReport.size,
  type: backendReport.type,
  uploadedAt: backendReport.uploadedAt,
  processedAt: backendReport.processedAt,
  extractedText: backendReport.extractedText,
});

/**
 * Mapea un PEI del backend al formato del frontend
 */
export const mapBackendPEI = (backendPEI: any) => ({
  id: backendPEI.id,
  studentId: backendPEI.studentId,
  reportId: backendPEI.reportId,
  content: backendPEI.content,
  status: backendPEI.status,
  generatedAt: backendPEI.generatedAt,
  lastModified: backendPEI.lastModified,
});

/**
 * Maps a backend user to the frontend format
 */
export const mapBackendUser = (backendUser: any): AuthUser => ({
  id: backendUser.id,
  email: backendUser.email,
  firstName: backendUser.nombre,
  lastName: backendUser.apellidos,
  rol: mapBackendRole(backendUser.rol),
  centroId: backendUser.centroId,
  centro: backendUser.centro,
  active: backendUser.activo,
  lastLogin: backendUser.lastLogin,
  createdAt: backendUser.createdAt,
  updatedAt: backendUser.updatedAt,
});

/**
 * Mapea el rol del backend al enum del frontend
 */
export const mapBackendRole = (backendRole: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'ADMIN': UserRole.ADMIN,
    'ORIENTADOR': UserRole.ORIENTADOR,
    'PROFESOR': UserRole.PROFESOR,
    'DIRECTOR_CENTRO': UserRole.DIRECTOR_CENTRO,
    'FAMILIA': UserRole.ESTUDIANTE_FAMILIA, // Backend usa FAMILIA, frontend usa ESTUDIANTE_FAMILIA
  };
  
  return roleMap[backendRole] || UserRole.PROFESOR;
};

// ==========================================
// FRONTEND → BACKEND MAPPERS
// ==========================================

/**
 * Mapea un estudiante del frontend al formato del backend
 */
export const mapFrontendStudent = (frontendStudent: Partial<Student>) => ({
  nombre: frontendStudent.firstName,
  apellidos: frontendStudent.lastName,
  fechaNacimiento: frontendStudent.birthDate,
  curso: frontendStudent.grade,
  nombreTutor: frontendStudent.parentName,
  emailTutor: frontendStudent.parentEmail,
  telefonoTutor: frontendStudent.parentPhone,
  colegio: frontendStudent.school,
});

/**
 * Maps a frontend user to the backend format
 */
export const mapFrontendUser = (frontendUser: Partial<AuthUser>) => ({
  email: frontendUser.email,
  nombre: frontendUser.firstName,
  apellidos: frontendUser.lastName,
  rol: mapFrontendRole(frontendUser.rol),
  centroId: frontendUser.centroId,
});

/**
 * Mapea el rol del frontend al formato del backend
 */
export const mapFrontendRole = (frontendRole?: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'ADMIN',
    [UserRole.ORIENTADOR]: 'ORIENTADOR',
    [UserRole.PROFESOR]: 'PROFESOR',
    [UserRole.DIRECTOR_CENTRO]: 'DIRECTOR_CENTRO',
    [UserRole.ESTUDIANTE_FAMILIA]: 'FAMILIA', // Frontend usa ESTUDIANTE_FAMILIA, backend usa FAMILIA
  };
  
  return frontendRole ? roleMap[frontendRole] : 'PROFESOR';
};

// ==========================================
// UTILIDADES
// ==========================================

/**
 * Mapea una respuesta de API del backend al formato esperado por el frontend
 */
export const mapApiResponse = <T>(backendResponse: any, mapper: (data: any) => T) => ({
  data: Array.isArray(backendResponse.data) 
    ? backendResponse.data.map(mapper)
    : mapper(backendResponse.data),
  message: backendResponse.message,
  status: backendResponse.status,
});

/**
 * Mapea una lista de estudiantes del backend
 */
export const mapStudentsResponse = (backendResponse: any) => 
  mapApiResponse(backendResponse, mapBackendStudent);

/**
 * Maps a backend user response
 */
export const mapUserResponse = (backendResponse: any) => 
  mapApiResponse(backendResponse, mapBackendUser);
