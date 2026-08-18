const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
  PermissionsBitField 
} = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Inicialização
client.once('ready', () => {
  console.log(`✅ RafinhaBot online como ${client.user.tag}!`);
  client.user.setActivity('🔴 twitch.tv/rafinhalive | !ajuda', { 
    type: 1, 
    url: 'https://twitch.tv/rafinhalive' 
  });
});

// Sistema de Boas-Vindas Visual (MEE6 / ProBot style)
client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.channels.cache.find(c => c.name.includes('chat-geral'));
  if (!channel) return;

  // Auto-cargo de Seguidor
  const seguidorRole = member.guild.roles.cache.find(r => r.name.includes('SEGUIDOR'));
  if (seguidorRole) member.roles.add(seguidorRole).catch(console.error);

  const welcomeEmbed = new EmbedBuilder()
    .setTitle('🚀 BEM-VINDO(A) À TROPA DO RAFINHA!')
    .setDescription(`Salve ${member}! Seja muito bem-vindo ao servidor oficial!\n\n📜 Leia as regras em <#regras>\n🎭 Resgate seus cargos em <#cargos-vips>\n🔴 Fique atento às lives em <#live-on>`)
    .setColor('#FF4655')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .setImage('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80')
    .setFooter({ text: `Membro #${member.guild.memberCount} da comunidade` })
    .setTimestamp();

  channel.send({ content: `👋 ${member}`, embeds: [welcomeEmbed] });
});

// Interações de Botões (Ticket Tool e Cargos)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  // Abertura de Ticket de Suporte
  if (interaction.customId === 'btn_abrir_ticket') {
    const ticketName = `ticket-${interaction.user.username.toLowerCase().slice(0, 10)}`;
    const modRole = interaction.guild.roles.cache.find(r => r.name.includes('MODERADOR'));

    const ticketChannel = await interaction.guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles
          ]
        },
        ...(modRole ? [{
          id: modRole.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }] : [])
      ]
    });

    const ticketEmbed = new EmbedBuilder()
      .setTitle('📩 TICKET DE SUPORTE - TROPA DO RAFINHA')
      .setDescription(`Olá ${interaction.user}, a equipe de moderação foi notificada.\nDescreva com detalhes seu assunto ou solicitação.`)
      .setColor('#1E3A8A');

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('btn_fechar_ticket')
        .setLabel('🔒 Fechar Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({ content: `${interaction.user}`, embeds: [ticketEmbed], components: [closeRow] });
    await interaction.reply({ content: `✅ Seu ticket foi criado em ${ticketChannel}!`, ephemeral: true });
  }

  // Fechar Ticket
  if (interaction.customId === 'btn_fechar_ticket') {
    await interaction.reply('🔒 Encerrando ticket em 5 segundos...');
    setTimeout(() => interaction.channel.delete().catch(console.error), 5000);
  }

  // Botões de Cargos por Reação
  if (interaction.customId === 'role_live_ping') {
    await interaction.reply({ content: '🔔 Você receberá todas as notificações de live do Rafinha!', ephemeral: true });
  }
});

// Comandos de Texto (!live, !ticket, !regras)
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // !live - Alerta de Live (Streamcord)
  if (command === 'live') {
    const liveEmbed = new EmbedBuilder()
      .setTitle('🔴 RAFINHA ESTÁ AO VIVO NA TWITCH!')
      .setURL('https://twitch.tv/rafinhalive')
      .setDescription('Cola na live rapaziada! Hoje tem GTA RP e gameplay pesada!')
      .setColor('#9146FF')
      .addFields(
        { name: '🎮 Jogo', value: 'Grand Theft Auto V', inline: true },
        { name: '📺 Canal', value: '[twitch.tv/rafinhalive](https://twitch.tv/rafinhalive)', inline: true }
      )
      .setImage('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80')
      .setFooter({ text: 'Streamcord Notificações • Rafinha Live' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Assistir na Twitch')
        .setURL('https://twitch.tv/rafinhalive')
        .setStyle(ButtonStyle.Link)
    );

    message.channel.send({ content: '@everyone', embeds: [liveEmbed], components: [row] });
  }

  // !ticket - Painel de Atendimento
  if (command === 'ticket') {
    const panelEmbed = new EmbedBuilder()
      .setTitle('🎫 CENTRAL DE SUPORTE & ATENDIMENTO')
      .setDescription('Precisa de ajuda com VIP, denúncia ou suporte?\nClique no botão abaixo para abrir um canal privado.')
      .setColor('#06B6D4');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('btn_abrir_ticket')
        .setLabel('📩 Abrir Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    message.channel.send({ embeds: [panelEmbed], components: [row] });
  }
});

client.login(process.env.DISCORD_TOKEN);
