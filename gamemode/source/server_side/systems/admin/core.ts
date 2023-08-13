import logger from '../../_modules/logger'

import mysql from '../../_mysql'

import CONFIG_ADMIN from '../../configs/admin.json'
import UserBase from '../../user/base'

let adminSettings: any = {}

export default class Admin {
    private readonly player: PlayerMp
    private readonly userBase?: any

    constructor(player: any = null) {
        this.player = player

        if(this.player) this.userBase = new UserBase(this.player)
    }


    loadAdminSettings(): void {
        mysql.query('select * from adminSettings', [], (err: any, res: any) => {
            if(err)return logger.error('Admin.loadAdminSettings', err)
            if(!res.length) {
                adminSettings = {
                    roles: CONFIG_ADMIN.defaultRoles,
                    prefixs: {},
                    access: CONFIG_ADMIN.defaultAccess
                }

                mysql.query('insert into adminSettings (roles, prefixs, access) values (?, ?, ?)',
                    [ JSON.stringify(adminSettings.roles), JSON.stringify(adminSettings.prefixs), JSON.stringify(adminSettings.access) ],
                    (err: any, res: any) => {
                        if(err)return logger.error('Admin.loadAdminSettings', err)
                        logger.mysql('Таблица adminSettings успешно сформирована:', adminSettings)
                    })
            }
            else {
                adminSettings = {
                    roles: JSON.parse(res[0]['roles'] || {}),
                    prefixs: JSON.parse(res[0]['prefixs'] || {}),
                    access: JSON.parse(res[0]['access'] || {})
                }

                let _confTmp: any = CONFIG_ADMIN.defaultRoles
                for(var key in _confTmp)
                {
                    if(adminSettings.roles[key] === undefined) adminSettings.roles[key] = _confTmp[key]
                }

                _confTmp = CONFIG_ADMIN.defaultAccess
                for(var key in _confTmp)
                {
                    if(adminSettings.access[key] === undefined) adminSettings.access[key] = _confTmp[key]
                }

                logger.mysql('Таблица adminSettings успешно загружена:', adminSettings)
            }
        })
    }

    get roleName(): string {
        if(!this.player){
            logger.error("Admin.roleName: Параметр PlayerMp обязателен")
            return 'unknown'
        }
        if(!this.userBase.storage.get('admin').length){
            return 'unknown'
        }

        const role = this.getRole(this.userBase.storage.get('admin'))
        if(!role) {
            logger.error(`Admin.setRole: ${this.getRole(this.userBase.storage.get('admin'))} не найден в базе`)
            return 'unknown'
        }
        return role.name
    }

    setRole(tag: string): void {
        if(!this.player)return logger.error("Admin.setRole: Параметр PlayerMp обязателен")

        const role = this.getRole(tag)
        if(!role)return logger.error(`Admin.setRole: ${tag} не найден в базе`)

        this.userBase.storage.set('admin', tag)
        this.userBase.storage.set('adminData', {})

        this.userBase.save()
    }
    removeRole(): void {
        if(!this.player)return logger.error("Admin.removeRole: Параметр PlayerMp обязателен")

        if(!this.userBase.storage.get('admin').length)return logger.error("Admin.removeRole: У передоваемого PlayerMp нет роли")

        this.userBase.storage.set('admin', '')
        this.userBase.storage.set('adminData', {})

        this.userBase.save()
    }

    getRole(tag: string): any {
        return adminSettings.roles[tag]
    }
    
    hasAccess(access: string): boolean {
        if(!this.player) {
            logger.error("Admin.hasAccess: Параметр PlayerMp обязателен")
            return false
        }
        if(!this.userBase.storage.get('admin').length)return false

        const accessData = adminSettings.access[access]
        if(!accessData) {
            logger.error("Admin.hasAccess: Передоваемый access не найден в базе")
            return false
        }
        return (accessData[0] === 'ALL' || accessData.indexOf(this.userBase.storage.get('admin')) != -1)
    }
}