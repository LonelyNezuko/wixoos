import logger from "./_modules/logger";
import mysql from "./_mysql";

const CONFIG_DEFAULT = require('./configs/default.json')

mysql.init(() => {
    require('./user')
    
    logger.log(`Gamemode ${CONFIG_DEFAULT.projectName} successfully loaded`)
})