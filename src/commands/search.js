import { EmbedBuilder } from "discord.js";
import axios from "axios";
import axiosRetry from "axios-retry";

// Configure Axios to retry failed requests
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

/**
 * handleSearchCommand - search for a webtoon
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

    // Fetch webtoon data from API
    const apiUrl = `https://korea-webtoon-api-cc7dda2f0d77.herokuapp.com/webtoons?keyword=${encodeURIComponent(
      keyword
    )}&provider=NAVER`;

    const response = await axios.get(apiUrl, {
      timeout: 10000, // 10-second timeout
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });

    const webtoons = response.data.webtoons;

    if (!webtoons || webtoons.length === 0) {
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

    webtoons.forEach((webtoon, index) => {
      embed.addFields({
        name: `${index + 1}. ${webtoon.title}`,
        value: `[Read Here](${webtoon.url}) | Author: ${webtoon.authors.join(
          ", "
        )}`,
        inline: false,
      });
    });

    // Send embed response
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error("Error fetching webtoons:", error);

    let errorMessage = "An error occurred while searching for webtoons.";

    if (error.code === "ERR_SOCKET_CONNECTION_TIMEOUT") {
      errorMessage = "The request timed out. Please try again later.";
    }

    await interaction.reply({
      content: errorMessage,
      ephemeral: true,
    });
  }
}
