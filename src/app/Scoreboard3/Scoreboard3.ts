import { ExpressServer, SocketServer, Firebase } from '@yukiTenshi/app';
import { LogType, LogLevel, Logger } from '@yukiTenshi/utils';
import { Game } from './Games/Game';
import { clientConnectedEvent, clientDisconnectEvent, clientRequestScoreEvent, clientTeamUpdateEvent } from './events';
import { Basketball } from './Games';
export class Scoreboard3 {
    private expressServer: ExpressServer;
    private socketServer: SocketServer;
    private firebase: Firebase;
    private logger: Logger;
    private scoreList: Game[]
    private lastSave: Game[]
    private adminList: string[];
    constructor(expressServer: ExpressServer, socketServer: SocketServer, firebase: Firebase) {
        this.expressServer = expressServer;
        this.socketServer = socketServer;
        this.firebase = firebase;
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
                let list: any = {};
                for (const singleScore of this.getScoreList()) {
                    list[singleScore.getId()] = singleScore;
                    list[singleScore.getId()].gameType = singleScore.getType();
                }
                this.getFirebase().ref('scoreLists').set(list).then(() => {
                    this.log("Auto saved complete!");
                    this.lastSave = this.scoreList;
                });
            }
        }, 1000 * 60);
    }
    public self(): Scoreboard3 {
        return this;
    }
    public log(message: string, level: LogLevel = LogLevel.INFO): void {
        this.logger.raw(level, LogType.APP, message);
    }
    public getFirebase(): Firebase {
        return this.firebase;
    }
    public getExpress(): ExpressServer {
        return this.expressServer;
    }
    private loadAllScores(): void {
        this.scoreList = [];
        let gameList = this.getFirebase().ref('scoreLists');
        let _ = this;
        gameList.once('value', (snapshot) => {
            snapshot.forEach(function (childSnapshot) {
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                if (childKey != null) {
                    let game: Game;
                    switch (childData.gameType) {
                        case 1:
                            game = new Basketball(childKey);;
                            break;
                        default:
                            game = new Game(childKey);
                    }
                    game.setChildData(childData);
                    _.log("Score (" + game.getType() + ") id: " + childKey + " loaded!");
                    _.scoreList.push(game)
                }
            });
        })
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