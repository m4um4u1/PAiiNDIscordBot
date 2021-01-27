import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import Utilities from "../../structures/Utilities";
import botSettings from "../../models/botsettings.model";

export default class RpsCommand extends Command {
    public constructor() {
        super('rps', {
            aliases: ['rps', 'ssp'],
            category: 'fun',
            description: {
                content: 'Spiele Stein Schere Papier gegen den Bot',
                usage: ''
            },
            ratelimit: 10,
            clientPermissions: ["SEND_MESSAGES"],
            userPermissions: ["SEND_MESSAGES"],
            channel: 'guild'
        });
    }

    public async exec(message: Message): Promise<void> {
        const settings = await botSettings.findOne({guildId: message.guild.id});

        if (settings.rpsCommand) {
            const chooseArr: string[] = ["🗻", "📰", "✂"];
            const embed: MessageEmbed = new MessageEmbed()
                .setColor("#ffffff")
                .setFooter(
                    message.guild.me.displayName,
                    this.client.user.displayAvatarURL()
                )
                .setDescription("Wähle Stein, Schere oder Papier!")
                .setTimestamp();

            const m: Message = await message.channel.send(embed);
            const reacted = await Utilities.promptMessage(m, message.author, 30, chooseArr);

            const botChoice: string = chooseArr[Math.floor(Math.random() * chooseArr.length)];

            const result: string = getResult(reacted, botChoice);

            embed.setDescription("").addField(result, `${reacted} vs ${botChoice}`);

            await m.edit(embed);

            await m.reactions.removeAll();

            function getResult(me, clientChosen): string {
                if (
                    (me === "🗻" && clientChosen === "✂") ||
                    (me === "📰" && clientChosen === "🗻") ||
                    (me === "✂" && clientChosen === "📰")
                ) {
                    return "Du hast gewonnen!";
                } else if (me === clientChosen) {
                    return "Versuche es nochmal!";
                } else {
                    return "Du hast verloren!";
                }
            }
        }
    }
}
