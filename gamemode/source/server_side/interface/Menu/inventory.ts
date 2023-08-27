import { InterfaceMenu, interfaceMenuEnums } from "."

import CEF from "../../_modules/cef"
import logger from "../../_modules/logger"

import UserBase from "../../user/base"
import User from "../../user/core"

import Inventory from "../../systems/inventory/core"

export default class InterfaceMenuInventory {
    private readonly player

    private readonly user
    private readonly userBase

    private readonly interfaceMenu
    private readonly inventory

    constructor(player: PlayerMp) {
        this.player = player

        this.user = new User(this.player)
        this.userBase = new UserBase(this.player)

        this.interfaceMenu = new InterfaceMenu(this.player)

        this.inventory = new Inventory(this.player)
    }

    show(): any {
        if(!this.user.isAuth
            || !this.user.openeds.is('menu'))return

        new CEF(this.player, 'cef::menu:inventory:transfer').add((data: any) => {
            const
                toParent: string = data.toParent,
                toID: number = data.toID,

                fromParent: string = data.fromParent,
                fromID: number = data.fromID

            if(toID === fromID
                && toParent === fromParent)return

            const
                inv: any[] = [...this.inventory.getItems('inventory')],
                backpack: any[] = [...this.inventory.getItems('backpack')]
            
            let
                toItem: any,
                toWhere: string = '',

                fromItem: any,
                fromWhere: string = ''
            
            if(toParent === '#inventoryMain' && inv[toID]) {
                toItem = inv[toID]
                toWhere = 'inventory'
            }
            else if(toParent === '#inventoryBackpack' && backpack[toID]) {
                toItem = backpack[toID]
                toWhere = 'backpack'
            }

            if(fromParent === '#inventoryMain' && inv[fromID]) {
                fromItem = inv[fromID]
                fromWhere = 'inventory'
            }
            else if(fromParent === '#inventoryBackpack' && backpack[fromID]) {
                fromItem = backpack[fromID]
                fromWhere = 'backpack'
            }


            if(toItem && fromItem) {
                this.inventory.removeItemFromSlot(toWhere, toID, { noSave: true })
                this.inventory.removeItemFromSlot(fromWhere, fromID, { noSave: true })

                this.inventory.addItemToSlot(fromItem, toWhere, toID, { noSave: true })
                this.inventory.addItemToSlot(toItem, fromWhere, fromID, { noSave: true })

                this.userBase.save()
            }
        })
        new CEF(this.player, 'cef::menu:inventory:trash').add((data: any) => {
            logger.debug('cef::menu:inventory:trash', data)
        })
    }
    update(): any {
        if(!this.user.isAuth
            || !this.user.openeds.is('menu'))return

        const inv_items = this.userBase.storage.get('char_inventory')
        const backpack_items = this.userBase.storage.get('char_backpack')

        new CEF(this.player, 'menu:inventory', 'setItems', {
            items: this.inventory.getItems('inventory'),
            backpack: this.inventory.getItems('backpack')
        }).send()
        new CEF(this.player, 'menu:inventory', 'setData', {
            main: {
                weight: this.inventory.maxWeight
            },
            backpack: {
                weight: this.inventory.maxWeightBackpack
            }
        }).send()
    }
}