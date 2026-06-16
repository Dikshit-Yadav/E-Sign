import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getOfficerDocuments = async () => {
  const { data } = await api.get(
    ENDPOINTS.OFFICER.DOCUMENTS
  );

  return data;
};

export const getSignature = async () => {
  const { data } = await api.get(
    ENDPOINTS.OFFICER.GET_SIGNATURE
  );

  return data;
};

export const uploadSignature = async (file) => {
  const formData = new FormData();

  formData.append("signature", file);

  const { data } = await api.post(
    ENDPOINTS.OFFICER.UPLOAD_SIGNATURE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};