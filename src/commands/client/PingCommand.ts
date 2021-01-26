import { Command } from 'discord-akairo';
import { MessageEmbed } from "discord.js";
import botSettings from '../../models/botsettings.model';

export default class PingCommand extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'client',
            description: {
                content: 'Zeigt die Latenzen vom Bot an',
                usage: '',
                examples: ['']
            },
            ratelimit: 5,
            clientPermissions: ["SEND_MESSAGES"],
            userPermissions: ["MANAGE_GUILD"]
        });
    }

    public async exec(message): Promise<void> {
        const settings = await botSettings.findOne({guildId: message.guild.id});

        if (settings.pingCommand) {


        const sent = await message.util.reply('Pong!');
        const timeDiff: number = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        const replyMessage = new MessageEmbed({
            color: "YELLOW",
            title: 'Ping'
        })
            .setDescription([
                `🔂 **Paketumlaufzeit**: ${timeDiff} ms`,
                `💟 **Ping**: ${Math.round(this.client.ws.ping)} ms`
            ]);
        if(sent.deletable) await sent.delete();
        if (message.deletable) await message.delete();
        return message.util.send(replyMessage);

    }
    }
}

