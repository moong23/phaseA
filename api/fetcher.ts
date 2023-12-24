import axios from "axios";

export const fetcher = axios.create({
  baseURL: "http://52.79.231.223:8000/api/v1/",
});
