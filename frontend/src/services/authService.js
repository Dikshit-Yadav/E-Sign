import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const login = async (credentials) => {
  const { data } = await api.post(
    ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post(
    ENDPOINTS.AUTH.LOGOUT
  );

  return data;
};

export const getProfile = async () => {
  const { data } = await api.get(
    ENDPOINTS.AUTH.PROFILE
  );

  return data;
};