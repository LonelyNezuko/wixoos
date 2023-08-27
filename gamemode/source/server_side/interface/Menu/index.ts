import CEF from "../../_modules/cef"

import Admin from "../../systems/admin/core"

import UserBase from "../../user/base"
import User from "../../user/core"

import InterfaceMenuInventory from "./inventory"

export enum interfaceMenuEnums {
    HEADER_NAV_INFO = 0,
    HEADER_NAV_INVENTORY,
    HEADER_NAV_QUESTS,
    HEADER_NAV_TICKETS,
    HEADER_NAV_SHOP,
    HEADER_NAV_FRACTION,
    HEADER_NAV_FAMILY,
    HEADER_NAV_ADMIN,
    HEADER_NAV_SETTINGS
}

export class InterfaceMenu {
    private readonly player

    private readonly user
    private readonly userBase

    private readonly admin

    constructor(player: PlayerMp) {
        this.player = player

        this.user = new User(this.player)
        this.userBase = new UserBase(this.player)
        this.admin = new Admin(this.player)
    }


    show(): void {
        if(!this.user.isAuth)return
        if(!this.user.onFoot)return

        this.user.openeds.add('menu')
        this.user.cursor(true)
        this.user.toggleHud(false)

        this.setHeaderNav(interfaceMenuEnums.HEADER_NAV_INFO)
        this.setBodyNav('account')

        new CEF(this.player, 'menu', 'toggle', {
            status: true,
            accountData: {
                login: this.userBase.login,

                uid: this.userBase.uid,
                cid: this.userBase.cid,

                char: {
                    cash: [ 0, 0 ],

                    fraction: undefined,
                    family: undefined
                },

                avatar: this.userBase.avatar,

                googleAuth: false,
                email: this.userBase.storage.get('email'),
                onlySCID: false,

                donate: 0,

                admin: this.admin.roleName === 'unknown' ? undefined : this.admin.getRole(this.admin.roleName),
                playedTime: [ 0, 0 ]
            }
        }).send()

        new CEF(this.player, 'cef::menu:openHeaderNav').add((data: any) => {
            this.setHeaderNav(data.id)
        })
        new CEF(this.player, 'cef::menu:openBodyNav').add((data: any) => {
            this.setBodyNav(data.id)
        })

        new CEF(this.player, 'cef::menu:close').add(() => {
            this.hide()
        })
    }
    hide(): void {
        if(!this.user.isAuth
            || !this.user.openeds.is('menu'))return
        
        this.user.openeds.remove('menu')
        this.user.cursor(false, true)
        this.user.toggleHud(true)

        this.user.storage.set('menuHeaderNav', -1)
        this.user.storage.set('menuBodyNav', '')

        new CEF(this.player, 'menu', 'toggle', { status: false }).send()
    }

    setHeaderNav(id: number): void {
        if(!this.user.isAuth
            || !this.user.openeds.is('menu'))return

        switch(id) {
            case interfaceMenuEnums.HEADER_NAV_INFO: { // information
                break
            }
            case interfaceMenuEnums.HEADER_NAV_INVENTORY: { // inventory
                const interfaceMenuInventory = new InterfaceMenuInventory(this.player)

                interfaceMenuInventory.update()
                interfaceMenuInventory.show()
                
                break
            }
            case interfaceMenuEnums.HEADER_NAV_QUESTS: { // quests
                break
            }
            case interfaceMenuEnums.HEADER_NAV_TICKETS: { // tickets
                break
            }
            case interfaceMenuEnums.HEADER_NAV_SHOP: { // shop
                break
            }
            case interfaceMenuEnums.HEADER_NAV_FRACTION: { // fraction
                return
            }
            case interfaceMenuEnums.HEADER_NAV_FAMILY: { // family
                return
            }
            case interfaceMenuEnums.HEADER_NAV_ADMIN: { // admin
                break
            }
            case interfaceMenuEnums.HEADER_NAV_SETTINGS: { // settings
                break
            }
        }

        this.user.storage.set('menuHeaderNav', id)
        new CEF(this.player, 'menu', 'setHeaderNav', { id }).send()
    }
    setBodyNav(id: string): void {
        if(!this.user.isAuth
            || !this.user.openeds.is('menu'))return

        this.user.storage.set('menuBodyNav', id)
        new CEF(this.player, 'menu', 'setBodyNav', { id }).send()
    }
}