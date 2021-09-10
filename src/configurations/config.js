// Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//
// This is for the initial configuration, the mongoDb is not used for the POC
//

exports.config = function () {
  var envJSON = require("./env.variables.json");
  var node_env = process.env.NODE_ENV || "development";

  let config = envJSON[node_env];

  config.PORT = process.env.PORT || config.PORT;
  config.DB.CS =
    config.DB.CS ||
    `mongodb://${config.DB.HOST}:${config.DB.PORT}/${config.DB.NAME}`;
    
  return config;
};