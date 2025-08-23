import { Server } from "socket.io";
import http from "node:http";
import { requireAuthS } from "./core/middlewares/requireAuthS";
import { MessageModel } from "./schemas/message";
import { decodeJWT } from "./core/decodeJWT";
import { UserModel } from "./schemas/user";

export const socket = (server: http.Server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    socket.on("auth/get-user", () =>
      requireAuthS(socket, (userInfo) => {
        socket.emit("server-info", {
          message: "auth/get-user",
          status: 200,
          result: userInfo,
        });
      })
    );

    socket.on("auth/send-message", (event) =>
      requireAuthS(socket, async (userInfo) => {
        await MessageModel.create({
          userId: userInfo.id,
          message: event.message,
        });

        const messages = await Promise.all(
          (
            await MessageModel.find()
          ).map(async (msg) => {
            const user = await UserModel.findById(msg.userId);
            return {
              message: msg.message,
              nickname: user?.nickname || "Unknown",
            };
          })
        );

        for (const [_id, currentSocket] of io.sockets.sockets) {
          const { valid } = decodeJWT(
            currentSocket.handshake.headers.authorization as string
          );
          if (valid) {
            currentSocket.emit("messages", messages);
          } else {
            currentSocket.emit("server-info", {
              message: "You are not authenticated, please refresh your token",
              status: 400,
              result: false,
            });
            currentSocket.disconnect();
          }
        }

        socket.emit("server-info", {
          message: "auth/send-message",
          status: 200,
          result: true,
        });
      })
    );

    socket.emit("server-info", {
      message: "You are connected to the server",
      status: 200,
      result: true,
    });
  });
};
