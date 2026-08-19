```js
const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const RAFINHA_USER_ID = process.env.RAFINHA_USER_ID || null;

// ============================================================
// CARGOS
// ============================================================

const ROLES = {
  STREAMER: {
    name: "👑・STREAMER",
    color: "#FF4655",
    hoist: true,
    mentionable: true
  },

  MODERADOR: {
    name: "🛡️・MODERADOR",
    color: "#1E3A8A",
    hoist: true,
    mentionable: true
  },

  EDITOR: {
    name: "🎬・EDITOR",
    color: "#06B6D4",
    hoist: true,
    mentionable: true
  },

  SUB: {
    name: "⭐・SUB / APOIADOR",
    color: "#A855F7",
    hoist: true,
    mentionable: true
  },

  BOOSTER: {
    name: "💎・BOOSTER",
    color: "#F47FFF",
    hoist: true,
    mentionable: false
  },

  MEMBRO: {
    name: "🔥・MEMBRO ATIVO",
    color: "#22C55E",
    hoist: true,
    mentionable: false
  },

  SEGUIDOR: {
    name: "👤・SEGUIDOR",
    color: "#94A3B8",
    hoist: false,
    mentionable: false
  }
};

// ============================================================
// ESTRUTURA
// ============================================================

const STRUCTURE = [
  {
    name: "🛡️・INFO & REGRAS",

    channels: [
      {
        name: "📜│regras",
        type: ChannelType.GuildText,
        readonly: true
      },
      {
        name: "📢│avisos",
        type: ChannelType.GuildText,
        readonly: true
      },
      {
        name: "🔗│redes-sociais",
        type: ChannelType.GuildText,
        readonly: true
      },
      {
        name: "🎭│cargos-vips",
        type: ChannelType.GuildText,
        readonly: true
      }
    ]
  },

  {
    name: "🎥・RAFINHA LIVE",

    channels: [
      {
        name: "🔴│live-on",
        type: ChannelType.GuildText,
        readonly: true
      },
      {
        name: "📅│agenda",
        type: ChannelType.GuildText,
        readonly: true
      },
      {
        name: "🎬│clipes",
        type: ChannelType.GuildText,
        readonly: false
      }
    ]
  },

  {
    name: "💬・COMUNIDADE",

    channels: [
      {
        name: "💬│chat-geral",
        type: ChannelType.GuildText,
        readonly: false
      },
      {
        name: "🔥│memes",
        type: ChannelType.GuildText,
        readonly: false
      },
      {
        name: "📸│mídia",
        type: ChannelType.GuildText,
        readonly: false
      },
      {
        name: "🤖│comandos",
        type: ChannelType.GuildText,
        readonly: false
      }
    ]
  },

  {
    name: "🎮・GAMING",

    channels: [
      {
        name: "🎮│procurar-duo",
        type: ChannelType.GuildText,
        readonly: false
      },
      {
        name: "🏆│torneios",
        type: ChannelType.GuildText,
        readonly: false
      },
      {
        name: "🌀│outros-jogos",
        type: ChannelType.GuildText,
        readonly: false
      }
    ]
  },

  {
    name: "🔊・CANAIS DE VOZ",

    channels: [
      {
        name: "🔊│Resenha",
        type: ChannelType.GuildVoice,
        limit: 20
      },
      {
        name: "🎮│Duo 1",
        type: ChannelType.GuildVoice,
        limit: 2
      },
      {
        name: "🎮│Squad 1",
        type: ChannelType.GuildVoice,
        limit: 4
      },
      {
        name: "🎧│Lofi & Chill",
        type: ChannelType.GuildVoice,
        limit: 15
      },
      {
        name: "💤│AFK",
        type: ChannelType.GuildVoice,
        limit: 99
      }
    ]
  }
];

// ============================================================
// PERMISSÕES DE CARGOS
// ============================================================

const ROLE_PERMISSIONS = {
  STREAMER: [
    PermissionsBitField.Flags.ManageGuild,
    PermissionsBitField.Flags.ManageChannels,
    PermissionsBitField.Flags.ManageMessages,
    PermissionsBitField.Flags.ManageRoles,
    PermissionsBitField.Flags.KickMembers,
    PermissionsBitField.Flags.BanMembers,
    PermissionsBitField.Flags.ModerateMembers,
    PermissionsBitField.Flags.ViewAuditLog
  ],

  MODERADOR: [
    PermissionsBitField.Flags.ManageMessages,
    PermissionsBitField.Flags.KickMembers,
    PermissionsBitField.Flags.BanMembers,
    PermissionsBitField.Flags.ModerateMembers,
    PermissionsBitField.Flags.ViewAuditLog
  ],

  EDITOR: [
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.AttachFiles,
    PermissionsBitField.Flags.EmbedLinks
  ],

  SUB: [],

  BOOSTER: [],

  MEMBRO: [],

  SEGUIDOR: []
};

// ============================================================
// PERMISSÕES DE CANAIS
// ============================================================

function channelPermissions(guild, channel) {
  const everyone = guild.roles.everyone;

  const streamer = guild.roles.cache.find(
    r => r.name === ROLES.STREAMER.name
  );

  const moderator = guild.roles.cache.find(
    r => r.name === ROLES.MODERADOR.name
  );

  const editor = guild.roles.cache.find(
    r => r.name === ROLES.EDITOR.name
  );

  const sub = guild.roles.cache.find(
    r => r.name === ROLES.SUB.name
  );

  const booster = guild.roles.cache.find(
    r => r.name === ROLES.BOOSTER.name
  );

  const membro = guild.roles.cache.find(
    r => r.name === ROLES.MEMBRO.name
  );

  const seguidor = guild.roles.cache.find(
    r => r.name === ROLES.SEGUIDOR.name
  );

  const permissions = [];

  // ==========================================================
  // @EVERYONE
  // ==========================================================

  permissions.push({
    id: everyone.id,

    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.ReadMessageHistory,
      PermissionsBitField.Flags.Connect
    ],

    deny: channel.readonly
      ? [
          PermissionsBitField.Flags.SendMessages
        ]
      : []
  });

  // ==========================================================
  // STREAMER
  // ==========================================================

  if (streamer) {
    permissions.push({
      id: streamer.id,

      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak
      ]
    });
  }

  // ==========================================================
  // MODERADOR
  // ==========================================================

  if (moderator) {
    permissions.push({
      id: moderator.id,

      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak
      ]
    });
  }

  // ==========================================================
  // EDITOR
  // ==========================================================

  if (editor) {
    permissions.push({
      id: editor.id,

      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak
      ]
    });
  }

  // ==========================================================
  // SUB
  // ==========================================================

  if (sub) {
    permissions.push({
      id: sub.id,

      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak
      ]
    });
  }

  // ==========================================================
  // BOOSTER
  // ==========================================================

  if (booster) {
    permissions.push({
      id: booster.id,

      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak
      ]
    });
  }

  // ==========================================================
  // MEMBRO ATIVO
  // ==========================================================

  if (membro) {
    permissions.push({
      id: membro.id,

      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak
      ]
    });
  }

  // ==========================================================
  // SEGUIDOR
  // ==========================================================

  if (seguidor) {
    permissions.push({
      id: seguidor.id,

      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak
      ]
    });
  }

  // ==========================================================
  // CANAIS DE ANÚNCIO / INFORMAÇÃO
  // ==========================================================

  const restricted = [
    "📜│regras",
    "📢│avisos",
    "🔗│redes-sociais",
    "🎭│cargos-vips",
    "🔴│live-on",
    "📅│agenda"
  ];

  if (restricted.includes(channel.name)) {

    // Todos abaixo não podem escrever
    const readOnlyRoles = [
      moderator,
      editor,
      sub,
      booster,
      membro,
      seguidor
    ];

    for (const role of readOnlyRoles) {

      if (!role) continue;

      permissions.push({
        id: role.id,

        deny: [
          PermissionsBitField.Flags.SendMessages
        ],

        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      });
    }

    // Streamer pode publicar
    if (streamer) {
      permissions.push({
        id: streamer.id,

        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.ManageMessages
        ]
      });
    }

    // Moderador pode publicar
    if (moderator) {
      permissions.push({
        id: moderator.id,

        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
          PermissionsBitField.Flags.ManageMessages
        ]
      });
    }
  }

  return permissions;
}

// ============================================================
// CRIAR / ATUALIZAR CARGO
// ============================================================

async function createRole(guild, config, permissions) {

  let role = guild.roles.cache.find(
    r => r.name === config.name
  );

  if (!role) {

    role = await guild.roles.create({
      name: config.name,
      color: config.color,
      hoist: config.hoist,
      mentionable: config.mentionable,
      permissions,
      reason: "Configuração do servidor Rafinha"
    });

    console.log(`✅ Cargo criado: ${config.name}`);

  } else {

    await role.edit({
      color: config.color,
      hoist: config.hoist,
      mentionable: config.mentionable,
      permissions,
      reason: "Atualização do servidor Rafinha"
    });

    console.log(`🔄 Cargo atualizado: ${config.name}`);
  }

  return role;
}

// ============================================================
// CONFIGURAR SERVIDOR
// ============================================================

async function configurarServidor(guild) {

  console.log("");
  console.log("======================================");
  console.log("🔥 CONFIGURAÇÃO RAFINHA");
  console.log("======================================");

  // ----------------------------------------------------------
  // CARGOS
  // ----------------------------------------------------------

  console.log("");
  console.log("👑 Criando cargos...");

  const roles = {};

  for (const [key, config] of Object.entries(ROLES)) {

    roles[key] = await createRole(
      guild,
      config,
      ROLE_PERMISSIONS[key]
    );
  }

  // ----------------------------------------------------------
  // COLOCAR CARGOS NA ORDEM
  // ----------------------------------------------------------

  console.log("");
  console.log("⬆️ Organizando cargos...");

  const orderedRoles = [
    roles.STREAMER,
    roles.MODERADOR,
    roles.EDITOR,
    roles.SUB,
    roles.BOOSTER,
    roles.MEMBRO,
    roles.SEGUIDOR
  ];

  let position = guild.roles.highest.position - 1;

  for (const role of orderedRoles) {

    try {

      if (role) {

        await role.setPosition(position);

        position--;

      }

    } catch (error) {

      console.log(
        `⚠️ Não consegui posicionar ${role?.name}`
      );
    }
  }

  // ----------------------------------------------------------
  // DAR STREAMER PARA RAFINHA
  // ----------------------------------------------------------

  if (RAFINHA_USER_ID) {

    try {

      const member = await guild.members.fetch(
        RAFINHA_USER_ID
      );

      if (member) {

        await member.roles.add(
          roles.STREAMER,
          "Cargo automático do Rafinha"
        );

        console.log(
          `👑 Cargo STREAMER entregue para ${member.user.tag}`
        );
      }

    } catch (error) {

      console.log(
        "⚠️ Não consegui entregar o cargo para RAFINHA_USER_ID."
      );
    }
  }

  // ----------------------------------------------------------
  // CATEGORIAS E CANAIS
  // ----------------------------------------------------------

  console.log("");
  console.log("📁 Criando categorias e canais...");

  for (const categoryConfig of STRUCTURE) {

    let category = guild.channels.cache.find(
      c =>
        c.name === categoryConfig.name &&
        c.type === ChannelType.GuildCategory
    );

    if (!category) {

      category = await guild.channels.create({
        name: categoryConfig.name,
        type: ChannelType.GuildCategory,
        reason: "Configuração do servidor Rafinha"
      });

      console.log(
        `📂 Categoria criada: ${category.name}`
      );

    } else {

      console.log(
        `📂 Categoria encontrada: ${category.name}`
      );
    }

    // --------------------------------------------------------
    // CANAIS
    // --------------------------------------------------------

    for (const channelConfig of categoryConfig.channels) {

      let channel = guild.channels.cache.find(
        c =>
          c.name === channelConfig.name &&
          c.parentId === category.id
      );

      if (!channel) {

        const data = {
          name: channelConfig.name,
          type: channelConfig.type,
          parent: category.id,
          reason: "Configuração do servidor Rafinha"
        };

        if (channelConfig.type === ChannelType.GuildVoice) {
          data.userLimit = channelConfig.limit;
        }

        channel = await guild.channels.create(data);

        console.log(
          `   ✅ Canal criado: ${channel.name}`
        );

      } else {

        console.log(
          `   🔄 Canal já existe: ${channel.name}`
        );
      }

      // ------------------------------------------------------
      // PERMISSÕES
      // ------------------------------------------------------

      try {

        const permissions = channelPermissions(
          guild,
          channelConfig
        );

        await channel.permissionOverwrites.set(
          permissions,
          "Configuração automática do servidor Rafinha"
        );

      } catch (error) {

        console.log(
          `⚠️ Erro nas permissões de ${channel.name}: ${error.message}`
        );
      }
    }
  }

  console.log("");
  console.log("======================================");
  console.log("🎉 SERVIDOR CONFIGURADO!");
  console.log("======================================");
  console.log("");
  console.log("👑 Rafinha");
  console.log("🛡️ Moderadores");
  console.log("🎬 Editores");
  console.log("⭐ Subs");
  console.log("💎 Boosters");
  console.log("🔥 Membros Ativos");
  console.log("👤 Seguidores");
  console.log("");
}

// ============================================================
// COMANDO SLASH
// ============================================================

const commands = [

  new SlashCommandBuilder()
    .setName("configurar")
    .setDescription("Configura automaticamente o servidor do Rafinha.")

].map(command => command.toJSON());

// ============================================================
// BOT ONLINE
// ============================================================

client.once("ready", async () => {

  console.log("");
  console.log("======================================");
  console.log("🤖 RAFINHA BOT ONLINE");
  console.log("======================================");
  console.log(`👤 Bot: ${client.user.tag}`);

  try {

    const rest = new REST({
      version: "10"
    }).setToken(TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(
        client.user.id,
        GUILD_ID
      ),
      {
        body: commands
      }
    );

    console.log("✅ Comando /configurar registrado.");

  } catch (error) {

    console.error(
      "❌ Erro registrando comando:",
      error
    );
  }
});

// ============================================================
// INTERAÇÕES
// ============================================================

client.on("interactionCreate", async interaction => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName !== "configurar") return;

  // Somente administrador pode executar
  if (
    !interaction.memberPermissions.has(
      PermissionsBitField.Flags.Administrator
    )
  ) {

    return interaction.reply({
      content:
        "❌ Você precisa ser **Administrador** para usar este comando.",
      ephemeral: true
    });
  }

  await interaction.reply({
    content:
      "🚀 **Iniciando a configuração do servidor do Rafinha...**\n\nAguarde alguns segundos.",
    ephemeral: true
  });

  try {

    const guild = interaction.guild;

    await guild.channels.fetch();
    await guild.roles.fetch();

    await configurarServidor(guild);

    await interaction.editReply({
      content:
        "🎉 **Servidor do Rafinha configurado com sucesso!**\n\n" +
        "👑 Cargos criados\n" +
        "📁 Categorias criadas\n" +
        "💬 Canais criados\n" +
        "🔊 Canais de voz criados\n" +
        "🔐 Permissões configuradas"
    });

  } catch (error) {

    console.error(error);

    await interaction.editReply({
      content:
        "❌ **Ocorreu um erro durante a configuração.**\n\n" +
        `\`${error.message}\``
    });
  }
});

// ============================================================
// ERROS
// ============================================================

process.on("unhandledRejection", error => {
  console.error("❌ Unhandled Rejection:", error);
});

process.on("uncaughtException", error => {
  console.error("❌ Uncaught Exception:", error);
});

// ============================================================
// LOGIN
// ============================================================

if (!TOKEN) {
  console.error("❌ DISCORD_TOKEN não configurado no .env");
  process.exit(1);
}

if (!GUILD_ID) {
  console.error("❌ GUILD_ID não configurado no .env");
  process.exit(1);
}

client.login(TOKEN);
```
