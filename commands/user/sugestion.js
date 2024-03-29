const { EmbedBuilder } = require('discord.js');
const Guild = require('../../models/guild');
module.exports = {
	name: 'sugerencia',
	aliases: ['s', 'sugestion'],
	category: 'user',
	description: 'Envia una sugerencia al canal de sugerencias',
	usage: 'sugerencia <text>',
	async execute(client, message, args) {
		message.delete();
		if (!args[0]) return message.channel.send('Escribe una sugerencia');
		const guildDB = await Guild.findOne({ _id: message.guild.id });
		if (!guildDB) {
			const newGuild = new Guild({
				_id: message.guild.id,
				guildName: message.guild.name,
				sugestionChannelID: null,
			});
			await newGuild.save().catch((err) => console.error(err));
		}
		const sugestionChannel = client.channels.cache.get(
			guildDB.sugestionChannelID,
		);
		if (!sugestionChannel) return 'No hay un canal de sugerencias';
		const sugerencia = new EmbedBuilder()
			.setColor('#ffffff')
			.setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
			.setDescription(args.join(' '))
			.setTimestamp();
		sugestionChannel.send({ embeds: [sugerencia] }).then((m) => {
			m.react('✅');
			m.react('❌');
		});
	},
};
