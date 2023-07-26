import bcryptjs from 'bcryptjs'

import logger from "../_modules/logger"

import mysql from "../_mysql"

import User from "./core"
import func from '../_modules/func'
import CEF from '../_modules/cef'

import CONFIG_ENUMS from '../configs/enums.json'

// storage
interface UserBaseInterface {
    uid: number,

    login: string,
    password: string,
    email: string,

    keyBinds: any,

    admin: number,
    adminData: any,


    // character
    char_cid: number,
    char_uid: number,

    char_name: [string, string],
    char_createAt: Date,

    char_gender: number,
    char_appearance: Object,
    char_clothes: Object,

    char_isMute: number,
    char_isKeysToggle: number,

    char_inventory: Array<any>,

    char_cash: number,
    
    char_isBank: number,
    char_bankCash: number
}
const storageDefault: UserBaseInterface = {
    uid: -1,

    login: '',
    password: '',
    email: '',

    keyBinds: {},

    admin: 0,
    adminData: {},


    // character
    char_cid: -1,
    char_uid: -1,

    char_name: ['', ''],
    char_createAt: new Date(),

    char_gender: 0,
    char_appearance: {},
    char_clothes: {},

    char_isMute: 0,
    char_isKeysToggle: 0,

    char_inventory: [],

    char_cash: 0,
    
    char_isBank: 0,
    char_bankCash: 0
}
const storage = new Map<number, UserBaseInterface>()

export default class UserBase {
    private readonly player: PlayerMp
    private readonly id: number

    constructor(player: PlayerMp) {
        this.player = player
        this.id = player.id
    }

    storage: any = {
        clear: (): void => {
            storage.delete(this.id)
            storage.set(this.id, {...storageDefault})
        },
        get: (key: number): any => {
            const data: any = storage.get(this.id)
            return data[key]
        },
        set: (key: number, value: [string, number]): boolean => {
            const data: any = storage.get(this.id)
            if(!data)return false

            data[key] = value
            return true
        }
    }


    get gender(): number {
        return this.storage.get('char_gender')
    }
    get name(): string {
        return this.storage.get('char_name')[0] + " " + this.storage.get('char_name')[0]
    }
    get login(): string {
        return this.storage.get('login')
    }

    get uid(): number {
        return this.storage.get('uid')
    }
    get cid(): number {
        return this.storage.get('char_cid')
    }

    get isAuth(): boolean {
        return new User(this.player).isAuth
    }


    signup(login: string, password: string, email: string, auto: boolean, save: boolean): void {
        if(this.isAuth)return

        mysql.query('select uid from users where login = ?', [ login ], (err: any, res: any) => {
            if(err)return logger.error('UserBase.signup', err)
            if(res.length)return new User(this.player).notify('Аккаунт с таким логином уже зарегистрирован', 'error')

            let salt: string = bcryptjs.genSaltSync(10)
            password = bcryptjs.hashSync(password, salt)

            mysql.query('insert into users (login, password, email) values (?, ?, ?)', [ login, password, email ], (err: any, res: any) => {
                if(err)return logger.error('UserBase.signup', err)
                if(res) {
                    new User(this.player).notify(`Аккаунт успешно создан. Его UID: ${res.insertId}`, 'success')

                    this.storage.set('uid', res.insertId)
                    this.load()
                }
            })
        })
    }
    signin(login: string, password: string): void {
        if(this.isAuth)return

        mysql.query('select uid, password from users where login = ?', [ login ], (err: any, res: any) => {
            if(err)return logger.error('UserBase.signin', err)
            
            if(!res.length
                || !bcryptjs.compareSync(password, res[0]['password'])) {
                return new User(this.player).notify('Аккаунт не найден. Логин и/или пароль не верный', 'error')
            }

            this.storage.set('uid', res[0]['uid'])
            this.load()
        })
    }


    load(): void {
        if(this.isAuth)return
        if(!this.uid
            || this.uid === -1)return
        
        mysql.query('select * from users where uid = ?', [ this.uid ], (err: any, res: any) => {
            if(err)return logger.error('UserBase.load', err)

            for(let item in storageDefault) {
                if(res[0][item]) this.storage.set(item, func.isJSON(res[0][item]) ? JSON.parse(res[0][item]) : res[0][item])
            }

            // update keys
            const keysSettings = JSON.parse(res[0]['keyBinds'])
            const _confTmp: any = CONFIG_ENUMS.keysSettings

            for(var key in _confTmp)
            {
                if(keysSettings[key] === undefined) keysSettings[key] = _confTmp[key]
            }
            this.storage.set('keyBinds', keysSettings)
            // 

            logger.debug(`Аккаунт #${this.uid} загружен`)

            this.player.setVariable('uid', this.uid)
            this.player.setVariable('keyBinds', this.storage.get('keyBinds'))

            new CEF(this.player, 'auth', 'toggle', { status: false }).send()            
            this.character.choice()
        })
    }
    save(): void {
        if(!this.isAuth)return

        try
        {
    		let query = 'update characters set '
    		const args = []

    		// Сохранение персонажа
            for(let item in storageDefault) {
                if(item.indexOf('char_') === 0
                    && item !== 'char_cid' && item !== 'char_uid' && item !== 'char_createAt')
                {
        			query += `${item.replace('char_', '')} = ?`
                    let get = this.storage.get(item)

                    if(typeof get === 'object') args.push(JSON.stringify(get))
                    else if(typeof get === 'string') args.push(get)
                    else args.push(get)

                    query += ', '
                }
            }

            query = query.substring(0, query.length - 2)
    		query += ` where cid = ?`

            args.push(this.cid)

    		// logger.log('user.save', {
    		// 	message: query,
    		// 	args: args
    		// })
    		mysql.query(query, args, (err: any) =>
    		{
    			if(err)return logger.error('UserBase.save', err)
                logger.debug(`UserBase.save character #${this.cid} successfuly`)
    		})

    		// Сохранение аккаута
    		mysql.query(`update users set login = ?, password = ?, email = ? where uid = ?`, [
    			this.login,
    			this.storage.get('password'),
    			this.storage.get('email'),
    			this.uid
    		], (err: any) =>
    		{
    			if(err)return logger.error('UserBase.save', err)
                logger.debug(`UserBase.save user #${this.uid} successfuly`)
    		})
        }
        catch(e)
        {
            logger.error('UserBase.save', e)
        }
    }

    character: any = {
        load: (): void => {
            if(this.isAuth)return
            if(!this.cid
                || this.cid === -1)return
            
            mysql.query('select * from characters where cid = ?', [ this.cid ], (err: any, res: any) => {
                if(err)return logger.error('UserBase.character.load', err)
                if(!res.length)return this.player.kick("Персонаж не найден")

                for(let item in storageDefault) {
                    if(res[0][item.replace('char_', '')]) this.storage.set(item, func.isJSON(res[0][item.replace('char_', '')]) ? JSON.parse(res[0][item.replace('char_', '')]) : res[0][item.replace('char_', '')])
                }

                logger.debug(`Персонаж #${this.cid} загружен: ${this.storage.get('char_name')}`)

                const user = new User(this.player)
                user.storage.set('isAuth', true)

                this.player.name = this.name

                this.player.setVariable('char_cash', 200)
                this.player.setVariable('char_bankCash', 0)

                user.loadScreen(true)
                user.spawn()
            })
        },
        choice: (): void => {
            if(this.isAuth)return
            if(!this.uid
                || this.uid === -1)return

            const user = new User(this.player)

            user.setPos(-1815.242431640625, -1203.771484375, 13.01736068725586, -41.2353515625, this.player.id + 1)
            user.setCamera(new mp.Vector3(-968.2666625976562, -2435.315185546875, 223.9071044921875), [ -580.9144897460938, -1692.084228515625, 36.439208984375 ])
            
            mysql.query('select * from characters where uid = ?', [ this.uid ], (err: any, res: any) => {
                if(err)return logger.error('UserBase.character.choice', err)

                const characters = []
                for(let i = 0; i < 3; i ++) {
                    if(!res[i]) characters[i] = {}
                    else characters[i] = {
                        name: JSON.parse(res[i]['name'])[0] + ' ' + JSON.parse(res[i]['name'])[1],
                        id: res[i]['cid'],
                        level: 1,

                        data: {
                            cash: res[i]['cash'],
                            bank: res[i]['bankCash'],
                            fraction: 'Неимеется',
                            family: 'Неимеется'
                        }
                    }
                }
                characters[2] = { donate: true }

                user.cursor(true)

                new CEF(this.player, "choiceChar", "setCharacters", characters).send()
                new CEF(this.player, "choiceChar", "toggle", { status: true }).send()

                new CEF(this.player, "cef::user:choiceChar").add((data: any) => {
                    new CEF(this.player, 'choiceChar', 'toggle', { status: false }).send()

                    this.storage.set('char_cid', data.id)
                    this.character.load()
                })
                new CEF(this.player, "cef::user:choiceChar:create").add(() => {
                    new CEF(this.player, 'choiceChar', 'toggle', { status: false }).send()
                    new User(this.player).createCharacter()
                })
                new CEF(this.player, "cef::user:choiceChar:buy").add(() => {
                    new User(this.player).notify('В разработке')
                })
            })
        },
        create: (name: [string, string], appearance: any, gender: number): void => {
            const user = new User(this.player)
            mysql.query('select cid from characters where name = ?', [ JSON.stringify(name) ], (err: any, res: any) => {
                if(err)return logger.mysql('UserBase.character.create', err)
                if(res.length)return user.notify('Данное Имя и Фамилию уже кто-то забрал. Попробуй другой вариант', 'error')
    
                user.loadScreen(true)
                mysql.query(`insert into characters (uid, name, gender, appearance, clothes) values (?, ?, ?, ?, ?)`, [
                    this.uid,
                    JSON.stringify(name),
                    gender,
                    JSON.stringify(appearance),
                    JSON.stringify(this.storage.get('char_clothes')) ], (err: any, res: any) => {
                    if(err)return logger.mysql('UserBase.character.create', err)
    
                    new CEF(this.player, 'createChar', 'toggle', { status: false }).send()
                    this.storage.set('char_cid', res.insertId)
    
                    this.character.load()
                })
            })
        }
    }
}