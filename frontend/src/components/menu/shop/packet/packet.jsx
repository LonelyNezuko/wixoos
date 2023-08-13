import React from 'react'
import $ from 'jquery'

import ragemp from '../../../../modules/ragemp'

import './packet.scss'

export default function Packet() {
    const [ cash, setCash ] = React.useState([
        { id: 1, name: 'Standart', icon: '1.png', price: 199, context: [ '10 000$', 'Лицензии категории B', 'Прокачка Выносливости до 100%', 'VIP статус на 3 дня', '', '' ] },
        { id: 2, name: 'Deluxe', icon: '2.png', price: 499, context: [ '50 000$', 'Лицензии категории B, A, C', 'Прокачка Выносливости, Вождения, Стрельбы', '2 кейса для рулетки', 'VIP статус на 7 дней', '' ] },
        { id: 3, name: 'ULTRA', icon: '3.png', price: 899, context: [ '100 000$', 'Лицензии категории B, A, C', 'Прокачка Выносливости, Вождения, Стрельбы', '7 кейсов для рулетки', 'VIP статус на 7 дней', 'Уникальный предмет одежды' ], discount: true }
    ])

    React.useMemo(() => {
        ragemp.eventCreate('menu:shop:packet', (cmd, data) => {
            if(cmd === 'set') setCash(data)
        })
    }, [])

    return (
        <div className="shopPacket shopCash">
            <div className="list">
                {!cash.length ? (
                    <h6 className="menu-body-notfound">
                        <span>Пакеты Вам более не доступны</span>
                    </h6>
                ) : ''}
                {cash.map((item, i) => {
                    return (
                        <div key={i} className="elem">
                            <div className="title">{item.name}</div>
                            <div className="icon">
                                <img src={`assets/shop/cash/${item.icon}`} />
                            </div>
                            <div className="context">
                                <h1>Что дает данный пакет?</h1>
                                <section>
                                    {item.context.map((item, i) => {
                                        return (<span key={i}>{item}</span>)    
                                    })}
                                </section>
                            </div>
                            <div className="other">Все бонусы сразу же будут активированы на персонаже после покупки. <br />Пакет покупается единожды на одного персонажа <br />Время доступности для покупки пакета ограничено</div>
                            <div className="action">
                                <button onClick={() => ragemp.send('server::menu:shop:buy', { type: 'packet', id: item.id })} className="btn">
                                    Купить
                                    <div className="donateCount">
                                        <img src="assets/donate.png" />
                                        {item.price.toLocaleString()}
                                    </div>
                                </button>
                            </div>
                            {item.discount ? (<div className="discount">Выгодно</div>) : ''}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}