import { axios } from "../axios";

export const refreshToken = () => {
  const credentials = localStorage.getItem("credentials");
  if (!credentials) return Promise.reject(new Error("No credentials found"));
  const { refreshToken } = JSON.parse(credentials);

  axios
    .post<{ accessToken: string; refreshToken: string }>("/refrsh-token", {
      refreshToken: refreshToken,
    })
    .then((res) => {
      const { accessToken, refreshToken: newRefreshToken } = res.data;
      localStorage.setItem(
        "credentials",
        JSON.stringify({ accessToken, refreshToken: newRefreshToken })
      );
      return Promise.resolve(accessToken);
    })
    .catch((err) => {
      return Promise.reject({ message: "Failed to refresh token", error: err });
    });
};
