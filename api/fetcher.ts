import axios from "axios";

export const fetcher = axios.create({
  baseURL: "http://13.125.57.208:8000/api/v1/",
});
