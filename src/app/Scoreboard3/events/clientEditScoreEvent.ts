import { ModelType, SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
export class clientEditScoreEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "score:edit"
    async Run(socket: Socket, server: SocketServer, data: any) {
        try {
            if (typeof data === "string") data = JSON.parse(data);
            if (typeof data == 'undefined') return new SocketSender("score:edit", 400, "no data include").send(socket);
            if (typeof data.id == 'undefined') return new SocketSender("score:edit", 400, "no id include").send(socket);
            if (typeof data.name == 'undefined') return new SocketSender("score:edit", 400, "no name data include").send(socket);
            if (typeof data.stamp == 'undefined') return new SocketSender("score:edit", 400, "no stamp data include").send(socket);
            let game = server.getApp().getScoreByID(data.id);
            if (typeof game == 'undefined') return new SocketSender("score:edit", 400, "edit failed this score not found").send(socket);
            game.setName(data.name);
            game.setStamp(data.stamp);
            new SocketSender('score:edit', 201, "score edited", { score: game.toObject() }).send(socket);
        } catch (err) {
            return new SocketSender("score:edit", 400, "invalid data").send(socket);
        }
    }
}