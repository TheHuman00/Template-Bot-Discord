const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
const { REST, Routes } = require('discord.js');
const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('dotenv').config();
const client = new Discord.Client({intents:[Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildVoiceStates]});

///////////////////Lister toute les commandes/////////////////////

client.commands = new Discord.Collection();
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    } else {
        systeme(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

/////////////////Register toute les commandes/////////////////////

const rest = new REST().setToken(process.env.TOKEN); // 

(async () => {
    try {
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
            { body: commands },
        );
        systeme(`Refresh et register de ${data.length} commandes effectué.`);
    } catch (error) {
        console.error(error);
    }
})();

////////////////////Lancement des commandes///////////////////////

client.on(Discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Pas de commandes "${interaction.commandName}" a été trouvé.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Il y a eu une erreur lors de l\'exécution de la commande!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Il y a eu une erreur lors de l\'exécution de la commande!', ephemeral: true });
        }
    }
});

//////////////////////////////////////////////////////////////////

client.once('ready', () => {
    systeme(`${client.user.tag} : Pour vous servir !`);
});

client.login(process.env.TOKEN);

//////////////////////////Fonctions//////////////////////////////

function prefixx(name) {
    const noString = "["+ name + "]"
    return noString;
  }

function commande(message){
    const prefix = prefixx("CMD");
        const log = `${prefix} ${message}`;
        io.emit("log", log);
        console.log(log);
}
  
function systeme(message){
    const prefix = prefixx("SYS");
        const log = `${prefix} ${message}`;
        io.emit("log", log);
        console.log(log);
}
  
exports.commande = commande;