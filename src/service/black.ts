import axios from "axios";

export const getList = async () => {
  return axios.get("http://localhost:3000/black/info");
};

export const searchBlack = async (address: string) => {
  return axios.get(`http://localhost:3000/black/search?address=${address}`);
};
