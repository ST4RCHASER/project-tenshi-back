import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();
import { ExpressServer } from './app/ExpressServer';
import { SocketServer } from './app/SocketServer';
import { MySQLClient } from './app/MySQLClient';
import { App } from './app/App/App';

//Setup Database (MySQL) Client
let mySQLClient = new MySQLClient(process.env.MYSQL_HOST || 'localhost', process.env.MYSQL_USER || 'root', process.env.MYSQL_PASS || '', process.env.MYSQL_DB || 'weeb-db');
mySQLClient.start();

//Bypass CORS
let bypass_cors: object = typeof process.env.BYPASS_CORS != 'undefined' && process.env.BYPASS_CORS == 'TRUE' ? {
    cors: {
        origin: '*'
    }
} : {};

//Setup express app
let expressServer: ExpressServer = new ExpressServer(process.env.PORT as unknown as number || 3000, process.env.HOST || '0.0.0.0');
expressServer.start();

//Setup Socket Server
let socketServer: SocketServer = new SocketServer(expressServer, bypass_cors);
socketServer.start();

//[FINAL] Start yukiTenshi app
let yukiTenshi = new App(expressServer, socketServer, mySQLClient);
yukiTenshi.start();