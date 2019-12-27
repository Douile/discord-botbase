const { RichEmbed, Attachment } = require('discord.js');

const OPTS = {
  dots: ['⚪','⚫'],
  title: function(server) {
    return `${server.name} server status`
  },
  description: function(server, players) {
    return `Playing ${server.map} with ${players.length}/${server.maxplayers} players\nConnect with ${server.connect}`;
  },
  color: 0x2894C2,
  image: undefined,
  columns: 3
}

const generateEmbed = function(server, tick, options) {
  if (typeof options !== 'object') options = {};
  let title = options.title === undefined ? OPTS.title : options.title;
  let description = options.description === undefined ? OPTS.description : options.description;

  let players = server.players.filter(v => typeof v.name === 'string');

  let embed = new RichEmbed({
    title: title(server),
    description: description(server, players),
    color: options.color === undefined ? OPTS.color : options.color,
    timestamp: Date.now()
  });

  let dots = options.dots === undefined ? OPTS.dots : options.dots;
  embed.setFooter(dots[tick % dots.length]);

  if (server.image) {
    let name = `image.${server.image.type}`;
    embed.attachFile(new Attachment(server.image.buffer, name));
    embed.setAuthor(embed.title, `attachment://${name}`);
    embed.setTitle('');
  }


  let columns = options.columns === undefined ? OPTS.columns : options.columns,
  rows = Math.ceil(players.length / columns);

  for (let i=0;i<columns;i++) {
    let column = players.splice(0, rows);
    if (column.length > 0) embed.addField('_ _', column.map(v => v.name).join('\n'), true);
  }

  return embed;
}

module.exports = generateEmbed;
