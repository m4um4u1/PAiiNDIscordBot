import { Listener } from "discord-akairo";
import dbGuild from "../../models/guild.model";

export default class GuildDeleteListener extends Listener {
    public constructor() {
        super('guildDelete', {
            emitter: 'client',
            event: 'guildDelete'
        });
    }

    public async exec(guild) {
        dbGuild.findOneAndDelete({
            guildID: guild.id
        }, (err) => {
            if(err) this.client.logger.error(err);
            this.client.logger.info(`Ich habe den Server ${guild.name} verlassen`)
        });
    }
}
