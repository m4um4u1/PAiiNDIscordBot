import { Command } from 'discord-akairo';
import {Message, MessageEmbed} from 'discord.js';
import botSettings from "../../models/botsettings.model";

export default class TempCommand extends Command {
    public constructor() {
        super('box', {
            aliases: ['box', 'schlagen'],
            category: 'fun',
            description: {
                content: 'Boxe ein Mitglied in die Fresse',
                usage: '[ Mitglied ]',
                examples: ['@PAiiN']
            },
            clientPermissions: ["SEND_MESSAGES"],
            userPermissions: ["SEND_MESSAGES"],
            channel: 'guild',
            args: [
                {
                    id: 'member',
                    type: 'member',
                }
            ]
        });
    }

    public async exec(message: Message, args): Promise<void> {
        const settings = await botSettings.findOne({ guildId: message.guild.id });
        if(settings.boxCommand) {
        if (message.deletable) {
            await message.delete();
        }

        const possibilities = [`hat ${args.member} im Boxring besiegt ${this.client.config.emojis.drunk}`, `wurde von ${args.member} im Boxring besiegt ${this.client.config.emojis.drunk}`];

        const replyMessage = new MessageEmbed({
            color: "AQUA"
        })
            .setDescription(possibilities[Math.floor(Math.random() * possibilities.length)])
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL()}`);

        await message.util.send(replyMessage);
    }
}
}
