import { ModelType, SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
import { FootBall } from "../Games";
import { GameType } from "../types";
export class clientEditScoreEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "score:edit"
    async Run(socket: Socket, server: SocketServer, data: any) {
        try {
            if (typeof data === "string") data = JSON.parse(data);
            if (typeof data == 'undefined') return new SocketSender("score:edit", 400, "no data include").send(socket);
            if (typeof data.id == 'undefined') return new SocketSender("score:edit", 400, "no id include").send(socket);
            let game = server.getApp().getScoreByID(data.id);
            if (typeof game == 'undefined') return new SocketSender("score:edit", 400, "edit failed this score not found").send(socket);
            if (typeof data.name != 'undefined') game.setName(data.name);
            if (typeof data.stamp != 'undefined')  game.setStamp(data.stamp);
            if (typeof data.fb_part != 'undefined' && game.getType() == GameType.FOOTBALL)  (game as FootBall)?.setPart(data.fb_part);
            new SocketSender('score:edit', 201, "score edited", { score: game.toObject() }).send(socket);
        } catch (err) {
            return new SocketSender("score:edit", 400, "invalid data").send(socket);
        }
    }
}