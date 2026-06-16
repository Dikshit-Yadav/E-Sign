import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getUserById = async (id) => {
  const { data } = await api.get(
    ENDPOINTS.USER.BY_ID(id)
  );

  return data;
};