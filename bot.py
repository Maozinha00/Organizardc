import os
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'✅ Bot do Rafinha online como {bot.user}')
    await bot.change_presence(
        activity=discord.Streaming(
            name="GTA RP Cidade Alta | twitch.tv/rafinhalive",
            url="https://twitch.tv/rafinhalive"
        )
    )

@bot.event
async def on_member_join(member):
    channel = discord.utils.get(member.guild.text_channels, name="💬│chat-geral")
    if channel:
        embed = discord.Embed(
            title="🚀 BEM-VINDO(A) À TROPA DO RAFINHA!",
            description=f"Salve {member.mention}! Seja bem-vindo à nossa comunidade!\nConfira as regras e não perca as lives!",
            color=0xFF4655
        )
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.set_footer(text=f"Membro #{member.guild.member_count}")
        await channel.send(content=f"👋 {member.mention}", embed=embed)

@bot.command(name="live")
async def live_alert(ctx):
    embed = discord.Embed(
        title="🔴 O RAFINHA ESTÁ AO VIVO NA TWITCH!",
        url="https://twitch.tv/rafinhalive",
        description="Cola na live família! Hoje tem gameplay insana e resenha!",
        color=0x9146FF
    )
    embed.add_field(name="🎮 Jogo", value="Grand Theft Auto V", inline=True)
    embed.add_field(name="📺 Canal", value="[twitch.tv/rafinhalive](https://twitch.tv/rafinhalive)", inline=True)
    embed.set_image(url="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80")
    embed.set_footer(text="Streamcord Alert • Rafinha Live")
    await ctx.send(content="@everyone", embed=embed)

bot.run(os.getenv('DISCORD_TOKEN'))
