import cef from "../_modules/cef"
import func from "../_modules/func"
import logger from "../_modules/logger"

let camera: any

let cursorStatus: boolean = false
export let escStatus: boolean = true
let escStatusTimer: any = null

export default class User {
    private readonly player: PlayerMp
    private _init: boolean = false

    constructor() {
        this.player = mp.players.local
    }

    init(): void {
        this._init = true
    }

    toggleHud(toggle: boolean): void {
        if(toggle === true) this.updateHud()
        cef.emit('hud', 'toggle', {
            status: toggle
        })

        mp.game.ui.displayRadar(toggle)
    }
    updateHud(): void {
        cef.emit('hud', 'setData', {
            online: mp.players.length,
            id: this.player.id,
    
            accountName: this.player.name,
            accountID: this.player.getVariable('uid') || 0,
    
            cash: this.player.getVariable('char_cash') || 0,
            bank: this.player.getVariable('char_bankCash') || 0,
    
            needs: this.player.getVariable('char_needs') || [ 0, 0 ]
        })
        cef.emit('hud', 'setAccountData', {
            mute: this.player.getVariable('char_mute') || false
        })
    
        const keyBinds: any = []
        const playerKeyBinds = this.player.getVariable('keyBinds') || {}
        
        for(var key in playerKeyBinds)
        {
            if(playerKeyBinds[key].hudVisible === true) keyBinds.push([ playerKeyBinds[key].key, playerKeyBinds[key].name ])
        }
    
        cef.emit('hud', 'setKeys', keyBinds)
        cef.emit('hud', 'setKeysToggle', { status: true })
    }

    freeze(status: boolean): void {
        this.player.freezePosition(status)
    }

    loadScreen(toggle: boolean, duration: number = 500): void {
        this.toggleHud(!toggle)
        toggle ? mp.game.cam.doScreenFadeOut(duration) : mp.game.cam.doScreenFadeIn(duration)
    }


    cursor(toggle: boolean, toggleESC: boolean = false) {
        mp.gui.cursor.show(toggle, toggle)
        cursorStatus = toggle

        if(toggleESC === true)
        {
            if(escStatusTimer) clearTimeout(escStatusTimer)
            escStatus = false

            escStatusTimer = setTimeout(() =>
            {
                escStatus = true

                clearTimeout(escStatusTimer)
                escStatusTimer = null
            }, 1500)
        }
    }


    setCamera(position: Vector3, atCoord: [ number, number, number ], data: any = {}): void {
        if(camera) this.destroyCamera()

        camera = mp.cameras.new('default', position, new mp.Vector3(0, 0, 0), data.fov ? data.fov : 40)
        camera.pointAtCoord(atCoord[0], atCoord[1], atCoord[2])

        camera.setActive(true)
        if(data.render === undefined
            || data.render === true) mp.game.cam.renderScriptCams(true, data.ease ? true : false, data.ease ? data.ease : 0, false, false)

        this.toggleHud(false)
    }
    destroyCamera(data: any = {}): void {
        if(!camera)return
        if(!data.renderDisable || data.renderDisable === false) mp.game.cam.renderScriptCams(false, data.ease ? true : false, data.ease ? data.ease : 0, false, false)

        camera.destroy()
        camera = undefined

        this.toggleHud(true)
    }
    setCameraToPlayer(data: any = {}): void {
        const playerPosition = this.player.position
        const cameraPosition = func.getCameraOffset(new mp.Vector3(playerPosition.x, playerPosition.y, playerPosition.z + (data.height || 0.5)), this.player.getHeading() + (data.angle || 90), data.dist || 1.5)

        this.setCamera(new mp.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z), [ playerPosition.x, playerPosition.y, playerPosition.z + (data.height || 0.5)], {
            ease: data.ease || 0
        })
    }

    
    setDimension(dimension: number): void {
        mp.events.callRemote('user:setDimension', dimension)
    }
    setPos(x: number, y: number, z: number, a: number, dimension: number): void {
        mp.events.callRemote('user:setPos', x, y, z, a, dimension)
    }

    notify(text: string, type: string = 'info', time: number = 5000): void {
        cef.emit('notify', 'add', {
            text,
            type,
            time
        })
    }


    setProp(index: number, id: number, texture: number): void {
        this.player.setPropIndex(index, id, texture, true)

        const props = this.player.getVariable('props') || [ -1, -1, -1, -1, -1 ]

        if(index === 6) index = 3
        else if(index === 7) index = 4

        props[index] = { id, texture }
        // this.player.setVariable("props", props)
    }
    clearProp(index: number): void {
        this.player.clearProp(index)

        const props = this.player.getVariable('props') || [ -1, -1, -1, -1, -1 ]

        if(index === 6) index = 3
        else if(index === 7) index = 4

        props[index] = -1
        // this.player.setVariable("props", props)
    }
}