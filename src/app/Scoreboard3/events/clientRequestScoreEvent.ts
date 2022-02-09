import { SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
import { Game } from "../Games";
export class clientRequestScoreEvent implements SocketEvent {
    Enable: boolean = true
    Name: string = "score:overall"
    async Run(socket: Socket, server: SocketServer, data: any) {
        let scoreList:any[] = [];
        for(const score of server.getApp().getScoreList()) {
            scoreList.push(score.toObject());
        }
        // console.log(scoreList);
        new SocketSender('score:overall', 201, "all score list", {scores: scoreList}).send(socket,server);
    }
}