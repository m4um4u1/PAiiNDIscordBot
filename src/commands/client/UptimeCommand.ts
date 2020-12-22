import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import Utilities from "../../structures/Utilities";

export default class UptimeCommand extends Command {
    public constructor() {
        super('uptime', {
            aliases: ['uptime'],
            category: 'client',
            description: {
                content: 'Zeigt wie lange der Bot schon ohne unterbrechung Online ist',
                usage: 'uptime',
                examples: ['uptime']
            },
            ratelimit: 1,
            clientPermissions: ["SEND_MESSAGES"],
            userPermissions: ["SEND_MESSAGES"]
        });
    }

    public async exec(message: Message): Promise<Message> {
        const time: string = await Utilities.parseDuration(this.client.uptime);

        return message.util.reply(
            `:chart_with_upwards_trend: Ich bin jetzt schon seit **${time}** online!`
        );
    }
}
