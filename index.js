const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = '!';
const CHANGELOG_CHANNEL_ID = '1400415683833102406';

// Store active changelog sessions
const activeChangelogs = new Map();

// Minecraft Rule articles and sub-articles data
const minecraftRules = {
    '1': {
        title: 'Respect for Creations',
        description: 'Article I — Respect for Creations',
        color: 0x138B4F,
        subarticles: {
            '1.1': 'No member shall destroy, alter, or steal from the builds of another without consent.',
            '1.2': 'The act of griefing, raiding, or trespassing is forbidden within all realms of Paraiso.'
        }
    },
    '2': {
        title: 'Integrity of Play',
        description: 'Article II — Integrity of Play',
        color: 0x138B4F,
        subarticles: {
            '2.1': 'The use of hacked clients, x-ray, duplication glitches, or exploits that grant unfair advantage is prohibited.',
            '2.2': 'The use of autoclickers, auto-aim, macros, or scripts designed to automate gameplay is strictly forbidden.',
            '2.3': 'Bugs or unintended mechanics must not be abused. Instead, they shall be reported to the Council (staff).'
        }
    },
    '3': {
        title: 'Boundaries of the Land',
        description: 'Article III — Boundaries of the Land',
        color: 0x138B4F,
        subarticles: {
            '3.1': 'Members shall respect land claims and protected regions.',
            '3.2': 'Construction too near another\'s settlement without consent is unlawful.'
        }
    },
    '4': {
        title: 'Creations & Expression',
        description: 'Article IV — Creations & Expression',
        color: 0x138B4F,
        subarticles: {
            '4.1': 'Builds or symbols of an inappropriate, offensive, or NSFW nature are forbidden.',
            '4.2': 'Political or historically controversial structures that may incite conflict or division are prohibited.',
            '4.3': 'The Council reserves the right to remove any build deemed harmful to the harmony of Paraiso.'
        }
    },
    '5': {
        title: 'Combat & PvP Conduct',
        description: 'Article V — Combat & PvP Conduct',
        color: 0x138B4F,
        subarticles: {
            '5.1': 'Spawn-killing, unfair trapping, or abusing mechanics to repeatedly kill others is prohibited.',
            '5.2': 'PvP shall be fair and without the aid of cheats or automated tools.'
        }
    },
    '6': {
        title: 'Economy & Rank',
        description: 'Article VI — Economy & Rank',
        color: 0x138B4F,
        subarticles: {
            '6.1': 'Scamming, deception, or abuse of shops and trades is forbidden.',
            '6.2': 'Exploitation of the economy through glitches or manipulation is unlawful.',
            '6.3': 'Abuse of donor rank perks, special abilities, or privileges that disrupt fair play is strictly forbidden.'
        }
    },
    '7': {
        title: 'Preservation of the Realm',
        description: 'Article VII — Preservation of the Realm',
        color: 0x138B4F,
        subarticles: {
            '7.1': 'Lag machines, excessive redstone clocks, or entities that strain performance are forbidden.',
            '7.2': 'Members must avoid excessive terrain destruction that ruins the environment of Paraiso.'
        }
    },
    '8': {
        title: 'Conduct & Community',
        description: 'Article VIII — Conduct & Community',
        color: 0x138B4F,
        subarticles: {
            '8.1': 'Members shall not incite or perpetuate unnecessary drama, disputes, or toxic rivalries.',
            '8.2': 'Hate speech, slander, or targeted negativity toward individuals or groups shall not be tolerated.',
            '8.3': 'Disruptive behavior intended to divide or destabilize the community is unlawful.'
        }
    },
    '9': {
        title: 'Authority & Order',
        description: 'Article IX — Authority & Order',
        color: 0x138B4F,
        subarticles: {
            '9.1': 'The rulings of Zeki and the Guardians (staff) are final and binding.',
            '9.2': 'Appeals may be brought forth with respect and proper context.'
        }
    }
};

// Discord rules data
const discordRules = {
    '1': {
        title: 'Respect for All',
        description: 'Article I — Respect for All',
        color: 0x5865F2,
        subarticles: {
            '1.1': 'Every member shall treat others with kindness and respect. Insults, harassment, or discrimination in any form are forbidden.'
        }
    },
    '2': {
        title: 'Proper Conduct',
        description: 'Article II — Proper Conduct',
        color: 0x131B8B,
        subarticles: {
            '2.1': 'Toxicity, excessive arguments, or hostile behavior have no place within Paraiso.'
        }
    },
    '3': {
        title: 'Language & Content',
        description: 'Article III — Language & Content',
        color: 0x131B8B,
        subarticles: {
            '3.1': 'All messages and media must remain safe for all members. NSFW, overly offensive, or harmful content is prohibited.'
        }
    },
    '4': {
        title: 'Chat Etiquette',
        description: 'Article IV — Chat Etiquette',
        color: 0x131B8B,
        subarticles: {
            '4.1': 'Spamming, flooding, excessive emojis, or disruptive behavior is not permitted.'
        }
    },
    '5': {
        title: 'Authority of Staff',
        description: 'Article V — Authority of Staff',
        color: 0x131B8B,
        subarticles: {
            '5.1': 'The word of Zeki and the Moderators shall be final. Members must respect staff directions at all times.'
        }
    },
    '6': {
        title: 'Privacy & Safety',
        description: 'Article VI — Privacy & Safety',
        color: 0x131B8B,
        subarticles: {
            '6.1': 'No member shall share personal information of themselves or others. Doxxing or unsafe behavior is strictly forbidden.'
        }
    },
    '7': {
        title: 'Harmony of the Community',
        description: 'Article VII — Harmony of the Community',
        color: 0x131B8B,
        subarticles: {
            '7.1': 'Members are expected to contribute positively, ensuring that Paraiso remains a welcoming and enjoyable space for all.'
        }
    }
};

client.once('ready', () => {
    console.log(`✅ ParaisoCore is online! Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    
    // Set bot status
    client.user.setActivity('Paraiso Server', { type: 'WATCHING' });
});

client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Check for active changelog sessions first (non-prefix messages)
    if (activeChangelogs.has(message.author.id)) {
        await handleChangelogResponse(message);
        return;
    }

    // Handle prefix commands
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        switch (command) {
            case 'announce':
                await handleAnnouncement(message, args);
                break;
            
            case 'update':
                await handleUpdate(message, args);
                break;
            
            case 'mcrule':
                await handleMinecraftRule(message, args);
                break;
            
            case 'mcrules':
                await handleAllMinecraftRules(message);
                break;
            
            case 'dcrule':
                await handleDiscordRule(message, args);
                break;
            
            case 'dcrules':
                await handleAllDiscordRules(message);
                break;
            
            case 'rule':
            case 'rules':
                await handleRuleHelp(message);
                break;
            
            case 'help':
                await handleHelp(message);
                break;
            
            default:
                // Don't respond to unknown commands to avoid spam
                break;
        }
    } catch (error) {
        console.error('Command execution error:', error);
        message.reply('❌ An error occurred while processing your command.');
    }
});

// Handle interactive changelog builder
async function handleAnnouncement(message, args) {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.reply('❌ You need `Manage Messages` permission to use this command.');
    }

    // Check if user already has an active changelog session
    if (activeChangelogs.has(message.author.id)) {
        return message.reply('❌ You already have an active changelog session. Please complete it first or type `cancel` to cancel it.');
    }

    // Start the interactive changelog builder
    activeChangelogs.set(message.author.id, {
        step: 'title',
        channelId: message.channel.id,
        title: null,
        description: null
    });

    const embed = new EmbedBuilder()
        .setTitle('📝 Changelog Builder')
        .setDescription('Let\'s create a changelog entry for the release notes!\n\n**Step 1 of 2:** Please provide the update title (e.g., "Version 2.1.0 - New Features")')
        .setColor(0x57F287)
        .setFooter({
            text: 'Type "cancel" at any time to cancel this process',
            iconURL: message.author.displayAvatarURL()
        })
        .setTimestamp();

    await message.reply({ embeds: [embed] });
    await message.delete().catch(() => {}); // Delete command message
}

// Handle changelog response messages
async function handleChangelogResponse(message) {
    const session = activeChangelogs.get(message.author.id);
    if (!session || session.channelId !== message.channel.id) return;

    const content = message.content.trim();

    // Handle cancel command
    if (content.toLowerCase() === 'cancel') {
        activeChangelogs.delete(message.author.id);
        const cancelEmbed = new EmbedBuilder()
            .setTitle('❌ Changelog Cancelled')
            .setDescription('The changelog creation has been cancelled.')
            .setColor(0xED4245)
            .setTimestamp();
        
        await message.reply({ embeds: [cancelEmbed] });
        await message.delete().catch(() => {});
        return;
    }

    try {
        if (session.step === 'title') {
            // Store the title and ask for description
            session.title = content;
            session.step = 'description';

            const embed = new EmbedBuilder()
                .setTitle('📝 Changelog Builder')
                .setDescription(`Great! Title saved: **${content}**\n\n**Step 2 of 2:** Now please provide the changelog description/logs.\nThis can be multiple lines and include all the changes, fixes, and updates.`)
                .setColor(0x57F287)
                .setFooter({
                    text: 'Type "cancel" to cancel this process',
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            await message.delete().catch(() => {});

        } else if (session.step === 'description') {
            // Store the description and create the final changelog
            session.description = content;
            
            // Create the changelog embed
            const changelogEmbed = new EmbedBuilder()
                .setTitle(`📋 ${session.title}`)
                .setDescription(session.description)
                .setColor(0x00D4AA)
                .setAuthor({
                    name: 'Paraiso Development Team',
                    iconURL: message.guild.iconURL()
                })
                .setFooter({
                    text: `Created by ${message.author.username}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp();

            // Send to changelog channel
            const changelogChannel = message.guild.channels.cache.get(CHANGELOG_CHANNEL_ID);
            if (changelogChannel) {
                await changelogChannel.send({ embeds: [changelogEmbed] });
                
                const successEmbed = new EmbedBuilder()
                    .setTitle('✅ Changelog Published!')
                    .setDescription(`Your changelog has been successfully posted to <#${CHANGELOG_CHANNEL_ID}>`)
                    .setColor(0x57F287)
                    .setTimestamp();
                
                await message.reply({ embeds: [successEmbed] });
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌ Error')
                    .setDescription('Could not find the changelog channel. Please contact an administrator.')
                    .setColor(0xED4245)
                    .setTimestamp();
                
                await message.reply({ embeds: [errorEmbed] });
            }

            // Clean up the session
            activeChangelogs.delete(message.author.id);
            await message.delete().catch(() => {});
        }
    } catch (error) {
        console.error('Changelog response error:', error);
        activeChangelogs.delete(message.author.id);
        message.reply('❌ An error occurred while processing your changelog. Please try again.');
    }
}

// Handle update embeds
async function handleUpdate(message, args) {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.reply('❌ You need `Manage Messages` permission to use this command.');
    }

    if (args.length === 0) {
        return message.reply('❌ Please provide an update message.\nUsage: `!update <message>`');
    }

    const updateText = args.join(' ');
    
    const embed = new EmbedBuilder()
        .setTitle('🔄 Server Update')
        .setDescription(updateText)
        .setColor(0x57F287)
        .setAuthor({
            name: 'Paraiso Development Team',
            iconURL: message.guild.iconURL()
        })
        .setFooter({
            text: `Updated by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL()
        })
        .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    await message.delete().catch(() => {}); // Delete command message
}

// Handle Minecraft rule articles
async function handleMinecraftRule(message, args) {
    if (args.length === 0) {
        return message.reply('❌ Please specify a rule number.\nUsage: `!mcrule <number>` or `!mcrule <number.subnumber>`\nExample: `!mcrule 1` or `!mcrule 1.2`');
    }

    const ruleQuery = args[0];
    
    // Check if it's a sub-article (contains a dot)
    if (ruleQuery.includes('.')) {
        const [mainRule, subRule] = ruleQuery.split('.');
        
        if (!minecraftRules[mainRule]) {
            return message.reply('❌ Minecraft rule not found. Use `!mcrules` to see all available rules.');
        }
        
        const subarticle = minecraftRules[mainRule].subarticles[`${mainRule}.${subRule}`];
        if (!subarticle) {
            return message.reply(`❌ Sub-article ${ruleQuery} not found.`);
        }
        
        const embed = new EmbedBuilder()
            .setTitle(`🏰 Minecraft Rule ${ruleQuery}`)
            .setDescription(subarticle)
            .setColor(minecraftRules[mainRule].color)
            .setFooter({
                text: 'Paraiso Minecraft Server Rules',
                iconURL: message.guild.iconURL()
            })
            .setTimestamp();
        
        await message.channel.send({ embeds: [embed] });
    } else {
        // Main article
        const rule = minecraftRules[ruleQuery];
        
        if (!rule) {
            return message.reply('❌ Minecraft rule not found. Use `!mcrules` to see all available rules.');
        }
        
        const subarticlesList = Object.entries(rule.subarticles)
            .map(([key, value]) => `**${key}:** ${value}`)
            .join('\n');
        
        const embed = new EmbedBuilder()
            .setTitle(`🏰 ${rule.title}`)
            .setDescription(rule.description)
            .addFields({
                name: 'Sub-articles:',
                value: subarticlesList
            })
            .setColor(rule.color)
            .setFooter({
                text: 'Paraiso Minecraft Server Rules',
                iconURL: message.guild.iconURL()
            })
            .setTimestamp();
        
        await message.channel.send({ embeds: [embed] });
    }
}

// Handle Discord rule articles
async function handleDiscordRule(message, args) {
    if (Object.keys(discordRules).length === 0) {
        return message.reply('❌ Discord rules are not yet configured. Please contact an administrator.');
    }
    
    if (args.length === 0) {
        return message.reply('❌ Please specify a rule number.\nUsage: `!dcrule <number>` or `!dcrule <number.subnumber>`\nExample: `!dcrule 1` or `!dcrule 1.2`');
    }

    const ruleQuery = args[0];
    
    // Check if it's a sub-article (contains a dot)
    if (ruleQuery.includes('.')) {
        const [mainRule, subRule] = ruleQuery.split('.');
        
        if (!discordRules[mainRule]) {
            return message.reply('❌ Discord rule not found. Use `!dcrules` to see all available rules.');
        }
        
        const subarticle = discordRules[mainRule].subarticles[`${mainRule}.${subRule}`];
        if (!subarticle) {
            return message.reply(`❌ Sub-article ${ruleQuery} not found.`);
        }
        
        const embed = new EmbedBuilder()
            .setTitle(`💬 Discord Rule ${ruleQuery}`)
            .setDescription(subarticle)
            .setColor(discordRules[mainRule].color)
            .setFooter({
                text: 'Paraiso Discord Server Rules',
                iconURL: message.guild.iconURL()
            })
            .setTimestamp();
        
        await message.channel.send({ embeds: [embed] });
    } else {
        // Main article
        const rule = discordRules[ruleQuery];
        
        if (!rule) {
            return message.reply('❌ Discord rule not found. Use `!dcrules` to see all available rules.');
        }
        
        const subarticlesList = Object.entries(rule.subarticles)
            .map(([key, value]) => `**${key}:** ${value}`)
            .join('\n');
        
        const embed = new EmbedBuilder()
            .setTitle(`💬 ${rule.title}`)
            .setDescription(rule.description)
            .addFields({
                name: 'Sub-articles:',
                value: subarticlesList
            })
            .setColor(rule.color)
            .setFooter({
                text: 'Paraiso Discord Server Rules',
                iconURL: message.guild.iconURL()
            })
            .setTimestamp();
        
        await message.channel.send({ embeds: [embed] });
    }
}

// Handle all Minecraft rules overview
async function handleAllMinecraftRules(message) {
    const rulesOverview = Object.entries(minecraftRules)
        .map(([key, rule]) => `**Article ${key}:** ${rule.title}`)
        .join('\n');
    
    const embed = new EmbedBuilder()
        .setTitle('🏰 Paraiso Minecraft Server Rules Overview')
        .setDescription('Here are all the main Minecraft rule articles:')
        .addFields({
            name: 'Available Rules:',
            value: rulesOverview
        })
        .setColor(0x8B4513)
        .setFooter({
            text: 'Use !mcrule <number> to view specific rules | Use !mcrule <number.subnumber> for sub-articles',
            iconURL: message.guild.iconURL()
        })
        .setTimestamp();
    
    await message.channel.send({ embeds: [embed] });
}

// Handle all Discord rules overview
async function handleAllDiscordRules(message) {
    if (Object.keys(discordRules).length === 0) {
        return message.reply('❌ Discord rules are not yet configured. Please contact an administrator.');
    }
    
    const rulesOverview = Object.entries(discordRules)
        .map(([key, rule]) => `**Rule ${key}:** ${rule.title}`)
        .join('\n');
    
    const embed = new EmbedBuilder()
        .setTitle('💬 Paraiso Discord Server Rules Overview')
        .setDescription('Here are all the main Discord rule articles:')
        .addFields({
            name: 'Available Rules:',
            value: rulesOverview
        })
        .setColor(0x5865F2)
        .setFooter({
            text: 'Use !dcrule <number> to view specific rules | Use !dcrule <number.subnumber> for sub-articles',
            iconURL: message.guild.iconURL()
        })
        .setTimestamp();
    
    await message.channel.send({ embeds: [embed] });
}

// Handle rule help command
async function handleRuleHelp(message) {
    const embed = new EmbedBuilder()
        .setTitle('📜 Rule Commands Help')
        .setDescription('Choose which type of rules you want to view:')
        .addFields(
            {
                name: '🏰 Minecraft Rules',
                value: '`!mcrules` - Show all Minecraft rule articles\n`!mcrule <number>` - Show specific Minecraft rule\n`!mcrule <number.subnumber>` - Show specific sub-article',
                inline: false
            },
            {
                name: '💬 Discord Rules',
                value: '`!dcrules` - Show all Discord rule articles\n`!dcrule <number>` - Show specific Discord rule\n`!dcrule <number.subnumber>` - Show specific sub-article',
                inline: false
            }
        )
        .setColor(0x9932CC)
        .setFooter({
            text: 'Paraiso Server Rules System',
            iconURL: message.guild.iconURL()
        })
        .setTimestamp();
    
    await message.channel.send({ embeds: [embed] });
}

// Handle help command
async function handleHelp(message) {
    const embed = new EmbedBuilder()
        .setTitle('🤖 ParaisoCore Bot Commands')
        .setDescription('Here are all available commands:')
        .addFields(
            {
                name: '📢 Changelog & Updates',
                value: '`!announce` - Interactive changelog builder for release notes\n`!update <message>` - Create an update embed',
                inline: false
            },
            {
                name: '📜 Rules System',
                value: '`!rules` or `!rule` - Show rule commands help\n`!mcrules` - Show Minecraft rules\n`!dcrules` - Show Discord rules',
                inline: false
            },
            {
                name: '❓ General',
                value: '`!help` - Show this help message',
                inline: false
            }
        )
        .setColor(0x5865F2)
        .setFooter({
            text: 'ParaisoCore Bot for Paraiso Server',
            iconURL: message.guild.iconURL()
        })
        .setTimestamp();
    
    await message.channel.send({ embeds: [embed] });
}

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login with bot token
client.login(process.env.DISCORD_BOT_TOKEN);
