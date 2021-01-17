import { Listener } from "discord-akairo";
import dbGuild from "../../models/guild.model";
import {MessageEmbed, TextChannel} from "discord.js";
import {stripIndents} from "common-tags";
import Utilities from "../../structures/Utilities";

export default class MessageReactionAddListener extends Listener {
    public constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            event: 'messageReactionAdd'
        });
    }

    public async exec(reaction, user) {

        if (reaction.message.partial) {
            try {
                await reaction.message.fetch();
            } catch (error) {
                this.client.logger.error('Something went wrong when fetching the message: ', error);
            }
        }

        const { message, emoji } = reaction;

        const member = message.guild.members.cache.get(user.id);

        const dbChannels = await dbGuild.getChannelsById(message.guild.id);
        const dbRoles = await dbGuild.getRolesById(message.guild.id);

        const guildRole = message.guild.roles.cache.find((role) => {
            return role.id === dbRoles.defaultRole;
        });

        const memberRole = member.roles.cache.find((role) => {
            return role.id === dbRoles.defaultRole;
        });

        if (message.channel.id === dbChannels.rulesChannel && emoji.name === this.client.config.emojis.true) {

            if (memberRole === guildRole) {
                await member
                    .send("Du hast die Regeln schon akzeptiert :yum:")
            } else {

                member.roles.add(guildRole).catch((err) => this.client.logger.error(err));
                await member
                    .send(`Du hast die Regeln akzeptiert, viel Spaß auf ${message.guild.name}. ${this.client.config.emojis.happy}`)
                this.client.logger.info(`${user.username} hat die Regeln auf ${reaction.message.guild.name} im Kanal 
                ${reaction.message.channel} bestätigt.`);
                const logChannel = await message.guild.channels.cache.get(dbChannels.logsChannel);
                const created: string = await Utilities.formatDate(member.user.createdAt);

                const logMessage = new MessageEmbed({
                    color: "GREEN",
                    title: `${this.client.config.emojis.warn}**Mitteilung:** Regeln angenommen`
                }).addField(
                    "Benutzerinformationen",
                    stripIndents`**ID:** ${member.user.id}
                 **Benutzername:** ${member}
                 **Discord tag:** ${member.user.tag}
                 **Erstellt am:** ${created}`,
                    true
                )
                    .setTimestamp()
                    .setThumbnail(member.user.displayAvatarURL());

                await (logChannel as TextChannel).send(logMessage);
            }
        }
    }
}
