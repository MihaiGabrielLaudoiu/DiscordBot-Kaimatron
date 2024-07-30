const { Client, IntentsBitField } = require("discord.js");
const { OpenAI } = require("openai");

const createClient = () => {
  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  });

  client.on("ready", () => {
    console.log(`✅ 🤖 ${client.user.tag} is online 🐊 📟`);
  });

  const openai = new OpenAI({
    apiKey: process.env.GPT_API,
  });

  // Pruebas
  client.on(`messageCreate`, async (message) => {
    if (message.author.bot) {
      return;
    }
    if (message.author.username === "") {
      message.reply("Yes");
    }

    if (message.content === "Antonio") {
      message.reply("Es mi primo");
    }
  });
  
  // GPT
  client.on(`messageCreate`, async (message) => {
    if (message.author.bot) { return; }
    const PREFIX = "!"; // Define your prefix here
    if (!message.content.startsWith(PREFIX)) return; // Check if message starts with prefix
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;
    //Let u know the bot is typing
    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(() => {
      message.channel.sendTyping();
    }, 5000)

    let conversation = [];
    conversation.push({
      role: "system",
      content: "I am kaimatron",
    });

    let prevMessages = await message.channel.messages.fetch({limit: 10});
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
      if (msg.author.bot && msg.author.id !== client.user.id) return;
      const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
      if (msg.author.id === client.user.id){
        conversation.push({
          role: "system",
          name: username,
          content: msg.content,
        });

        return;
      }

      conversation.push({
        role: "user",
        name: username,
        content: msg.content,
      })
    })

    //Makes the bot answer
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: conversation,
      });
      
      clearInterval(sendTypingInterval);

      if (!response){
        message.reply("I had a problem and couldn't answer");
        return
      }

      const responseMessage = response.choices[0].message.content;
      const maxSizeLimit = 2000;

      for (let i = 0; i < responseMessage.length; i+=maxSizeLimit) {
        const fat = responseMessage.substring(i,i + maxSizeLimit);

        await message.reply(fat);
      }


    } catch (error) {
      console.error("Error from OpenAI:", error);
    }
  });

  const CHANNELS = ["1206417263935229962"];

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'hi') {
      await interaction.reply({ content: 'Hi' });
    }
  });

  return client;
};

module.exports = { createClient };
