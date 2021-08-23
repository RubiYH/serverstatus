const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const fetch = require("node-fetch");

let url = `https://eu.mc-api.net/v3/server/ping/${config.ip}`;

let settings = {
  method: "Get",
  headers: { "User-Agent": "Mozilla/5.0" },
};

client.on("ready", () => {
  console.log("Bot logged in");

  setInterval(() => {
    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => {
        let current_players = [];

        for (var i in json.players.sample) {
          console.log(json.players.sample[i].name);
          current_players.push(json.players.sample[i].name);
        }

        var online_embed = new Discord.MessageEmbed()
          .setAuthor("Inferno SMP Server Status")
          .setTitle("\\🟢 Online")
          .setDescription("```" + json.description.extra[0].text + "```")
          .addField("Version", json.version.name, true)
          .addField("Type", "Java Edition", true)
          .addField("\u200b", "\u200b", true)
          .addField(
            `Currently Online: **\`${json.players.online}\`**`,
            current_players.join("\n")
          )
          .addField("Max Players", json.players.max)
          .setTimestamp()
          .setFooter("By Rubi");

        var offline_embed = new Discord.MessageEmbed()
          .setAuthor("Inferno SMP server Status")
          .setTitle("\\🔴 Offline")
          .setDescription("Server is currently offline.")
          .setTimestamp()
          .setFooter("By Rubi");
        //client.channels.cache.get(config.channelID).send(embed);

        client.channels.cache
          .get(config.channelID)
          .messages.fetch("879372883686723594")
          .then((m) => {
            if (json.online == true) {
              if (json.description) {
                m.edit(online_embed);
              } else {
                m.edit(offline_embed);
              }
            } else if (json.online == false) {
              m.edit(offline_embed);
            }
          });
      });
  }, 1000 * 60 * 5);
});

client.login(process.env.token);
