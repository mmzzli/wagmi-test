import axios from "axios";

export const getList = async () => {
  return axios.get("/api/black/info");
};

export const searchBlack = async (address: string) => {
  return axios.get(`/api/black/search?address=${address}`);
};
