import { axios } from "../axios";

export const signUp = (data: {
  email: string;
  password: string;
  nickname: string;
}) => {
  return axios.post("/sign-up", data).then((res) => {
    return Promise.resolve(res);
  });
};
