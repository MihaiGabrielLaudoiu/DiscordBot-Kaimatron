require('dotenv').config();
const { REST, Routes } = require("discord.js");
const { createClient } = require('./client');

const createRest = () => { 
    return new REST({ version: '10' }).setToken(process.env.TOKEN);
}

const loginClient = (client) => { 
    client.login(process.env.TOKEN);
}

const addNewCommands = async (rest) => {
    console.log("Registring commands");
    const commands = [ 
        { name: 'hi', data: 'hi',  description: "Replies with hi" },
        { name: 'music', data: 'music',  description: "Plays a song" }
    ];

    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
    );
    console.log("Command registered");
}

const main = async () => {
    try {
        const client = createClient();
        loginClient(client);
        const rest = createRest();
        await addNewCommands(rest);   
    } catch (error) {
        console.error(`Something didnt work as expected: ${error}`);
    }
};

main();