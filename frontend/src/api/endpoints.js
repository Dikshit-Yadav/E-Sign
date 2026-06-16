export const ENDPOINTS = {
  COURTS: {
    LIST: "/admin/courts",
    DETAILS: (id) => `/admin/courts/${id}`,
    FULL_DETAILS: (id) => `/admin/courts/${id}/details`,
    DELETE: (id) => `/admin/courts/${id}`,
    ASSIGN_USER: (courtId) =>
      `/admin/courts/${courtId}/users`,
    CREATE: "/admin/courts",
  },
  OFFICER: {
    DOCUMENTS: "/officer/documents",
    GET_SIGNATURE: "/officer/get-signature",
    UPLOAD_SIGNATURE: "/officer/upload-signature",
  },
  DOCUMENTS: {
    LIST: "/documents",
    CREATE: "/documents",
    PREVIEW: (id) => `/documents/${id}/preview`,
    REJECT: (id) => `/documents/${id}/reject`,
    SIGN: (id) => `/documents/${id}/sign`,
    DELETE: (id) => `/documents/${id}`,
    SAVE_TEMPLATE: (id) =>
      `/documents/${id}/save-template`,
    GET_OFFICERS: (id) =>
      `/documents/${id}/officers`,
    SEND_FOR_SIGNATURE: (id) =>
      `/documents/${id}/send`,
  },
  USER: {
    BY_ID: (id) => `/users/${id}`,
  },
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
  },
};