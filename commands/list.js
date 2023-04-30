const Discord = require("discord.js");
const fs = require("fs");
const log = require("../index.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('list')
        .setDescription('Lister tout les ids déjà ajouté !'),
    async execute(interaction) {
        log.commande(`list - ${interaction.user.username}#${interaction.user.discriminator}`);
        const jsonData = fs.readFileSync('id.json');
        const data = JSON.parse(jsonData);
        const table = [];
        for (const key in data) {
            const value = data[key];
            table.push(`${key}: ${value}`);
        }
        fs.writeFileSync('id.json', JSON.stringify(data));
        const exampleEmbed = new Discord.EmbedBuilder()
            .setColor(0x0099FF)
            .addFields({ name: 'Liste des ids ajoutés', value: table.join('\n'), inline: true })
            .setFooter({ text: 'Pour le en supprimer : /delete' });

        await interaction.reply({ embeds: [exampleEmbed] });

        
    },
};
