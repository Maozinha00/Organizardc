/**
 * ============================================================
 * 🔊 DISCORD — RESET DE CALLS
 * ============================================================
 *
 * Este bot:
 *
 * ✅ Apaga SOMENTE canais de voz
 * ✅ Mantém canais de texto
 * ✅ Mantém cargos
 * ✅ Mantém outras categorias
 * ✅ Cria a categoria de voz se não existir
 * ✅ Cria as CALLs novamente
 *
 * Node.js 18+
 * Discord.js v14
 * ============================================================
 */

const {
    Client,
    GatewayIntentBits,
    ChannelType
} = require('discord.js');

require('dotenv').config();

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

const CATEGORY_NAME = '🔊 | CANAIS DE VOZ';

// ============================================================
// CALLS QUE SERÃO CRIADAS
// ============================================================

const CALLS = [
    {
        name: '🔊│Resenha',
        limit: 20
    },
    {
        name: '🎮│Duo 1',
        limit: 2
    },
    {
        name: '🎮│Squad 1',
        limit: 4
    },
    {
        name: '🎧│Lofi & Chill',
        limit: 15
    },
    {
        name: '💤│AFK',
        limit: 99
    }
];

// ============================================================
// VALIDAÇÃO
// ============================================================

if (!TOKEN) {
    console.error('');
    console.error('❌ ERRO: DISCORD_TOKEN não encontrado!');
    console.error('');
    console.error('Crie um arquivo .env contendo:');
    console.error('DISCORD_TOKEN=SEU_TOKEN');
    console.error('GUILD_ID=ID_DO_SERVIDOR');
    console.error('');
    process.exit(1);
}

if (!GUILD_ID) {
    console.error('');
    console.error('❌ ERRO: GUILD_ID não encontrado!');
    console.error('');
    console.error('Crie um arquivo .env contendo:');
    console.error('GUILD_ID=ID_DO_SERVIDOR');
    console.error('');
    process.exit(1);
}

// ============================================================
// CLIENT
// ============================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// ============================================================
// INÍCIO
// ============================================================

client.once('ready', async () => {

    console.log('');
    console.log('==============================================');
    console.log('🔊 RESET DE CALLS — DISCORD');
    console.log('==============================================');
    console.log(`🤖 Bot: ${client.user.tag}`);
    console.log('');

    try {

        // ====================================================
        // PEGAR SERVIDOR
        // ====================================================

        const guild = await client.guilds.fetch(GUILD_ID);

        if (!guild) {
            throw new Error('Servidor não encontrado.');
        }

        console.log(`🏠 Servidor: ${guild.name}`);
        console.log('');

        // ====================================================
        // PEGAR TODOS OS CANAIS
        // ====================================================

        const channels = await guild.channels.fetch();

        // ====================================================
        // APAGAR SOMENTE CANAIS DE VOZ
        // ====================================================

        console.log('🗑️ Apagando CALLs antigas...');
        console.log('');

        let deleted = 0;

        for (const [, channel] of channels) {

            if (!channel) continue;

            // Somente canais de voz
            if (channel.type !== ChannelType.GuildVoice) {
                continue;
            }

            try {

                console.log(`🗑️ Apagando: ${channel.name}`);

                await channel.delete(
                    'Reset automático das CALLs'
                );

                deleted++;

                console.log(`✅ Apagado: ${channel.name}`);

            } catch (error) {

                console.error(
                    `❌ Não foi possível apagar ${channel.name}`
                );

                console.error(error.message);
            }
        }

        console.log('');
        console.log(`🗑️ Total apagado: ${deleted}`);
        console.log('');

        // ====================================================
        // PROCURAR CATEGORIA
        // ====================================================

        console.log('📁 Procurando categoria...');
        console.log(`   ${CATEGORY_NAME}`);
        console.log('');

        let category = guild.channels.cache.find(
            channel =>
                channel.type === ChannelType.GuildCategory &&
                channel.name === CATEGORY_NAME
        );

        // ====================================================
        // CRIAR CATEGORIA SE NÃO EXISTIR
        // ====================================================

        if (!category) {

            console.log('⚠️ Categoria não encontrada.');
            console.log('📁 Criando categoria...');

            category = await guild.channels.create({
                name: CATEGORY_NAME,
                type: ChannelType.GuildCategory,
                reason: 'Criação automática da categoria de CALLs'
            });

            console.log(
                `✅ Categoria criada: ${CATEGORY_NAME}`
            );

        } else {

            console.log(
                `✅ Categoria encontrada: ${CATEGORY_NAME}`
            );
        }

        console.log('');

        // ====================================================
        // CRIAR CALLS
        // ====================================================

        console.log('🔊 Criando CALLs...');
        console.log('');

        let created = 0;

        for (const call of CALLS) {

            try {

                const channel = await guild.channels.create({

                    name: call.name,

                    type: ChannelType.GuildVoice,

                    parent: category.id,

                    userLimit: call.limit,

                    reason: 'Recriação automática das CALLs'

                });

                created++;

                console.log(
                    `✅ ${channel.name} | Limite: ${call.limit}`
                );

            } catch (error) {

                console.error(
                    `❌ Erro ao criar ${call.name}`
                );

                console.error(error.message);
            }
        }

        // ====================================================
        // FINAL
        // ====================================================

        console.log('');
        console.log('==============================================');
        console.log('🎉 RESET CONCLUÍDO!');
        console.log('==============================================');
        console.log(`🗑️ CALLs apagadas: ${deleted}`);
        console.log(`🔊 CALLs criadas: ${created}`);
        console.log('');
        console.log('✅ Canais de texto preservados');
        console.log('✅ Cargos preservados');
        console.log('✅ Outras categorias preservadas');
        console.log('==============================================');
        console.log('');

        // Desliga o bot depois de terminar
        await client.destroy();

        process.exit(0);

    } catch (error) {

        console.error('');
        console.error('==============================================');
        console.error('❌ ERRO');
        console.error('==============================================');
        console.error(error);
        console.error('');

        await client.destroy();

        process.exit(1);
    }
});

// ============================================================
// ERROS
// ============================================================

process.on('unhandledRejection', error => {

    console.error('');
    console.error('❌ UNHANDLED REJECTION');
    console.error(error);
    console.error('');

});

process.on('uncaughtException', error => {

    console.error('');
    console.error('❌ UNCAUGHT EXCEPTION');
    console.error(error);
    console.error('');

});

// ============================================================
// LOGIN
// ============================================================

client.login(TOKEN);
