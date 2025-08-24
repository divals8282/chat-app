import a from "axios";

export const axios = a.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
