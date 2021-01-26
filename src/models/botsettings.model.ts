import { prop, getModelForClass } from '@typegoose/typegoose';

class Settings {

    @prop({ default: true })
    public welcomeMessages?: boolean;

    @prop({ default: true })
    public welcomeDmMessage?: boolean;

    @prop({ default: true })
    public goodbyeMessages?: boolean;

    @prop({ default: true })
    public pingCommand?: boolean;

    @prop({ default: true })
    public uptimeCommand?: boolean;

    @prop({ default: true })
    public boxCommand?: boolean;

    @prop({ default: true })
    public rpsCommand?: boolean;

    @prop({ default: true })
    public clearCommand?: boolean;

    @prop({ default: true })
    public reportCommand?: boolean;

    @prop({required: true})
    public guildId!: string;
}

const botSettings = getModelForClass(Settings);

export default botSettings;
