import React from 'react'
import $ from 'jquery'

import ragemp from '../../../../modules/ragemp'

import './cash.scss'

export default function Cash() {
    const [ cash, setCash ] = React.useState([
        { id: 1, name: 'Новичок', desc: 'Отлично подходит для тех, кто только начинает свой путь', icon: '1.png', cash: 10000, price: 250 },
        { id: 2, name: 'Бывалый', desc: 'Для бывалых игроков, которые хотят чего-то большего', icon: '2.png', cash: 100000, price: 850 },
        { id: 3, name: 'Миллионер из трущоб', desc: 'В одноклик стать миллионером это замечательно', icon: '3.png', cash: 1000000, price: 1750, discount: true },
        { id: 4, name: 'Волк с Уолл-стрит', desc: 'Пора покупать машины, дома, яхты и все в штате', icon: '4.png', cash: 5000000, price: 3250 },
        { id: 5, name: 'Биткоиновый магнат', desc: 'Это счастье, внезапно найти жесткий диск с биткоином', icon: '5.png', cash: 10000000, price: 7550 }
    ])

    React.useMemo(() => {
        ragemp.eventCreate('menu:shop:cash', (cmd, data) => {
            if(cmd === 'set') setCash(data)
        })
    }, [])

    return (
        <div className="shopCash">
            <div className="list">
                {cash.map((item, i) => {
                    return (
                        <div className="elem">
                            <div className="title">{item.name}</div>
                            <div className="desc">{item.desc}</div>
                            <div className="icon">
                                <img src={`assets/shop/cash/${item.icon}`} />
                                <h1>{item.cash.toLocaleString()}$</h1>
                            </div>
                            <div className="other">Средства поступят на наличный счет сразу же, после покупки</div>
                            <div className="action">
                                <button onClick={() => ragemp.send('server::menu:shop:buy', { type: 'cash', id: item.id })} className="btn">
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