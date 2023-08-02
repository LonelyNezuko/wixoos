import React from 'react'
import $ from 'jquery'
import 'jquery-mousewheel'

import moment from 'moment'
import 'moment/locale/ru'

import './admin.scss'
import timeConvert from '../../modules/timeConvert'

import AdminTickets from './tickets/tickets'
import AdminList from './adminlist/adminlist'

export default function Admin() {
    function toggle(status) {
        !status ? $('#admin').hide() : $('#admin').show()
    }

    const [ role, setRole ] = React.useState({
        tag: 'DIRECTOR',
        color: '#f23a3a',
        name: 'Руководство'
    })
    const [ account, setAccount ] = React.useState({
        role: {
            tag: 'DIRECTOR',
            color: '#f23a3a',
            name: 'Руководство'
        },
        login: 'LonelyNezuko',
        id: 52,
        time: [ 2312312, 293582 ],

        uid: 1,
        cid: 5,

        avatar: {
            image: 'https://gas-kvas.com/uploads/posts/2023-01/1673348613_gas-kvas-com-p-nazuko-anime-risunki-37.jpg'
        }
    })

    const [ nav, setNav ] = React.useState([
        { id: 'tickets', name: 'Панель <жалоб>', access: [ 'ALL' ] },
        { id: 'adminlist', name: 'Список <администрации>', access: [ 'ALL' ] },
        { id: 'adminsettings', name: 'Настройки <администрации>', access: [ 'DIRECTOR', 'CHEIF_ADMIN' ] },
    ])
    const [ navSelected, setNavSelected ] = React.useState('adminlist')

    React.useMemo(() => {
        $('body').on('mousewheel', '#admin header .nav', (event, delta) => {
            event.currentTarget.scrollLeft -= (delta * 40)
        })
    })

    return (
        <div id="admin" style={{display: 'none'}}>
            <header>
                <div className="logo">
                    <img src="assets/admin/logo.png" />
                </div>
                <div className="info">
                    <h1 className="login">{account.login} (ID: {account.id})</h1>
                    <span className="adminRole" style={{background: account.role.color}}>{account.role.name}</span>
                    <div className="other">
                        <span>{timeConvert(account.time[0])} ({timeConvert(account.time[1])})</span>
                    </div>
                </div>
                <ul className="nav">
                    {nav.map((item, i) => {
                        return (<li onClick={() => setNavSelected(item.id)}
                            className={navSelected === item.id ? "selected" : ""} key={i}
                            dangerouslySetInnerHTML={{__html: item.name.replace(/(<[\s\S]+\>)/, el => {
                            el = el.replace("<", "").replace(">", "")
                            return `<span>${el}</span>`
                        })}}></li>)
                    })}
                </ul>
            </header>
            <div className="body">
                {navSelected === 'tickets' ? (<AdminTickets account={account} />) : ''}
                {navSelected === 'adminlist' ? (<AdminList account={account} />) : ''}
            </div>
        </div>
    )
}