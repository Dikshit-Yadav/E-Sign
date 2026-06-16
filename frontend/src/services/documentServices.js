import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDocumentPreview = async (id) => {
  const response = await api.get(
    ENDPOINTS.DOCUMENTS.PREVIEW(id),
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getDocuments = async (userId) => {
  const { data } = await api.get(
    ENDPOINTS.DOCUMENTS.LIST,
    {
      params: { userId },
    }
  );

  return data;
};

export const rejectDocument = async (id) => {
  const { data } = await api.put(
    ENDPOINTS.DOCUMENTS.REJECT(id)
  );

  return data;
};

export const signDocument = async (
  id,
  signature
) => {
  const { data } = await api.put(
    ENDPOINTS.DOCUMENTS.SIGN(id),
    { signature }
  );

  return data;
};

export const createDocument = async ({
  title,
  description,
  createdBy,
}) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description || "");
  formData.append("createdBy", createdBy);

  const { data } = await api.post(
    ENDPOINTS.DOCUMENTS.CREATE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const deleteDocument = async (id) => {
  const { data } = await api.delete(
    ENDPOINTS.DOCUMENTS.DELETE(id)
  );

  return data;
};

export const saveDocumentTemplate = async (
  documentId,
  templates
) => {
  const { data } = await api.post(
    ENDPOINTS.DOCUMENTS.SAVE_TEMPLATE(
      documentId
    ),
    {
      documentId,
      templates,
    }
  );

  return data;
};

export const getDocumentOfficers =
  async (documentId) => {
    const { data } = await api.get(
      ENDPOINTS.DOCUMENTS.GET_OFFICERS(
        documentId
      )
    );

    return data;
  };

export const sendForSignature = async (
  documentId,
  officerId
) => {
  const { data } = await api.post(
    ENDPOINTS.DOCUMENTS.SEND_FOR_SIGNATURE(
      documentId
    ),
    {
      officerId,
    }
  );

  return data;
};