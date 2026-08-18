```js
/**
 * ============================================================
 * RAFINHA DISCORD — CONFIGURAÇÃO AUTOMÁTICA
 * ============================================================
 *
 * O script:
 * ✅ Apaga os canais antigos
 * ✅ Cria os cargos
 * ✅ Configura permissões dos cargos
 * ✅ Cria categorias
 * ✅ Cria canais de texto
 * ✅ Cria canais de voz
 * ✅ Configura canais somente leitura
 * ✅ Configura acesso por cargo
 *
 * REQUISITOS:
 * - Node.js 18+
 * - discord.js v14
 * - .env com DISCORD_TOKEN e GUILD_ID
 * - Bot com ADMINISTRADOR
 *
 * ATENÇÃO:
 * Este script APAGA TODOS OS CANAIS existentes do servidor.
 * ============================================================
 */

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// ============================================================
// CONFIGURAÇÃO DOS CARGOS
// ============================================================

const ROLES_TO_CREATE = [
  {
    name: '👑 | STREAMER',
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
    name: '🛡️ | MODERADOR',
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
    name: '🎬 | EDITOR',
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
    name: '⭐ | SUB / APOIADOR',
    color: '#A855F7',
    hoist: true,
    mentionable: true
  },

  {
    name: '💎 | BOOSTER',
    color: '#F47FFF',
    hoist: true,
    mentionable: false
  },

  {
    name: '🔥 | MEMBRO ATIVO',
    color: '#22C55E',
    hoist: true,
    mentionable: false
  },

  {
    name: '👤 | SEGUIDOR',
    color: '#94A3B8',
    hoist: false,
    mentionable: false
  }
];

// ============================================================
// NOMES DOS CARGOS
// ============================================================

const ROLE_NAMES = {
  STREAMER: '👑 | STREAMER',
  MOD: '🛡️ | MODERADOR',
  EDITOR: '🎬 | EDITOR',
  SUB: '⭐ | SUB / APOIADOR',
  BOOSTER: '💎 | BOOSTER',
  MEMBRO: '🔥 | MEMBRO ATIVO',
  SEGUIDOR: '👤 | SEGUIDOR'
};

// ============================================================
// FUNÇÃO PARA PEGAR CARGO
// ============================================================

function getRole(guild, name) {
  return guild.roles.cache.find(role => role.name === name);
}

// ============================================================
// PERMISSÕES BASE
// ============================================================

function everyoneDeny() {
  return {
    id: 'EVERYONE',
    deny: [
      PermissionsBitField.Flags.SendMessages
    ]
  };
}

// ============================================================
// ESTRUTURA DO SERVIDOR
// ============================================================

const STRUCTURE = [

  // ==========================================================
  // INFORMAÇÕES
  // ==========================================================

  {
    category: '🛡️ | INFO & REGRAS',

    channels: [

      {
        name: '📜│regras',
        type: ChannelType.GuildText,
        readOnly: true
      },

      {
        name: '📢│avisos',
        type: ChannelType.GuildAnnouncement,
        readOnly: true
      },

      {
        name: '🔗│redes-sociais',
        type: ChannelType.GuildText,
        readOnly: true
      },

      {
        name: '🎭│cargos-vips',
        type: ChannelType.GuildText,
        readOnly: true
      }

    ]
  },

  // ==========================================================
  // RAFINHA LIVE
  // ==========================================================

  {
    category: '🎥 | RAFINHA LIVE',

    channels: [

      {
        name: '🔴│live-on',
        type: ChannelType.GuildAnnouncement,
        readOnly: true
      },

      {
        name: '📅│agenda',
        type: ChannelType.GuildText,
        readOnly: true
      },

      {
        name: '🎬│clipes',
        type: ChannelType.GuildText,
        readOnly: false
      }

    ]
  },

  // ==========================================================
  // COMUNIDADE
  // ==========================================================

  {
    category: '💬 | COMUNIDADE',

    channels: [

      {
        name: '💬│chat-geral',
        type: ChannelType.GuildText,
        readOnly: false
      },

      {
        name: '🔥│memes',
        type: ChannelType.GuildText,
        readOnly: false
      },

      {
        name: '📸│mídia',
        type: ChannelType.GuildText,
        readOnly: false
      },

      {
        name: '🤖│comandos',
        type: ChannelType.GuildText,
        readOnly: false
      }

    ]
  },

  // ==========================================================
  // GAMING
  // ==========================================================

  {
    category: '🎮 | GAMING',

    channels: [

      {
        name: '🎮│procurar-duo',
        type: ChannelType.GuildText,
        readOnly: false
      },

      {
        name: '🏆│torneios',
        type: ChannelType.GuildText,
        readOnly: false
      },

      {
        name: '🌀│outros-jogos',
        type: ChannelType.GuildText,
        readOnly: false
      }

    ]
  },

  // ==========================================================
  // VOZ
  // ==========================================================

  {
    category: '🔊 | CANAIS DE VOZ',

    channels: [

      {
        name: '🔊│Resenha',
        type: ChannelType.GuildVoice,
        userLimit: 20
      },

      {
        name: '🎮│Duo 1',
        type: ChannelType.GuildVoice,
        userLimit: 2
      },

      {
        name: '🎮│Squad 1',
        type: ChannelType.GuildVoice,
        userLimit: 4
      },

      {
        name: '🎧│Lofi & Chill',
        type: ChannelType.GuildVoice,
        userLimit: 15
      },

      {
        name: '💤│AFK',
        type: ChannelType.GuildVoice,
        userLimit: 99
      }

    ]
  }
];

// ============================================================
// FUNÇÃO DE PERMISSÕES
// ============================================================

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

  // ==========================================================
  // @EVERYONE
  // ==========================================================

  let everyonePermissions = {
    id: everyone.id,
    allow: [
      PermissionsBitField.Flags.ViewChannel
    ]
  };

  // Canais somente leitura
  if (readOnly) {
    everyonePermissions.deny = [
      PermissionsBitField.Flags.SendMessages
    ];
  }

  overwrites.push(everyonePermissions);

  // ==========================================================
  // STREAMER
  // ==========================================================

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

  // ==========================================================
  // MODERADOR
  // ==========================================================

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

  // ==========================================================
  // EDITOR
  // ==========================================================

  if (editor) {

    const editorPermissions = [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.ReadMessageHistory,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.AttachFiles,
      PermissionsBitField.Flags.EmbedLinks
    ];

    overwrites.push({
      id: editor.id,
      allow: editorPermissions
    });
  }

  // ==========================================================
  // SUB
  // ==========================================================

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

  // ==========================================================
  // BOOSTER
  // ==========================================================

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

  // ==========================================================
  // MEMBRO ATIVO
  // ==========================================================

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

  // ==========================================================
  // SEGUIDOR
  // ==========================================================

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

  // ==========================================================
  // REGRAS / AVISOS / REDES / CARGOS
  // NINGUÉM ESCREVE
  // ==========================================================

  const restrictedChannels = [
    '📜│regras',
    '📢│avisos',
    '🔗│redes-sociais',
    '🎭│cargos-vips',
    '🔴│live-on',
    '📅│agenda'
  ];

  if (restrictedChannels.includes(channelName)) {

    // @everyone não pode enviar
    overwrites.push({
      id: everyone.id,
      deny: [
        PermissionsBitField.Flags.SendMessages
      ]
    });

    // Membros comuns não podem enviar
    if (membro) {
      overwrites.push({
        id: membro.id,
        deny: [
          PermissionsBitField.Flags.SendMessages
        ]
      });
    }

    if (seguidor) {
      overwrites.push({
        id: seguidor.id,
        deny: [
          PermissionsBitField.Flags.SendMessages
        ]
      });
    }

    if (booster) {
      overwrites.push({
        id: booster.id,
        deny: [
          PermissionsBitField.Flags.SendMessages
        ]
      });
    }

    if (sub) {
      overwrites.push({
        id: sub.id,
        deny: [
          PermissionsBitField.Flags.SendMessages
        ]
      });
    }

    // EDITOR também não publica nesses canais
    if (editor) {
      overwrites.push({
        id: editor.id,
        deny: [
          PermissionsBitField.Flags.SendMessages
        ]
      });
    }

    // MOD pode escrever
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

    // STREAMER pode escrever
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

// ============================================================
// BOT ONLINE
// ============================================================

client.once('ready', async () => {

  console.log('');
  console.log('==============================================');
  console.log('🔥 RAFINHA DISCORD SETUP');
  console.log('==============================================');
  console.log(`🤖 Bot: ${client.user.tag}`);

  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  if (!guild) {

    console.error('');
    console.error('❌ SERVIDOR NÃO ENCONTRADO!');
    console.error('Confira o GUILD_ID no arquivo .env');

    process.exit(1);
  }

  console.log(`🏠 Servidor: ${guild.name}`);
  console.log('');

  // ==========================================================
  // 1 — APAGAR CANAIS
  // ==========================================================

  console.log('🗑️ Apagando canais antigos...');

  const channels = await guild.channels.fetch();

  for (const channel of channels.values()) {

    if (!channel) continue;

    try {

      await channel.delete();

      console.log(`   ❌ Apagado: ${channel.name}`);

    } catch (error) {

      console.log(`   ⚠️ Não foi possível apagar: ${channel.name}`);
    }
  }

  // ==========================================================
  // 2 — CRIAR CARGOS
  // ==========================================================

  console.log('');
  console.log('👑 Criando/configurando cargos...');

  const createdRoles = {};

  for (const roleConfig of ROLES_TO_CREATE) {

    let role = guild.roles.cache.find(
      r => r.name === roleConfig.name
    );

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

      createdRoles[roleConfig.name] = role;

    } catch (error) {

      console.error(
        `   ❌ Erro no cargo ${roleConfig.name}:`,
        error.message
      );
    }
  }

  // Atualizar cache
  await guild.roles.fetch();

  // ==========================================================
  // 3 — CRIAR CATEGORIAS E CANAIS
  // ==========================================================

  console.log('');
  console.log('📁 Criando estrutura...');

  for (const section of STRUCTURE) {

    try {

      // ------------------------------------------------------
      // CATEGORIA
      // ------------------------------------------------------

      const category = await guild.channels.create({

        name: section.category,

        type: ChannelType.GuildCategory,

        reason: 'Configuração automática do servidor Rafinha'

      });

      console.log('');
      console.log(`📂 ${section.category}`);

      // ------------------------------------------------------
      // CANAIS
      // ------------------------------------------------------

      for (const channelConfig of section.channels) {

        try {

          const permissions = buildPermissions(
            guild,
            channelConfig.name,
            channelConfig.readOnly
          );

          const channelData = {

            name: channelConfig.name,

            type: channelConfig.type,

            parent: category.id,

            permissionOverwrites: permissions,

            reason: 'Configuração automática do servidor Rafinha'

          };

          if (
            channelConfig.type === ChannelType.GuildVoice &&
            channelConfig.userLimit
          ) {

            channelData.userLimit =
              channelConfig.userLimit;
          }

          const channel =
            await guild.channels.create(channelData);

          console.log(
            `   ✅ ${channel.name}`
          );

        } catch (error) {

          console.error(
            `   ❌ Erro ao criar ${channelConfig.name}:`,
            error.message
          );
        }
      }

    } catch (error) {

      console.error(
        `❌ Erro na categoria ${section.category}:`,
        error.message
      );
    }
  }

  // ==========================================================
  // FINAL
  // ==========================================================

  console.log('');
  console.log('==============================================');
  console.log('🎉 CONFIGURAÇÃO CONCLUÍDA!');
  console.log('==============================================');
  console.log('');
  console.log('👑 STREAMER: RAFINHA');
  console.log('🛡️ MODERADOR configurado');
  console.log('🎬 EDITOR configurado');
  console.log('⭐ SUB / APOIADOR configurado');
  console.log('💎 BOOSTER configurado');
  console.log('🔥 MEMBRO ATIVO configurado');
  console.log('👤 SEGUIDOR configurado');
  console.log('');
  console.log('🚀 Servidor pronto!');
  console.log('');

  process.exit(0);
});

// ============================================================
// ERROS
// ============================================================

process.on('unhandledRejection', error => {
  console.error('❌ Erro não tratado:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Exceção não tratada:', error);
});

// ============================================================
// LOGIN
// ============================================================

client.login(process.env.DISCORD_TOKEN);
```
