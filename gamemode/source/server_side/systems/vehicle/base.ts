import func from "../../_modules/func"
import logger from "../../_modules/logger"

import mysql from "../../_mysql"

import UserBase from "../../user/base"
import User from "../../user/core"

import Vehicle from "./core"

interface VehicleBaseInterface {
    id: number,
    model: string,

    position: any,
    heading: number,
    dimension: number,

    owner: any,
    
    locked: boolean,
    number: string,

    color: any,
    fuel: number
}
const storage = new Map<number, VehicleBaseInterface>()

export default class VehicleBase {
    private readonly vehicle: VehicleMp
    private readonly vehicleCore: Vehicle

    private readonly player?: PlayerMp

    private readonly user?: User
    private readonly userBase?: UserBase

    private readonly storageDefault: VehicleBaseInterface = {
        id: -1,
        model: '',

        position: { x: 0.0, y: 0.0, z: 0.0 },
        heading: 0.0,
        dimension: 0,

        owner: {},
        
        locked: false,
        number: 'SERVER',

        color: [ 255, 255, 255 ],
        fuel: 100
    }

    constructor(vehicle: VehicleMp, player?: PlayerMp) {
        this.vehicle = vehicle
        this.vehicleCore = new Vehicle(this.vehicle)

        if(player) {
            this.player = player
            
            this.user = new User(this.player)
            this.userBase = new UserBase(this.player)
        }
    }

    storage: any = {
        clear: (): void => {
            storage.delete(this.vehicle.id)
            storage.set(this.vehicle.id, {...this.storageDefault})
        },
        get: (key: number): any => {
            const data: any = storage.get(this.vehicle.id)
            return data[key]
        },
        set: (key: number, value: [string, number]): boolean => {
            const data: any = {...storage.get(this.vehicle.id)}
            if(!data)return false

            data[key] = value
            storage.set(this.vehicle.id, data)

            return true
        }
    }


    load(): void {
        mysql.query('select * from vehicles', [], (err: any, res: any) => {
            if(err)return logger.error('VehicleBase.load', err)

            res.map((item: any, i: number) => {
                const tmpveh = mp.vehicles.new(mp.joaat('bmx'), new mp.Vector3(0.0, 0.0, 0.0))
                if(tmpveh) {
                    for(let key in this.storageDefault) {
                        if(item[key]) this.storage.set(key, func.isJSON(item[key]) ? JSON.parse(item[key]) : item[key])
                    }

                    
                }
            })
        })
    }
}