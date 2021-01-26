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
            userPermissions: ["SEND_MESSAGES", "MANAGE_GUILD"],
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
        const settings = await botSettings.findOne({ guildId: message.guild.id });

        if(!settings) {
            await botSettings.create({
                guildId: message.guild.id
            })
        }

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
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {welcomeDmMessage: true});
                    await message.util.send('Die privaten "Willkommensnachrichten" wurden aktiviert!');
                } else if (args.status === 'disable'){
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {welcomeDmMessage: false});
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
                if(args.status === 'enable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {uptimeCommand: true});
                    await message.util.send('Command "Uptime" wurde aktiviert!');
                } else if (args.status === 'disable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {uptimeCommand: false});
                    await message.util.send('Command "uptime" wurde deaktiviert!');
                }
                break;
            case 'box':
                if(args.status === 'enable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {boxCommand: true});
                    await message.util.send('Command "Box" wurde aktiviert!');
                } else if (args.status === 'disable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {boxCommand: false});
                    await message.util.send('Command "Box" wurde deaktiviert!');
                }
                break;
            case 'rps':
                if(args.status === 'enable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {rpsCommand: true});
                    await message.util.send('Command "rps" wurde aktiviert!');
                } else if (args.status === 'disable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {rpsCommand: false});
                    await message.util.send('Command "rps" wurde deaktiviert!');
                }
                break;
            case 'clear':
                if(args.status === 'enable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {clearCommand: true});
                    await message.util.send('Command "clear" wurde aktiviert!');
                } else if (args.status === 'disable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {clearCommand: false});
                    await message.util.send('Command "clear" wurde deaktiviert!');
                }
                break;
            case 'report':
                if(args.status === 'enable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {reportCommand: true});
                    await message.util.send('Command "report" wurde aktiviert!');
                } else if (args.status === 'disable') {
                    await botSettings.findOneAndUpdate({guildId: message.guild.id}, {reportCommand: false});
                    await message.util.send(' Command "report" wurde deaktiviert!');
                }
                break;
            default:
            await message.util.send('Der command wurde nicht gefunden!')
        }


    }
}

