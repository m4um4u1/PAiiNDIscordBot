import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    public async exec() {
     const activities = ['https://paiinweb.wtf', 'Made by PAiiN', 'Hosted by PAiiN'];
        this.client.logger.info(`Eingeloggt als ${this.client.user.tag}! (${this.client.user.id})`);

        setInterval(async () => {
            const index = Math.floor(Math.random() * (activities.length - 1) + 1);
            await this.client.user.setPresence({
                status: "online",
                activity: {
                    name: activities[index],
                    type: 'WATCHING'
                }
            });
        }, 10000);
    }
}
