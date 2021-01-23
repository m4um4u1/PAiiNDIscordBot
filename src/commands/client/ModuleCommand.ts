import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import botSettings from "../../models/botsettings.model";

export default class ModuleCommand extends Command {
    public constructor() {
        super('module', {
            aliases: ['module'],
            category: 'client',
            description: {
                content: 'Mit dem command kannst du Module an und ausschalten',
                usage: '[module] [status]',
                examples: ['ping enable', 'goodbye disable']
            },
            ratelimit: 0,
            clientPermissions: ["SEND_MESSAGES"],
            userPermissions: ["SEND_MESSAGES"],
            channel: 'guild',       // guild, dm
            args: [
                {
                    id: 'module',
                    type: 'string'
                    // match: "rest",   // option
                    // flag: []
                },
                {
                    id: 'status',
                    type: 'string'
                }
            ]
        });
    }

    public async exec(message: Message, args): Promise<void> {

        switch(args.module) {
            case 'ping':
                if(args.status === 'enable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {pingCommand: true});
                    await message.util.send('Command "Ping" wurde aktiviert!');
                } else if (args.status === 'disable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {pingCommand: false});
                    await message.util.send('Command "Ping" wurde deaktiviert!');
                }
                break;
            case 'welcomeMessages':
                if(args.status === 'enable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {welcomeMessages: true});
                    await message.util.send('"Willkommensnachrichten" wurden aktiviert!');
                } else if (args.status === 'disable'){
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {welcomeMessages: false});
                    await message.util.send('"Willkommensnachrichten" wurden deaktiviert!');
                }
                break;
            case 'welcomeDmMessage':
                if(args.status === 'enable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {welcomeDmMessages: true});
                    await message.util.send('Die privaten "Willkommensnachrichten" wurden aktiviert!');
                } else if (args.status === 'disable'){
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {welcomeDmMessages: false});
                    await message.util.send('Die privaten "Willkommensnachrichten" wurden deaktiviert!');
                }
                break;
            case 'goodbyeMessages':
                if(args.status === 'enable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {goodbyeMessages: true});
                    await message.util.send('"Abschiedsnachrichten" wurden aktiviert!');
                } else if (args.status === 'disable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {goodbyeMessages: false});
                    await message.util.send('"Abschiedsnachrichten" wurden deaktiviert!');
                }
                break;
            case 'uptime':

                break;
            case 'box':

                break;
            case 'rps':

                break;
            case 'clear':

                break;
            case 'report':

                break;
            default:
            await message.util.send('Der command wurde nicht gefunden!')
        }


    }
}

