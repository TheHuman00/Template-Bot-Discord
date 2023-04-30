const Discord = require("discord.js");
const fs = require("fs");
const log = require("../index.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('delete')
        .setDescription('Ajouter un id !')
        .addStringOption(option =>
            option
                .setName('numero')
                .setDescription('Numéro dans la liste')
                .setRequired(true)),
    async execute(interaction) {
        log.commande(`delete - ${interaction.user.username}#${interaction.user.discriminator}`);
        const numero = interaction.options.getString('numero') ?? null;
        const jsonData = fs.readFileSync('id.json');
        const data = JSON.parse(jsonData);
        if(data[numero]){
            delete data[numero];
            fs.writeFileSync('id.json', JSON.stringify(data));
            await interaction.reply(`Le ${numero} a été supprimé avec succes`);
        }else{
            await interaction.reply('[Erreur] Numéro dans liste non trouvé !')
        }
    },
};
