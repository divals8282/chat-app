import { axios } from "../axios";

export const signIn = (data: { email: string; password: string }) => {
  return axios
    .post<{
      credentials: {
        accessToken: string;
        refreshToken: string;
      };
    }>("/sign-in", data)
    .then((res) => {
      const { accessToken, refreshToken: newRefreshToken } =
        res.data.credentials;
      localStorage.setItem(
        "credentials",
        JSON.stringify({ accessToken, refreshToken: newRefreshToken })
      );
      return Promise.resolve(accessToken);
    });
};
