import PAiiNDiscordClient from './structures/Client';
import winston, { Logger } from 'winston';
import DbHelper from "./structures/DbHelper";

const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((log) => `[${log.timestamp}] [${log.level}]: ${log.message}`),
    )
});

const mongo = new DbHelper(logger);

const client: PAiiNDiscordClient = new PAiiNDiscordClient(logger);

mongo.init(client.config.mongouri).then(() => logger.info("Mongo wird gestartet!"))
client.start().then(() => logger.info("PAiiNDiscordBot wird gestartet!"));
