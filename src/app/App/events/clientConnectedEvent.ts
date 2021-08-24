import { SocketServer } from "@yukiTenshi/app";
import { SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
export class clientConnectedEvent implements SocketEvent {
    Enable: boolean = true;
    Name: string = 'client:connected'
    Run(socket: Socket, server: SocketServer, data: any) {
        server.log(`New connection form: ${socket.handshake.headers['cf-connecting-ip'] || socket.handshake.headers['x-forwarded-for'] || socket.handshake.address}`)
        setTimeout(() => {
            new SocketSender('client:welcome', 200, 'Welcome to Yuki-Tenshi Socket server!').send(socket)
        }, 1000);
    }
}