/**
 * ============================================================
 * RESET DE CALLS — DISCORD
 * ============================================================
 *
 * Apaga SOMENTE os canais de voz e cria novamente.
 *
 * Requisitos:
 * - Node.js 18+
 * - discord.js v14
 * - .env com DISCORD_TOKEN e GUILD_ID
 * - Bot com permissão Gerenciar Canais
 */

const {
  Client,
  GatewayIntentBits,
  ChannelType
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// ============================================================
// CONFIGURAÇÃO DAS CALLS
// ============================================================

const CALLS = [
  {
    name: '🔊│Resenha',
    userLimit: 20
  },
  {
    name: '🎮│Duo 1',
    userLimit: 2
  },
  {
    name: '🎮│Squad 1',
    userLimit: 4
  },
  {
    name: '🎧│Lofi & Chill',
    userLimit: 15
  },
  {
    name: '💤│AFK',
    userLimit: 99
  }
];

// Nome da categoria onde as calls ficarão
const CATEGORY_NAME = '🔊 | CANAIS DE VOZ';

// ============================================================
// BOT ONLINE
// ============================================================

client.once('ready', async () => {

  console.log('');
  console.log('==============================================');
  console.log('🔊 RESET DE CALLS');
  console.log('==============================================');
  console.log(`🤖 Bot: ${client.user.tag}`);

  try {

    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    if (!guild) {
      console.error('❌ SERVIDOR NÃO ENCONTRADO!');
      console.error('Confira o GUILD_ID no .env');
      process.exit(1);
    }

    console.log(`🏠 Servidor: ${guild.name}`);
    console.log('');

    // ========================================================
    // 1 — ENCONTRAR E APAGAR SOMENTE CALLS
    // ========================================================

    console.log('🗑️ Procurando canais de voz...');

    const channels = await guild.channels.fetch();

    for (const channel of channels.values()) {

      if (!channel) continue;

      // Só apaga canais de voz
      if (channel.type !== ChannelType.GuildVoice) {
        continue;
      }

      try {

        console.log(`   🗑️ Apagando: ${channel.name}`);

        await channel.delete(
          'Reset automático das calls'
        );

        console.log(`   ✅ Apagado: ${channel.name}`);

      } catch (error) {

        console.error(
          `   ❌ Erro ao apagar ${channel.name}:`,
          error.message
        );

      }
    }

    // ========================================================
    // 2 — PROCURAR A CATEGORIA
    // ========================================================

    console.log('');
    console.log('📁 Procurando categoria das calls...');

    let category = guild.channels.cache.find(
      channel =>
        channel.type === ChannelType.GuildCategory &&
        channel.name === CATEGORY_NAME
    );

    // ========================================================
    // 3 — SE NÃO EXISTIR, CRIAR CATEGORIA
    // ========================================================

    if (!category) {

      console.log('⚠️ Categoria não encontrada.');
      console.log('📁 Criando categoria...');

      category = await guild.channels.create({
        name: CATEGORY_NAME,
        type: ChannelType.GuildCategory,
        reason: 'Criação automática da categoria de calls'
      });

      console.log(`✅ Categoria criada: ${CATEGORY_NAME}`);

    } else {

      console.log(`✅ Categoria encontrada: ${CATEGORY_NAME}`);

    }

    // ========================================================
    // 4 — CRIAR CALLS NOVAMENTE
    // ========================================================

    console.log('');
    console.log('🔊 Criando novas calls...');

    for (const call of CALLS) {

      try {

        const channel = await guild.channels.create({

          name: call.name,

          type: ChannelType.GuildVoice,

          parent: category.id,

          userLimit: call.userLimit,

          reason: 'Recriação automática das calls'

        });

        console.log(
          `   ✅ ${channel.name} | Limite: ${call.userLimit}`
        );

      } catch (error) {

        console.error(
          `   ❌ Erro ao criar ${call.name}:`,
          error.message
        );

      }
    }

    // ========================================================
    // FINAL
    // ========================================================

    console.log('');
    console.log('==============================================');
    console.log('🎉 RESET DAS CALLS CONCLUÍDO!');
    console.log('==============================================');
    console.log(`🔊 ${CALLS.length} calls criadas`);
    console.log('💬 Canais de texto NÃO foram alterados');
    console.log('👑 Cargos NÃO foram alterados');
    console.log('📁 Demais categorias NÃO foram alteradas');
    console.log('==============================================');
    console.log('');

    process.exit(0);

  } catch (error) {

    console.error('');
    console.error('❌ ERRO GERAL:');
    console.error(error);

    process.exit(1);
  }
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
