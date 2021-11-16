import { ModelType, SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
import { GameType } from "../types";
import { Basketball } from "../Games";
export class clientCreateScoreEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "score:create"
    async Run(socket: Socket, server: SocketServer, data: any) {
        try {
            if (typeof data === "string") data = JSON.parse(data);
            if (typeof data == 'undefined') return new SocketSender("score:create", 400, "no data include").send(socket);
            if (typeof data.gameType == 'undefined') return new SocketSender("score:create", 400, "no game type include").send(socket);
            if (typeof data.name == 'undefined') return new SocketSender("score:create", 400, "no name data include").send(socket);
            if (typeof data.stamp == 'undefined') return new SocketSender("score:create", 400, "no stamp data include").send(socket);
            if (typeof data.teams == 'undefined') return new SocketSender("score:create", 400, "no teams data include").send(socket);
            let game = undefined;
            switch (+data.gameType) {
                case GameType.BASKETBALL:
                    let scoreDB = server.getApp().getMongoDB().getModel(ModelType.SCORES);
                    let createResult = await scoreDB.create({ gameType: data.gameType });
                    game = new Basketball(createResult._id,);
                    break;
                default:
                    return new SocketSender("score:create", 400, "invalid gameType").send(socket);
            }
            if (typeof game == 'undefined') return new SocketSender("score:create", 400, "create failed").send(socket);
            game.setName(data.name);
            game.setStamp(data.stamp);
            game.setTeams(data.teams);
            server.getApp().addScore(game);
            new SocketSender('score:create', 201, "score created", { score: game.toObject() }).send(socket);
        } catch (err) {
            return new SocketSender("score:create", 400, "invalid data").send(socket);
        }
    }
}