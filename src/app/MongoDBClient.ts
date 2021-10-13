
import mongoose, { Mongoose, Schema, Model } from "mongoose";
import { ModelType, Logger, LogType, LogLevel } from "@yukiTenshi/utils";
export class MongoDBClient {
    private logger: Logger = new Logger();
    public connString: string;
    private connection: Mongoose;
    private models: Model<any>[] = [];
    constructor(connString: string) {
        this.connString = connString;
    }
    async start() {
        try {
            this.connection = await mongoose.connect(this.connString);
            (global as any).db = this;
            this.log(`connection created : ${this.connString}`)
            this.registerSchema();
        } catch (e: any) {
            this.log(`connection failed : ${e.stack || e}`)
        }
    }
    public log(message: string, level: LogLevel = LogLevel.INFO): void {
        this.logger.raw(level, LogType.DATABASE, message);
    }
    getConnection(): Mongoose {
        return this.connection;
    }
    registerSchema(): void {
        const scores = new Schema({
            data: Object
        });
        this.models.push(this.getConnection().model('score', scores));
        this.log(`Schema registered : ${this.models.length}`);
    }
    getModel(type: ModelType): Model<any> {
        return this.models[type];
    }
}