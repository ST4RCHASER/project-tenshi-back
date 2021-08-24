import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();
import { ExpressServer, SocketServer, Scoreboard3, Firebase } from '@yukiTenshi/app';

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

//Setup Firebase client
let firebase: Firebase = new Firebase();
firebase.start();

//[FINAL] Start yukiTenshi app
let scoreboardTenshi = new Scoreboard3(expressServer, socketServer, firebase);
scoreboardTenshi.start();