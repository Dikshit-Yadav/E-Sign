import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getCourts = async () => {
  const { data } = await api.get(ENDPOINTS.COURTS.LIST);
  return data;
};

export const getCourtById = async (id) => {
  const { data } = await api.get(
    ENDPOINTS.COURTS.DETAILS(id)
  );

  return data;
};

export const getCourtDetails = async (id) => {
  const { data } = await api.get(
    ENDPOINTS.COURTS.FULL_DETAILS(id)
  );

  return data;
};

export const deleteCourt = async (id) => {
  const { data } = await api.delete(
    ENDPOINTS.COURTS.DELETE(id)
  );

  return data;
};

export const assignUserToCourt = async (
  courtId,
  userData
) => {
  const { data } = await api.post(
    ENDPOINTS.COURTS.ASSIGN_USER(courtId),
    userData
  );

  return data;
};

export const createCourt = async (payload) => {
  const { data } = await api.post(
    ENDPOINTS.COURTS.CREATE,
    payload
  );

  return data;
};