import { addCommand } from "../../_modules/commands";
import logger from "../../_modules/logger";

import UserBase from "../../user/base";
import chat from "../../user/chat";

import Admin from "./core";

addCommand({
    "a": {
        settings: {
            admin: "cmd_a"
        },
        func: (player: PlayerMp, args: any[], argsText: string) => {
            if(!argsText.length)return chat.push(player, '/a [text]', 'error')

            const role = new Admin(player).getRole(new UserBase(player).storage.get('admin'))
            chat.pushAdmin(`{${role.color.replace('#', '')}}${role.name} ${new UserBase(player).login}[${player.id}]: {ffffff}${argsText}`)
        }
    }
})