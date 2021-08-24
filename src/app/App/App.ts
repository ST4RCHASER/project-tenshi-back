import { ExpressServer, SocketServer, MySQLClient } from '@yukiTenshi/app';
import { clientConnectedEvent } from './events/clientConnectedEvent';
import { clientDisconnectEvent } from './events/clientDisconnectEvent';
export class App {
    private httpServer: ExpressServer;
    private socketServer: SocketServer;
    private mySQLServer: MySQLClient;
    constructor(httpServer: ExpressServer, socketServer: SocketServer, mySQLServer: MySQLClient) {
        this.httpServer = httpServer;
        this.socketServer = socketServer;
        this.mySQLServer = mySQLServer;
        return this;
    }
    public async start() {
        //Register slef
        this.socketServer.setApp(this);
        //Register event
        this.socketServer.registerEvent(new clientConnectedEvent());
        this.socketServer.registerEvent(new clientDisconnectEvent());

    }
    public self(): App {
        return this;
    }
}