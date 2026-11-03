import { request } from '@lm_fe/utils';


export const getInformedConsents = async (pregnancyId) => {
  const result = await request.get(`/api/prenatal-patient-documents?prenatalPatientId.equals=${pregnancyId}`);
  return result.data;
};

export const getInformedConsentById = async (id) => {
  const result = await request.get(`/api/prenatal-patient-documents/${id}`);
  return result.data;
};

export const createInformedConsent = async (data) => {
  const result = await request.post('/api/prenatal-patient-documents', data);
  return result.data;
};

export const updateInformedConsent = async (data) => {
  const result = await request.put('/api/prenatal-patient-documents', data);
  return result.data;
};

export const getAllDiagnosisByPatientId = async (patientId: number) => {
  const result = await request.get(`/api/findDiagnosisByDateVisitType/${patientId}`);
  return result.data;
};
