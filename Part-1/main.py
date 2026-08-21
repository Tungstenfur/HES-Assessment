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

        print("API error:", await response.text())
        return None


@tree.command(name="status")
async def status(interaction: discord.Interaction):
    try:
        data = await get_status()
    except Exception as error:
        print("Status request failed:", error)
        data = None

    embed = discord.Embed(
        title="HES System Status",
        color=discord.Color.green() if data is not None else discord.Color.red(),
    )

    if data is None:
        embed.add_field(
            name="Error!",
            value="Server cant be reached or returned an error, try again in a moment, if the error will appear again report that to systems department"
        )
    elif isinstance(data, dict) and isinstance(data.get("status"), dict):
        service_status = data["status"]
        embed.add_field(
            name="Website",
            value=service_status.get("website", "unknown"),
        )

        embed.add_field(
            name="Roblox",
            value=service_status.get("roblox", "unknown"),
        )
    else:
        embed.color = discord.Color.red()
        embed.add_field(
            name="Error!",
            value="Server returned an invalid status response. Please try again in a moment."
        )

    await interaction.response.send_message(embed=embed)


@client.event
async def on_ready():
    print(f"Logged in as {client.user}")
    await tree.sync()


client.run(TOKEN)
