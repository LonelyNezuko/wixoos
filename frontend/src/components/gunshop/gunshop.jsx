import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import './gunshop.scss'

import { FaMouse } from 'react-icons/fa'

export default function Gunshop() {
    const [ toggle, setToggle ] = React.useState(false)

    const [ navMenu, setNavMenu ] = React.useState([
        'Холодное оружие', 'Легкие пистолеты', 'Тяжелые пистолеты',
        'Пистолеты-пулеметы', 'Винтовки',
        'Патроны', 'Прочее'
    ])
    const [ nav, setNav ] = React.useState(0)

    const [ store, setStore ] = React.useState([
        [
            { id: 'dagger', name: 'Кинжал', price: 250, bullet: 0, icon: 'knife-1.webp', desc: 'Простенький ножичек для повседневных дел', stats: [ 0, 3.5, 1.5, 4.2 ] },
            { id: 'knife', name: 'Охотничий нож', price: 350, bullet: 0, icon: 'knife-2.webp', desc: 'Для настоящего охотника, и в холод, и в знобь', stats: [ 1.5, 1.5, 2.5, 3.2 ] },
            { id: 'crowbar', name: 'Монтировка', price: 75, bullet: 0, icon: 'knife-3.webp', desc: 'Гордон Фримен оценивает это оружие на все 10 из 10', stats: [ 2, 3.5, 1.5, 4.2 ] },
        ],
        [
            { id: 'pistol', name: 'Обычный пистолет', price: 550, bullet: '9x19', icon: 'easypistol-2.webp', desc: 'Стандартный пистолет. Есть у 95% жителей', stats: [ 2, 3.5, 1.5, 4.2 ] },
            { id: 'combatpistol', name: 'Боевой пистолет', price: 750, bullet: '9x19', icon: 'easypistol-1.webp', desc: 'Название врет. Данный пистолет НЕ предназначен для боевых действий', stats: [ 2, 3.5, 1.5, 4.2 ] },
            { id: 'pistol50', name: 'Пистолет 50 мм', price: 650, bullet: '9x19', icon: 'easypistol-3.webp', desc: 'Для тех, кто любит по меньше', stats: [ 2, 3.5, 1.5, 4.2 ] },
        ],
        [
            { id: 'heavypistol', name: 'Тяжелый пистолет', price: 900, bullet: '9x19', icon: 'hardpistol-1.webp', desc: 'Настоящий апогей своего класса', stats: [ 2, 3.5, 1.5, 4.2 ] },
            { id: 'revolver', name: 'Револьвер', price: 1250, bullet: '9x19', icon: 'hardpistol-2.webp', desc: 'Прибыл к нам из самого вестерна', stats: [ 2, 3.5, 1.5, 4.2 ] },
        ],
        [
            { id: 'machinepistol', name: 'Пистолет-пулемет', price: 1850, bullet: '5x56', icon: 'submachine-1.webp', desc: 'Одна из разновидностей пистолетов. Более скорострельная, но менее убойная', stats: [ 2, 3.5, 1.5, 4.2 ] },
            { id: 'tecpistol', name: 'TEC', price: 1550, bullet: '5x56', icon: 'submachine-2.webp', desc: 'Легок снаружи, легок внутри', stats: [ 2, 3.5, 1.5, 4.2 ] },
            { id: 'minismg', name: 'Мини-SMG', price: 1799, bullet: '5x56', icon: 'submachine-3.webp', desc: 'Минимальная версия популярного SMG', stats: [ 2, 3.5, 1.5, 4.2 ] },
        ],
        [
            { id: 'assaultrifle', name: 'AK-47', price: 2699, bullet: '7.62x39', icon: 'rifle-1.webp', desc: 'Для самых убойных ситуаций', stats: [ 2, 3.5, 1.5, 4.2 ] },
            { id: 'tacticalrifle', name: 'M4A1-S', price: 2459, bullet: '7.62x39', icon: 'rifle-2.png', desc: 'Когда нужно провернуть дело по тихому', stats: [ 2, 3.5, 1.5, 4.2 ] },
        ],
        [
            { id: 'bullet919', name: '9x19 (10 штук)', price: 10, bullet: 0, icon: 'bullet-1.png', desc: 'Патроны 9x19 калибра для легких и тяжелых пистолетов', stats: [ 2, 3.5, 1.5, 4.2 ] },
            { id: 'bullet556', name: '5x56 (20 штук)', price: 75, bullet: 0, icon: 'bullet-2.png', desc: 'Патроны 5x56 калибра для пистолетов-пулеметов', stats: [ 2, 3.5, 1.5, 4.2 ] },
            { id: 'bullet76239', name: '7.62x39 (50 штук)', price: 250, bullet: 0, icon: 'bullet-3.png', desc: 'Патроны 7.62x39 калибра для винтовок', stats: [ 2, 3.5, 1.5, 4.2 ] },
        ],
        [
            { id: 'bat', name: 'Бейсбольная бита', price: 50, bullet: 0, icon: 'other-1.webp', desc: 'Вы же собираетесь играть в бейсбол? Верно же?', stats: [ 2, 3.5, 1.5, 4.2 ] },
            { id: 'knuckle', name: 'Кастет', price: 25, bullet: 0, icon: 'other-2.webp', desc: 'Если на дух не переносишь огнестрел. Ну или не выдали лицензию', stats: [ 2, 3.5, 1.5, 4.2 ] },
        ]
    ])
    const [ weaponHover, setWeaponHover ] = React.useState(-1)

    React.useMemo(() => {
        $('body').on('mouseover', '#gunshop .body .list .elem', event => {
            if(weaponHover !== -1)return

            const target = $(event.currentTarget)
            setWeaponHover(parseInt(target.attr('data-index')))
        })
        $('body').on('mouseleave', '#gunshop .body .list .elem', event => {
            setWeaponHover(-1)
        })


        ragemp.eventCreate('gunshop', (cmd, data) => {
            switch(cmd) {
                case 'toggle': {
                    setToggle(data.status)
                    break
                }
                case 'setStore': {
                    setStore(data)
                    break
                }
            }
        })
    }, [])

    return (
        <div id="gunshop" style={{display: !toggle ? "none" : 'flex'}}>
            <div className="menu">
                <div className="logo">
                    <img src="assets/gunshop/logo.png" />
                </div>
                <ul className="nav">
                    {navMenu.map((item, i) => {
                        return (<li onClick={() => setNav(i)} key={i} className={nav === i ? 'selected' : ''}>{item}</li>)
                    })}
                </ul>
                <div className="btn" onClick={() => ragemp.send('server::gunshop:exit')}>Выйти</div>
            </div>
            <div className="body">
                <div className="list">
                    {store[nav].map((item, i) => {
                        return (
                            <div className="elem" key={i} data-index={i}>
                                <h1 className="title">{item.name}</h1>
                                <div className={`icon ${nav === 5 ? 'bullet' : ''}`}>
                                    <img src={`assets/gunshop/weapons/${item.icon}`} />
                                </div>
                                <div className="desc">
                                    <section style={{display: !item.bullet ? 'none' : 'flex'}}>
                                        <h1>Тип патронов:</h1>
                                        <span>{item.bullet}</span>
                                    </section>
                                    <section>
                                        <h1>Состояние:</h1>
                                        <span className="itemcondition good"></span>
                                    </section>
                                </div>
                                <div className="price">
                                    <h1>{item.price.toLocaleString()}$</h1>
                                    <div className="buy">
                                        <div onClick={() => ragemp.send('server::gunshop:buy', { id: item.id, type: false })} className="btn">Наличными</div>
                                        <div onClick={() => ragemp.send('server::gunshop:buy', { id: item.id, type: true })} className="btn">Картой</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="guninfo">
                {weaponHover === -1 ? (
                    <div className="isnone">
                        <div className="wrap">
                            <FaMouse />
                            <h1>Наведитесь на товар для просмотра подробностей</h1>
                        </div>
                    </div>
                ) : (
                    <div className="info">
                        <h1 className="title">{store[nav][weaponHover].name}</h1>
                        <div className={`icon ${nav === 5 ? 'bullet' : ''}`}>
                            <img src={`assets/gunshop/weapons/${store[nav][weaponHover].icon}`} />
                        </div>
                        <div className="text">
                            {store[nav][weaponHover].desc}
                        </div>
                        <div className="desc" style={{display: nav === 5 ? 'none' : 'block'}}>
                            <section style={{display: !store[nav][weaponHover].bullet ? 'none' : 'flex'}}>
                                <h1>Тип патронов:</h1>
                                <span>{store[nav][weaponHover].bullet}</span>
                            </section>
                            <section>
                                <h1>Состояние:</h1>
                                <span className="itemcondition good"></span>
                            </section>
                            <section>
                                <h1>Урон:</h1>
                                <div>
                                    <div style={{display: !store[nav][weaponHover].stats[0] ? 'none' : 'block', width: (store[nav][weaponHover].stats[0] * 100) / 5 + "%"}}></div>

                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </section>
                            <section>
                                <h1>Скорость:</h1>
                                <div>
                                    <div style={{display: !store[nav][weaponHover].stats[1] ? 'none' : 'block', width: (store[nav][weaponHover].stats[1] * 100) / 5 + "%"}}></div>

                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </section>
                            <section>
                                <h1>Точность:</h1>
                                <div>
                                    <div style={{display: !store[nav][weaponHover].stats[2] ? 'none' : 'block', width: (store[nav][weaponHover].stats[2] * 100) / 5 + "%"}}></div>

                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </section>
                            <section>
                                <h1>Дистанция:</h1>
                                <div>
                                    <div style={{display: !store[nav][weaponHover].stats[3] ? 'none' : 'block', width: (store[nav][weaponHover].stats[3] * 100) / 5 + "%"}}></div>

                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}