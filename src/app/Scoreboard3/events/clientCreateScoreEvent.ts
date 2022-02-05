import { ModelType, SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
import { GameType } from "../types";
import { Basketball, BasketballQuarter, FootBall } from "../Games";
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
            let scoreDB = server.getApp().getMongoDB().getModel(ModelType.SCORES);
            switch (+data.gameType) {
                case GameType.BASKETBALL:
                    let basCreateResult = await scoreDB.create({ gameType: data.gameType });
                    game = new Basketball(basCreateResult._id);
                    break;
                case GameType.FOOTBALL:
                    let footCreateResult = await scoreDB.create({ gameType: data.gameType });
                    game = new FootBall(footCreateResult._id);
                    break;
                default:
                    return new SocketSender("score:create", 400, "invalid gameType").send(socket);
            }
            if (typeof game == 'undefined') return new SocketSender("score:create", 400, "create failed").send(socket);
            game.setName(data.name);
            game.setStamp(data.stamp);
            game.setTeams(data.teams);
            switch (+data.gameType) {
                case GameType.BASKETBALL:
                    (game as Basketball).setQuarterList([
                        new BasketballQuarter('1').setQuarter(1).setStamp(data.stamp).setName(data.name + 'Quarter 1').setTeams(data.teams),
                        new BasketballQuarter('2').setQuarter(2).setStamp(data.stamp).setName(data.name + 'Quarter 2').setTeams(data.teams),
                        new BasketballQuarter('3').setQuarter(3).setStamp(data.stamp).setName(data.name + 'Quarter 3').setTeams(data.teams),
                        new BasketballQuarter('4').setQuarter(4).setStamp(data.stamp).setName(data.name + 'Quarter 4').setTeams(data.teams),
                        
                    ]);
                    break;
                default:
            }
            server.getApp().addScore(game);
            new SocketSender('score:create', 201, "score created", { score: game.toObject() }).send(socket);
        } catch (err) {
            return new SocketSender("score:create", 400, "invalid data").send(socket);
        }
    }
}