const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../models/guild');
module.exports = {
	name: 'ban',
	aliases: ['desterrar', 'expatriar', 'b'],
	category: 'moderation',
	usage: 'ban <usuario> <razon>',
	description: 'Banea permanentemente al usuario',
	async execute(client, message, args) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {return message.channel.send('No tienes permisos para hacer esto.');}
		const warningSet = await Guild.findOne({ _id: message.guild.id });
		const channel =
      client.channels.cache.get(warningSet.logChannelID) || message.channel;
		const user =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]);
		// let member = message.guild.member(user);
		const mod = message.author.username;
		let reason = args.slice(1).join(' ');
		if (!user) return message.channel.send('Mencione un usuario.');
		if (user.id === message.author.id) {return message.channel.send('No te puedes banear a ti mismo.');}
		if (user.id === client.user.id) {return message.channel.send('No puedes banearme.');}
		if (!reason) reason = 'No hay razón provista';
		message.guild.bans
			.create(user, { reason: reason })
			.then(() => {
				const banembed = new EmbedBuilder()
					.setColor('#ff0000')
					.setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
					.setDescription(
						`**Miembro:** ${user} (${user.id})\n **Accion:** Ban\n**Razon:** ${reason}\n **Moderador:** ${mod}`,
					)
					.setTimestamp();
				channel.send({ embeds: [banembed] });
			})
			.catch(() => {
				message.reply('No he podido banear al miembro');
			});
	},
};
