import CONFIG_DEFAULT from './_configs/default.json'

import logger from "./_modules/logger"
import cef from "./_modules/cef"

import User from "./user/core"
const user = new User()

import './user/events'

mp.gui.chat.show(false)
mp.game.ui.displayCash(false)
mp.game.ui.displayAmmoThisFrame(false)
mp.game.ui.displayHud(false)
mp.game.gameplay.setFadeOutAfterDeath(false)
mp.game.gameplay.setFadeOutAfterArrest(false)
mp.game.gameplay.setFadeInAfterDeathArrest(false)
mp.game.gameplay.setFadeInAfterLoad(false)
mp.game.audio.startAudioScene("CHARACTER_CHANGE_IN_SKY_SCENE")

mp.game.vehicle.defaultEngineBehaviour = false
mp.players.local.setConfigFlag(429, true)

mp.nametags.enabled = false
mp.game.gxt.set("PM_PAUSE_HDR", CONFIG_DEFAULT.projectName)

mp.game.ui.setRadarZoom(1.0)
mp.game.ui.setRadarBigmapEnabled(false, false)

user.freeze(true)
user.loadScreen(true)
user.cursor(false)

user.setPos(-1815.242431640625, -1203.771484375, 13.01736068725586, -41.2353515625, mp.players.local.id + 1)
user.setCamera(new mp.Vector3(-968.2666625976562, -2435.315185546875, 223.9071044921875), [ -580.9144897460938, -1692.084228515625, 36.439208984375 ])

cef.init(() => {
    user.toggleHud(false)

    logger.log('Client side loaded')
    mp.events.callRemote('client::user:cefLoaded')
})