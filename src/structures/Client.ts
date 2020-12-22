import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Logger } from 'winston';
import { Message } from 'discord.js';
import { join } from 'path';
import { Config } from './Config'

declare module 'discord-akairo' {
    export interface AkairoClient {
        config: typeof Config;
        logger: Logger;
        commandHandler: CommandHandler,
        listenerHandler: ListenerHandler,
    }
}

export default class PAiiNDiscordClient extends AkairoClient {
    public config: typeof Config = Config;
    public logger: Logger;


    public listenerHandler: ListenerHandler = new ListenerHandler(this,{
        directory: join(__dirname, "..", "listeners")
    });

    public commandHandler: CommandHandler = new CommandHandler(this,{
        directory: join(__dirname, "..", "commands"),
        prefix: "!",
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 5000,
        argumentDefaults:{
            prompt: {
                modifyStart: (_: Message, str: string): string => `${str}\n\n Schreibe \'cancel\' um den command abzubrechen!`,
                modifyRetry: (_: Message, str: string): string => `${str}\n\n Schreibe \'cancel\' um den command abzubrechen!`,
                timeout: "Du hast zu lange gebraucht, der command wurde abgrebrochen",
                ended: "Du hast zu viele Versuche gebraucht, der command wurde abgebrochen",
                cancel: "Der command wurde abgebrochen",
                retries: 3,
                time: 3e4
            },
            otherwise: ""
        },
        ignorePermissions: Config.owner
    });

    public constructor(logger: Logger) {
        super({
            ownerID: Config.owner,
            partials: ['MESSAGE', 'REACTION', 'USER']
        });

        this.config = Config;
        this.logger = logger;
    }

    private async _init(): Promise<void> {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            process
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    public async start(): Promise<string> {
        await this._init();
        return this.login(this.config.discordToken);
    }
}
