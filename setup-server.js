/**
 * SCRIPT DE CONFIGURAÇÃO AUTOMÁTICA - DISCORD
 * AÇÃO: Wipe total de canais e recriação de cargos/canais
 * REQUISITOS: O bot precisa de permissão de ADMINISTRADOR e estar acima de todos os cargos.
 */

const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// CONFIGURAÇÃO DOS CARGOS (Cores do Rafinha)
const ROLES_TO_CREATE = [
  { name: '👑 | STREAMER', color: '#FF4655', hoist: true, mentionable: true, permissions: [PermissionsBitField.Flags.Administrator] },
  { name: '🛡️ | MODERADOR', color: '#1E3A8A', hoist: true, mentionable: true, permissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.MuteMembers] },
  { name: '🎬 | EDITOR', color: '#06B6D4', hoist: true, mentionable: true },
  { name: '⭐ | SUB / APOIADOR', color: '#A855F7', hoist: true, mentionable: true },
  { name: '💎 | BOOSTER', color: '#F47FFF', hoist: true, mentionable: false },
  { name: '🔥 | MEMBRO ATIVO', color: '#22C55E', hoist: true, mentionable: false },
  { name: '👤 | SEGUIDOR', color: '#94A3B8', hoist: false, mentionable: false },
];

// ESTRUTURA DOS CANAIS
const STRUCTURE = [
  {
    category: '🛡️ | INFO & REGRAS',
    channels: [
      { name: '📜│regras', type: ChannelType.GuildText, readOnly: true },
      { name: '📢│avisos', type: ChannelType.GuildAnnouncement, readOnly: true },
      { name: '🔗│redes-sociais', type: ChannelType.GuildText, readOnly: true },
      { name: '🎭│cargos-vips', type: ChannelType.GuildText, readOnly: true },
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
  console.log(`✅ Logado como ${client.user.tag}`);
  
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado! Verifique o GUILD_ID no .env');
    process.exit(1);
  }

  console.log(`🚀 Iniciando reestruturação em: ${guild.name}`);

  // 1. APAGAR CANAIS ANTIGOS
  console.log('🗑️ Apagando canais antigos...');
  const channels = await guild.channels.fetch();
  for (const channel of channels.values()) {
    try {
      if (channel) await channel.delete();
    } catch (e) {
      console.log(`⚠️ Não pude deletar o canal: ${channel.name}`);
    }
  }

  // 2. CRIAR CARGOS
  console.log('👑 Configurando cargos...');
  for (const r of ROLES_TO_CREATE) {
    const roleExists = guild.roles.cache.find(role => role.name === r.name);
    if (!roleExists) {
      await guild.roles.create({
        name: r.name,
        color: r.color,
        hoist: r.hoist,
        mentionable: r.mentionable,
        permissions: r.permissions || []
      });
      console.log(`   + Cargo criado: ${r.name}`);
    }
  }

  // 3. CRIAR ESTRUTURA
  console.log('📁 Criando categorias e canais...');
  for (const item of STRUCTURE) {
    const category = await guild.channels.create({
      name: item.category,
      type: ChannelType.GuildCategory
    });

    for (const ch of item.channels) {
      const permissions = [];
      
      // Se for apenas leitura, nega permissão de enviar mensagens para o cargo @everyone
      if (ch.readOnly) {
        permissions.push({
          id: guild.id,
          deny: [PermissionsBitField.Flags.SendMessages]
        });
      }

      await guild.channels.create({
        name: ch.name,
        type: ch.type,
        parent: category.id,
        userLimit: ch.userLimit || undefined,
        permissionOverwrites: permissions
      });
      console.log(`   # Canal criado: ${ch.name}`);
    }
  }

  console.log('✨ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
