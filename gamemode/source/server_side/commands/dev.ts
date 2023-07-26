import { addCommand } from "../_modules/commands";
import logger from "../_modules/logger";

import UserBase from "../user/base";

addCommand({
    "save": {
        settings: {
            devmode: true
        },
        func: (player: PlayerMp, args: string[], argsText: string): void => {
            new UserBase(player).save()
            logger.log('save')
        }
    }
})