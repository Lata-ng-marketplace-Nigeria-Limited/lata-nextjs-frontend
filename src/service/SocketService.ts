import { io, Socket } from "socket.io-client";
import { getCookies } from "@/utils";

export interface SocketOnAuth {
  message: string;
  isAuthorized: boolean;
}

class SocketServe {
  public socket: Socket<any, any> | null = null;
  public onConnect: () => void = () => {};
  public onDisconnect: () => void = () => {};
  public onAuthenticated: (data: SocketOnAuth) => void = () => {};

  constructor() {}

  boot({
    onAuthenticated,
    onConnect,
    onDisconnect,
    token,
  }: {
    onConnect?: () => void;
    onAuthenticated?: (data: SocketOnAuth) => void;
    onDisconnect?: () => void;
    token?: string;
  }) {
    this.onConnect = onConnect || this.onConnect;
    this.onDisconnect = onDisconnect || this.onDisconnect;
    this.onAuthenticated = onAuthenticated || this.onAuthenticated;

    this.socket = io(process.env.NEXT_PUBLIC_CHAT_API_URL || "", {
      reconnectionDelayMax: 10000,
      auth: {
        token: token || getCookies("token"),
      },
    });

    this.socket.on("connect", () => {
      // console.log("socket connected");
      this.onConnect?.();
    });

    this.socket.on("disconnect", () => {
      // console.log("socket disconnected");
      this.onDisconnect?.();
    });

    this.socket.on("socket:auth", (data: SocketOnAuth) => {
      this.onAuthenticated(data);
    });
  }
}

const SocketService = new SocketServe();

export default SocketService;
