const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../models/guild');
module.exports = {
	name: 'mute',
	aliases: ['silenciar', 'm'],
	category: 'moderation',
	usage: 'mute <usuario> <tiempo> <razon>',
	description:
    'Le quita el derecho a la voz al usuario mencionado, para que no pueda hablar en el servidor',
	async execute(client, message, args) {
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {return message.channel.send('No tienes permisos para hacer esto.');}
		const warningSet = await Guild.findOne({ _id: message.guild.id });
		const channel =
      client.channels.cache.get(warningSet.logChannelID) || message.channel;
		const userID = args.shift().replace(/[<@!&>]/g, '');
		const user = message.guild.members.cache.get(userID);
		const role = await message.guild.roles.fetch(warningSet.muteRoleID);
		const mod = message.author.username;
		let reason = args.slice(1).join(' ');
		if (!user) return message.channel.send('Utilice el ID de un usuario.');
		if (!reason) reason = 'No hay razón provista';
		user.roles.add(role).catch(console.error);
		const muteembed = new EmbedBuilder()
			.setColor('#ff0000')
			.setAuthor({ name: 'Tidewave', iconURL: client.user.displayAvatarURL(), url: 'https://hellhades.tk' })
			.setDescription(
				`**Miembro:** ${user} (${user.id})\n **Accion:** Mute\n**Razon:** ${reason}\n **Moderador:** ${mod}`,
			)
			.setTimestamp();
		channel.send({ embeds: [muteembed] });
	},
};
