import { keys } from "../_modules/keys"
import logger from "../_modules/logger"
import UserBase from "../user/base"

mp.events.add('server::key', (player: PlayerMp, data: any) => {
    data = JSON.parse(data)
    const keyBinds = new UserBase(player).storage.get('keyBinds')

    for(var key in keyBinds)
    {
        if(keyBinds[key].keyCode === data.keyCode
            || keyBinds[key].keyCode === data.keyCode[0]
            || (typeof keyBinds[key].keyCode === 'object'
                && keyBinds[key].keyCode.length >= 2
                && keyBinds[key].keyCode[0] === data.keyCode[0]
                && keyBinds[key].keyCode[1] === data.keyCode[1])
            || (typeof data.keyCode === 'object'
                && data.keyCode.indexOf(keyBinds[key].keyCode) !== -1)) {
            if(keys[key] && keys[key].func) keys[key].func(player, data.up)
        }
    }
})