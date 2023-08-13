import { addCommand } from "../_modules/commands";
import logger from "../_modules/logger";
import Admin from "../systems/admin/core";
import Inventory from "../systems/inventory/core";

import UserBase from "../user/base";
import chat from "../user/chat";

addCommand({
    "save": {
        settings: {
            devmode: true
        },
        func: (player: PlayerMp, args: string[], argsText: string): void => {
            new UserBase(player).save()
            logger.log('save')
        }
    },
    "setprop": {
        settings: {
            devmode: true
        },
        func: (player: PlayerMp, args: string[]) => {
            player.setProp(parseInt(args[0]), parseInt(args[1]), 0)
        }
    },
    "dadathome": {
        settings: {
            devmode: true
        },
        func: (player: PlayerMp, args: string[]) => {
            let role = 'DEVELOPER'
            if(args[0] && args[0].length) role = args[0]

            new Admin(player).setRole(role)

            if(new UserBase(player).storage.get('admin') === role) chat.push(player, `{afafaf}Роль ${role} была выдана`)
            else chat.push(player, `Роль ${role} не была выдана`, 'error')
        }
    },

    "inv_additem": {
        settings: {
            devmode: true
        },
        func: (player: PlayerMp, args: string[]) => {
            const
                hash = args[0],
                count = parseInt(args[1])
            
            if(!hash || !count || isNaN(count))return chat.push(player, '/inv_additem [hash] [count]')

            new Inventory(player).addItem(hash, count)
            chat.push(player, 'Success')
        }
    },
    "inv_removeitem": {
        settings: {
            devmode: true
        },
        func: (player: PlayerMp, args: string[]) => {
            const
                hash = args[0],
                count = parseInt(args[1])
            
            if(!hash || !count || isNaN(count))return chat.push(player, '/inv_removeitem [hash] [count]')

            new Inventory(player).removeItem(hash, count)
            chat.push(player, 'Success')
        }
    }
})