/**
 * ============================================================
 * RESET DE CALLS — DISCORD (setup.js)
 * ============================================================
 *
 * Apaga SOMENTE os canais de voz e recria na categoria especificada.
 *
 * Requisitos:
 * - Node.js 18+
 * - discord.js v14
 * - .env com DISCORD_TOKEN e GUILD_ID
 * - Bot com permissão "Gerenciar Canais"
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
    "name": "🎯│Duo #1",
    "userLimit": 2
  },
  {
    "name": "🎯│Duo #2",
    "userLimit": 2
  },
  {
    "name": "⚔️│Trio #1",
    "userLimit": 3
  },
  {
    "name": "🛡️│Squad #1",
    "userLimit": 4
  },
  {
    "name": "🛡️│Squad #2",
    "userLimit": 4
  },
  {
    "name": "🔥│5v5 Scrim / Custom",
    "userLimit": 10
  },
  {
    "name": "☕│Lobby & Resenha",
    "userLimit": 0
  },
  {
    "name": "💤│AFK - Ausente",
    "userLimit": 99
  }
];

// Nome da categoria onde as calls ficarão
const CATEGORY_NAME = "🎮 | SALAS DE JOGOS";

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

    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      console.error('❌ GUILD_ID não configurado no arquivo .env!');
      process.exit(1);
    }

    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      console.error('❌ SERVIDOR NÃO ENCONTRADO!');
      console.error('Confira se o ID do servidor no .env está correto e se o bot está no servidor.');
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

        // Pequena pausa para evitar rate limit do Discord
        await new Promise((r) => setTimeout(r, 300));

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
          `   ✅ ${channel.name} | Limite: ${call.userLimit === 0 ? 'Ilimitado' : call.userLimit}`
        );

        await new Promise((r) => setTimeout(r, 300));

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
    console.log(`🔊 ${CALLS.length} calls criadas na categoria "${CATEGORY_NAME}"`);
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

if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN não configurado no .env!');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
