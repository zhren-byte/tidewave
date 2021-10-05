const validateFlag = f => f === 'true' || f === 'false' || f === 'null';
const IGNORED = new Set([
  699038845462642748,
  699038847664914443,
  699038849686438038,
  699038850663841913,
  699038852437770280
]);
module.exports = {
    name: "lock",
  aliases: ['lockdown'],
  description: 'locksdown a channel',
  run: async(client, message, args) => {
    if(args.slice(' ').length !== 2) 
      return message.channel.send('?lock <ROLE_ID> TRUE | FALSE | NULL');
    let [ roleId, flag ] = args.slice(' ');
    if(!isNaN(roleId) && validateFlag(flag.toLowerCase())) {
      if(message.guild.roles.cache.has(roleId)) {
        flag = flag.toLowerCase() === 'true' ? true : (flag.toLowerCase() === 'false' ? false : null);
        const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');
        channels.forEach(channel => {
          if(!IGNORED.has(channel.id)) {
            channel.updateOverwrite(roleId, {
              SEND_MESSAGES: !flag
            }).then(g => {
              console.log(`Updated ${g.name} (${g.id})`); 
              if(flag) {
                if(!g.name.endsWith('🔒')) {
                  g.edit({ name: g.name + ' 🔒'});
                }
              } else {
                g.edit({ name: g.name.replace(/\s*🔒/, '')});
              }
            })
            .catch(err => console.log(err));
          } else {
            console.log(`Skipping ${channel.name} (${channel.id})`);
          }
        });
      }
      else {
        message.channel.send('Invalid Role.');
      }
    }
  },
}