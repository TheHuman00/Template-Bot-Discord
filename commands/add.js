const Discord = require("discord.js");
const fs = require("fs");
const log = require("../index.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('add')
        .setDescription('Ajouter un id !')
        .addStringOption(option =>
            option
                .setName('id')
                .setDescription('Id steam on reuf')
                .setRequired(true)),
    async execute(interaction) {
        log.commande(`add - ${interaction.user.username}#${interaction.user.discriminator}`);
        const id = interaction.options.getString('id') ?? null;
        const jsonData = fs.readFileSync('id.json');
        const data = JSON.parse(jsonData);
        const lastKey = parseInt(Object.keys(data).pop());
        const newKey = lastKey + 1;
        data[newKey] = id;
        fs.writeFileSync('id.json', JSON.stringify(data));
        await interaction.reply(`L'id : ${id} a été ajouté avec succes`);
    },
};
