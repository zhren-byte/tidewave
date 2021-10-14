const {MessageEmbed, Permissions} = require("discord.js")
const Guild = require('../../models/guild');
const User = require('../../models/user');
module.exports = {
name: 'unwarn',
aliases: ['unw', 'unadv'],
description: 'Saca un warn o mas a un usuario',
category: 'moderation',
async execute(client, message, args) {
	if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send("No tienes permisos para hacer esto.");
	warningSet = await Guild.findOne({_id: message.guild.id});
	let channel = client.channels.cache.get(warningSet.logChannelID) || message.channel
	let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
	let mod = message.author.username;
	let number = parseInt(args[1]);
	let reason = args.slice(2).join(" ");
	if (!number) {
		reason = args.slice(1).join(" ");
		number = 1
	}
	if (!user) return message.channel.send("Mencione un usuario.");
	if (user.id === message.author.id) return message.channel.send("No te puedes banear a ti mismo.");
	if (user.id === client.user.id) return message.channel.send("No puedes banearme.");
	if (!reason) reason = "No hay razón provista";
	warnSet = await User.findOne({_id: user.id}, (err, usuario) => {
		if (err) console.error(err)
		const warnembed = new MessageEmbed()
			.setColor('#ff0000')
			.setAuthor(`Tidewave`, client.user.avatarURL())
			.setDescription(`**Miembro:** ${user} (${user.id})\n**Accion:** Warn\n**Razon:** ${reason}\n**Warns:** ${(usuario.warns)-number}\n**Moderador:** ${mod}`)
			.setTimestamp()
		if (!usuario) {
			const newUser = new User({
			_id: user.id,
			guildID: message.guild.id,
			userName: user.username,
			warns: 0
			})
			newUser.save().catch(err => console.error(err));
			return channel.send({ embeds: [warnembed] })
		}else{
			usuario.updateOne({
				warns: ((usuario.warns)-number)
			}).catch(err => console.error(err));
			return channel.send({ embeds: [warnembed] })
		}
		});
	}
}