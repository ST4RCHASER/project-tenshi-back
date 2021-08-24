import { Server, Socket } from "socket.io";
import { SocketServer } from "@yukiTenshi/app";
export interface SocketEvent {
    Run(client: Socket, server: SocketServer, data: object): any
    Name: string
    Enable: boolean
}