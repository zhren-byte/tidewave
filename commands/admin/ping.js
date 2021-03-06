const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "ping",
  category: "admin",
  description: "Command description",
  usage: "Devuelve el ping (ms) del bot",
  async execute(client, message, args) {
    message.delete();
    const pingEmbed = new MessageEmbed()
      .setColor("#ffffff")
      .setTitle("Pong!")
      .setDescription(`${client.ws.ping}ms`)
      .setFooter({ text: 'Tidewave', iconURL: client.user.displayAvatarURL() });
    return message.channel.send({ embeds: [pingEmbed] });
    // const channel = client.channels.cache.get("622624908995723285");
    // const embed = new MessageEmbed()
    //   .setColor("#ff0000")
    //   .setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://exithades.tk' })
    //   .setDescription(
    //     `**Miembro:** ${
    //       message.author
    //     }\n **Accion:** Auto-Mute\n **Moderador:** Tidewave\n **Fecha:** ${message.createdAt.toLocaleString()} `
    //   );
    // channel.send(message.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
  },
};
