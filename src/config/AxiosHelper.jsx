import axios from "axios";

// Automatically pick from .env or .env.production
export const baseURL = import.meta.env.VITE_BACKEND_URL;

export const httpClient = axios.create({
  baseURL: baseURL,
});
