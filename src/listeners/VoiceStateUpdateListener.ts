import { Listener } from "discord-akairo";

export default class GuildDeleteListener extends Listener {
    public constructor() {
        super('voiceStatusUpdate', {
            emitter: 'client',
            event: 'voiceStatusUpdate'
        });
    }

    public async exec(oldState, newState) {
        if (
            newState.member.user.bot &&
            !newState.channelID &&
            newState.guild.musicData.songDispatcher &&
            newState.member.user.id === this.client.user.id
        ) {
            oldState.guild.musicData.queue.length = 0;
            oldState.guild.musicData.songDispatcher.end();
        }
    }
}
