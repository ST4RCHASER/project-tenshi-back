import express, { Application, Request, Response } from 'express'
import http from 'http';
import { Logger, LogType, LogLevel } from "@yukiTenshi/utils";
import fs from 'fs';
import cors from 'cors';
export class ExpressServer {
    private logger: Logger = new Logger();
    private port: number;
    private host: string;
    private express: Application;
    private server: http.Server
    private path: string
    constructor(port: number, host: string) {
        this.port = port;
        this.host = host;
        return this;
    }
    public start(): Application {
        this.express = express();
        if (typeof process.env.BYPASS_CORS != 'undefined' && process.env.BYPASS_CORS == 'TRUE') this.express.use(cors())
        this.path = __dirname + '/Express/script';
        this.path = this.path.replace(/\\/g, "/");
        this.express.use(express.static(__dirname + '/Express/static'));
        this.loadFolders().then(loadRes => {
            this.express.all('*', (req: Request, res: Response) => {
                res.json({ success: false, code: 404, message: `path ${req.path} with method ${req.method} not found` });
            })
        });
        this.server = this.express.listen(this.port, this.host);
        this.log(`Server started at: http://${this.host}:${this.port}`, LogLevel.INFO)
        return this.express;
    }
    public get(): http.Server {
        return this.server;
    }
    public getExpress(): Application {
        return this.express;
    }
    public self(): ExpressServer {
        return this;
    }
    public getPort(): number {
        return this.port;
    }
    public log(message: string, level: LogLevel = LogLevel.INFO): void {
        this.logger.raw(level, LogType.EXPRESS_SERVER, message);
    }
    private loadFiles(path: string): void {
        if (!path.endsWith(".js") && !path.endsWith(".ts")) return;
        this.log(`Loading file ${path}...`, LogLevel.INFO)
        
        let name: string = path.replace(this.path, "");
        name = name.replace("index.js", "").replace("index.ts", "")
            let props: any = require(`${path}`);
            props = props.default;
            this.getExpress().use(name, props);
        this.log(`File: ${path} loaded to path ${name}`, LogLevel.INFO)
    }
    private loadFolders(path: string = this.path): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.log(`Starting load files... (${this.path})`, LogLevel.INFO)
            this.log(`Loading folder ${path}...`, LogLevel.INFO)
            let files = fs.readdirSync(path);
            if (files) {
                for (const file of files) {
                    if (fs.lstatSync(path + "/" + file).isDirectory()) await this.loadFolders(path + "/" + file);
                    else if (file.endsWith('.js') || file.endsWith('.ts') && file[0] != '-') this.loadFiles(path + "/" + file);
                    else if (file[0] == '-') this.log(`Skipped page disabled ${file}`, LogLevel.INFO)
                    else if (fs.lstatSync(path + "/" + file).isDirectory()) this.log(`Skipped page ${file} floder empty!`, LogLevel.INFO)
                }
            }
            this.log(`All files loaded`, LogLevel.INFO)
            resolve(true);
        });
    }
}
