import { SocketServer } from "@yukiTenshi/app";
import { Game } from "../Games";
import { SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
export class clientTeamUpdateEvent implements SocketEvent {
    Enable: boolean = true;
    Name: string = 'team:update'
    Run(socket: Socket, server: SocketServer, data: any) {
        if (server.getApp().isInAdminList(socket.id)) {
            if (typeof data == undefined) return new SocketSender("team:update", 400, "no data include").send(socket);
            if (typeof data.id == undefined) return new SocketSender("team:update", 400, "no game id include").send(socket);
            if (typeof data.teams == undefined) return new SocketSender("team:update", 400, "no team data include").send(socket);
            let score: Game | undefined = server.getApp().getScoreByID(data.id);
            if (typeof score == 'undefined') {
                if (typeof data.teams == undefined) return new SocketSender("team:update", 400, `can't update game id ${data.id} not found`).send(socket);
            } else {
                score.setTeams(data.teams);
                new SocketSender("team:update", 201, `team id ${data.id} update`, {id: score.getId(), teams: score.getTeams()}).sendToAll(socket);
            }
        } else {
            return new SocketSender("team:update", 400, "This event require auth").send(socket);
        }
    }
}