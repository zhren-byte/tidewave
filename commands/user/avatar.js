const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'avatar',
	category: 'users',
	description: 'Command description',
	usage: '>avatar',
	async execute(client, message, args) {
		const user =
      message.mentions.users.first() ||
      client.users.cache.get(args[0]) ||
      message.author;
		const AvatarEmbed = new EmbedBuilder()
			.setImage(user.avatarURL({ dynamic: true, size: 2048, extension: 'png' }))
			.setColor(0x66b3ff)
			.setFooter({ text: `Avatar de ${user.tag}` });
		if (user) return message.reply({ embeds: [AvatarEmbed] });
	},
};
