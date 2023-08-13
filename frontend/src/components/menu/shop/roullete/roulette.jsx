import React from 'react'
import $ from 'jquery'

import ragemp from '../../../../modules/ragemp'
import func from '../../../../modules/func'

import './roulette.scss'

import { ImArrowLeft2 } from 'react-icons/im'

import { FaPlay } from 'react-icons/fa'

import { IoIosArrowBack } from 'react-icons/io'

export default function Roulette() {
    const [ chests, setChests ] = React.useState([])
    const [ selectChest, setSelectChest ] = React.useState(-1)


    const [ items, setItems ] = React.useState([
		{ id: 1, type: 'cash', count: 1000, rare: '', rare2: 0, icon: 'assets/inventory/items/cash.png', name: '1.000$' },
		{ id: 2, type: 'cash', count: 15000, rare: '', rare2: 0, icon: 'assets/inventory/items/cash.png', name: '15.000$' },
		{ id: 3, type: 'cash', count: 50000, rare: 'green', rare2: 1, icon: 'assets/inventory/items/cash.png', name: '50.000$' },
		{ id: 4, type: 'cash', count: 150000, rare: 'blue', rare2: 2, icon: 'assets/inventory/items/cash.png', name: '150.000$' },
		{ id: 5, type: 'cash', count: 500000, rare: 'purple', rare2: 3, icon: 'assets/inventory/items/cash.png', name: '500.000$' },

		{ id: 6, type: 'vehicle', model: 'stafford', count: 1, rare: 'green', rare2: 1, icon: 'assets/vehicles/stafford.png', name: 'Enus Stafford', sellPrice: 300 },
		{ id: 7, type: 'vehicle', model: 'trophytruck2', count: 1, rare: 'blue', rare2: 2, icon: 'assets/vehicles/trophytruck2.png', name: 'Vapid Desert Raid', sellPrice: 750 },
		{ id: 8, type: 'vehicle', model: 'stromberg', count: 1, rare: 'purple', rare2: 3, icon: 'assets/vehicles/stromberg.png', name: 'Ocelot Stromberg', sellPrice: 1500 },
		{ id: 9, type: 'vehicle', model: 'autarch', count: 1, rare: 'gold', rare2: 4, icon: 'assets/vehicles/autarch.png', name: 'Overflod Autarch', sellPrice: 2000 },
		{ id: 10, type: 'vehicle', model: 'nero2', count: 1, rare: 'gold', rare2: 4, icon: 'assets/vehicles/nero2.png', name: 'Truffade Nero Custom', sellPrice: 2000 },
		{ id: 11, type: 'vehicle', model: 'tezeract', count: 1, rare: 'gold', rare2: 4, icon: 'assets/vehicles/tezeract.png', name: 'Pegassi Tezeract', sellPrice: 2000 },

		{ id: 12, type: 'vip', count: 1, rare: 'purple', rare2: 3, icon: 'assets/vip/vip.png', name: 'Brilliant VIP' },

		{ id: 13, type: 'donate', count: 100, rare: 'green', rare2: 1, icon: 'assets/donate.png', name: '100 доната' },
		{ id: 14, type: 'donate', count: 250, rare: 'blue', rare2: 2, icon: 'assets/donate.png', name: '250 доната' },
		{ id: 15, type: 'donate', count: 500, rare: 'purple', rare2: 3, icon: 'assets/donate.png', name: '500 доната' },
		{ id: 16, type: 'donate', count: 1500, rare: 'gold', rare2: 4, icon: 'assets/donate.png', name: '1.500 доната' },

		{ id: 17, type: 'vehicle', model: 'banshee', count: 1, rare: 'red', rare2: 5, icon: 'assets/vehicles/banshee.png', name: 'Bravado Banshee', sellPrice: 10000 }
	])

    const [ isStarted, setIsStarted ] = React.useState(false)
	const [ count, setCount ] = React.useState(1)
	const [ fast, setFast ] = React.useState(false)
	const [ roulette, setRoulette ] = React.useState([
		[],
		[],
		[],
		[],
        []
	])

    const [ rewards, setRewards ] = React.useState([
        { id: 11, type: 'vehicle', model: 'tezeract', count: 1, rare: 'gold', rare2: 4, icon: 'assets/vehicles/tezeract.png', name: 'Pegassi Tezeract', sellPrice: 2000 }
    ])
    const [ rewardsIndex, setRewardsIndex ] = React.useState([ -1, -1, -1, -1, -1 ])
    const [ rewardsToggle, setRewardsToggle ] = React.useState(false)


    // test
    function setRouletteItems(index) {
        if(index < 0 || index >= 5)return

        setRoulette(old => {
            old[index] = []

            for(let i = 0; i < 150; i ++) {
                old[index].push(items[func.random(0, items.length - 1)])
            }
            return [...old]
        })
    }

    function onStart() {
        if(isStarted)return

        setIsStarted(true)
        for(let i = 0; i < count; i ++) {
            if(roulette[i].length && rewards[i]) {
                let index = rewardsIndex[i]
                console.log(index, rewards)
                
                if(index !== -1) {
                    const parent = $(`#menu .menuShop .menuShopRoulette .roulette .game .list[data-index="${i}"] .wrap`)
                    const elem = $(`#menu .menuShop .menuShopRoulette .roulette .game .list[data-index="${i}"] .wrap .rouletteItem[data-index="${index}"]`)

                    let minus = 3
                    if(!$(`#menu .menuShop .menuShopRoulette .roulette .game .listWrapper`).hasClass('listWrapper-1')) minus = 18

                    parent[0].scrollLeft = 0
                    parent.animate({
                        scrollLeft: elem.position().left - parent[0].clientWidth / 2 + elem[0].clientWidth / 2 - minus
                    }, {
                        duration: !fast ? 15000 : 0,
                        complete: () => {
                            setRewardsToggle(true)
                            setIsStarted(false)
                        }
                    })
                }
            }
        }
    }

    React.useEffect(() => {
        if(selectChest === -1)return

        let rew = []
        let rewIndex = []

        for(let i = 0, rand = 0; i < count; i ++) {
            rand = func.random(85, 100)

            if(roulette[i].length) {
                rew[i] = roulette[i][rand]
                rewIndex[i] = rand
            }

            $(`#menu .menuShop .menuShopRoulette .roulette .game .list[data-index="${i}"] .wrap`)[0].scrollLeft = 0
        }

        setRewards([...rew])
        setRewardsIndex([...rewIndex])
    }, [roulette])

    return (
        <div className="menuShopRoulette">
            {selectChest === -1 ? (
                <div className="chests">
                    <div className="list">
                        {!chests.length ? (
                            <h6 className="menu-body-notfound">
                                <span>Пока кейсов нет. Следите за обновлениями</span>
                            </h6>
                        ) : ''}
                        {chests.map((item, i) => {
                            return (
                                <div data-index={i} className="elem" key={i} onClick={elem => {
                                    if($(elem.target).is(`.menuShopRoulette .chests .list .elem[data-index="${i}"] .action .btn`)
                                        || $(elem.target).closest(`.menuShopRoulette .chests .list .elem[data-index="${i}"] .action .btn`).length)return

                                    setSelectChest(i)
                                }}>
                                    <h1 className="title">{item.name}</h1>
                                    <div className="icon">
                                        <img src={`assets/shop/chests/${item.icon}`} />
                                    </div>
                                    <h1 className="count">
                                        {item.count.toLocaleString()} штук
                                    </h1>
                                    <div className="action">
                                        <button onClick={() => ragemp.send('server::menu:shop:roulette:buychest', { id: item.id })} className={`btn ${!item.price ? 'btn-ban' : ''}`}>
                                            {item.price > 0 ? (
                                                <>
                                                    Купить
                                                    <div className="donateCount">
                                                        <img src="assets/donate.png" />
                                                        {item.price.toLocaleString()}
                                                    </div>
                                                </>
                                            ) : 'Приобрести нельзя'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="roulette">
                    <RouletteReward rewards={rewards} setRewardsToggle={setRewardsToggle} rewardsToggle={rewardsToggle} />

                    <div className="header">
                        <button className="btn back" onClick={() => setSelectChest(-1)}>
                            <ImArrowLeft2 />
                            Назад
                        </button>
                        <div className="openedchest">
                            <div className="icon">
                                <img src={`assets/shop/chests/${chests[selectChest].icon}`} />
                            </div>
                            <div className="desc">
                                <h1 className="title">{chests[selectChest].name}</h1>
                                <h1 className="count">{chests[selectChest].count.toLocaleString()} штук</h1>
                            </div>
                            <div className="action">
                                <button onClick={() => ragemp.send('server::menu:shop:roulette:buychest', { id: chests[selectChest].id })} className={`btn ${!chests[selectChest].price ? 'btn-ban' : ''}`}>
                                        {chests[selectChest].price > 0 ? (
                                            <>
                                                Купить
                                                <div className="donateCount">
                                                    <img src="assets/donate.png" />
                                                    {chests[selectChest].price.toLocaleString()}
                                                </div>
                                            </>
                                        ) : 'Приобрести нельзя'}
                                    </button>
                            </div>
                        </div>
                    </div>
                    <div className="body">
                        <div className="game">
                            <div className={`listWrapper listWrapper-${count}`}>
                                {new Array(count).fill().map((item, i) => {
                                    return (
                                        <div key={i} className="list" data-index={i}>
                                            <div className="listarrow">
                                                <div></div>
                                                <div></div>
                                            </div>
                                            <div className="wrap">
                                                {roulette[i].map((item, i) => {
                                                    return (
                                                        <div data-index={i} className={`rouletteItem ${item.rare}`}>
                                                            <div className="icon">
                                                                <img src={item.icon} />
                                                            </div>
                                                        </div>
                                                    )    
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="action">
                                <div className="count">
                                    {new Array(5).fill().map((item, i) => {
                                        return (<button onClick={() => {
                                            if(isStarted)return

                                            setCount(i + 1)
                                            for(let i = 0; i < 5; i ++) setRouletteItems(i)
                                        }} key={i} className={count === i + 1 ? 'selected' : ''}><span>x{i + 1}</span></button>)    
                                    })}
                                </div>
                                <button onClick={() => onStart()} className={`start ${isStarted ? 'blocked' : ''}`}>
                                    <FaPlay />
                                </button>
                                <div className="fast">
                                    <h1>Открыть быстро</h1>
                                    <input type="checkbox" className="input-swap" checked={fast} onChange={event => {
                                        if(isStarted)return
                                        setFast(event.target.checked)
                                    }} />
                                </div>
                            </div>
                        </div>
                        <div className="rewards">
                            <h1 className="title">Что лежит в этом кейсе?</h1>
                            <div className="list">
                                {items.sort((a, b) => b.rare2 - a.rare2).map((item, i) => {
                                    return (
                                        <div className={`rouletteItem ${item.rare}`}>
                                            <div className="icon">
                                                <img src={item.icon} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


function RouletteReward({ rewards, rewardsToggle, setRewardsToggle }) {
    const [ rewardsSelect, setRewardsSelect ] = React.useState(0)
    React.useEffect(() => {
        setRewardsSelect(0)
    }, [rewardsToggle])

    return (
        <div className={`reward ${rewardsToggle ? 'show' : ''}`}>
            <div className={`wrapper ${rewards.length !== 1 ? 'more' : ''}`}>
                <div className="arrows">
                    <div className="left">
                        <IoIosArrowBack onClick={() => setRewardsSelect(old => old - 1)} style={{display: !rewardsSelect ? 'none' : 'block'}} />
                    </div>
                    <div className="right">
                        <IoIosArrowBack onClick={() => setRewardsSelect(old => old + 1)} style={{display: rewardsSelect >= rewards.length - 1 ? 'none' : 'block'}} />
                    </div>
                </div>
                <div className="list">
                    <div className="listwrap" style={{transform: `translateX(-${rewardsSelect * 100}%)`}}>
                        {rewards.map((item, i) => {
                            return (
                                <div className="elem">
                                    <div className="title">{item.name}</div>
                                    <div className={`rouletteItem ${item.rare}`}>
                                        <div className="icon">
                                            <img src={item.icon} />
                                        </div>
                                    </div>
                                    <div className="action">
                                        {item.sellPrice ? (
                                            <button onClick={() => ragemp.send('server::menu:show:roulette:sellreward', { id: item.id })} className="btn">
                                                Продать за
                                                <div className="donateCount">
                                                    <img src="assets/donatewhite2.png" />
                                                    {item.sellPrice.toLocaleString()}
                                                </div>
                                            </button>
                                        ) : ''}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="action">
                    <button className="btn close" onClick={() => setRewardsToggle(false)}>Закрыть</button>
                </div>
            </div>
        </div>
    )
}