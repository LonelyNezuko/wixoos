import logger from "./_modules/logger";
import mysql from "./_mysql";

import CONFIG_DEFAULT from './configs/default.json'

import './events'
import './commands'

mysql.init(() => {
    require('./user')
    
    logger.log(`Gamemode ${CONFIG_DEFAULT.projectName} successfully loaded`)
})