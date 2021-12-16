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
  
//   client.channels.cache.get(config.channelID).send("test")

  setInterval(() => {
    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => {
        if (json.online == true && json.description.text) {
          let current_players = [];

          for (var i in json.players.sample) {
            console.log(json.players.sample[i].name);
            current_players.push(json.players.sample[i].name);
          }

          var online_embed = new Discord.MessageEmbed()
            .setAuthor("Inferno SMP Server Status")
            .setTitle("\\🟢 Online")
            .setDescription("```" + json.description.text + "```")
            .addField("Version", json.version.name, true)
            .addField("Type", "Java Edition", true)
            .addField("\u200b", "\u200b", true)
            .addField(
              `Currently Online: **\`${json.players.online}\`**`,
              current_players.join("\n") || "No one is playing."
            )
            .addField("Max Players", json.players.max)
            .setTimestamp()
            .setFooter("By Rubi");

          client.channels.cache
            .get(config.channelID)
            .messages.fetch("920902753449017385")
            .then((m) => {
              m.edit(online_embed);
            });
          
          client.channels.cache.get(config.channelID).send("****")
          .then(m => {
             m.delete()
          });
          
        } else {
          var offline_embed = new Discord.MessageEmbed()
            .setAuthor("Inferno SMP server Status")
            .setTitle("\\🔴 Offline")
            .setDescription("Server is currently offline.")
            .setTimestamp()
            .setFooter("By Rubi");

          client.channels.cache
            .get(config.channelID)
            .messages.fetch("920902753449017385")
            .then((m) => {
              m.edit(offline_embed);
            });
          
          client.channels.cache.get(config.channelID).send("****")
          .then(m => {
             m.delete()
          });
        }
      });
  }, 1000 * 60 * 5);
});

client.login(process.env.token);
