require('dotenv').config();
const { REST, Routes } = require("discord.js")

const commands = [
    {
        name: "Salute",
        data: "Hi",
        description: "Replies with hi"
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registring commands");
        

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },

        )
        console.log("Command registered");
    } catch (error) {
        console.error(`Something didn't work as expected: ${error}`);
    }
    
})();