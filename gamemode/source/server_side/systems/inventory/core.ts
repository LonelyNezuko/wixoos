import UserBase from "../../user/base"
import User from "../../user/core"

import CONFIG_INVENTORY_ITEMS from '../../configs/inventoryItems.json'

import logger from "../../_modules/logger"

import { interfaceMenuEnums } from "../../interface/Menu"
import InterfaceMenuInventory from "../../interface/Menu/inventory"

export default class Inventory {
    private readonly player

    private readonly user
    private readonly userBase

    constructor(player: PlayerMp) {
        this.player = player

        this.user = new User(player)
        this.userBase = new UserBase(player)
    }

    
    addItem(hash: string, count: number = 1, data: any = {}): void {
        if(!this.user.isAuth)return

        let inv: any = this.userBase.storage.get('char_inventory')
        let backpack: any = this.userBase.storage.get('char_backpack')

        const invItem = CONFIG_INVENTORY_ITEMS.find((item: any) => item.hash === hash)
        if(!invItem)return

        function _add(where: any, invItem: any, weight: number, maxWeight: number): any {
            let status: boolean = false
            let addedWeight: number = 0.0

            where.map((item: any, i: number) => {
                if(item.hash
                    && item.hash === hash
                    && item.count <= invItem.maxCount
                    && count > 0
                    && !status
                    && item.count < invItem.maxCount) {
                    let addCount: number = 0
    
                    if(item.count + count > invItem.maxCount) addCount = invItem.maxCount - item.count
                    else addCount = count
    
                    for(let i = 0, s = addCount; i <= s; i ++) {
                        if((weight + addedWeight) + (invItem.weight * addCount) > maxWeight) addCount --
                    }
    
                    if(addCount > 0) {
                        where[i].count += addCount
                        count -= addCount

                        addedWeight += (invItem.weight * addCount)
                    }
                    else status = true
                }
            })
    
            status = false
            if(count > 0) {
                where.map((item: any, i: number) => {
                    if(!item.hash
                        && count > 0
                        && !status) {
                        let addCount: number = 0
    
                        if(count > invItem.maxCount) addCount = invItem.maxCount
                        else addCount = count
    
                        for(let i = 0, s = addCount; i <= s; i ++) {
                            if((weight + addedWeight) + (invItem.weight * addCount) > maxWeight) addCount --
                        }

                        if(addCount > 0) {
                            where[i] = {...invItem}
    
                            delete where[i].maxCount
                            where[i].count = addCount
    
                            count -= addCount
                            addedWeight += (invItem.weight * addCount)
                        }
                        else status = true
                    }
                })
            }
            return where
        }

        inv = _add(inv, invItem, this.weight, this.maxWeight)
        if(count > 0 && this.maxWeightBackpack > 0) backpack = _add(backpack, invItem, this.weightBackpack, this.maxWeightBackpack)

        if(count > 0) {
            logger.debug('inventory: drop item', count)
            // выкидывание предмета
        }

        this.userBase.storage.set('char_inventory', inv)
        this.userBase.storage.set('char_backpack', backpack)
        
        this.userBase.save()

        if(this.user.openeds.is('menu')
            && this.user.storage.get('menuHeaderNav') === interfaceMenuEnums.HEADER_NAV_INVENTORY) {
            new InterfaceMenuInventory(this.player).update()
        }
    }
    removeItem(hash: string, count: number = 1, params: any = {}) {
        if(!this.user.isAuth)return

        let inv: any = this.userBase.storage.get('char_inventory')
        let backpack: any = this.userBase.storage.get('char_backpack')

        const invItem = CONFIG_INVENTORY_ITEMS.find((item: any) => item.hash === hash)
        if(!invItem)return

        inv.map((item: any, i: number) => {
            if(item.hash
                && item.hash === hash
                && count > 0) {
                if(item.count <= count) {
                    count -= item.count
                    inv[i] = {}
                }
                else {
                    inv[i].count -= count
                    count = 0
                }
            }
        })

        if(count > 0
            && this.maxWeightBackpack > 0) {
            backpack.map((item: any, i: number) => {
                if(item.hash
                    && item.hash === hash
                    && count > 0) {
                    if(item.count <= count) {
                        count -= item.count
                        backpack[i] = {}
                    }
                    else {
                        backpack[i].count -= count
                        count = 0
                    }
                }
            })
        }

        this.userBase.storage.set('char_inventory', inv)
        this.userBase.storage.set('char_backpack', backpack)
        
        this.userBase.save()

        if(this.user.openeds.is('menu')
            && this.user.storage.get('menuHeaderNav') === interfaceMenuEnums.HEADER_NAV_INVENTORY) {
            new InterfaceMenuInventory(this.player).update()
        }
    }


    addItemToSlot(item: any, where: string, slot: number, settings: any = {}): any {
        if(!this.user.isAuth)return

        const inv = this.userBase.storage.get('char_inventory')
        const backpack = this.userBase.storage.get('char_backpack')

        if(where === 'inventory'
            && inv[slot]) inv[slot] = item
        else if(where === 'backpack'
            && backpack[slot]) backpack[slot] = item
        
        this.userBase.storage.set('char_inventory', inv)
        this.userBase.storage.set('char_backpack', backpack)

        if(!settings.noSave) this.userBase.save()

        if(this.user.openeds.is('menu')
            && this.user.storage.get('menuHeaderNav') === interfaceMenuEnums.HEADER_NAV_INVENTORY) {
            new InterfaceMenuInventory(this.player).update()
        }
    }
    removeItemFromSlot(where: string, slot: number, settings: any = {}): any {
        if(!this.user.isAuth)return

        const inv = this.userBase.storage.get('char_inventory')
        const backpack = this.userBase.storage.get('char_backpack')

        if(where === 'inventory'
            && inv[slot]) inv[slot] = {}
        else if(where === 'backpack'
            && backpack[slot]) backpack[slot] = {}
        
        this.userBase.storage.set('char_inventory', inv)
        this.userBase.storage.set('char_backpack', backpack)

        if(!settings.noSave) this.userBase.save()

        if(this.user.openeds.is('menu')
            && this.user.storage.get('menuHeaderNav') === interfaceMenuEnums.HEADER_NAV_INVENTORY) {
            new InterfaceMenuInventory(this.player).update()
        }
    }


    get weight(): number {
        if(!this.user.isAuth)return 0.0

        const inv = this.userBase.storage.get('char_inventory')
        
        let weight = 0.0
        inv.map((item: any) => {
            if(item.hash) weight += item.weight * item.count
        })
        return weight
    }
    get weightBackpack(): number {
        if(!this.user.isAuth)return 0.0

        const inv = this.userBase.storage.get('char_backpack')
        
        let weight = 0.0
        inv.map((item: any) => {
            if(item.hash) weight += item.weight * item.count
        })
        return weight
    }

    get maxWeight(): number {
        if(!this.user.isAuth)return 0.0
        return this.userBase.storage.get('char_inventorySettings').maxWeight
    }
    get maxWeightBackpack(): number {
        if(!this.user.isAuth)return 0.0
        return 40.0
    }

    getItems(where: string): any {
        let items: any = []

        if(where === 'inventory') items = this.userBase.storage.get('char_inventory')
        if(where === 'backpack') items = this.userBase.storage.get('char_backpack')

        items.map((_: any, i: number) => {
            if(items[i].hash) items[i].id = i
        })
        return items
    }
}