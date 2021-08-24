import { ExpressServer, SocketServer, Firebase } from '@yukiTenshi/app';
import { LogType, LogLevel, Logger } from '@yukiTenshi/utils';
import { clientConnectedEvent } from './events/clientConnectedEvent';
import { clientDisconnectEvent } from './events/clientDisconnectEvent';
export class Scoreboard3 {
    private httpServer: ExpressServer;
    private socketServer: SocketServer;
    private firebase: Firebase;
    private logger: Logger;
    constructor(httpServer: ExpressServer, socketServer: SocketServer, firebase: Firebase) {
        this.httpServer = httpServer;
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
        this.log("Server started");
        
    }
    public self(): Scoreboard3 {
        return this;
    }
    public log(message: string, level: LogLevel = LogLevel.INFO): void {
        this.logger.raw(level, LogType.APP, message);
    }
}