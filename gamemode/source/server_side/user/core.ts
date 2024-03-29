import CEF from "../_modules/cef"
import func from "../_modules/func"
import logger from "../_modules/logger"

// storage
interface UserInterface {
    isReady: boolean,
    isAuth: boolean,
    isCefLoaded: boolean,
    isEditCharacter: boolean,

    openeds: any[],

    menuHeaderNav: number,
    menuBodyNav: string
}
const storage = new Map<number, UserInterface>()

import CONFIG_DEFAULT from '../configs/default.json'
import CONFIG_SPAWN from '../configs/spawn.json'
import CONFIG_USER from '../configs/user.json'
import CONFIG_ENUMS from '../configs/enums.json'

import UserBase from "./base"

export default class User {
    private readonly player: PlayerMp
    private readonly id: number

    private readonly userBase: UserBase

    private readonly storageDefault: UserInterface = {
        isReady: false,
        isAuth: false,
        isCefLoaded: false,
        isEditCharacter: false,
    
        openeds: [],

        menuHeaderNav: -1,
        menuBodyNav: ''
    }

    constructor(player: PlayerMp) {
        this.player = player
        this.id = player.id

        this.userBase = new UserBase(this.player)
    }


    storage: any = {
        clear: (): void => {
            let res = storage.delete(this.id)
            const newobj = {...this.storageDefault}

            storage.set(this.id, newobj)
        },
        get: (key: number): any => {
            const data: any = storage.get(this.id)
            return data[key]
        },
        set: (key: number, value: [string, number]): boolean => {
            const data: any = {...storage.get(this.id)}
            if(!data)return false

            data[key] = value
            storage.set(this.id, data)

            return true
        }
    }

    get isAuth(): boolean {
        return this.storage.get('isAuth')
    }
    
    get onFoot(): boolean {
        if(this.storage.get('openeds').length)return false

        return true
    }


    // авторизация/регистрация
    goSignin(): void {
        if(this.isAuth)return

        if(this.storage.get('isReady')
            && this.storage.get('isCefLoaded')) {
            this.player.call('client::user:signin:setRemember')

            new CEF(this.player, 'signin', 'toggle', { status: true }).send()
            this.cursor(true)

            new CEF(this.player, 'cef::signin:submit:auth').add((data: any): any => {
                const
                    login: string = data.login,
                    password: string = data.password,
                    remember: boolean = data.remember

                if(login.length < CONFIG_DEFAULT.usernameLength[0] || login.length > CONFIG_DEFAULT.usernameLength[1]
                    || !func.validatePassword(password))
                    return this.notify('Некорректные данные', 'error')
                
                new UserBase(this.player).signin(login, password, (err: string, success: string) => {
                    new CEF(this.player, 'signin', 'notf', { type: err ? 'error' : 'success', where: '.auth', message: err }).send()

                    if(success) {
                        if(remember) {
                            this.player.call('client::user:signin:remember', [ true, {
                                login,
                                password
                            } ])
                        }
                        else this.player.call('client::user:signin:remember', [ false, {} ])
                    }
                })
            })
            new CEF(this.player, 'cef::signin:submit:registry').add((data: any): any => {
                const
                    login: string = data.login,
                    password: string = data.password,
                    email: string = data.email,
                    remember: boolean = data.remember

                if(login.length < CONFIG_DEFAULT.usernameLength[0] || login.length > CONFIG_DEFAULT.usernameLength[1]
                    || !func.validatePassword(password))
                    return this.notify('Некорректные данные', 'error')
                if(!func.validateEmail(email))
                    return this.notify('Некорректный Email адрес (пример: email@domen.ru)', 'error')

                if(remember) {
                    this.player.call('client::user:signin:remember', [ true, {
                        login,
                        password
                    } ])
                }

                new UserBase(this.player).signup(login, password, email, (err: string, success: string) => {
                    new CEF(this.player, 'signin', 'notf', { type: err ? 'error' : 'success', where: '.registry', message: err }).send()
                    if(success) {
                        new CEF(this.player, 'signin', 'notf', { type: 'success', where: '.registry', message: 'Загружаем данные аккаунта...' }).send()
                    }
                })
            })
        }
    }
    ////////////


    notify(text: string, type: string = 'info', time: number = 5000): void {
        this.player.call('client::user:notify', [ text, type, time ])
    }

    cursor(toggle: boolean, toggleESC: boolean = false): void {
        this.player.call('client::user:cursor', [ toggle, toggleESC ])
    }

    setDimension(dimension: number): void {
        this.player.dimension = dimension || 0
    }
    setPos(x: number, y: number, z: number, a: number, dimension: number): void {
        this.player.position = new mp.Vector3(x, y, z)
	    this.player.heading = a
	    this.player.dimension = dimension || 0
    }
    freeze(toggle: boolean): void {
        this.player.call('client::user:freeze', [ toggle ])
    }

    setCamera(position: Vector3, atCoord: [ number, number, number ], data: any = {}): void {
        this.player.call('client::user:setCamera', [ position, atCoord, data ])
    }
    destroyCamera(data: any = {}): void {
        this.player.call('client::user:destroyCamera', [ data ])
    }
    setCameraToPlayer(data: any = {}): void {
        this.player.call('client::user:setCameraToPlayer', [ data ])
    }

    toggleHud(toggle: boolean): void {
        this.player.call('client::user:toggleHud', [ toggle ])
    }
    updateHud(): void {
        this.player.call('client::user:updateHud')
    }

    loadScreen(toggle: boolean): void {
        this.player.call('client::user:loadScreen', [ toggle ])
    }


    spawn(): void {
        if(!this.isAuth)return

        let spawnRandom = func.random(0, CONFIG_SPAWN.length - 1)
        this.setPos(CONFIG_SPAWN[spawnRandom][0], CONFIG_SPAWN[spawnRandom][1], CONFIG_SPAWN[spawnRandom][2], CONFIG_SPAWN[spawnRandom][3], CONFIG_SPAWN[spawnRandom][4])

        this.player.health = 100
        this.player.armour = 0

        this.player.clearDecorations()
        this.player.stopAnimation()

        this.setClothes()
        this.resetAppearance()

        this.cursor(false)
        this.toggleHud(true)

        this.destroyCamera()
        this.loadScreen(false)

        this.freeze(false)
        this.setNeeds()
    }


    createCharacter(): void {
        const userBase = new UserBase(this.player)

        this.setPos(-1816.74755859375, -1205.465576171875, 13.017354965209961, -40.66239547729492, this.player.id + 1)
        this.setCameraToPlayer()

        this.cursor(true)

        this.resetAppearance()
        this.setClothes({ clothes: CONFIG_ENUMS.clothesDefault[userBase.gender] })

        const ui_setData: any = CONFIG_USER.appearanceDefault
        ui_setData.clothes = [ 0, 0, 0, 0 ]

        let ui_setClothesList: any[] = []
        CONFIG_ENUMS.characterCreateClothesList[userBase.gender].map((item, i) => {
            ui_setClothesList[i] = []
            item.map(item => ui_setClothesList[i].push(item.name))
        })

        ui_setData.gender = userBase.gender

        new CEF(this.player, 'createChar', 'setData', ui_setData).send()
        new CEF(this.player, 'createChar', 'setType', { type: 0 }).send()
        new CEF(this.player, 'createChar', 'setClothesList', ui_setClothesList).send()
        new CEF(this.player, 'createChar', 'toggle', { status: true }).send()

        this.storage.set('isEditCharacter', true)

        new CEF(this.player, 'cef::createChar:update').add((data: any) => {
            if(!this.storage.get('isEditCharacter'))return

            const clothes: any = data.clothes
            let setcloth: any = {}

            clothes.map((item: any, i: number) => {
                let cl: any = CONFIG_ENUMS.characterCreateClothesList[data.gender][i][item]
                delete cl.name

                if(i === 0) setcloth.props = { hat: cl.id }
                else {
                    for(let key in cl) setcloth[key] = cl[key]
                }
            })
            this.setClothes({ clothes: setcloth })

            delete data.clothes
            this.resetAppearance({ appearance: data, gender: data.gender })
        })
        new CEF(this.player, 'cef::createChar:random').add((data: any) => {
            this.notify('Позже напишу')
        })
        new CEF(this.player, 'cef::createChar:submit').add((data: any) => {
            if(!this.storage.get('isEditCharacter'))return
            if(data.name[0].length < 2 || data.name[1].length < 2)return this.notify('А как нам тебя звать то?', 'error')

            const viewData = data.viewData
            const name = data.name

            const clothes = viewData.clothes
            delete viewData.clothes

            const gender = viewData.gender
            delete viewData.gender

            let setcloth: any = {}
            clothes.map((item: any, i: number) => {
                let cl: any = CONFIG_ENUMS.characterCreateClothesList[gender][i][item]
                delete cl.name

                if(i === 0) setcloth.props = { hat: cl.id }
                else {
                    for(let key in cl) setcloth[key] = cl[key]
                }
            })
            this.setClothes({ clothes: setcloth, save: true, notSaveMysql: true })

            new UserBase(this.player).character.create(name, viewData, gender)
        })
        new CEF(this.player, 'cef::createChar:changeType').add((data: any) => {
            if(!this.storage.get('isEditCharacter'))return
            const type = data.type

            if(type === 4 || type === 5) {
                this.setCameraToPlayer({
                    height: 0.6,
                    dist: 1
                })
            }
            else if(type === 22) {
                this.setCameraToPlayer({
                    height: -0.3
                })
            }
            else if(type === 23) {
                this.setCameraToPlayer({
                    height: -0.6
                })
            }
            else this.setCameraToPlayer()
        })
    }


    resetAppearance(data: any = {}): void {
        const userBase = new UserBase(this.player)

        let appearance = userBase.storage.get('char_appearance')
        let gender = userBase.gender

		if(data.appearance) appearance = data.appearance
		if(!appearance
            || !appearance.genetic) appearance = CONFIG_USER.appearanceDefault
        if(data.gender) gender = data.gender

        this.player.setCustomization(gender === 0 ? true : false,
            appearance.genetic.mother,
			appearance.genetic.father,
			0,

            appearance.genetic.mother,
            appearance.genetic.father,
            0,

            appearance.genetic.similarity,
            appearance.genetic.skinTone,
            0,

            appearance.appearance[0],
            appearance.hair.head_color,

            0,
            appearance.face
        )
        this.player.setClothes(2, appearance.hair.head, 0, 0) // Волосы на голове

        this.player.setHeadOverlay(1, [ appearance.hair.beard, !appearance.hair.beard ? 0.0 : 100.0, appearance.hair.beard_color, appearance.hair.beard_color ]) // Волосы на лице
        this.player.setHeadOverlay(2, [ appearance.hair.eyebrow, !appearance.hair.eyebrow ? 0.0 : 100.0, appearance.hair.eyebrow_color, appearance.hair.eyebrow_color ]) // Брови
        this.player.setHeadOverlay(10, [ appearance.hair.breast, !appearance.hair.breast ? 0.0 : 100.0, appearance.hair.breast_color, appearance.hair.breast_color ]) // Волосы на теле

        this.player.setHeadOverlay(0, [ appearance.appearance[1], !appearance.appearance[1] ? 0 : 100.0, 0, 0 ]) // Пятна на лице
        this.player.setHeadOverlay(3, [ appearance.appearance[2], !appearance.appearance[2] ? 0 : 100.0, 0, 0 ]) // Старение
        this.player.setHeadOverlay(6, [ appearance.appearance[3], !appearance.appearance[3] ? 0 : 100.0, 0, 0 ]) // Цвет лица
        this.player.setHeadOverlay(7, [ appearance.appearance[4], !appearance.appearance[4] ? 0 : 100.0, 0, 0 ]) // Повреждения кожи
        this.player.setHeadOverlay(8, [ appearance.appearance[5], !appearance.appearance[5] ? 0.0 : 100.0, appearance.appearance[6], 0 ]) // Губная помада (цвет помады)
        this.player.setHeadOverlay(9, [ appearance.appearance[7], !appearance.appearance[7] ? 0 : 100.0, 0, 0 ]) // Родинки
        this.player.setHeadOverlay(11, [ appearance.appearance[8], !appearance.appearance[8] ? 0 : 100.0, 0, 0 ]) // Пятна на теле
    }
    setClothes(data: any = {}): void {
        const userBase = new UserBase(this.player)

		let clothes = userBase.storage.get('char_clothes')
		let gender = userBase.gender

		if(data.gender) gender = data.gender
		if(data.clothes) clothes = data.clothes

		if(!clothes || !clothes.props) clothes = CONFIG_ENUMS.clothesDefault[gender]

        const clothesComponentIDTemp: any = CONFIG_ENUMS.clothesComponentID
        for(var key in clothes) {
        	if(key === 'props') {
        		for(var key in clothes.props) {
        			if(clothes.props[key] === -1) this.player.call('client::user:clearProp', [ clothesComponentIDTemp.props[key] ])
        			else this.player.call('client::user:setProp', [ clothesComponentIDTemp.props[key], clothes.props[key], 0 ])
        		}
        	}
        	else this.player.setClothes(clothesComponentIDTemp[key], clothes[key], 0, 0)
        }

		if(data.save)
		{
			let saveClothes = userBase.storage.get('char_clothes')
			if(!saveClothes || !saveClothes.props) saveClothes = CONFIG_ENUMS.clothesDefault[gender]

			for(var key in clothes) {
				if(key === 'props') {
					for(var key in clothes.props) saveClothes.props[key] = clothes.props[key]
				}
				else saveClothes[key] = clothes[key]
			}

			userBase.storage.set('char_clothes', saveClothes)
			if(!data.notSaveMysql) userBase.save()
		}
	}


    // openeds
    openeds: any = {
        add: (name: string): void => {
            const temp = this.storage.get('openeds')
            temp.push(name)

            this.storage.set('openeds', temp)
        },
        remove: (name: string): void => {
            const temp = this.storage.get('openeds')
            if(temp.indexOf(name) !== -1) temp.splice(temp.indexOf(name), 1)

            this.storage.set('openeds', temp)
        },
        is: (name: string): boolean => {
            return this.storage.get('openeds').indexOf(name) !== -1
        }
    }

    
    setNeeds(satiety?: number, thirst?: number) {
        this.player.setVariable('needs', [
            satiety || this.userBase.storage.get('char_needs')[0],
            thirst || this.userBase.storage.get('char_needs')[1],
        ])
        this.updateHud()

        const needs = this.userBase.storage.get('char_needs')

        if(satiety) needs[0] = satiety
        if(thirst) needs[1] = thirst

        this.userBase.storage.set('char_needs', needs)
    }
}