import { Listener } from "discord-akairo";
import dbGuild from "../../models/guild.model";
import botSettings from "../../models/botsettings.model";

export default class GuildUpdateListener extends Listener {
    public constructor() {
        super('guildUpdate', {
            emitter: 'client',
            event: 'guildUpdate'
        });
    }

    public async exec(guild) {
        const settings = botSettings.findOne({ guildId: guild.id});

        try {
            await dbGuild.findOneAndUpdate({guildId: guild.id},
                {
                guildName: guild.name
            });

            if(!settings) await botSettings.create({
                guildId: guild.id
            });

            this.client.logger.info(`Ich wurde zu ${guild.guildName} eingeladen`)
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
