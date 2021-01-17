import { Listener } from "discord-akairo";
import dbGuild from "../../models/guild.model";
import { GiphyFetch } from '@giphy/js-fetch-api';
import {Channel, MessageEmbed, TextChannel} from "discord.js";
require('isomorphic-fetch');

export default class GuildMemberAddListener extends Listener {
    public constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }

    public async exec(member) {
        const gf: GiphyFetch = new GiphyFetch(this.client.config.giphyToken);
        const dbChannels = await dbGuild.getChannelsById(member.guild.id)
        let wlch: Channel = await this.client.channels.fetch(dbChannels.welcomeChannel);
        if (!wlch) return;

        let rlch: Channel = await this.client.channels.fetch(dbChannels.rulesChannel);
        if (!rlch) return;

        const replyMessage = new MessageEmbed({
            color: "AQUA",
            title: `Willkommen auf ${member.guild.name}`
        })
            .setDescription([`Hallo ${member}, willkommen bei ${member.guild.name}!\n
        Lese dir am besten gleich am Anfang die Regeln durch und betätige mit ${this.client.config.emojis.true} in ${(rlch as TextChannel)}, 
        um deine Mitgliedsrolle zu erhalten und Zugang zu allen Kanälen zu bekommen :relaxed:
        Solltest du Fragen haben, melde dich einfach bei einem Moderator oder versuche es in einem der Support-Kanäle.
        
        Viel Spaß bei uns,\n
        Dein ${member.guild.name} Mod-Team`]);
        await member.send(replyMessage);



        await gf.search('hello', {sort: 'relevant', type: 'gifs'})
            .then((gifs) => {
            let totalResponses = gifs.data.length;
            let responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
            let responseFinal = gifs.data[responseIndex];
                const welcomeMessage = new MessageEmbed({
                    color: "AQUA",
                    title: `Willkommen :wave:`
                })
                    .setDescription([`Willkommen ${member}, vergiss nicht die Regeln in ${(rlch as TextChannel)} zu bestätigen!`])
                    .setImage(responseFinal.images.fixed_height.url)
                    .setTimestamp();

            (wlch as TextChannel).send(welcomeMessage);
        }).catch((e) => this.client.logger.error("Fuckin giphy error mate:" + e));
    }
}
