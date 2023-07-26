import { callCommand, commands } from "../../_modules/commands"
import func from "../../_modules/func"

import UserBase from "../base"
import User from "../core"

import chat from "../chat"

import CONFIG_DEFAULT from '../../configs/default.json'

mp.events.add('cef::hud:chat:send', (player: PlayerMp, data: any) => {
    data = JSON.parse(data)

    const user = new User(player)
    const userBase = new UserBase(player)

    if(!user.isAuth)return

    if(data.text[0] === '/') {
        const cmd = data.text.split(' ')[0].replace('/', '')

        if(commands[cmd]) callCommand(player, cmd, data.text.replace(`/${cmd} `, '').replace(`/${cmd}`, ''))
        else chat.push(player, 'Такой команды не существует!', 'system')
    }
    else {
        // if(user.isMute(player) > 0)return

        switch(data.type) {
            case '': {
                chat.radius(player, `${userBase.name} [${player.id}] говорит: ${data.text}`)
                break
            }
            case 'ooc': {
                chat.radius(player, `(( ${userBase.name} [${player.id}]: ${data.text} ))`, 'ooc')
                break
            }
            case 'admin': {
                callCommand(player, 'a', data.text)
                break
            }
            case 'me': {
                chat.radius(player, `{FF99FF}${userBase.name}[${player.id}] ${data.text}`, '')
                break
            }
            case 'do': {
                chat.radius(player, `{4276b5}${data.text} - ${userBase.name}[${player.id}]`, '')
                break
            }
            case 'try': {
                chat.radius(player, `{FF99FF}${userBase.name}[${player.id}] ${data.text} - ${func.random(0, 1) === 0 ? '{47cf4f}Удачно' : '{cf4646}Не удачно'}`, '')
                break
            }
            case 'todo': {
                const text = data.text.split('*')[0]
                const me = data.text.split('*')[1]

                if((!me || !text)
                    || (!me.length || !text.length))return chat.push(player, 'Ты не правильно это используешь! Делай так: Твоя фраза*Действие', 'system')

                chat.radius(player, `${text} - сказал(а) ${userBase.name} [${player.id}], {FF99FF}${me}`, '')
                break
            }
        }
    }
})