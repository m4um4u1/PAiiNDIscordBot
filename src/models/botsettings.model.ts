import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';

class Settings {

    @prop({ default: true })
    public welcomeMessages: boolean;

    @prop({ default: true })
    public welcomeDmMessage: boolean;

    @prop({ default: true })
    public goodbyeMessages: boolean;

    @prop({ default: true })
    public PingCommand: boolean;

    @prop({ default: true })
    public UptimeCommand: boolean;

    @prop({ default: true })
    public BoxCommand: boolean;

    @prop({ default: true })
    public RpsCommand: boolean;

    @prop({ default: true })
    public ClearCommand: boolean;

    @prop({ default: true })
    public ReportCommand: boolean;

    @prop({ default: null })
    public guildId!: string;
}

const botSettings = getModelForClass(Settings);

export default botSettings;
