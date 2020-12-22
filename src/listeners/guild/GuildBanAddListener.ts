import { Listener } from "discord-akairo";
import dbGuild from "../../models/guild.model";
import { Channel, MessageEmbed, TextChannel } from "discord.js";
import { stripIndents } from "common-tags";
import Utilities from "../../structures/Utilities";

export default class GuildBanAddListener extends Listener {
    public constructor() {
        super('guildBanAdd', {
            emitter: 'client',
            event: 'guildBanAdd'
        });
    }

    public async exec(guild, user) {
        const dbChannels = await dbGuild.getChannelsById(guild.id);
        const channel: Channel = guild.channels.cache.fetch(dbChannels.logsChannel);

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

        const banLog = await fetchedLogs.entries.first();
        if (!banLog) return;
        let banReason: string;

        const {executor, target, reason} = banLog;
        if (!reason) {
            banReason = "Es wurde kein Grund angegeben";
        } else {
            banReason = reason;
        }

        if (target.id === user.id) {
            const joined: string = await Utilities.formatDate(user.joinedAt);
            const logMessage = new MessageEmbed({
                color: "RED",
                title: `${this.client.config.emojis.warn} **Mitteilung:** Ban`
            }).addField(
                "Gebannt wurde:",
                stripIndents`**ID:** ${user.id}
                 **Benutzername:** ${user}
                 **Discord tag:** ${user.tag}
                 **Beigetreten am:** ${joined}`,
                true
            ).addField("Gebannt durch",
                stripIndents`**ID:** ${executor.id}
                **Benutzername:** ${executor}
                **Grund:** ${banReason}`)
                .setTimestamp()
                .setThumbnail(user.displayAvatarURL());

            await (channel as TextChannel).send(logMessage);
        }
    }
}
