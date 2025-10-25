// Normalizer for backend <-> frontend data
export function normalizeStudent(apiStudent: any) {
  return {
    id: apiStudent.id,
    firstName: apiStudent.firstName || apiStudent.first_name,
    lastName: apiStudent.lastName || apiStudent.last_name,
    dateOfBirth: apiStudent.dateOfBirth || apiStudent.birth_date,
    gradeLevel: apiStudent.gradeLevel || apiStudent.grade,
    diagnosis: apiStudent.diagnosis,
    notes: apiStudent.notes,
    createdAt: apiStudent.createdAt || apiStudent.created_at,
    updatedAt: apiStudent.updatedAt || apiStudent.updated_at,
    reports: apiStudent.reports,
    peis: apiStudent.peis,
  };
}

export function normalizePEI(apiPei: any) {
  return {
    id: apiPei.id,
    studentId: apiPei.studentId,
    reportId: apiPei.reportId,
    summary: apiPei.summary,
    diagnosis: apiPei.diagnosis,
    objectives: apiPei.objectives,
    adaptations: apiPei.adaptations,
    strategies: apiPei.strategies,
    evaluation: apiPei.evaluation,
    timeline: apiPei.timeline,
    status: apiPei.status,
    generatedAt: apiPei.generatedAt || apiPei.createdAt,
    lastModified: apiPei.lastModified || apiPei.updatedAt,
    student: apiPei.student,
    report: apiPei.report,
    audioFiles: apiPei.audioFiles,
    resourceLinks: apiPei.resourceLinks,
  };
}
// ...add more normalizers as needed...
