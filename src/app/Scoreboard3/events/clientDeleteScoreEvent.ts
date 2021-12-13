import { ModelType, SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
export class clientDeleteScoreEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "score:delete"
    async Run(socket: Socket, server: SocketServer, data: any) {
        try {
            if (typeof data === "string") data = JSON.parse(data);
            if (typeof data == 'undefined') return new SocketSender("score:delete", 400, "no data include").send(socket);
            if (typeof data.id == 'undefined') return new SocketSender("score:delete", 400, "no id include").send(socket);
            // let score: Game | undefined = server.getApp().getScoreByID(data.id);
            await server.getApp().deleteScore(data.id);
            new SocketSender('score:delete', 201, "score deleted").send(socket);
        } catch (err) {
            return new SocketSender("score:delete", 400, "invalid data").send(socket);
        }
    }
}