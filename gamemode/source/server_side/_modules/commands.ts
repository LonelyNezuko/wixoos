import CONFIG_DEFAULT from '../configs/default.json'
import Admin from '../systems/admin/core'
import UserBase from '../user/base'
import chat from '../user/chat'
import User from '../user/core'
import logger from './logger'

interface interfaceNameObject {
    // commands: ([name: string]: (...args: any[])
}
interface interfaceSettings {
    devmode?: boolean,
    admin?: number
}
interface interfaceFunction {
    (player: PlayerMp, args: string[], argsText?: string): void
}

export const commands: any = {}
export function addCommand(name: any | interfaceNameObject, settings?: interfaceSettings, func?: interfaceFunction)
{
    if(typeof name === 'object')
    {
        for(var i in name) commands[i] = name[i]
    }
    else commands[name] = { settings, func }
}
export function callCommand(player: PlayerMp, cmd: string, argsText: string): void {
    if(!commands[cmd])return

    const user = new User(player)
    const userBase = new UserBase(player)

    if(!user.isAuth)return
    if(commands[cmd].settings) {
        if(commands[cmd].settings.admin && !new Admin(player).hasAccess(commands[cmd].settings.admin))return chat.push(player, '{afafaf}У Вас нет доступа к данной команде')
        if(commands[cmd].settings.devmode && CONFIG_DEFAULT.dev.names.indexOf(userBase.login) === -1)return
    }

    const args = argsText.split(' ')
    commands[cmd].func(player, args, argsText)
}