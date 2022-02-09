import { SocketServer } from "@yukiTenshi/app";
import { SocketEvent, SocketSender } from "@yukiTenshi/utils";
import { Socket } from "socket.io";
export class clientSubmitAdminEvent implements SocketEvent {
    Enable: boolean = true;
    Name: string = 'admin:submit';
    Run(socket: Socket, server: SocketServer, data: any) {
        server.log(`New connection form: ${socket.handshake.headers['cf-connecting-ip'] || socket.handshake.headers['x-forwarded-for'] || socket.handshake.address}`)
        if (server.getApp().isInAdminList(socket.id)) {
            return new SocketSender('admin:submit', 400, 'You are already logged in.').send(socket, server)
        }
        if (typeof data == undefined) return new SocketSender('admin:submit', 400, 'No data include').send(socket, server)
        if (typeof data.password == undefined) return new SocketSender('admin:submit', 400, 'No password include').send(socket, server)
        if (data.password == process.env.ADMIN_PWD) {
            server.getApp().addAdmin(socket.id)
            return new SocketSender('admin:submit', 200, 'Login success').send(socket, server)
        }
        return new SocketSender('admin:submit', 403, 'Wrong password').send(socket, server)
    }
}