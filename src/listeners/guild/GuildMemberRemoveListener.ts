import { Listener } from "discord-akairo";
import dbGuild from "../../models/guild.model";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Channel, MessageEmbed, TextChannel } from "discord.js";
import { stripIndents } from 'common-tags';
import Utilities from "../../structures/Utilities";
require('isomorphic-fetch');

export default class GuildMemberRemoveListener extends Listener {
    public constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }

    public async exec(member) {

        const gf: GiphyFetch = new GiphyFetch(this.client.config.giphyToken);
        const dbChannels = await dbGuild.getChannelsById(member.guild.id);

        let wlch: Channel = await this.client.channels.fetch(dbChannels.welcomeChannel);
        if (!wlch) return;

        let lch: Channel = await this.client.channels.fetch(dbChannels.logsChannel);
        if (!lch) return;

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });

        const kickLog = fetchedLogs.entries.first();
        const { executor, target, reason } = kickLog;

        await gf.search('goodbye', {sort: 'relevant', type: 'gifs'})
            .then((gifs) => {
                let totalResponses = gifs.data.length;
                let responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
                let responseFinal = gifs.data[responseIndex];
                (wlch as TextChannel).send(`${member} hat uns leider verlassen :sob:`, {
                    files: [responseFinal.images.fixed_height.url]
                });
            })
            .catch((e) => this.client.logger.error("Fuckn giphy error mate:" + e));

  if ( kickLog && target.id === member.user.id) {
     const joined: string = await Utilities.formatDate(member.joinedAt);

     let kickReason;
     if (!reason){
         kickReason = "Es wurde kein Grund angegeben"
     } else {
         kickReason = reason;
     }

     const logMessage: MessageEmbed = new MessageEmbed({
         color: "RED",
         title: `${this.client.config.emojis.warn} **Mitteilung:** Kick`
     }).addField(
         "Gekickt wurde:",
         stripIndents`**ID:** ${member.user.id}
                 **Benutzername:** ${member}
                 **Discord tag:** ${member.user.tag}
                 **Beigetreten am:** ${joined}`,
         true
     ).addField("Gekickt durch:",
         stripIndents`**ID:** ${executor.id}
                **Benutzername:** ${executor}
                **Grund:** ${kickReason}`)
         .setTimestamp()
         .setThumbnail(member.user.displayAvatarURL());

     await (lch as TextChannel).send(logMessage);
    }
    }
}
