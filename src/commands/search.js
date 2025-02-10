import { EmbedBuilder } from "discord.js";
import axios from "axios";

/**
 * handleSearchCommand - search for a webtoon
 * @param {*} interaction
 */
export async function handleSearchCommand(interaction) {
  const keyword = interaction.options.getString("keyword");
  if (!keyword) {
    interaction.reply("Please provide a keyword to search for a webtoon.");
    return;
  }

  const encodedKeyword = encodeURIComponent(keyword);
  const apiUrl = `https://korea-webtoon-api-cc7dda2f0d77.herokuapp.com/webtoons?keyword=${encodedKeyword}&provider=NAVER&page=1&perPage=30&sort=ASC`;

  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.webtoons.length > 0) {
        const firstWebtoon = data.webtoons[0];

        const embed = new EmbedBuilder()
          .setTitle(firstWebtoon.title || "No title found")
          .setColor(0x0099ff)
          .addFields(
            { name: "Author", value: firstWebtoon.authors?.join(", ") || "No author found" },
            { name: "Provider", value: firstWebtoon.provider || "Unknown" },
            { name: "Status", value: firstWebtoon.isEnd ? "Completed" : "Ongoing" },
            { name: "Age Rating", value: firstWebtoon.ageGrade ? `${firstWebtoon.ageGrade}+` : "All ages" },
            { name: "URL", value: `[Read here](${firstWebtoon.url})` || "No URL found" }
          )
          .setImage(firstWebtoon.thumbnail?.[0] || "")
          .setTimestamp()
          .setFooter({
            text: "Powered by Nomekuma",
            iconURL: "https://avatars.githubusercontent.com/u/122863540?v=4",
          });

        interaction.reply({ embeds: [embed] });
        return;
      } else {
        interaction.reply("No webtoons found for the given keyword.");
        return;
      }
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed: ${error.message}`);
      retries++;
    }
  }

  interaction.reply("An error occurred while searching for webtoons.");
}
