import { ModelType, SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
import { GameType } from "../types";
import { Basketball, BasketballQuarter, FootBall, Game, Volleyball, VolleyballSet } from "../Games";
import { Petanque } from "../Games/Petanque";
import { Muzzle } from "../Games/Muzzle";
import { Badminton } from "../Games/Badminton";
import { BadmintonSet } from "../Games/BadmintonSet";
import { MuzzleSet } from "../Games/MuzzleSet";
import { FootballSet } from "../Games/FootballSet";
import { FootballSetRound } from "../Games/FootballSetRound";
export class clientCreateScoreEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "score:create"
    async Run(socket: Socket, server: SocketServer, data: any) {
        try {
            if (typeof data === "string") data = JSON.parse(data);
            if (typeof data == 'undefined') return new SocketSender("score:create", 400, "no data include").send(socket,server);
            if (typeof data.gameType == 'undefined') return new SocketSender("score:create", 400, "no game type include").send(socket,server);
            if (typeof data.name == 'undefined') return new SocketSender("score:create", 400, "no name data include").send(socket,server);
            if (typeof data.stamp == 'undefined') return new SocketSender("score:create", 400, "no stamp data include").send(socket,server);
            if (typeof data.teams == 'undefined') return new SocketSender("score:create", 400, "no teams data include").send(socket,server);
            let game = undefined;
            let scoreDB = server.getApp().getMongoDB().getModel(ModelType.SCORES);
            switch (+data.gameType) {
                case GameType.FOOTBALL_SET:
                    let footballCreateResult = await scoreDB.create({gameType: data.gameType});
                    game = new FootballSet(footballCreateResult.id);
                case GameType.BASKETBALL:
                    let basCreateResult = await scoreDB.create({ gameType: data.gameType });
                    game = new Basketball(basCreateResult._id);
                    break;
                case GameType.FOOTBALL:
                    let footCreateResult = await scoreDB.create({ gameType: data.gameType });
                    game = new FootBall(footCreateResult._id);
                    break;
                case GameType.PETANQUE:
                    let petanqueCreateResult = await scoreDB.create({ gameType: data.gameType });
                    game = new Petanque(petanqueCreateResult._id);
                    break;
                case GameType.VOLLEYBALL:
                    let volCreateResult = await scoreDB.create({ gameType: data.gameType });
                    game = new Volleyball(volCreateResult._id);
                    break;
                case GameType.BADMINTON:
                    let badCreateResult = await scoreDB.create({ gameType: data.gameType });
                    game = new Badminton(badCreateResult._id);
                    break;
                case GameType.MUZZLE:
                    let muzCreateResult = await scoreDB.create({ gameType: data.gameType });
                    game = new Muzzle(muzCreateResult._id);
                    break;
                default:
                    return new SocketSender("score:create", 400, "invalid gameType").send(socket,server);
            }
            if (typeof game == 'undefined') return new SocketSender("score:create", 400, "create failed").send(socket,server);
            game.setName(data.name);
            game.setStamp(data.stamp);
            game.setTeams(data.teams);
            switch (+data.gameType) {
                case GameType.FOOTBALL_SET:
                    (game as FootballSet).setSetsList([
                        new FootballSetRound('ครึ่งแรก').setStamp(data.stamp).setTeams(data.teams).setName(data.name),
                        new FootballSetRound('ครึ่งหลัง').setStamp(data.stamp).setTeams(data.teams).setName(data.name)
                    ]);
                case GameType.BASKETBALL:
                    (game as Basketball).setQuarterList([
                        new BasketballQuarter('1').setQuarter(1).setStamp(data.stamp).setName(data.name + 'Quarter 1').setTeams(data.teams),
                        new BasketballQuarter('2').setQuarter(2).setStamp(data.stamp).setName(data.name + 'Quarter 2').setTeams(data.teams),
                        new BasketballQuarter('3').setQuarter(3).setStamp(data.stamp).setName(data.name + 'Quarter 3').setTeams(data.teams),
                        new BasketballQuarter('4').setQuarter(4).setStamp(data.stamp).setName(data.name + 'Quarter 4').setTeams(data.teams),
                    ]);
                    break;
                case GameType.VOLLEYBALL:
                    (game as Volleyball).setSetsList([
                        new VolleyballSet('1').setStamp(data.stamp).setName(data.name + 'Set 1').setTeams(data.teams),
                        new VolleyballSet('2').setStamp(data.stamp).setName(data.name + 'Set 2').setTeams(data.teams),
                        new VolleyballSet('3').setStamp(data.stamp).setName(data.name + 'Set 3').setTeams(data.teams),
                        new VolleyballSet('4').setStamp(data.stamp).setName(data.name + 'Set 4').setTeams(data.teams),
                        new VolleyballSet('5').setStamp(data.stamp).setName(data.name + 'Set 5').setTeams(data.teams),
                    ]);
                    break;
                case GameType.BADMINTON:
                    (game as Badminton).setSetsList([
                        new BadmintonSet('1').setStamp(data.stamp).setName(data.name + 'Set 1').setTeams(data.teams),
                        new BadmintonSet('2').setStamp(data.stamp).setName(data.name + 'Set 2').setTeams(data.teams),
                        new BadmintonSet('3').setStamp(data.stamp).setName(data.name + 'Set 3').setTeams(data.teams),
                    ]);
                case GameType.MUZZLE:
                    (game as Muzzle).setSetsList([
                        new MuzzleSet('1').setStamp(data.stamp).setName(data.name + 'Set 1').setTeams(data.teams),
                        new MuzzleSet('2').setStamp(data.stamp).setName(data.name + 'Set 2').setTeams(data.teams),
                        new MuzzleSet('3').setStamp(data.stamp).setName(data.name + 'Set 3').setTeams(data.teams),
                    ]);
                default:
            }
            server.getApp().addScore(game);
            new SocketSender('score:create', 201, "score created", { score: game.toObject() }).send(socket,server);
        } catch (err) { 
            console.log(err);
            return new SocketSender("score:create", 400, "invalid data").send(socket,server);
        }
    }
}