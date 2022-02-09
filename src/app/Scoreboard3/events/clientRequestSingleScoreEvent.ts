import { SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
export class clientRequestSingleScoreEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "score:single"
    async Run(socket: Socket, server: SocketServer, data: any) {
        let score = await server.getApp().getScoreByID(data.id)
        new SocketSender('score:single', 201, `single score: ${data.id}`, {score: score?.toObject()}).send(socket,server);
    }
}