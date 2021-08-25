import { SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
export class clientRequestScoreEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "score:overall"
    async Run(socket: Socket, server: SocketServer, data: any) {
        new SocketSender('score:overall', 201, "all score list", server.getApp().getScoreList()).send(socket);
    }
}