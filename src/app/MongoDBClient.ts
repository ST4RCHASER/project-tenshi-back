
import mongoose, { Mongoose, Schema, Model } from "mongoose";
import { ModelType, Logger, LogType, LogLevel } from "@yukiTenshi/utils";
import { Scoreboard3 } from ".";
export class MongoDBClient {
    private logger: Logger = new Logger();
    public connString: string;
    private connection: Mongoose;
    private models: Model<any>[] = [];
    private app: Scoreboard3;
    constructor(connString: string) {
        this.connString = connString;
    }
    public setApp(scoreboard3: Scoreboard3) {
        this.app = scoreboard3;
        return this;
    }
    async start() {
        try {
            this.connection = await mongoose.connect(this.connString);
            (global as any).db = this;
            this.log(`connection created : ${this.connString}`)
            this.registerSchema();
            this.app.start();
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
            gameType: Number,
            name: String,
            stamp: Date,
            state: Number,
            teams: Schema.Types.Mixed,
            timer: Number,
            gameMeta: Schema.Types.Mixed,
        }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
        this.models.push(this.getConnection().model('score', scores));
        this.log(`Schema registered : ${this.models.length}`);
    }
    getModel(type: ModelType): Model<any> {
        return this.models[type];
    }
}