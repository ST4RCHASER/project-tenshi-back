import { ExpressServer, SocketServer, MongoDBClient } from '@yukiTenshi/app';
import { LogType, LogLevel, Logger, ModelType } from '@yukiTenshi/utils';
import { Game } from './Games/Game';
import { clientConnectedEvent, clientDisconnectEvent, clientRequestScoreEvent, clientTeamUpdateEvent, clientCreateScoreEvent, clientRequestSingleScoreEvent, clientDeleteScoreEvent, clientEditScoreEvent, clientGameMetaUpdateEvent, clientGameMetaRequestEvent, clientSubmitScoreEvent } from './events';
import { Basketball, FootBall } from './Games';
import { GameType } from './types';
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
        this.socketServer.registerEvent(new clientCreateScoreEvent());
        this.socketServer.registerEvent(new clientEditScoreEvent());
        this.socketServer.registerEvent(new clientDeleteScoreEvent());
        this.socketServer.registerEvent(new clientRequestSingleScoreEvent());
        this.socketServer.registerEvent(new clientGameMetaUpdateEvent());
        this.socketServer.registerEvent(new clientGameMetaRequestEvent());
        this.socketServer.registerEvent(new clientSubmitScoreEvent());
        this.log("Server started");
        this.loadAllScores();
        // setTimeout(() => { console.log(this.getScoreList()) }, 1000);
        setInterval(async () => {
            if (this.scoreList != this.lastSave || true) {
                this.log("Starting auto save...");
                let gameList = this.getMongoDB().getModel(ModelType.SCORES);
                for (const singleScore of this.getScoreList()) {
                    let updateResult = await gameList.findByIdAndUpdate(singleScore.getId(), singleScore.toObject() as any);
                }
                this.log("Auto saved complete!");
                this.lastSave = this.scoreList;
            }
        }, 1000 * 60);
        setInterval(() => {
            for (const singleScore of this.getScoreList()) {
                singleScore.update();
            }
         }, 1000);
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
    public async deleteScore(id: string, delete_in_db: boolean = true) {
        let index = this.scoreList.findIndex(x => x.getId() == id);
        if (index != -1) {
            this.scoreList.splice(index, 1);
        }
        if (delete_in_db) {
            await this.getMongoDB().getModel(ModelType.SCORES).findByIdAndDelete(id);
        }
    }
    public addScore(game: Game): void {
        this.scoreList.push(game);
    }
    private async loadAllScores(): Promise<void> {
        this.scoreList = [];
        let gameList = this.getMongoDB().getModel(ModelType.SCORES);
        let _ = this;
        let data = await gameList.find({});
        for (const score of data) {
            let game: Game;
            switch (score.gameType) {
                case GameType.BASKETBALL:
                    game = new Basketball(score._id);;
                    break;
                case GameType.FOOTBALL:
                    game = new FootBall(score._id);;
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
        return true;
        return this.adminList.find(x => x == socketID) != null;
    }
}