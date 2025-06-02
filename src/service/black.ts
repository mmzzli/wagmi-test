import axios from "axios";

export const getList = async () => {
  return axios.get("http://18.163.63.131:3001/black/info");
};

export const searchBlack = async (address: string) => {
  return axios.get(`http://18.163.63.131:3001/black/search?address=${address}`);
};
