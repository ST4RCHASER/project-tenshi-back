import { Logger, LogType, LogLevel } from "@yukiTenshi/utils";
import { Server, Socket } from "socket.io";
import { ExpressServer } from "./ExpressServer";
import { SocketEvent } from "@yukiTenshi/utils";
import { SocketSender } from "@yukiTenshi/utils";
export class SocketServer {
    private logger: Logger = new Logger();
    private expressServer: ExpressServer;
    private socketServer: Server;
    private options: object;
    private Events: Array<SocketEvent> = [];
    private app: any;
    constructor(expressServer: ExpressServer, options: object = {}) {
        this.expressServer = expressServer;
        this.options = options
        return this;
    }
    public start(): Server {
        this.socketServer = new Server(this.expressServer.get(), this.options);
        this.log(`Server started`, LogLevel.INFO);
        let _this: SocketServer = this;
        this.socketServer.on('connection', (client) => {
            this.onEvent(client, 'client:connected', []);
            client.on('disconnect', () => {
                this.onEvent(client, 'client:disconnect', []);
            })
            client.onAny((name: string, ...arrayData: any[]) => {
                _this.onEvent(client, name, arrayData)
            });
        });
        this.socketServer.on('disconnect', (client) => {
            this.onEvent(client, 'client:disconnect', []);
        })
        return this.socketServer;
    }
    public get(): Server {
        return this.socketServer;
    }
    public log(message: string, level: LogLevel = LogLevel.INFO): void {
        this.logger.raw(level, LogType.SOCKET_SERVER, message);
    }
    private onEvent(client: Socket, name: string, data: any[]) {
        for (const single_event of this.Events) {
            try {
                if (name.toLowerCase() === single_event.Name.toLowerCase()) single_event.Run(client, this, data[0]);
            } catch (e: any) {
                //catch error event
                this.log('Error on run event:', LogLevel.ERROR);
                console.error(e);
                this.log('Event info: ', LogLevel.ERROR);
                console.error(single_event);
                this.log('Request event data:', LogLevel.ERROR)
                console.error(name, data);
                if (client) {
                    if (name) {
                        new SocketSender(name.toLowerCase(), 500, `Server error: ${e.message || e}`);
                    }
                    new SocketSender('server:error', 500, `SERVER ERROR: ${e.message || e}`);
                }
            }
        }
    }
    public registerEvent(event: SocketEvent): void {
        if (event.Enable) {
            this.Events.push(event);
            this.log(`Registed event "${event.Name}" from class "${event.constructor.name}"`, LogLevel.INFO)
        } else {
            this.log(`Event "${event.Name}" skip to register because this event disable in class`, LogLevel.WARN);
        }
    }
    public getApp(): any {
        return this.app;
    }
    public setApp(app: any) {
        this.app = app;
        return this;
    }
}