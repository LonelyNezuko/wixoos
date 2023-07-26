import User from "./core"

mp.events.add({
    "client::user:notify": (text: string, type: string, time: number): void => {
        new User().notify(text, type, time)
    },
    "client::user:cursor": (toggle: boolean): void => {
        new User().cursor(toggle)
    },
    "client::user:setPos": (x: number, y: number, z: number, a: number, dimension: number): void => {
        new User().setPos(x, y, z, a, dimension)
    },
    "client::user:freeze": (toggle: boolean): void => {
        new User().freeze(toggle)
    },
    "client::user:setCamera": (position: Vector3Mp, atCoord: [ number, number, number ], data: any = {}): void => {
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
    "client::user:loadScreen": (toggle: boolean): void => {
        new User().loadScreen(toggle)
    },
})