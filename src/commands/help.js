/**
 * handleHelpCommand - Handles the help command
 * @param {*} interaction - Represents a Discord interaction
 */
import { EmbedBuilder } from "discord.js";

export async function handleHelpCommand(interaction) {
  const embed = new EmbedBuilder()
    .setTitle("Help")
    .setColor(0x0099ff)
    .addFields(
      {
        name: "`/search <keyword>`",
        value: "Search for the specified webtoon to get the id",
      },
      { name: "`/download`", value: "Initiate the webtoon download process" },
      {
        name: "`/rank`",
        value: "Get the ranking of members based on their time in server",
      },
      {
        name: "`/randomanime`",
        value: "Get information about a random anime",
      },
      {
        name: "`/help`",
        value: "Get a list of commands",
      },
      {
        name: "`/searchanime <query>`",
        value: "Search for an anime",
      },
      {
        name: "`/searchmanga <query>`",
        value: "Search for a manga",
      },
      {
        name: "`/randommanga`",
        value: "Get information about a random manga",
      },
      {
        name: "`/search <query>`",
        value: "Search for a webtoon",
      },
      {
        name: "`/download <titleId> <no> <authId> <sessionId>`",
        value: "Download a webtoon",
      }
    )
    .setTimestamp(new Date())
    .setFooter({
      text: "Powered by Nomekuma",
      iconURL: "https://avatars.githubusercontent.com/u/122863540?v=4",
    });

  await interaction.reply({ embeds: [embed] });
}
