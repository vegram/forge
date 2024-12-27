import type { APIGuildMember } from "discord-api-types/v10";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { google } from "googleapis";
import Stripe from "stripe";

import type { Session } from "@forge/auth";
import {
  DISCORD_ADMIN_ROLE_ID,
  KNIGHTHACKS_GUILD_ID,
} from "@forge/consts/knight-hacks";

import { env } from "./env";

export const discord = new REST({ version: "10" }).setToken(
  env.DISCORD_BOT_TOKEN,
);

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, { typescript: true });

export const isDiscordAdmin = async (user: Session["user"]) => {
  const guildMember = (await discord.get(
    Routes.guildMember(KNIGHTHACKS_GUILD_ID, user.discordUserId),
  )) as APIGuildMember;
  return guildMember.roles.includes(DISCORD_ADMIN_ROLE_ID);
};

const auth = new google.auth.JWT(
  env.GOOGLE_CLIENT_EMAIL,
  undefined,
  env.GOOGLE_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/calendar"],
  "dylan@knighthacks.org",
);

export const calendar = google.calendar({
  version: "v3",
  auth: auth,
});
