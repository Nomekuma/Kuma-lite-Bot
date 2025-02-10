import { REST, Routes } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * An array of objects that define the commands.
 *
 * @type {Object[]} - An array of objects that define the commands.
 * @property {string} name - The name of the command.
 */
const commands = [
  {
    name: "randomanime",
    description: "Provides a new anime to watch!",
  },
  {
    name: "randommanga",
    description: "Provides a new manga to read!",
  },
  {
    name: "searchanime",
    description: "Search for an anime",
    options: [
      {
        name: "query",
        description: "Name of the anime",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "searchmanga",
    description: "Search for a manga",
    options: [
      {
        name: "query",
        description: "Name of the manga",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "rank",
    description:
      "Provides a rank of users based on their time on the Discord server!",
  },
  {
    name: "help",
    description: "Provides a list of commands",
  },
  {
    name: "search",
    description: "Search for a webtoon",
    options: [
      {
        name: "keyword",
        description: "Keyword to search for",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "download",
    description: "Download a webtoon",
    options: [
      {
        name: "webtoonid",
        description: "ID of the webtoon",
        type: 3,
        required: true,
      },
      {
        name: "chapterno",
        description: "Chapter number of the webtoon",
        type: 3,
        required: true,
      },
      {
        name: "nid_aut",
        description: "NID_AUT cookie value",
        type: 3,
        required: false,
      },
      {
        name: "nid_ses",
        description: "NID_SES cookie value",
        type: 3,
        required: false,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
/**
 * Registers the specified application commands.
 *
 * @param {Client} client - The Discord client.
 * @param {string} clientId - The client ID associated with your application.
 */
export function registerCommands(client, clientId) {
  try {
    console.log("Started refreshing application (/) commands.");

    // Set up your commands
    client.once("ready", async () => {
      try {
        await rest.put(Routes.applicationCommands(clientId), {
          body: commands,
        });

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
