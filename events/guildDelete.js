const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = {
name: 'guildDelete',
on: true,
async execute(client, guild){
    Guild.findOneAndDelete({
        _id: guild.id
    }, (err, res) => {
        if(err) console.error(err)
    });
    }
};