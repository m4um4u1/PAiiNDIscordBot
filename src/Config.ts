export class Config {
    discordToken: string = process.env.DISCORD_BOT_TOKEN;
    giphyToken: string = process.env.GIPHY_TOKEN;
    owner: string = process.env.OWNER;
    ytapitoken: string = process.env.YOUTUBE_API;
    mongouri: string = process.env.DBURI;
}
