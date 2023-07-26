import logger from "./_modules/logger";
import mysql from "./_mysql";

import CONFIG_DEFAULT from './configs/default.json'

import './events'
import './commands'
import './user'
import './systems/admin'

import Admin from "./systems/admin/core"

mysql.init(() => {
    new Admin().loadAdminSettings()
    
    logger.log(`Gamemode ${CONFIG_DEFAULT.projectName} successfully loaded`)
})