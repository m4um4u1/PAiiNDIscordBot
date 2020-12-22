export default class Utilities {

    static async parseDuration(duration: number): Promise<string> {
        const SECOND = 1000;
        const MINUTE = SECOND * 60;
        const HOUR = MINUTE * 60;
        const seconds = Math.floor(duration / SECOND) % 60;
        const minutes = Math.floor(duration / MINUTE) % 60;
        let output = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (duration >= HOUR) {
            const hours = Math.floor(duration / HOUR);
            output = `${hours.toString().padStart(2, '0')}:${output}`;
        }
        return output;
    }

    static async promptMessage(message, author, time, validReactions) {
        time *= 1000;

        for (const reaction of validReactions) await message.react(reaction);

        const filter = (reaction, user) =>
            validReactions.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    }

    static async formatDate(date): Promise<string>{
        return new Intl.DateTimeFormat("de-DE").format(date);
    }
}
