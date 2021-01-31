import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    public async exec() {
     let activities = ['Made by PAiiN', `${this.client.channels.cache.size} channels!`, `${this.client.guilds.cache.size} servers!`, `${this.client.users.cache.size} users!`], i=0;
        this.client.logger.info(`Eingeloggt als ${this.client.user.tag}! (${this.client.user.id})`);

        setInterval(async () => {
            await this.client.user.setPresence({
                status: "online",
                activity: {
                    name: `${activities[i++ % activities.length]}`,
                    type: 'WATCHING'
                }
            });
        }, 10000);
    }
}
