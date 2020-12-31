import { Command } from 'discord-akairo';

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
        const sent = await message.util.reply('Pong!');
        const timeDiff: number = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        return message.util.send([
            `🔂 **Paketumlaufzeit**: ${timeDiff} ms`,
            `💟 **Ping**: ${Math.round(this.client.ws.ping)} ms`
        ]);
    }
}

