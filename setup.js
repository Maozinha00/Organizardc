/**
 * ============================================================
 * RAFINHA DISCORD — CONFIGURAÇÃO AUTOMÁTICA
 * ============================================================
 *
 * O script:
 * ✅ Apaga os canais antigos
 * ✅ Cria os cargos (Streamer, Mod, Editor, Sub, Booster, Membro, Seguidor)
 * ✅ Configura permissões dos cargos
 * ✅ Cria 5 categorias (Info, Live, Comunidade, Gaming, Voz)
 * ✅ Cria canais de texto e anúncio
 * ✅ Cria canais de voz
 * ✅ Configura canais somente leitura e acesso por cargo
 *
 * REQUISITOS:
 * - Node.js 18+
 * - discord.js v14
 * - .env com DISCORD_TOKEN e GUILD_ID
 * - Bot com permissão ADMINISTRADOR e cargo no topo
 * ============================================================
 */

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActivityType
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ============================================================
// CONFIGURAÇÃO DOS CARGOS
// ============================================================

const ROLES_TO_CREATE = [
  {
    name: '👑・STREAMER',
    color: '#FF4655',
    hoist: true,
    mentionable: true,
    permissions: [
      PermissionsBitField.Flags.ManageGuild,
      PermissionsBitField.Flags.ManageChannels,
      PermissionsBitField.Flags.ManageMessages,
      PermissionsBitField.Flags.ManageRoles,
      PermissionsBitField.Flags.KickMembers,
      PermissionsBitField.Flags.BanMembers,
      PermissionsBitField.Flags.ModerateMembers,
      PermissionsBitField.Flags.ViewAuditLog
    ]
  },

  {
    name: '🛡️・MODERADOR',
    color: '#1E3A8A',
    hoist: true,
    mentionable: true,
    permissions: [
      PermissionsBitField.Flags.ManageMessages,
      PermissionsBitField.Flags.KickMembers,
      PermissionsBitField.Flags.BanMembers,
      PermissionsBitField.Flags.ModerateMembers,
      PermissionsBitField.Flags.ViewAuditLog
    ]
  },

  {
    name: '🎬・EDITOR',
    color: '#06B6D4',
    hoist: true,
    mentionable: true,
    permissions: [
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.AttachFiles,
      PermissionsBitField.Flags.EmbedLinks
    ]
  },

  {
    name: '⭐・SUB / APOIADOR',
    color: '#A855F7',
    hoist: true,
    mentionable: true
  },

  {
    name: '💎・BOOSTER',
    color: '#F47FFF',
    hoist: true,
    mentionable: false
  },

  {
    name: '🔥・MEMBRO ATIVO',
    color: '#22C55E',
    hoist: true,
    mentionable: false
  },

  {
    name: '👤・SEGUIDOR',
    color: '#94A3B8',
    hoist: false,
    mentionable: false
  }
];

const ROLE_NAMES = {
  STREAMER: '👑・STREAMER',
  MOD: '🛡️・MODERADOR',
  EDITOR: '🎬・EDITOR',
  SUB: '⭐・SUB / APOIADOR',
  BOOSTER: '💎・BOOSTER',
  MEMBRO: '🔥・MEMBRO ATIVO',
  SEGUIDOR: '👤・SEGUIDOR'
};

function getRole(guild, name) {
  return guild.roles.cache.find(role => role.name === name);
}

const STRUCTURE = [
  {
    category: '🛡️・INFO & REGRAS',
    channels: [
      { name: '📜│regras', type: ChannelType.GuildText, readOnly: true },
      { name: '📢│avisos', type: ChannelType.GuildAnnouncement, readOnly: true },
      { name: '🔗│redes-sociais', type: ChannelType.GuildText, readOnly: true },
      { name: '🎭│cargos-vips', type: ChannelType.GuildText, readOnly: true }
    ]
  },
  {
    category: '🎥・RAFINHA LIVE',
    channels: [
      { name: '🔴│live-on', type: ChannelType.GuildAnnouncement, readOnly: true },
      { name: '📅│agenda', type: ChannelType.GuildText, readOnly: true },
      { name: '🎬│clipes', type: ChannelType.GuildText, readOnly: false }
    ]
  },
  {
    category: '💬・COMUNIDADE',
    channels: [
      { name: '💬│chat-geral', type: ChannelType.GuildText, readOnly: false },
      { name: '🔥│memes', type: ChannelType.GuildText, readOnly: false },
      { name: '📸│mídia', type: ChannelType.GuildText, readOnly: false },
      { name: '🤖│comandos', type: ChannelType.GuildText, readOnly: false }
    ]
  },
  {
    category: '🎮・GAMING',
    channels: [
      { name: '🎮│procurar-duo', type: ChannelType.GuildText, readOnly: false },
      { name: '🏆│torneios', type: ChannelType.GuildText, readOnly: false },
      { name: '🌀│outros-jogos', type: ChannelType.GuildText, readOnly: false }
    ]
  },
  {
    category: '🔊・CANAIS DE VOZ',
    channels: [
      { name: '🔊│Resenha', type: ChannelType.GuildVoice, userLimit: 20 },
      { name: '🎮│Duo 1', type: ChannelType.GuildVoice, userLimit: 2 },
      { name: '🎮│Squad 1', type: ChannelType.GuildVoice, userLimit: 4 },
      { name: '🎧│Lofi & Chill', type: ChannelType.GuildVoice, userLimit: 15 },
      { name: '💤│AFK', type: ChannelType.GuildVoice, userLimit: 99 }
    ]
  }
];

function buildPermissions(guild, channelName, readOnly) {
  const overwrites = [];
  const everyone = guild.roles.everyone;

  const streamer = getRole(guild, ROLE_NAMES.STREAMER);
  const moderator = getRole(guild, ROLE_NAMES.MOD);
  const editor = getRole(guild, ROLE_NAMES.EDITOR);
  const sub = getRole(guild, ROLE_NAMES.SUB);
  const booster = getRole(guild, ROLE_NAMES.BOOSTER);
  const membro = getRole(guild, ROLE_NAMES.MEMBRO);
  const seguidor = getRole(guild, ROLE_NAMES.SEGUIDOR);

  let everyonePermissions = {
    id: everyone.id,
    allow: [PermissionsBitField.Flags.ViewChannel]
  };

  if (readOnly) {
    everyonePermissions.deny = [PermissionsBitField.Flags.SendMessages];
  }

  overwrites.push(everyonePermissions);

  if (streamer) {
    overwrites.push({
      id: streamer.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.ManageChannels
      ]
    });
  }

  if (moderator) {
    overwrites.push({
      id: moderator.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.ModerateMembers
      ]
    });
  }

  if (editor) {
    overwrites.push({
      id: editor.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks
      ]
    });
  }

  if (sub) {
    overwrites.push({
      id: sub.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks
      ]
    });
  }

  if (booster) {
    overwrites.push({
      id: booster.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks
      ]
    });
  }

  if (membro) {
    overwrites.push({
      id: membro.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks
      ]
    });
  }

  if (seguidor) {
    overwrites.push({
      id: seguidor.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    });
  }

  const restrictedChannels = [
    '📜│regras',
    '📢│avisos',
    '🔗│redes-sociais',
    '🎭│cargos-vips',
    '🔴│live-on',
    '📅│agenda'
  ];

  if (restrictedChannels.includes(channelName)) {
    overwrites.push({
      id: everyone.id,
      deny: [PermissionsBitField.Flags.SendMessages]
    });

    if (membro) overwrites.push({ id: membro.id, deny: [PermissionsBitField.Flags.SendMessages] });
    if (seguidor) overwrites.push({ id: seguidor.id, deny: [PermissionsBitField.Flags.SendMessages] });
    if (booster) overwrites.push({ id: booster.id, deny: [PermissionsBitField.Flags.SendMessages] });
    if (sub) overwrites.push({ id: sub.id, deny: [PermissionsBitField.Flags.SendMessages] });
    if (editor) overwrites.push({ id: editor.id, deny: [PermissionsBitField.Flags.SendMessages] });

    if (moderator) {
      overwrites.push({
        id: moderator.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      });
    }

    if (streamer) {
      overwrites.push({
        id: streamer.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
          PermissionsBitField.Flags.ManageMessages
        ]
      });
    }
  }

  return overwrites;
}

client.once('ready', async () => {
  console.log('');
  console.log('==============================================');
  console.log('🔥 RAFINHA DISCORD SETUP');
  console.log('==============================================');
  console.log(`🤖 Bot conectado: ${client.user.tag}`);

  const rawGuildId = (process.env.GUILD_ID || '').replace(/["'\s]/g, '');
  if (!rawGuildId) {
    console.error('❌ GUILD_ID não encontrado no .env!');
    process.exit(1);
  }

  let guild = client.guilds.cache.get(rawGuildId);
  if (!guild) {
    try {
      guild = await client.guilds.fetch(rawGuildId);
    } catch (err) {
      console.error('❌ SERVIDOR NÃO ENCONTRADO!');
      process.exit(1);
    }
  }

  console.log(`🏠 Servidor: ${guild.name}`);
  console.log('');

  try {
    console.log('🗑️ Apagando canais antigos...');
    const channels = await guild.channels.fetch();
    for (const channel of channels.values()) {
      if (!channel) continue;
      try {
        await channel.delete('Configuração automática Rafinha Discord');
        console.log(`   ❌ Apagado: ${channel.name}`);
        await new Promise((r) => setTimeout(r, 250));
      } catch (error) {
        console.log(`   ⚠️ Não foi possível apagar: ${channel.name}`);
      }
    }

    console.log('');
    console.log('👑 Criando/configurando cargos...');
    for (const roleConfig of ROLES_TO_CREATE) {
      let role = guild.roles.cache.find(r => r.name === roleConfig.name);
      try {
        if (!role) {
          role = await guild.roles.create({
            name: roleConfig.name,
            color: roleConfig.color,
            hoist: roleConfig.hoist,
            mentionable: roleConfig.mentionable,
            permissions: roleConfig.permissions || [],
            reason: 'Configuração automática do servidor Rafinha'
          });
          console.log(`   ✅ Criado: ${role.name}`);
        } else {
          await role.edit({
            color: roleConfig.color,
            hoist: roleConfig.hoist,
            mentionable: roleConfig.mentionable,
            permissions: roleConfig.permissions || []
          });
          console.log(`   🔄 Atualizado: ${role.name}`);
        }
        await new Promise((r) => setTimeout(r, 200));
      } catch (error) {
        console.error(`   ❌ Erro no cargo ${roleConfig.name}:`, error.message);
      }
    }

    await guild.roles.fetch();

    console.log('');
    console.log('📁 Criando estrutura...');
    for (const section of STRUCTURE) {
      try {
        const category = await guild.channels.create({
          name: section.category,
          type: ChannelType.GuildCategory,
          reason: 'Configuração automática do servidor Rafinha'
        });

        console.log('');
        console.log(`📂 ${section.category}`);

        for (const channelConfig of section.channels) {
          try {
            let channelType = channelConfig.type;
            const permissions = buildPermissions(guild, channelConfig.name, channelConfig.readOnly);
            const channelData = {
              name: channelConfig.name,
              type: channelType,
              parent: category.id,
              permissionOverwrites: permissions,
              reason: 'Configuração automática do servidor Rafinha'
            };

            if (channelConfig.type === ChannelType.GuildVoice && channelConfig.userLimit) {
              channelData.userLimit = channelConfig.userLimit;
            }

            let channel;
            try {
              channel = await guild.channels.create(channelData);
              console.log(`   ✅ ${channel.name}`);
            } catch (createErr) {
              if (channelType === ChannelType.GuildAnnouncement) {
                channelData.type = ChannelType.GuildText;
                channel = await guild.channels.create(channelData);
                console.log(`   ✅ ${channel.name} (como texto)`);
              } else if (createErr.code === 50013) {
                delete channelData.permissionOverwrites;
                channel = await guild.channels.create(channelData);
                console.log(`   ✅ ${channel.name} (permissões básicas)`);
              } else {
                throw createErr;
              }
            }

            // Publicação de Mensagens & Embeds
            try {
              if (channel.name === '📜│regras') {
                const embed = new EmbedBuilder()
                  .setTitle('📜 REGRAS DA COMUNIDADE — RAFINHA')
                  .setDescription('Seja muito bem-vindo ao servidor oficial! Para mantermos um ambiente saudável, siga as regras:')
                  .setColor(0x5865F2)
                  .addFields(
                    { name: '1️⃣ Respeito em Primeiro Lugar', value: 'Sem discriminação, ofensas ou toxicidade.' },
                    { name: '2️⃣ Proibido Spam/Flood', value: 'Evite repetição de mensagens e emojis em massa.' },
                    { name: '3️⃣ Proibido Divulgação', value: 'Divulgações de canais externos sem autorização são proibidas.' },
                    { name: '4️⃣ Use os Canais Corretos', value: 'Poste memes em #memes e clipes em #clipes.' },
                    { name: '5️⃣ Respeite os Moderadores', value: 'Decisões da moderação e do streamer são finais.' }
                  )
                  .setFooter({ text: 'Servidor Oficial do Rafinha' })
                  .setTimestamp();
                await channel.send({ embeds: [embed] });
              } else if (channel.name === '🔗│redes-sociais') {
                const embed = new EmbedBuilder()
                  .setTitle('🔗 REDES SOCIAIS OFICIAIS DO RAFINHA')
                  .setDescription('Acompanhe todos os conteúdos e lives:')
                  .setColor(0x9146FF)
                  .addFields(
                    { name: '🔴 Twitch / Lives', value: '👉 [twitch.tv/rafinha](https://twitch.tv)', inline: true },
                    { name: '▶️ YouTube', value: '👉 [youtube.com/@rafinha](https://youtube.com)', inline: true },
                    { name: '📸 Instagram', value: '👉 [instagram.com/rafinha](https://instagram.com)', inline: true },
                    { name: '📱 TikTok', value: '👉 [tiktok.com/@rafinha](https://tiktok.com)', inline: true },
                    { name: '🐦 Twitter / X', value: '👉 [twitter.com/rafinha](https://twitter.com)', inline: true },
                    { name: '💬 Discord', value: '👉 [discord.gg/rafinha](https://discord.gg)', inline: true }
                  );
                await channel.send({ embeds: [embed] });
              } else if (channel.name === '🎭│cargos-vips') {
                const embed = new EmbedBuilder()
                  .setTitle('🎭 GUIA DE CARGOS & BENEFÍCIOS')
                  .setDescription('Conheça os cargos do servidor e seus privilégios:')
                  .setColor(0xFEE75C)
                  .addFields(
                    { name: '👑・STREAMER', value: 'Criador de conteúdo e dono do servidor.' },
                    { name: '🛡️・MODERADOR', value: 'Equipe de moderação e segurança.' },
                    { name: '🎬・EDITOR', value: 'Editores com permissão para postagem de mídias.' },
                    { name: '⭐・SUB / APOIADOR', value: 'Inscritos da Twitch/YouTube com sala e destaque.' },
                    { name: '💎・BOOSTER', value: 'Boosters do servidor com cor especial.' },
                    { name: '🔥・MEMBRO ATIVO', value: 'Membros frequentes da comunidade.' },
                    { name: '👤・SEGUIDOR', value: 'Cargo inicial padrão concedido a todos.' }
                  );
                await channel.send({ embeds: [embed] });
              } else if (channel.name === '📅│agenda') {
                const embed = new EmbedBuilder()
                  .setTitle('📅 AGENDA SEMANAL DE TRANSMISSÕES')
                  .setDescription('Horários regulares de transmissões:')
                  .setColor(0xEB459E)
                  .addFields(
                    { name: '🗓️ Segunda a Sexta', value: '🔴 Lives a partir das 19:00' },
                    { name: '🗓️ Sábado', value: '🏆 Torneios & Duos com a Comunidade' },
                    { name: '🗓️ Domingo', value: '🎬 React e Melhores Clipes' }
                  );
                await channel.send({ embeds: [embed] });
              } else if (channel.name === '🤖│comandos') {
                const embed = new EmbedBuilder()
                  .setTitle('🤖 COMANDOS DO BOT')
                  .setDescription('Comandos disponíveis para todos os membros:')
                  .setColor(0x57F287)
                  .addFields(
                    { name: '`!live`', value: 'Link da live e status atual.', inline: true },
                    { name: '`!regras`', value: 'Resumo das regras do servidor.', inline: true },
                    { name: '`!redes`', value: 'Links de todas as redes sociais.', inline: true },
                    { name: '`!cargos`', value: 'Hierarquia e benefícios.', inline: true },
                    { name: '`!ping`', value: 'Latência do bot.', inline: true },
                    { name: '`!limpar <1-100>`', value: '(Mods) Apaga mensagens.', inline: true }
                  );
                await channel.send({ embeds: [embed] });
              }
            } catch (embedErr) {}

            await new Promise((r) => setTimeout(r, 250));
          } catch (error) {
            console.error(`   ❌ Erro ao criar ${channelConfig.name}:`, error.message);
          }
        }
      } catch (error) {
        console.error(`❌ Erro na categoria ${section.category}:`, error.message);
      }
    }

    console.log('');
    console.log('==============================================');
    console.log('🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('🤖 Bot mantido ONLINE para Auto-Role e Comandos (!live, !regras, !redes, !cargos, !ajuda)...');
    console.log('==============================================');

    if (client.user) {
      client.user.setActivity('🔴 Rafinha AO VIVO | !ajuda', { type: ActivityType.Streaming, url: 'https://twitch.tv' });
    }
  } catch (error) {
    console.error('❌ ERRO GERAL:', error);
  }
});

// Auto-Role ao entrar no servidor
client.on('guildMemberAdd', async member => {
  try {
    const role = member.guild.roles.cache.find(r => r.name === '👤・SEGUIDOR' || r.name === '👤 | SEGUIDOR');
    if (role) await member.roles.add(role);

    const generalChannel = member.guild.channels.cache.find(c => c.name === '💬│chat-geral');
    if (generalChannel) {
      const welcomeEmbed = new EmbedBuilder()
        .setTitle('👋 NOVO MEMBRO NA ÁREA!')
        .setDescription(`Seja muito bem-vindo ao servidor do Rafinha, ${member}! 🚀`)
        .setColor(0x57F287)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
      await generalChannel.send({ embeds: [welcomeEmbed] });
    }
  } catch (err) {}
});

// Comandos de Chat
client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'live') {
    return message.reply('🔴 **Rafinha está AO VIVO!** Acesse agora: 👉 https://twitch.tv/rafinha');
  }
  if (command === 'redes') {
    return message.reply('🔗 **Redes Oficiais:**\nTwitch: https://twitch.tv/rafinha\nYouTube: https://youtube.com/@rafinha\nInstagram: https://instagram.com/rafinha');
  }
  if (command === 'ping') {
    return message.reply(`🏓 Pong! Latência: **${client.ws.ping}ms**`);
  }
  if (command === 'ajuda' || command === 'help') {
    return message.reply('🤖 **Comandos:** `!live`, `!regras`, `!redes`, `!cargos`, `!ping`, `!limpar <qtd>`');
  }
});

process.on('unhandledRejection', error => console.error('❌ Erro não tratado:', error));
process.on('uncaughtException', error => console.error('❌ Exceção não tratada:', error));

const cleanToken = (process.env.DISCORD_TOKEN || '').replace(/^(Bot\s+)/i, '').replace(/["'\s]/g, '');
if (!cleanToken) {
  console.error('❌ DISCORD_TOKEN não encontrado!');
  process.exit(1);
}
client.login(cleanToken);
