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
    public sendToAll(socket: Socket): any {
        try {
            let data: any = this.responseData as any;
            data.status = this.responseCode == 200;
            data.code = this.responseCode;
            data.message = this.responseMessage;
            data.stamp = new Date().getTime();
            socket.broadcast.emit(this.name, data);
            return { success: true, message: `Emit "${this.name}" send to all successfully` };
        } catch (e: any) {
            console.error(e);
            return { success: false, message: `Emit "${this.name}" send to all error: ${e.message}` };
        }
    }
    private getObject(): any {
        let data: any = this.responseData as any;
        data.status = this.responseCode == 200;
        data.code = this.responseCode;
        data.message = this.responseMessage;
        data.stamp = new Date().getTime();
    }
    public send(targetSocket: Socket): any {
        try {
            targetSocket.emit(this.name, this.getObject());
            return { success: true, message: `Emit "${this.name}" send successfully` };
        } catch (e: any) {
            console.error(e);
            return { success: false, message: `Emit "${this.name}" error: ${e.message}` };
        }
    }
}