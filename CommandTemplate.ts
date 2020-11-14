import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class TempCommand extends Command {
    public constructor() {
        super('', {
            aliases: [''],
            category: '',
            description: {
                content: "",
                usage: "",
                examples: []
            },
            ratelimit: 0,
            clientPermissions: [],
            userPermissions: [],
            channel: 'guild',       // guild, dm
            args: [
                {
                    id: "",
                    type: "",
                    // match: "rest",   // option
                   // flag: []
                }
            ]
        });
    }

    public async exec(message: Message): Promise<void> {

    }
}

