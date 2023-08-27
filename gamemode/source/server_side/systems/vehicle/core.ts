import UserBase from "../../user/base"
import User from "../../user/core"

import VehicleBase from "./base"

export default class Vehicle {
    private readonly vehicle: VehicleMp
    private readonly vehicleBase: VehicleBase

    private readonly player?: PlayerMp

    private readonly user?: User
    private readonly userBase?: UserBase

    constructor(vehicle: VehicleMp, player?: PlayerMp) {
        this.vehicle = vehicle
        this.vehicleBase = new VehicleBase(this.vehicle)

        if(player) {
            this.player = player
            
            this.user = new User(this.player)
            this.userBase = new UserBase(this.player)
        }
    }
}