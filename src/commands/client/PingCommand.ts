import { Command } from 'discord-akairo';
import {MessageEmbed} from "discord.js";

export default class PingCommand extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'client',
            description: {
                content: 'Zeigt die Latenzen vom Bot an',
                usage: 'ping',
                examples: ['ping']
            },
            ratelimit: 5,
            clientPermissions: ["SEND_MESSAGES"]
        });
    }

    public async exec(message): Promise<void> {
        if (message.deletable) await message.delete()
        const sent = await message.reply('Pong!');
        const timeDiff: number = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        const replyMessage = new MessageEmbed({
            color: "AQUA",
            title: 'Ping'
        })
            .setDescription([
                `🔂 **Paketumlaufzeit**: ${timeDiff} ms`,
                `💟 **Ping**: ${Math.round(this.client.ws.ping)} ms`
            ]);
        if(sent.deletable) await sent.delete();
        return message.util.send(replyMessage);
    }
}

