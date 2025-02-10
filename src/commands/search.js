import { EmbedBuilder } from "discord.js";
import * as xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * handleSearchCommand - search for a webtoon from a CSV file
 * @param {*} interaction - The Discord interaction object
 */
export async function handleSearchCommand(interaction) {
  try {
    // Extract search query from interaction
    const keyword = interaction.options.getString("keyword");
    console.log("Searching for webtoons with keyword:", keyword);

    if (!keyword) {
      return interaction.reply({
        content: "Please provide a webtoon title to search.",
        ephemeral: true,
      });
    }

    // Load CSV file
    const filePath = path.join(__dirname, "webtoons", "naver.csv");
    const fileBuffer = fs.readFileSync(filePath, "utf-8");

    // Read CSV file as a workbook
    const workbook = xlsx.read(fileBuffer, { type: "string" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const webtoons = xlsx.utils.sheet_to_json(sheet, { raw: false });

    // Filter webtoons by keyword
    const results = webtoons.filter((webtoon) =>
      webtoon.title.toLowerCase().includes(keyword.toLowerCase())
    );

    if (results.length === 0) {
      return interaction.reply({
        content: "No webtoons found for that search query.",
        ephemeral: true,
      });
    }

    // Create an embed message with search results
    const embed = new EmbedBuilder()
      .setTitle(`Search Results for: ${keyword}`)
      .setColor(0x00aaff)
      .setFooter({ text: `Results for: ${keyword}` });

    results.slice(0, 5).forEach((webtoon, index) => {
      embed.addFields({
        name: `${index + 1}. ${webtoon.title}`,
        value: `Author: ${webtoon.author}\nGenre: ${webtoon.genre}\nRating: ${webtoon.rating}\nDate: ${webtoon.date}\nCompleted: ${webtoon.completed}\nAge: ${webtoon.age}\nFree: ${webtoon.free}\n[Link](${webtoon.link})`,

        inline: false,
      });
    });

    // Send embed response
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error("Error fetching webtoons:", error);

    await interaction.reply({
      content: "An error occurred while searching for webtoons.",
      ephemeral: true,
    });
  }
}
