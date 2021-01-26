import { Command } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import botSettings from "../../models/botsettings.model";

export default class ClearCommand extends Command {
    public constructor() {
        super('clear', {
            aliases: ['clear'],
            category: 'moderation',
            description: {
                content: 'Löscht eine Anzahl Nachrichten',
                usage: '[ anzahl ]',
                examples: ['10']
            },
            ratelimit: 5,
            clientPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
            userPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
            channel: 'guild',
            args: [
                {
                    id: 'amount',
                    type: 'number'
                }
            ]
        });
    }

    public async exec(message: Message, args): Promise<Message> {
        const settings = await botSettings.findOne({guildId: message.guild.id});

        if(settings.clearCommand) {


        if (args.amount <= 0) {
            return message.util
                .reply("Ich habe keine Nachrichten gelöscht! ... ")
                .then(m => m.delete({timeout: 5000}));
        }

        let deleteAmount: number;

        if (args.amount > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = args.amount;
        }

        (message.channel as TextChannel)
            .bulkDelete(deleteAmount, true)
            .then(deleted =>
                message.util.send(`Ich habe \`${deleted.size}\` Nachrichten gelöscht!.`)
            )
            .then(m => m.delete({ timeout: 5000 }))
            .catch(err => this.client.logger.error(`Irgendwas ist schief gelaufen -> ${err}`));

            if (message.deletable) {
                await message.delete();
            }
    }
}
}
