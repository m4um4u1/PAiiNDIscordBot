import { Listener } from "discord-akairo";
import dbGuild from "../../models/guild.model";
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Channel, TextChannel } from "discord.js";
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

        await member.send(`Hallo ${member}, willkommen bei ${member.guild.name}!\n
        Lese dir am besten gleich am Anfang die Regeln durch und betätige mit ${this.client.config.emojis.true} in ${(rlch as TextChannel)}, 
        um deine Mitgliedsrolle zu erhalten und Zugang zu allen Kanälen zu bekommen :relaxed:
        Solltest du Fragen haben, melde dich einfach bei einem Moderator oder versuche es in einem der Support-Kanäle.
        \n
        Viel Spaß bei uns,\n
        Dein ${member.guild.name} Discord-Team`);


        await gf.search('hello', {sort: 'relevant', type: 'gifs'})
            .then((gifs) => {
            let totalResponses = gifs.data.length;
            let responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
            let responseFinal = gifs.data[responseIndex];
            (wlch as TextChannel).send(`Willkommen, ${member} auf unserem Server, bitte vergiss nicht die Regeln in ${(rlch as TextChannel)} zu bestätigen!`, {
                files: [responseFinal.images.fixed_height.url]
            });
        }).catch((e) => this.client.logger.error("Fuckin giphy error mate:" + e))
    }
}
