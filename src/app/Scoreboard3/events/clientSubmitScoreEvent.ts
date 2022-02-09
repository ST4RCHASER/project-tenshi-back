import { SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
import { Basketball, Game } from "../Games";
export class clientSubmitScoreEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "score:submit"
    async Run(socket: Socket, server: SocketServer, data: any) {
        if (server.getApp().isInAdminList(socket.id)) {
            if (typeof data == 'undefined') return new SocketSender("score:submit", 400, "no data include").send(socket,server);
            if (typeof data.score == 'undefined') return new SocketSender("score:submit", 400, "no score include").send(socket,server);
            if (typeof data.score.gameType == 'undefined') return new SocketSender("score:submit", 400, "no score type include").send(socket,server);
            if (typeof data.id == 'undefined') return new SocketSender("score:submit", 400, "no game id include").send(socket,server);
            let score: Game | undefined = server.getApp().getScoreByID(data.id);
            if (typeof score == 'undefined') {
                if (typeof data.teams == 'undefined') return new SocketSender("score:submit", 400, `can't update game id ${data.id} not found`).send(socket,server);
            } else {
                if (score.getType() != data.score.gameType) return new SocketSender("score:submit", 400, `can't update score type not match`).send(socket,server);
                let new_score = { ...score.toObject(), ...data.score };
                score.setChildData(new_score);
                new SocketSender("score:single", 201, `meta score id ${data.id} update`, { id: score.getId(), score: new_score }).sendToAll(server);
            }
        } else {
            return new SocketSender("score:submit", 400, "This event require auth").send(socket,server);
        }
    }
}