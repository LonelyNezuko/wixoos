import React from 'react'
import $ from 'jquery'

import './stickers.scss'

import { FaSmileWink } from 'react-icons/fa'
import { AiFillPushpin } from 'react-icons/ai'
import ragemp from '../../../modules/ragemp'

export const stickerRegExp = /(\[stk:[\s\S]+\])/gm
export function Stickers({ onStickerClick }) {
    const [ stickers, setStickers ] = React.useState([
        { id: 'paimon_noproblem', name: 'Нет проблем', img: 'paimon_noproblem.webp', pin: true },
        { id: 'paimon_shipout', name: 'Держи чест', img: 'paimon_shipout.webp', pin: true },
        { id: 'paimon_hehe', name: 'Хе-хе', img: 'paimon_hehe.webp' },
        { id: 'paimon_timetoeat', name: 'Время обеда', img: 'paimon_timetoeat.webp' },
        { id: 'paimon_surprised', name: 'Удивился', img: 'paimon_surprised.webp' },
        { id: 'paimon_easy', name: 'Пфф... Изи', img: 'paimon_easy.webp' }
    ])
    const [ pinCount, setPinCount ] = React.useState(0)
    
    React.useEffect(() => {
        let count = 0
        stickers.map(item => {
            if(item.pin) count ++
        })

        setPinCount(count)
    }, [stickers])

    return (
        <div className="btn stickeraction">
            <FaSmileWink />

            <div className="stickermenu">
                <input onChange={event => {
                    if(!event.target.value.length) {
                        $('.stickermenu-list .stickermenu-list-elem').show()
                        return true
                    }

                    stickers.map((item, i) => {
                        if(item.name.indexOf(event.target.value) === -1 && item.id.indexOf(event.target.value) === -1) $(`.stickermenu-list .stickermenu-list-elem[data-index="${i}"]`).hide()
                        else $(`.stickermenu-list .stickermenu-list-elem[data-index="${i}"]`).show()
                    })
                }} className="stickermenu-input" type="text" placeholder="Найди нужный стикер" />
                <div className="stickermenu-body">
                    {pinCount > 0 ? (
                        <div className="stickermenu-list">
                            <h1 className="stickermenu-list-title">Избранное</h1>
                            {stickers.map((item, i) => {
                                if(!item.pin)return (<></>)
                                return (<StickersRender onStickerClick={onStickerClick} item={item} i={i} setStickers={setStickers} />)
                            })}
                        </div>
                    ) : ''}
                    <div className="stickermenu-list">
                        <h1 className="stickermenu-list-title">Все смайлы</h1>
                        {stickers.map((item, i) => {
                            return (<StickersRender onStickerClick={onStickerClick} item={item} i={i} setStickers={setStickers} />)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StickersRender({ item, i, setStickers, onStickerClick }) {
    return (
        <div key={i} data-index={i} className={`stickermenu-list-elem ${item.pin ? 'stickermenu-list-elem-pined' : ''}`}>
            <h1>
                {item.name}
                <AiFillPushpin className="stickermenu-pin" onClick={() => {
                    setStickers(old => {
                        if(item.pin) delete old[i].pin
                        else item.pin = true

                        ragemp.send('client::stickers:pin', { id: item.id })
                        return [...old]
                    })
                }} />
            </h1>
            <img onClick={event => {
                if(onStickerClick) onStickerClick(`[stk:${item.img}]`)
            }} src={`assets/stickers/${item.img}`} />
        </div>
    )
}

export function StickersRenderMessage({ stickerpath }) {
    if(stickerpath.match(stickerRegExp)) stickerpath = stickerpath.replace('[stk:', '').replace(']', '')

    return (<img className="sticker" onError={event => {
        event.target.src = 'assets/stickers/none.webp'
    }} src={`assets/stickers/${stickerpath}`} />)
}