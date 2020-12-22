import { Listener } from "discord-akairo";
import dbGuild from "../../models/guild.model";
import {MessageEmbed, ReactionManager, TextChannel, User} from "discord.js";
import {stripIndents} from "common-tags";
import Utilities from "../../structures/Utilities";

export default class MessageReactionAddListener extends Listener {
    public constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            event: 'messageReactionAdd'
        });
    }

    public async exec(reaction, user: User) {

        if (reaction.message.partial) {
            try {
                await reaction.message.fetch();
            } catch (error) {
                this.client.logger.error('Something went wrong when fetching the message: ', error);
            }
            this.client.logger.info(`${user.username} hat die Regeln auf ${reaction.message.guild.name} im Kanal 
            ${reaction.message.channel} bestätigt.`);
        }
        const { message, emoji } = reaction;

        const dbChannels = await dbGuild.getChannelsById(message.guild.id);
        const dbRoles = await dbGuild.getRolesById(message.guild.id);

        if (message.channel.id === dbChannels.rulesChannel && emoji.name === this.client.config.emojis.true) {
            if (
                message.member.roles.cache.some(r =>
                    [dbRoles.defaultRole].includes(r.id)
                )
            ) {
                await message.channel
                    .send("Du hast die Regeln schon akzeptiert :yum:")
                    .then(m => m.delete({ timeout: 10000 }));
            } else {
                let role = message.guild.roles.cache.find(r => r.id === dbRoles.defaultRole);
                let member = message.member;

                member.roles.add(role).catch((err) => this.client.logger.error(err));
                await message.channel
                    .send(
                        `Du hast die Regeln akzeptiert, viel Spaß auf ${message.guild.name}. ${this.client.config.emojis.happy}`
                    )
                    .then(m => m.delete({ timeout: 10000 }));

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
