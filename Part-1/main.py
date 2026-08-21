import os
import discord
import aiohttp
from discord import app_commands
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("TOKEN")
API_KEY = os.getenv("API_KEY")
#API_URL = "https://api.hydroelectric.com/v2/status"
API_URL="http://127.0.0.1:3000"

intents = discord.Intents.default()

client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)


async def get_status():
    headers = {
        "Authorization": API_KEY
    }

    async with aiohttp.ClientSession() as session:
        response = await session.get(API_URL, headers=headers)

        if response.status == 200:
            return await response.json()

        print("API error:", response.text())
        return None


@tree.command(name="status")
async def status(interaction: discord.Interaction):

    data = await get_status()

    status=data["status"]

    embed = discord.Embed(
        title="HES System Status",
        color=discord.Color.green()
    )

    embed.add_field(
        name="Website",
        value=status["website"]
    )

    embed.add_field(
        name="Roblox",
        value=status["roblox"]
    )

    await interaction.response.send_message(embed=embed)


@client.event
async def on_ready():
    print(f"Logged in as {client.user}")
    await tree.sync()


client.run(TOKEN)