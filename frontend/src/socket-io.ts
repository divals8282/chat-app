import { io, Socket } from "socket.io-client";
import axios from "axios";

class SocketClient {
  private socket: Socket | null = null;
  private listeners: (() => Socket)[] = [];

  private reinitializeConnection() {
    const credentialsInStorage = localStorage.getItem("credentials");
    if (!credentialsInStorage) {
      throw new Error("SocketIO: No credentials found in local storage");
    }

    const credentials = JSON.parse(credentialsInStorage);
    const refreshToken = credentials.refreshToken;
    axios
      .post<{
        credentials: {
          accessToken: string;
          refreshToken: string;
        };
      }>(`${import.meta.env.VITE_BACKEND_URL}/refresh-token`, {
        refreshToken,
      })
      .then((response) => {
        localStorage.setItem(
          "credentials",
          JSON.stringify(response.data.credentials)
        );
        const accessToken = response.data.credentials.accessToken;
        this.socket?.disconnect();

        if (this.socket) {
          this.socket.auth = {
            ...this.socket.auth,
            token: accessToken,
          };
        }

        this.socket?.connect();
        this.listeners.forEach((c) => c());
      });
  }

  private listenServerInfo() {
    this.socket?.on("server-info", (data) => {
      console.info("Server info:", data);

      if (data.status === 400) {
        this.reinitializeConnection();
      }
    });
  }

  public initializeConection() {
    return new Promise((resolve) => {
      const credentialsInStorage = localStorage.getItem("credentials");
      if (!credentialsInStorage) {
        throw new Error("SocketIO: No credentials found in local storage");
      }

      const credentials = JSON.parse(credentialsInStorage);

      const accessToken = credentials.accessToken;

      this.socket = io(import.meta.env.VITE_BACKEND_URL, {
        auth: {
          token: accessToken,
        },
        reconnection: false,
      });

      this.socket.connect();
      this.listenServerInfo();
      resolve(true);
    });
  }
  public send<DataTypeT>(to: string, data: DataTypeT) {
    return this.socket?.emit(to, data);
  }

  public listen<DataT>(to: string, callback: (data: DataT) => void) {
    if (!this.socket) {
      throw new Error("Socket is not initialized");
    }
    this.socket.on(to, callback);
    return true;
  }
}

export const socketClient = new SocketClient();
