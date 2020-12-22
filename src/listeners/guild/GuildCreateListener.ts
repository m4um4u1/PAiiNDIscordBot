import { Listener } from "discord-akairo";
import dbGuild from "../../models/guild.model";

export default class GuildCreateListener extends Listener {
    public constructor() {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    public async exec(guild) {
        try {
            await dbGuild.create({
                guildId: guild.id,
                guildName: guild.name,
                joinedAt: guild.joinedAt,
                roles: {},
                channels: {}
            });

            this.client.logger.info(`Ich wurde zu ${guild.guildName} eingeladen`)
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
