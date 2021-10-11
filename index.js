const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config()
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
})
//mongoose
const mongoose = require('mongoose')
client.mongoose = require('./utils/mongoose');
const Guild = require('./models/guild');
const User = require('./models/user');
//Handler Interactions
client.interactions = new Collection();
const interactionFiles = fs.readdirSync('./interactions').filter(file => file.endsWith('.js'));
for (const file of interactionFiles) {
	const interactionn = require(`./interactions/${file}`);
	client.interactions.set(interactionn.data.name, interactionn);
}
//Handler Commands
client.commands  = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');
["command"].forEach(handler => {
	require(`./handler/${handler}`)(client);
});
//Events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	console.log(`Evento: '${event.name}'`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.interactions.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		return interaction.reply({ content: 'Ocurrio un error al ejecutar el comando', ephemeral: true });
	}
});

client.on('messageCreate', async (message) => {
	if(!message.guild) return;
	if(message.author.bot)return;
	const settings = await Guild.findOne({
        guildID: message.guild.id
    }, (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
            const newGuild = new Guild({
                _id: message.guild.id,
                guildID: message.guild.id,
                guildName: message.guild.name,
                prefix: '>',
                logChannelID: null,
                muteRoleID: null,
                autoRoleID: null,
            })
            newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));
        }
    });
	const userSet = await User.findOne({
        guildID: message.guild.id,
		_id: message.author.id
    }, (err, user) => {
        if (err) console.error(err)
        if (!user) {
            const newUser = new User({
                _id: message.author.id,
    			guildID: message.guild.id,
    			userName: message.author.username,
    			warns: 0
            })
            newUser.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));
        }
    });
	let prefix = settings.prefix;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member) message.member = await message.guild.fetchMember(message)
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	if(cmd.length === 0)return;
	let commando = client.commands.get(cmd);
	if(!commando) commando = client.commands.get(client.aliases.get(cmd));
	try {
		await commando.execute(client, message, args);
	} catch (error) {
		console.log(error);
		return message.reply({ content: 'El comando ejecutado no es correcto', ephemeral: true });
	}
});

client.mongoose.init();
client.login(process.env.TOKEN)