import { text } from "stream/consumers"
import cef from "../_modules/cef"
import func from "../_modules/func"
import logger from "../_modules/logger"

import User, { escStatus } from "./core"

const IS_RADAR_HIDDEN: string = "0x157F93B036700462"
const IS_RADAR_ENABLED: string = "0xAF754F20EB5CD51A"

let minimap: number = 0
let minimapTimer: any = null

mp.events.add({
    "client::user:signin:setRemember": (): void => {
        if(mp.storage.data.authRemember) cef.emit('signin', 'setData', mp.storage.data.authRemember)
    },
    "client::user:signin:remember": (status: boolean, data: any): void => {
        if(!status && mp.storage.data.authRemember) delete mp.storage.data.authRemember
        else if(status) mp.storage.data.authRemember = data

        mp.storage.flush()
    },

    "client::user:notify": (text: string, type: string, time: number): void => {
        new User().notify(text, type, time)
    },
    "client::user:cursor": (toggle: boolean, toggleESC: boolean): void => {
        new User().cursor(toggle, toggleESC)
    },
    "client::user:setPos": (x: number, y: number, z: number, a: number, dimension: number): void => {
        new User().setPos(x, y, z, a, dimension)
    },
    "client::user:freeze": (toggle: boolean): void => {
        new User().freeze(toggle)
    },
    "client::user:setCamera": (position: Vector3, atCoord: [ number, number, number ], data: any = {}): void => {
        new User().setCamera(position, atCoord, data)
    },
    "client::user:destroyCamera": (data: any = {}): void => {
        new User().destroyCamera(data)
    },
    "client::user:setCameraToPlayer": (data: any = {}): void => {
        new User().setCameraToPlayer(data)
    },
    "client::user:toggleHud": (toggle: boolean): void => {
        new User().toggleHud(toggle)
    },
    "client::user:updateHud": (): void => {
        new User().updateHud()
    },
    "client::user:loadScreen": (toggle: boolean): void => {
        new User().loadScreen(toggle)
    },
    "client::user:setProp": (index: number, id: number, texture: number): void => {
        new User().setProp(index, id, texture)
    },
    "client::user:clearProp": (index: number): void => {
        new User().clearProp(index)
    },

    'server::user:changeMinimap': () => {
    	if(mp.game.invoke(IS_RADAR_ENABLED) && !mp.game.invoke(IS_RADAR_HIDDEN)) {
	    	if(minimap === 0) {
	    		mp.game.ui.setRadarZoom(0.0)
				minimap = 1
			
	            minimapTimer = setTimeout(() => {
	                mp.game.ui.setRadarBigmapEnabled(false, false)
	                mp.game.ui.setRadarZoom(1.0)

	                minimap = 0
	                minimapTimer = null
	            }, 10000)
	    	}
	    	else if(minimap === 1) {
	    		if(minimapTimer != null) 
				{	
					clearTimeout(minimapTimer)
					minimapTimer = null
				}

				mp.game.ui.setRadarBigmapEnabled(true, false)
	            mp.game.ui.setRadarZoom(0.0)

	            minimap = 2
	            minimapTimer = setTimeout(() => {
	                mp.game.ui.setRadarBigmapEnabled(false, false)
	                mp.game.ui.setRadarZoom(1.0)

	                minimap = 0
	                minimapTimer = null
	            }, 10000)
	    	}
	    	else {
	    		if(minimapTimer != null) 
				{	
					clearTimeout(minimapTimer)
					minimapTimer = null
				}

				mp.game.ui.setRadarBigmapEnabled(false, false)
				mp.game.ui.setRadarZoom(1.0)

	            minimap = 0
	    	}
	    }
    },

    "render": (): void => {
        let safeZone = mp.game.graphics.getSafeZoneSize();

        let mapPos = [1 + safeZone, 2 + safeZone]
        let keyPos = [1 + safeZone, 14 + safeZone]

        if(mp.game.invoke(IS_RADAR_ENABLED) && !mp.game.invoke(IS_RADAR_HIDDEN)) {
            mapPos = [16 + safeZone, 2 + safeZone]
            keyPos = [1 + safeZone, 21 + safeZone]
        }
        if(minimap === 2) {
            mapPos = [25 + safeZone, 2 + safeZone]
            keyPos = [1 + safeZone, 45 + safeZone]
        }
        
        cef.emit('hud', 'setMap', {
            gps: func.getStreetNames(),
            pos: [`${mapPos[0]}%`, `${mapPos[1]}%`]
        }, false)
        cef.emit('hud', 'setKeysPos', [`${keyPos[0]}%`, `${keyPos[1]}%`], false)


        if(escStatus === false) mp.game.controls.disableControlAction(32, 200, true)
    }
})