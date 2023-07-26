import CEF from "../_modules/cef";
import { addKey } from "../_modules/keys";
import logger from "../_modules/logger";

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
                user.cursor(false)
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
    }
})