import { SocketEvent } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
export class clientDisconnectEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "client:disconnect"
    async Run(socket: Socket, server: SocketServer, data: any) {
        server.log(`Client disconected: ${socket.handshake.headers['cf-connecting-ip'] || socket.handshake.headers['x-forwarded-for'] || socket.handshake.address}`);
    }
}