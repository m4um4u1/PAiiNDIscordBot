import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import dbGuild from "../../models/guild.model";


export default class HelpCommand extends Command {
    public constructor() {
        super('help', {
            aliases: ['help'],
            description: {
                content: 'Zeigt eine Liste aller commands, oder detaillierte Informationen eines Commands.',
                usage: '[command]'
            },
            category: 'client',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias'
                }
            ]
        });
    }

    public async exec(message: Message, { command }: { command: Command }): Promise<Message | Message[]> {
        const prefix = dbGuild.getPrefixById(message.guild.id);

        if (!command) {
            const embed = new MessageEmbed()
                .setColor('WHITE')
                .addField('❯ Commands', stripIndents`Eine liste aller commands.
                    Für genauere hilfe, schreibe \`${prefix}help <command>\`
                `);

            for (const category of this.handler.categories.values()) {
                embed.addField(`❯ ${category.id.replace(/(\b\w)/gi, (lc): string => lc.toUpperCase())}`, `${category.filter((cmd): boolean => cmd.aliases.length > 0).map((cmd): string => `\`${cmd.aliases[0]}\``).join(' ')}`);
            }

            return message.util!.send(embed);
        }

        const embed = new MessageEmbed()
            .setColor([155, 200, 200])
            .setTitle(`\`${command.aliases[0]} ${command.description.usage ? command.description.usage : ''}\``)
            .addField('❯ Beschreibung', `${command.description.content ? command.description.content : ''} ${command.description.ownerOnly ? '\n**[Owner Only]**': ''}`);

        if (command.aliases.length > 1) embed.addField('❯ Aliases', `\`${command.aliases.join('` `')}\``, true);
        if (command.description.examples && command.description.examples.length) embed.addField('❯ Beispiel', `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\``, true);

        return message.util!.send(embed);
    }
}
