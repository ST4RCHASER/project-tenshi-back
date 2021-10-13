import { ExpressServer, SocketServer,MongoDBClient } from '@yukiTenshi/app';
import { LogType, LogLevel, Logger, ModelType } from '@yukiTenshi/utils';
import { Game } from './Games/Game';
import { clientConnectedEvent, clientDisconnectEvent, clientRequestScoreEvent, clientTeamUpdateEvent } from './events';
import { Basketball } from './Games';
export class Scoreboard3 {
    private expressServer: ExpressServer;
    private socketServer: SocketServer;
    private mongodb: MongoDBClient;
    private logger: Logger;
    private scoreList: Game[]
    private lastSave: Game[]
    private adminList: string[];
    constructor(expressServer: ExpressServer, socketServer: SocketServer, mongodb: MongoDBClient) {
        this.expressServer = expressServer;
        this.socketServer = socketServer;
        this.mongodb = mongodb;
        this.logger = new Logger();
        return this;
    }
    public async start() {
        //Register slef
        this.socketServer.setApp(this);
        //Register event
        this.socketServer.registerEvent(new clientConnectedEvent());
        this.socketServer.registerEvent(new clientDisconnectEvent());
        this.socketServer.registerEvent(new clientRequestScoreEvent());
        this.socketServer.registerEvent(new clientTeamUpdateEvent());
        this.log("Server started");
        this.loadAllScores();
        // setTimeout(() => { console.log(this.getScoreList()) }, 1000);
        setInterval(() => {
            if (this.scoreList != this.lastSave) {
                this.log("Starting auto save...");
                let gameList = this.getMongoDB().getModel(ModelType.SCORES);
                for (const singleScore of this.getScoreList()) {
                    gameList.findByIdAndUpdate(singleScore.getId(),{
                        gameType: singleScore.getType(), 
                        name: singleScore.getName(),
                        quater: (<Basketball> singleScore).getQuarter(),
                        stamp: singleScore.getStamp(),
                        state: singleScore.getState(),
                        teams: singleScore.getTeams(),
                        timer: singleScore.getTimer()
                    })
                }
                this.log("Auto saved complete!");
                this.lastSave = this.scoreList;
            }
        }, 1000 * 60);
    }
    public self(): Scoreboard3 {
        return this;
    }
    public log(message: string, level: LogLevel = LogLevel.INFO): void {
        this.logger.raw(level, LogType.APP, message);
    }
    public getMongoDB(): MongoDBClient {
        return this.mongodb;
    }
    public getExpress(): ExpressServer {
        return this.expressServer;
    }
    private async loadAllScores(): Promise<void> {
        this.scoreList = [];
        let gameList = this.getMongoDB().getModel(ModelType.SCORES);
        let _ = this;
        let data = await gameList.find({});
        for (const score of data) {
            let game: Game;
            switch (score._id) {
                case 1:
                    game = new Basketball(score._id);;
                    break;
                default:
                    game = new Game(score._id);
            }
            game.setChildData(score);
            _.log("Score (" + game.getType() + ") id: " + score._id + " loaded!");
            _.scoreList.push(game)
        }
    }
    getScoreList() {
        return this.scoreList;
    }
    getScoreByID(id: string): Game | undefined {
        return this.scoreList.find(x => x.getId() == id);
    }
    isInAdminList(socketID: string): boolean {
        return this.adminList.find(x => x == socketID) != null;
    }
}