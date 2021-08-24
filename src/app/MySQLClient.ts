import mysql,{ Pool } from "mysql2"
import { Logger, LogType, LogLevel } from "@yukiTenshi/utils";
export class MySQLClient {
    private host: string;
    private user: string;
    private password: string;
    private database: string;
    private connection: Pool;
    private logger: Logger = new Logger();
    constructor(host: string, user: string, password: string, database: string) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }
    start() {
        this.connection = mysql.createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        });
        this.log(`pool created : ${this.host}`)
    }
    getConnection(): Pool {
        return this.connection;
    }
    query(queryString: string, prepareVarable: string[]): Promise<QueryResult> {
        return new Promise<QueryResult>(resolve => {
            this.connection.execute(
                queryString,
                prepareVarable,
                (err, results, fields) => {
                    resolve(new QueryResult(results as mysql.RowDataPacket[], fields, err));
                }
            );
        });
    }
    public log(message: string, level: LogLevel = LogLevel.INFO): void {
        this.logger.raw(level, LogType.DATABASE, message);
    }
}
export class QueryResult {
    row: mysql.RowDataPacket[]
    fields: mysql.FieldPacket[]
    err: mysql.QueryError | null
    constructor(row: mysql.RowDataPacket[], fields: mysql.FieldPacket[], err: mysql.QueryError | null) {
        this.row = row;
        this.fields = fields
        this.err = err;
    }
}