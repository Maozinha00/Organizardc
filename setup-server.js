/**
 * SCRIPT COM WIPE (APAGA TUDO E RECbackgroundRIA)
 * Execução: node setup-server-wipe.js
 * ATENÇÃO: Irá deletar todos os canais e categorias existentes antes de recriar!
 */
const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// DEFINIÇÃO DOS CARGOS COM CORES DO RAFINHA
const ROLES_TO_CREATE = [
  { name: '👑 | STREMER', color: '#FF4655', hoist: true, mentionable: true, permissions: [PermissionsBitField.Flags.Administrator] },
  { name: '🛡️ | MODERADOR', color: '#1E3A8A', hoist: true, mentionable: true, permissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.MuteMembers] },
  { name: '🎬 | EDITOR', color: '#06B6D4', hoist: true, mentionable: true },
  { name: '⭐ | SUB / APOIADOR', color: '#A855F7', hoist: true, mentionable: true },
  { name: '💎 | BOOSTER', color: '#F47FFF', hoist: true, mentionable: false },
  { name: '🔥 | MEMBRO ATIVO', color: '#22C55E', hoist: true, mentionable: false },
  { name: '👤 | SEGUIDOR', color: '#94A3B8', hoist: false, mentionable: false },
];

// ESTRUTURA OFICIAL DE CANAIS
const STRUCTURE = [
  {
    category: '🛡️ | INFO & REGRAS',
    channels: [
      { name: '📜│regras', type: ChannelType.GuildText, readOnly: true },
      { name: '📢│avisos', type: ChannelType.GuildAnnouncement, readOnly: true },
      { name: '🔗│redes-sociais', type: ChannelType.GuildText, readOnly: true },
      { name: '🎭│cargos-vips', type: ChannelType.GuildText, readOnly: false },
    ]
  },
  {
    category: '🎥 | RAFINHA LIVE',
    channels: [
      { name: '🔴│live-on', type: ChannelType.GuildAnnouncement, readOnly: true },
      { name: '📅│agenda', type: ChannelType.GuildText, readOnly: true },
      { name: '🎬│clipes', type: ChannelType.GuildText, readOnly: false },
    ]
  },
  {
    category: '💬 | COMUNIDADE',
    channels: [
      { name: '💬│chat-geral', type: ChannelType.GuildText, readOnly: false },
      { name: '🔥│memes', type: ChannelType.GuildText, readOnly: false },
      { name: '📸│mídia', type: ChannelType.GuildText, readOnly: false },
      { name: '🤖│comandos', type: ChannelType.GuildText, readOnly: false },
    ]
  },
  {
    category: '🎮 | GAMING',
    channels: [
      { name: '🎮│procurar-duo', type: ChannelType.GuildText, readOnly: false },
      { name: '🏆│torneios', type: ChannelType.GuildText, readOnly: false },
      { name: '🌀│outros-jogos', type: ChannelType.GuildText, readOnly: false },
    ]
  },
  {
    category: '🔊 | CANAIS DE VOZ',
    channels: [
      { name: '🔊│Resenha', type: ChannelType.GuildVoice, userLimit: 20 },
      { name: '🎮│Duo 1', type: ChannelType.GuildVoice, userLimit: 2 },
      { name: '🎮│Squad 1', type: ChannelType.GuildVoice, userLimit: 4 },
      { name: '🎧│Lofi & Chill', type: ChannelType.GuildVoice, userLimit: 15 },
      { name: '💤│AFK', type: ChannelType.GuildVoice, userLimit: 99 },
    ]
  }
];

client.once('ready', async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado! Verifique a variável GUILD_ID no .env');
    process.exit(1);
  }

  console.log(`⚠️ ATENÇÃO: Iniciando limpeza e reestruturação do servidor: ${guild.name}`);

  // ==========================================
  // PASSO 1: APAGAR TODOS OS CANAIS ANTIGOS
  // ==========================================
  console.log('🗑️ Apagando todos os canais e categorias existentes...');
  const currentChannels = await guild.channels.fetch();
  for (const [, ch] of currentChannels) {
    try {
      if (ch) {
        await ch.delete();
        console.log(`  ❌ Canal/Categoria deletado: ${ch.name}`);
      }
    } catch (err) {
      console.warn(`  ⚠️ Não foi possível apagar ${ch?.name}: ${err.message}`);
    }
  }

  // ==========================================
  // PASSO 2: CRIAR CARGOS
  // ==========================================
  console.log('👑 Criando Cargos da Hierarquia...');
  for (const roleData of ROLES_TO_CREATE) {
    const existing = guild.roles.cache.find(r => r.name === roleData.name);
    if (!existing) {
      await guild.roles.create({
        name: roleData.name,
        color: roleData.color,
        hoist: roleData.hoist,
        mentionable: roleData.mentionable,
        permissions: roleData.permissions || []
      });
      console.log(`  + Cargo criado: ${roleData.name}`);
    }
  }

  // ==========================================
  // PASSO 3: RECRIAR TODAS AS CATEGORIAS E CANAIS
  // ==========================================
  console.log('📁 Recriando Estrutura Oficial...');
  for (const section of STRUCTURE) {
    const cat = await guild.channels.create({
      name: section.category,
      type: ChannelType.GuildCategory
    });
    console.log(`  📂 Categoria criada: ${section.category}`);

    for (const ch of section.channels) {
      const overwrites = [];
      if (ch.readOnly) {
        overwrites.push({
          id: guild.id,
          deny: [PermissionsBitField.Flags.SendMessages] // Modo somente leitura
        });
      }

      await guild.channels.create({
        name: ch.name,
        type: ch.type,
        parent: cat.id,
        userLimit: ch.userLimit || undefined,
        permissionOverwrites: overwrites
      });
      console.log(`    #️⃣ Canal criado: ${ch.name}`);
    }
  }

  console.log('🎉 TUDO PRONTO! O servidor foi completamente limpo e recriado do zero!');
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
