import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    public async exec() {
        this.client.logger.info(`Eingeloggt als ${this.client.user.tag}! (${this.client.user.id})`);

        await this.client.user.setPresence({
            status: "online",
            activity: {
                name: 'https://paiinweb.wtf',
                type: 'WATCHING'
            }
        });
    }
}
