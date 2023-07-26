import CEF from "../_modules/cef"
import func from "../_modules/func"

import User from "./core"

const chat: any = {}

chat.push = (player: PlayerMp, message: string, type: string, settings: any = {}) => {
    new CEF(player, 'hud:chat', 'addMessage', {
        text: message,
        type,
        settings
    }).send()
}

chat.clear = (player: PlayerMp) => {
    new CEF(player, 'hud:chat', 'clear').send()
    chat.push(player, 'Чат очищен', 'system')
}

chat.radius = (player: PlayerMp, text: string, type: string, settings: any = {}) =>
{
    mp.players.forEach(pl =>
    {
        if(new User(pl).isAuth === true
            && func.distance2D(player.position, pl.position) < 30) chat.push(pl, text, type, settings)
    })
}

chat.setTypeList = (player: PlayerMp) => {
    const typeList = [
        '',
    ]

    // if(STORAGE.get('user', player.id, 'admin') > 0) typeList.push('admin')

    typeList.push('ooc')
    typeList.push('me')
    typeList.push('do')
    typeList.push('try')
    typeList.push('todo')

    new CEF(player, 'hud:chat', 'setTypeList', typeList).send()
}

// chat.pushAdmin = (message, settings = {}) => {
//     mp.players.forEach(pl => {
//         if(STORAGE.get('user', pl.id, 'admin') > 0) chat.push(pl, message, 'admin', settings)
//     })
// }

export default chat