import UserBase from "../../user/base"
import User from "../../user/core"

import CONFIG_INVENTORY_ITEMS from '../../configs/inventoryItems.json'

import logger from "../../_modules/logger"

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

                            logger.debug('inventory: add new item', addCount, count)
                        }
                        else status = true
                    }
                })
            }
            return where
        }

        inv = _add(inv, invItem, this.weight, this.maxWeight)
        if(count > 0) backpack = _add(backpack, invItem, this.weightBackpack, this.maxWeightBackpack)

        if(count > 0) {
            logger.debug('inventory: drop item', count)
            // выкидывание предмета
        }

        logger.debug('inventory: save', inv, backpack)

        this.userBase.storage.set('char_inventory', inv)
        this.userBase.storage.set('char_backpack', backpack)
        
        this.userBase.save()
    }
    removeItem(hash: string, count: number = 1, params: any = {}) {
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

        if(count > 0) {
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
    }


    get weight(): number {
        const inv = this.userBase.storage.get('char_inventory')
        
        let weight = 0.0
        inv.map((item: any) => {
            if(item.hash) weight += item.weight * item.count
        })
        return weight
    }
    get weightBackpack(): number {
        const inv = this.userBase.storage.get('char_backpack')
        
        let weight = 0.0
        inv.map((item: any) => {
            if(item.hash) weight += item.weight * item.count
        })
        return weight
    }

    get maxWeight(): number {
        return 1.0
    }
    get maxWeightBackpack(): number {
        return 2.0
    }
}