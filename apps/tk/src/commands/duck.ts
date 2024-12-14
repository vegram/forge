import type { CommandInteraction } from "discord.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import JIMP from "jimp";
import fetch from "node-fetch";

// DUCK COMMAND
// Command that posts duck images
interface DuckProps {
  message: string;
  url: string;
}

// Create the command
export const data = new SlashCommandBuilder()
  .setName("duck")
  .setDescription("Quack!");

const url = "https://random-d.uk/api/v2/quack";
export async function execute(interaction: CommandInteraction) {
  try {
    const res = await fetch(url);
    const data = (await res.json()) as DuckProps;

    // gets the average color of the image and makes it the embed color
    const img = JIMP.read(data.url);
    const width = (await img).getWidth(),
      height = (await img).getHeight();
    const color = (await img).getPixelColor(width / 2, height / 2);

    const r = (color >> 24) & 0xff;
    const g = (color >> 16) & 0xff;
    const b = (color >> 8) & 0xff;

    const hexString = `${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
    const embed = new EmbedBuilder()
      .setImage(data.url)
      .setColor(`#${hexString}`);
    void interaction.reply({ embeds: [embed] });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("An unknown error occurred: ", err);
    }
  }
}
