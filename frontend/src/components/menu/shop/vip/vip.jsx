import React from 'react'
import $ from 'jquery'

import ragemp from '../../../../modules/ragemp'

import './vip.scss'

export default function Vip() {
    const [ cash, setCash ] = React.useState([
        { id: 1, name: 'Silver VIP', icon: '1.png', price: 299, context: [ '10 000$', 'Лицензии категории B', 'Прокачка Выносливости до 100%', 'VIP статус на 3 дня', '', '' ] },
        { id: 2, name: 'Gold VIP', icon: '2.png', price: 599, context: [ '50 000$', 'Лицензии категории B, A, C', 'Прокачка Выносливости', '2 кейса для рулетки', 'VIP статус на 7 дней', '' ] },
        { id: 3, name: 'Memory VIP', icon: '3.png', price: 899, context: [ '100 000$', 'Лицензии категории B, A, C', 'Прокачка Выносливости', '7 кейсов для рулетки', 'VIP статус на 7 дней', 'Уникальный предмет одежды' ] },
        { id: 4, name: 'Atomic VIP', icon: '3.png', price: 1299, context: [ '100 000$', 'Лицензии категории B, A, C', 'Прокачка Выносливости', '7 кейсов для рулетки', 'VIP статус на 7 дней', 'Уникальный предмет одежды', '100 000$', 'Лицензии категории B, A, C', 'Прокачка Выносливости', '7 кейсов для рулетки', 'VIP статус на 7 дней', 'Уникальный предмет одежды' ] }
    ])

    React.useMemo(() => {
        ragemp.eventCreate('menu:shop:vip', (cmd, data) => {
            if(cmd === 'set') setCash(data)
        })
    }, [])

    return (
        <div className="shopVip shopPacket shopCash">
            <div className="list">
                {cash.map((item, i) => {
                    return (
                        <div key={i} className="elem">
                            <div className="title">{item.name}</div>
                            <div className="icon">
                                <img src={`assets/shop/cash/${item.icon}`} />
                            </div>
                            <div className="context">
                                <h1>Что дает данный VIP статус?</h1>
                                <section>
                                    {item.context.map((item, i) => {
                                        return (<span key={i}>{item}</span>)    
                                    })}
                                </section>
                            </div>
                            <div className="other">Все бонусы сразу же будут активированы на персонаже после покупки. <br />VIP статус покупается на срок в 1 месяц. <br />После пройденное времени VIP статус нужно снова приобрести</div>
                            <div className="action">
                                <button onClick={() => ragemp.send('server::menu:shop:buy', { type: 'vip', id: item.id })} className="btn">
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