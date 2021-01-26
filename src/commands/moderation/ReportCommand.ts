import { Command } from 'discord-akairo';
import {Message, MessageEmbed, TextChannel} from 'discord.js';
import dbGuild from "../../models/guild.model";
import {stripIndents} from "common-tags";
import Utilities from "../../structures/Utilities";
import botSettings from "../../models/botsettings.model";

export default class ReportCommand extends Command {
    public constructor() {
        super('report', {
            aliases: ['report'],
            category: 'moderation',
            description: {
                content: 'Hiermit kannst du ein Mitglied reporten wenn er gegen Regeln verstößt',
                usage: '[ Mitglied ] [ Grund ]',
                examples: ['@PAiiN he is to cool for this server' ]
            },
            clientPermissions: ["SEND_MESSAGES"],
            userPermissions: ["SEND_MESSAGES"],
            channel: 'guild',
            args: [
                {
                    id: 'userToReport',
                    type: 'member'
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: "rest"
                }
            ]
        });
    }

    public async exec(message: Message, args): Promise<Message> {
        const settings = await botSettings.findOne({ guildId: message.guild.id });

        if(settings.reportCommand) {

        const dbChannels = await dbGuild.getChannelsById(message.guild.id);
        const logChannel = message.guild.channels.cache.get(dbChannels.logsChannel);

        if (!logChannel) {
            return message.util
                .send(`Ich konnte den Log Kanal nicht finden, bitte stelle im Dashboard den Kanal ein!`)
                .then(m => m.delete({timeout: 5000}));
        }
        const joined = await Utilities.formatDate(args.userToReport.joinedAt)
        const logMessage: MessageEmbed = new MessageEmbed({
            color: "YELLOW",
            title: `${this.client.config.emojis.warn} **Mitteilung:** Report`
        }).addField(
            "Gemeldet wurde:",
            stripIndents`**ID:** ${args.userToReport.id}
                 **Benutzername:** ${args.userToReport}
                 **Discord tag:** ${args.userToReport.user.tag}
                 **Beigetreten am:** ${joined}`,
            true
        ).addField("Gemeldet durch:",
            stripIndents`**ID:** ${message.member.id}
                **Benutzername:** ${message.member}
                **Grund:** ${args.reason}`)
            .setTimestamp()
            .setThumbnail(args.userToReport.user.displayAvatarURL());

        await (logChannel as TextChannel).send(logMessage);

        const replyMessage = new MessageEmbed({
            color: "YELLOW"
        })
            .setDescription(`hat ${args.userToReport} wegen \' ${args.reason} \' gemeldet`)
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL()}`);

        await message.util.send(replyMessage);
            if (message.deletable) {
                await message.delete();
            }
    }
}
}
