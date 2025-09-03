# Overview

ParaisoCore is a Discord bot designed for community management, focusing on rule enforcement and information dissemination. The bot provides an interactive rule system where users can query specific rules and sub-articles through simple commands. Built with Discord.js v14, it serves as a centralized hub for community guidelines and moderation support within Discord servers.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Bot Architecture
The application follows a straightforward event-driven architecture typical of Discord bots:

- **Single-file structure**: All bot logic is contained in `index.js` for simplicity and ease of maintenance
- **Command-prefix system**: Uses `!` prefix for command recognition, providing a familiar interface for Discord users
- **Intent-based permissions**: Implements minimal required Discord intents (Guilds, GuildMessages, MessageContent) for optimal performance and security

## Data Management
- **In-memory rule storage**: Rules and sub-articles are stored as JavaScript objects within the application
- **Structured rule system**: Hierarchical organization with main rules (1, 2, 3, 4) and sub-articles (1.1, 1.2, etc.)
- **Color-coded embeds**: Each rule category has distinct colors for visual organization and user experience

## Message Handling
- **Rich embed responses**: Utilizes Discord's EmbedBuilder for formatted, professional-looking rule displays
- **Dynamic content rendering**: Supports querying both main rules and specific sub-articles
- **Error handling**: Graceful handling of invalid rule requests with user-friendly feedback

## Dual Rule System
The bot now features a comprehensive dual rule system for both Minecraft and Discord servers:

### Minecraft Server Rules (9 Articles)
1. **Respect for Creations** (Brown) - Protection of builds and creations
2. **Integrity of Play** (Lime Green) - Fair play and anti-cheat policies
3. **Boundaries of the Land** (Forest Green) - Land claims and territory respect
4. **Creations & Expression** (Tomato Red) - Appropriate build content guidelines
5. **Combat & PvP Conduct** (Crimson) - Fair combat and PvP rules
6. **Economy & Rank** (Gold) - Trading and economy guidelines
7. **Preservation of the Realm** (Royal Blue) - Performance and environment protection
8. **Conduct & Community** (Dark Orchid) - Community behavior standards
9. **Authority & Order** (Purple) - Staff authority and appeals process

### Discord Server Rules (7 Articles)
1. **Respect for All** (Blue) - Basic respect and anti-harassment policies
2. **Proper Conduct** (Green) - Anti-toxicity and behavior standards
3. **Language & Content** (Yellow) - Content appropriateness guidelines
4. **Chat Etiquette** (Red) - Chat behavior and spam prevention
5. **Authority of Staff** (Purple) - Staff authority and compliance
6. **Privacy & Safety** (Tomato) - Personal information protection
7. **Harmony of the Community** (Dark Turquoise) - Community contribution expectations

# External Dependencies

## Discord.js Framework
- **Version**: 14.22.1
- **Purpose**: Primary library for Discord API interaction and bot functionality
- **Components used**: Client, GatewayIntentBits, EmbedBuilder
- **Rationale**: Industry-standard library with comprehensive Discord API coverage and active community support

## Discord API
- **Integration**: Direct connection to Discord's Gateway API for real-time message processing
- **Permissions**: Requires bot token and appropriate server permissions for message reading and sending
- **Rate limiting**: Inherits Discord.js built-in rate limiting and connection management

## Node.js Runtime
- **Version requirement**: >=16.11.0 (as specified by Discord.js dependency)
- **Environment**: Server-side JavaScript execution for continuous bot operation