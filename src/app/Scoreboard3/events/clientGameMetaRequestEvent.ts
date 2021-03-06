import { SocketServer } from "@yukiTenshi/app";
import { Game } from "../Games";
import { SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
export class clientGameMetaRequestEvent implements SocketEvent {
    Enable: boolean = true;
    Name: string = 'meta:request'
    Run(socket: Socket, server: SocketServer, data: any) {
            if (typeof data == undefined) return new SocketSender("meta:request", 400, "no data include").send(socket,server);
            if (typeof data.id == undefined) return new SocketSender("meta:request", 400, "no game id include").send(socket,server);
            let score: Game | undefined = server.getApp().getScoreByID(data.id);
            if (typeof score == 'undefined') {
                if (typeof data.teams == undefined) return new SocketSender("meta:request", 400, `can't get game id ${data.id} not found`).send(socket,server);
            } else {
                new SocketSender("meta:request", 201, `meta score id ${data.id}`, {id: score.getId(), meta: score.toObject().gameMeta}).send(socket,server);
            }
    }
}