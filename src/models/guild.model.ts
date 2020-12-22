import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';

class Roles {

    @prop({ default: null })
    public defaultRole?: string;

    @prop({ default: null })
    public moderatorRole?: string;

    @prop({ default: null })
    public adminRole?: string;
}

class Channels {

    @prop({ default: null })
    public welcomeChannel?: string;

    @prop({ default: null })
    public rulesChannel?: string;

    @prop({ default: null })
    public logsChannel?: string;
}

class Guild {

    @prop({ required: true })
    public guildId!: string;

    @prop({ default: "!", required: true })
    public prefix?: string;

    @prop({ required: true })
    public guildName!: string;

    @prop({ required: true })
    public joinedAt!: Date;

    @prop({ required: true })
    public roles!: Roles;

    @prop({ required: true })
    public channels!: Channels;

    public static async getChannelsById (this: ReturnModelType<typeof Guild>, id: string) {
        const guild = await this.findOne({ guildId: id });
        return guild.channels;
    }

    public static async getRolesById (this: ReturnModelType<typeof Guild>, id: string) {
        const guild = await this.findOne({ guildId: id });
        return guild.roles;
    }
}

const dbGuild = getModelForClass(Guild);

export default dbGuild;
