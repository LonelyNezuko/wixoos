import CEF from "../_modules/cef";
import { addKey } from "../_modules/keys";
import logger from "../_modules/logger";
import { InterfaceMenu, interfaceMenuEnums } from "../interface/Menu";

import chat from "./chat";
import User from "./core";

addKey({
    'chatOpen': {
        func: (player: PlayerMp) => {
            const user = new User(player)
            if(!user.onFoot)return

            chat.setTypeList(player)

            new CEF(player, 'hud:chat', 'setOpen', { status: true }).send()
            new CEF(player, 'cef::hud:chat:close').add(() => {
                user.cursor(false, true)
                user.openeds.remove('chat')

                new CEF(player, 'hud:chat', 'setOpen', { status: false }).send()
            })

            user.cursor(true)
            user.openeds.add('chat')
        }
    },
    'changeMinimap': {
        func: (player: PlayerMp) => {
            player.call('server::user:changeMinimap')
        }
    },

    'menuOpen': {
        func: (player: PlayerMp) => {
            new InterfaceMenu(player).show()
        }
    },
    'inventoryOpen': {
        func: (player: PlayerMp) => {
            const interfaceMenu = new InterfaceMenu(player)

            interfaceMenu.show()
            interfaceMenu.setHeaderNav(interfaceMenuEnums.HEADER_NAV_INVENTORY)
        }
    }
})