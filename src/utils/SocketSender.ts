import { SocketServer } from "app/SocketServer";
import { Socket } from "socket.io";
export class SocketSender {
    private responseCode: number;
    private responseMessage: string;
    private responseData: object;
    private name: string;
    constructor(eventname: string = 'NONE', code: number = 500, message: string = 'No sender message set', data: object = {}) {
        this.responseCode = code;
        this.responseMessage = message;
        this.responseData = data;
        this.name = eventname;
        return this;
    }
    public getJSONText(): string {
        return '';
    }
    public sendToAll(server: SocketServer): any {
        try {
            let sockets = server.get().sockets.sockets;
            for (var socketId in sockets) {
                var s = sockets.get(socketId);
                if (s) {
                    let data: any = this.responseData as any;
                    data.status = this.responseCode == 200;
                    data.code = this.responseCode;
                    data.message = this.responseMessage;
                    data.stamp = new Date().getTime();
                    data.admin = server.getApp().isInAdminList(s.id);
                    s.emit(this.name, data);
                }
            }
            return { success: true, message: `Emit "${this.name}" send to all successfully` };
        } catch (e: any) {
            console.error(e);
            return { success: false, message: `Emit "${this.name}" send to all error: ${e.message}` };
        }
    }
    private getObject(socket?: Socket, server?: SocketServer): any {
        let data: any = this.responseData as any;
        data.status = this.responseCode == 200;
        data.code = this.responseCode;
        data.message = this.responseMessage;
        data.stamp = new Date().getTime();
        data.admin = socket && server ? server.getApp().isInAdminList(socket.id) : false;
        return data;
    }
    public send(targetSocket: Socket, server?: SocketServer): any {
        try {
            targetSocket.emit(this.name, this.getObject(targetSocket, server));
            return { success: true, message: `Emit "${this.name}" send successfully` };
        } catch (e: any) {
            console.error(e);
            return { success: false, message: `Emit "${this.name}" error: ${e.message}` };
        }
    }
}