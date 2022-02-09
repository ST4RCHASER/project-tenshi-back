import { SocketServer } from "@yukiTenshi/app";
import { Game } from "../Games";
import { SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
export class clientGameMetaUpdateEvent implements SocketEvent {
    Enable: boolean = true;
    Name: string = 'meta:update'
    Run(socket: Socket, server: SocketServer, data: any) {
        if (server.getApp().isInAdminList(socket.id)) {
            if (typeof data == undefined) return new SocketSender("meta:update", 400, "no data include").send(socket, server);
            if (typeof data.meta == undefined) return new SocketSender("meta:update", 400, "no meta inclide").send(socket, server);
            if (typeof data.meta.metaType == undefined) return new SocketSender("meta:update", 400, "no meta type include").send(socket, server);
            if (typeof data.id == undefined) return new SocketSender("meta:update", 400, "no game id include").send(socket, server);
            let score: Game | undefined = server.getApp().getScoreByID(data.id);
            if (typeof score == 'undefined') {
                if (typeof data.teams == undefined) return new SocketSender("meta:update", 400, `can't update game id ${data.id} not found`).send(socket, server);
            } else {
                if (score.getType() != data.meta.metaType) return new SocketSender("meta:update", 400, `can't update meta type not match`).send(socket, server);
                let new_score = { ...score.toObject(), ...data.meta };
                score.setChildData(new_score);
                new SocketSender("meta:update", 201, `meta score id ${data.id} update`, { id: score.getId(), meta: new_score }).sendToAll(server);
            }
        } else {
            return new SocketSender("meta:update", 400, "This event require auth").send(socket, server);
        }
    }
}