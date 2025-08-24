import { Socket } from "socket.io";
import { DecodedTokenI, decodeJWT } from "../decodeJWT";

export const requireAuthS = (
  socket: Socket,
  next: (userInfo: DecodedTokenI) => void
) => {
  const currentToken = socket.handshake.auth.token;
  const tokenValidityResult = decodeJWT(currentToken as string);

  if (!tokenValidityResult.valid) {
    socket.emit("server-info", {
      message: "You are not authenticated, please refresh your token",
      status: 400,
      result: false,
    });

    socket.disconnect();

    return false;
  }

  next(tokenValidityResult.decoded as DecodedTokenI);
};
