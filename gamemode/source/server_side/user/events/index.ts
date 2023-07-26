import logger from "../../_modules/logger"

import UserBase from ".././base"
import User from ".././core"

import './chat'

mp.events.add({
    "playerJoin": (player: PlayerMp) => {
        new User(player).storage.clear()
        new UserBase(player).storage.clear()
    },
    "playerReady": (player: PlayerMp) => {
        const user = new User(player)

        user.storage.set('isReady', true)
        user.goSignin()
    },
    "client::user:cefLoaded": (player: PlayerMp) => {
        const user = new User(player)
        
        user.storage.set('isCefLoaded', true)
        user.goSignin()
    },

    "playerQuit": (player: PlayerMp, exitType: string, reason: string) => {
        new UserBase(player).save()
    },

    "user:setDimension": (player: PlayerMp, dimension: number) => {
        new User(player).setDimension(dimension)
    },
    "user:setPos": (player: PlayerMp, x: number, y: number, z: number, a: number, dimension: number) => {
        new User(player).setPos(x, y, z, a, dimension)
    }
})