const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../models/guild');
const User = require('../../models/user');
module.exports = {
	name: 'unwarn',
	aliases: ['unw', 'unadv'],
	description: 'Saca un warn o mas a un usuario',
	category: 'moderation',
	async execute(client, message, args) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {return message.channel.send('No tienes permisos para hacer esto.');}
		const warningSet = await Guild.findOne({ _id: message.guild.id });
		const channel =
      client.channels.cache.get(warningSet.logChannelID) || message.channel;
		const user =
      (await message.guild.members.cache.get(args[0])) ||
      message.mentions.users.first();
		const mod = message.author.username;
		let number = parseInt(args[1]);
		let reason = args.slice(2).join(' ');
		if (!number) {
			reason = args.slice(1).join(' ');
			number = 1;
		}
		if (!user) return message.channel.send('Mencione un usuario.');
		// if (user.id === message.author.id) {return message.channel.send('No te puedes unwarnear a ti mismo.');}
		if (user.id === client.user.id) {return message.channel.send('No puedes unwarnearme.');}
		if (!reason) reason = 'No hay razón provista';
		await User.findOne(
			{
				_id: user.id,
			},
			(err, usuario) => {
				if (err) console.error(err);
				if (!usuario) {
					const newUser = new User({
						_id: message.author.id,
						userName: message.author.username,
						warns: [
							{
								_id: message.guild.id,
								warn: 0,
							},
						],
					});
					newUser.save().catch((err) => console.error(err));
					const warnembed = new EmbedBuilder()
						.setColor('#4697e1')
						.setAuthor({
							name: 'Tidewave',
							iconURL: client.user.displayAvatarURL(),
							url: 'https://www.hellhades.tk',
						})
						.setDescription(
							`**Miembro:** ${user} (${user.id})\n**Accion:** UnWarn\n**Razon:** ${reason}\n**Warns:** 0\n**Moderador:** ${mod}`,
						)
						.setTimestamp();
					return channel.send({ embeds: [warnembed] });
				}
				else {
					const warn = usuario.warns.find((w) => w._id === message.guild.id);
					if (!warn) {
						usuario.warns.push({
							_id: message.guild.id,
							warn: 1,
						});
						return usuario.save().catch((err) => console.error(err));
					}
					else {
						const newWarn = warn.warn - number;
						usuario.warns.find((w) => w._id === message.guild.id).warn = newWarn;
						usuario.save().catch((err) => console.error(err));
						const warnembed = new EmbedBuilder()
							.setColor('#4697e1')
							.setAuthor({
								name: 'Tidewave',
								iconURL: client.user.displayAvatarURL(),
								url: 'https://www.hellhades.tk',
							})
							.setDescription(
								`**Miembro:** ${user} (${
									user.id
								})\n**Accion:** UnWarn\n**Razon:** ${reason}\n**Warns:** ${
									newWarn
								}\n**Moderador:** ${mod}`,
							)
							.setTimestamp();
						return channel.send({ embeds: [warnembed] });
					}
				}
			},
		);
	},
};
