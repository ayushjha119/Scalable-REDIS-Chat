import { Server, Socket } from "socket.io";
import Redis from "ioredis";
const pub = new Redis({
  host: 
  port: 
  username: 
  password: 
});
const sub = new Redis({
 
});

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket service..");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Listeners");

    io.on("connect", (socket) => {
      console.log(`New Socket connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("new message recievd", message);
        //publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("new message from redis", message);

        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
