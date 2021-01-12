import mongoose from 'mongoose';
import { Logger } from "winston";

export default class dbHelper {
    private logger: Logger;

    public constructor(logger: Logger) {
        this.logger = logger;
    }

    public async init(db: string) {
        mongoose
            .connect(
                db,
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
                }
            )
            .then(() => {
                return this.logger.info(`Successfully connected to the database!`);
            })
            .catch(error => {
                this.logger.error('Error connecting to database: ', error);
                return process.exit(1);
            });

        mongoose.Promise = global.Promise;

        mongoose.connection.on("err", err => {
            this.logger.error(`Mongoose connection error: ${err.stack}`);
        });
    };
};
