import React from 'react'
import $ from 'jquery'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import moment from 'moment'
import 'moment/locale/ru'

import { notifySend } from '../../../notify/Notify'

import Avatar from '../../../_modules/avatar/avatar'
import Modal from '../_modals'
import Select from '../../../select'

import timeConvert from '../../../../modules/timeConvert'

import './adminlist.scss'

import { IoSearch } from 'react-icons/io5'

import { MdEdit } from 'react-icons/md'
import { FaInfo } from 'react-icons/fa'

import { IoIosArrowUp } from 'react-icons/io'
import { IoIosArrowDown } from 'react-icons/io'

export default function AdminList({ accountData }) {
    const [ admins, setAdmins ] = React.useState([
        {
            login: 'ASuck', uid: 295823, afkStatus: false,
            avatar: { image: 'https://i.pinimg.com/originals/8a/47/f7/8a47f7fa2bd6a90c0b42437175feb66e.jpg' },
            role: { tag: 'CURATOR', color: '#9b1ece', name: 'Куратор', sort: 7 },
            dateAt: 1689825644000, dateEdit: new Date(), gameTime: 592832, afkTime: 5928, status: new Date()
        },
        {
            login: 'BNewLogin', uid: 958283, afkStatus: 592,
            avatar: { image: 'https://anime-star.ru/wp-content/uploads/2021/11/Anime-avatarki-dlya-stima-topovaya-kollektsiya_11-1024x1024.jpg' },
            role: { tag: 'ADMIN1', color: '#d57d15', name: 'Мл. Администратор', sort: 3 },
            dateAt: new Date(), dateEdit: 0, gameTime: 5928, afkTime: 52313, status: 0
        },
        {
            login: 'MyAngelNezuko', uid: 232, afkStatus: 592850,
            avatar: { image: 'https://phonoteka.org/uploads/posts/2021-05/1622204586_13-phonoteka_org-p-neonovie-arti-anime-krasivo-19.jpg' },
            role: { tag: 'ADMIN2', color: '#3d44e2', name: 'Ст. Администратор', sort: 4 },
            dateAt: new Date(), dateEdit: new Date(), gameTime: 23, afkTime: 592, status: new Date()
        },
        {
            login: 'LonelyNezuko', uid: 1, afkStatus: false,
            avatar: { image: 'https://gas-kvas.com/uploads/posts/2023-01/1673348613_gas-kvas-com-p-nazuko-anime-risunki-37.jpg' },
            role: { tag: 'DEVELOPER', color: '#f33bd0', name: 'Разработчик', sort: 10 },
            dateAt: new Date(), dateEdit: new Date(), gameTime: 5928592, afkTime: 20, status: 0
        }
    ])

    const [ header, setHeader ] = React.useState([
        { id: 'login', name: 'Логин (UID)' },
        { id: 'role', name: 'Роль' },
        { id: 'dateAt', name: 'Поставили' },
        { id: 'gameTime', name: 'Часы за нед.' },
        { id: 'afkTime', name: 'АФК за нед.' },
        { id: 'status', name: 'Заходил' },
        { id: 'action', name: '&nbsp;' }
    ])
    const [ sort, setSort ] = React.useState({
        id: '',
        type: '',
        other: ''
    })

    const [ info, setInfo ] = React.useState({
        toggle: false,
        data: {
            login: 'LonelyNezuko', uid: 1, afkStatus: false,
            avatar: { image: 'https://gas-kvas.com/uploads/posts/2023-01/1673348613_gas-kvas-com-p-nazuko-anime-risunki-37.jpg' },
            role: { tag: 'DEVELOPER', color: '#f33bd0', name: 'Разработчик', sort: 10 },
            dateAt: new Date(), dateEdit: 0, status: 0,
            gameTime: {
                day: {
                    general: 29582,
                    generalAfk: 50293,

                    more: [ 2412, 523, 0, 5123, 3592, 29582, 29, 0, 0, 285, 2958, 0, 0, 592, 293, 599, 0, 0, 259, 0, 22222, 59283, 0, 2783 ],
                    afk: [ 23, 5, 0, 0, 0, 0, 231, 0, 0, 42, 0, 0, 0, 23, 293, 599, 0, 0, 0, 0, 23, 55, 0, 21 ]
                },
                week: {
                    general: 2514123,
                    generalAfk: 50293,

                    more: [ 3592, 29582, 29, 285, 2958, 259, 22222 ],
                    afk: [ 231, 555, 0, 23, 513, 56, 523 ],
                },
                month: {
                    general: 2958252395,
                    generalAfk: 50293,

                    more: [ 3592, 29582, 29, 285, 2958, 259, 22222, 3592, 29582, 29, 285, 2958, 259, 22222, 3592, 29582, 29, 285, 2958, 259, 22222, 3592, 29582, 29, 285, 2958, 259, 22222, 0, 0 ],
                    afk: [ 23, 33, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 232, 0, 0, 231, 0, 523, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
                },
                all: {
                    general: 112323152,
                    generalAfk: 502938
                }
            },
            work: {
                day: [ 59, 1950, 50, 23, 39, 10, 5 ],
                week: [ 5928, 259283, 251, 281, 392, 512, 212 ],
                month: [ 59282, 2592835, 25123, 28521, 39232, 51522, 22212 ],
                all: [ 59282232, 259212835, 23225123, 22318521, 3932232, 53221522, 2222212 ]
            }
        },
        select: {
            gameTime: 'day',
            work: 'day'
        }
    })
    const [ edit, setEdit ] = React.useState({
        toggle: false,
        data: {
            login: 'LonelyNezuko', uid: 1, afkStatus: false,
            avatar: { image: 'https://gas-kvas.com/uploads/posts/2023-01/1673348613_gas-kvas-com-p-nazuko-anime-risunki-37.jpg' },
            role: { tag: 'DEVELOPER', color: '#f33bd0', name: 'Разработчик', sort: 10 },
            dateAt: new Date(), dateEdit: 0, gameTime: 5928592, afkTime: 20, status: 0
        },
        allRoles: {
            "HELPER": { "name": "Помощник", "color": "#8d9191" },
            "MODERATOR": { "name": "Модератор", "color": "#30d4c5" },
            "ADMIN1": { "name": "Мл. Администратор", "color": "#d57d15" },
            "ADMIN2": { "name": "Ст. Администратор", "color": "#3d44e2" },
            "DEPUTY_CHEIF_ADMIN": { "name": "Зам. Глав. Администратора", "color": "#3de39d" },
            "CHEIF_ADMIN": { "name": "Глав. Администратор", "color": "#20c230" },
            "CURATOR": { "name": "Куратор", "color": "#9b1ece" },
            "RED_ADMIN": { "name": "Красный Администратор", "color": "#f23a3a" },
            "DIRECTOR": { "name": "Руководство", "color": "#f23a3a" },
            "DEVELOPER": { "name": "Разработчик", "color": "#f33bd0" }
        }
    })

    function onSearch(text) {
        if(!text.length) {
            $('#admin .adminlist .list table tbody tr').show()
            $('#admin .adminlist .header .search h1').hide()
        }
        else {
            let count = 0
            admins.map((item, i) => {
                if(item.login.indexOf(text) !== -1
                    || item.uid.toString().indexOf(text) !== -1
                    || item.role.tag.indexOf(text) !== -1
                    || item.role.name.indexOf(text) !== -1
                    || text === ':afk:' && item.afkStatus !== false) {
                    $(`#admin .adminlist .list table tbody tr[data-id="${i}"]`).show()
                    count ++
                }
                else $(`#admin .adminlist .list table tbody tr[data-id="${i}"]`).hide()
            })

            $('#admin .adminlist .header .search h1 span').html(count)
            $('#admin .adminlist .header .search h1').show()
        }
    }

    function getAverageGameTime() {
        let sum = 0
        admins.map(item => sum += item.gameTime)
        
        const avg = (sum / admins.length) || 0
        return avg
    }
    function getAverageAFKTime() {
        let sum = 0
        admins.map(item => sum += item.afkTime)
        
        const avg = (sum / admins.length) || 0
        return avg
    }


    function onSort(id) {
        if(id < 0 || id >= header.length - 1)return false

        const elem = header[id]
        
        let type = 'up'
        let other = ''

        if(elem.id === sort.id
            && elem.id !== 'login') {
            if(sort.type === 'up') type = 'down'
            else type = 'up'
        }

        if(elem.id === 'login') {
            if(sort.id === elem.id) {
                if(sort.other === 'uid' && sort.type === 'down') {
                    type = 'up'
                    other = 'login'
                }
                else if(sort.other === 'login' && sort.type === 'down') {
                    type = 'up'
                    other = 'uid'
                }
                else if(sort.type === 'up') {
                    type = 'down'
                    other = sort.other
                }
            }
            else {
                if(sort.type === 'up') type = 'down'
                else type = 'up'
                
                other = 'uid'
            }
        }

        setSort({
            id: elem.id,
            type,
            other
        })
    }

    return (
        <div className="adminlist">
            {info.toggle ? (
                <ModalInfo info={info} setInfo={setInfo} />
            ) : ''}
            {edit.toggle ? (
                <ModalEdit edit={edit} setEdit={setEdit} />
            ) : ''}

            <div className="header">
                <div className="search">
                    <IoSearch />
                    <input onChange={event => onSearch(event.target.value)} type="text" placeholder="Введите логин админа" maxLength={144} />
                    <h1 style={{display: 'none'}}>Найдено: <span>23</span></h1>
                </div>
                <div className="stats">
                    <div className="elem">
                        <section>
                            <h1>Всего администрации:</h1>
                            <span>{admins.length}</span>
                        </section>
                        <section>
                            <h1>Из них онлайн:</h1>
                            <span>{admins.filter(item => !item.status).length}</span>
                        </section>
                    </div>
                    <div className="elem">
                        <section>
                            <h1>Недавно поставленных (нед.):</h1>
                            <span>{admins.filter(item => item.dateAt >= +new Date - ((86400 * 7) * 1000)).length}</span>
                        </section>
                        <section>
                            <h1>Недавно повышенных (нед.):</h1>
                            <span>{admins.filter(item => item.dateEdit >= +new Date - ((86400 * 7) * 1000)).length}</span>
                        </section>
                    </div>
                    <div className="elem">
                        <section>
                            <h1>Среднее время в игре (нед.):</h1>
                            <span>{timeConvert(getAverageGameTime())}</span>
                        </section>
                        <section>
                            <h1>Среднее время в АФК (нед.):</h1>
                            <span>{timeConvert(getAverageAFKTime())}</span>
                        </section>
                    </div>
                </div>
            </div>
            <div className="list">
                <table>
                    <thead>
                        <tr>
                            {header.map((item, i) => {
                                return (
                                    <th onClick={() => onSort(i)} key={i} data-id={item.id} colSpan={i === header.length - 1 ? 2 : 1}>
                                        <span dangerouslySetInnerHTML={{__html: item.name}}></span>
                                        <div className="sort" style={{display: sort.id !== item.id ? 'none' : 'inline-block'}}>
                                            {sort.type === 'up' ? (<IoIosArrowUp />) : (<IoIosArrowDown />)}
                                            {sort.other.length ? (<span>{sort.other}</span>) : ''}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {admins.toSorted((a, b) => {
                            if(sort.id === 'login'
                                && sort.other === 'uid') {
                                if(sort.type === 'up')return a.uid - b.uid
                                else return b.uid - a.uid
                            }
                            if(sort.id === 'login'
                                && sort.other === 'login') {
                                if(sort.type === 'up')return a.login.localeCompare(b.login)
                                else return b.login.localeCompare(a.login)
                            }
                            if(sort.id === 'role') {
                                if(sort.type === 'up')return a.role.sort - b.role.sort
                                else return b.role.sort - a.role.sort
                            }
                            if(sort.id === 'dateAt') {
                                if(sort.type === 'up')return a.dateAt - b.dateAt
                                else return b.dateAt - a.dateAt
                            }
                            if(sort.id === 'dateEdit') {
                                if(sort.type === 'up')return a.dateEdit - b.dateEdit
                                else return b.dateEdit - a.dateEdit
                            }
                            if(sort.id === 'gameTime') {
                                if(sort.type === 'up')return a.gameTime - b.gameTime
                                else return b.gameTime - a.gameTime
                            }
                            if(sort.id === 'afkTime') {
                                if(sort.type === 'up')return a.afkTime - b.afkTime
                                else return b.afkTime - a.afkTime
                            }
                            if(sort.id === 'status') {
                                if(sort.type === 'up')return a.status - b.status
                                else return b.status - a.status
                            }
                        }).map((item, i) => {
                            return (
                                <tr key={i} data-id={i}>
                                    <td className="login">
                                        <Avatar image={item.avatar.image} />
                                        <h1>
                                            {item.login}
                                            <span>#{item.uid}</span>
                                            <span>{!item.afkStatus ? 'Не в афк' : 'АФК: ' + timeConvert(item.afkStatus)}</span>
                                        </h1>
                                    </td>
                                    <td className="role center">
                                        <span className="adminRole" style={{background: item.role.color}}>{item.role.name}</span>
                                    </td>
                                    <td className="dateAt center">{moment(item.dateAt).format('LLL')}</td>
                                    <td className="gametime center">{timeConvert(item.gameTime)}</td>
                                    <td className="afktime center">{timeConvert(item.afkTime)}</td>
                                    <td className="status center">
                                        {!item.status ? (<span className="onlineStatus online">Online</span>) : (
                                            moment(item.status).format('LLL')
                                        )}
                                    </td>
                                    <td className="action" onClick={() => setInfo({ ...info, toggle: true })}>
                                        <button>
                                            <FaInfo />
                                        </button>
                                    </td>
                                    <td className="action" onClick={() => setEdit({ ...edit, toggle: true, data: item })}>
                                        <button style={{background: '#189bb5'}}>
                                            <MdEdit />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function ModalEdit({ edit, setEdit }) {
    const [ select, setSelect ] = React.useState({
        prefix: 'none',
        role: 'none'
    })
    const [ roles, setRoles ] = React.useState([])
    const [ del, setDel ] = React.useState(false)

    React.useMemo(() => {
        setSelect({
            prefix: 'none',
            role: edit.data.role.tag
        })

        let rolesTmp = []
        for(let key in edit.allRoles) {
            rolesTmp.push([ key, `<span class="adminRole" style="background: ${edit.allRoles[key].color}">${edit.allRoles[key].name}</span>` ])
        }
        setRoles(rolesTmp)
    }, [])

    return (
        <Modal
            onClose={() => setEdit({ ...edit, toggle: false })}

            classes="adminlist_modal_edit adminlist_modal_info"
            title="Управление администратором"

            body={(
                <>
                    {del ? (
                        <section className="modal modalDialog">
                            <div>
                                <h1>Вы действительно хотите снять <b>{edit.data.login}</b> с роли администратора?</h1>
                                <section>
                                    <button onClick={() => setDel(false)} className="btn">Нет</button>
                                    <button onClick={() => {
                                        setDel(false)
                                        setEdit({ ...edit, toggle: false })

                                        // тут запрос на снятие роли (там же будет обновление списка админов)
                                    }} className="btn">Да</button>
                                </section>
                            </div>
                        </section>
                    ) : ''}
                    <div className="accountpage">
                        <div className="wrap">
                            <Avatar image={edit.data.avatar.image} />
                            <section>
                                <h1>{edit.data.login}</h1>
                                <span>#{edit.data.uid}</span>
                                <span>{!edit.data.afkStatus ? 'Не в афк' : 'АФК: ' + timeConvert(edit.data.afkStatus)}</span>
                            </section>
                        </div>
                        <div className="wrap stats">
                            <section>
                                <h1>Роль:</h1>
                                <h2>
                                    <span className="adminRole" style={{background: edit.data.role.color}}>{edit.data.role.name}</span>
                                </h2>
                            </section>
                            <section>
                                <h1>Дата постановления:</h1>
                                <h2>{moment(edit.data.dateAt).format('LLL')}</h2>
                            </section>
                            <section>
                                <h1>Дата повышения:</h1>
                                <h2>{!edit.data.dateEdit ? 'Не повышался' : moment(edit.data.dateEdit).format('LLL')}</h2>
                            </section>
                            <section>
                                <h1>Последний раз заходил:</h1>
                                <h2>{!edit.data.status ? (<span className="onlineStatus online">Online</span>) : (
                                        moment(edit.data.status).format('LLL')
                                    )}</h2>
                            </section>
                        </div>
                    </div>
                    <div className="edit">
                        <section>
                            <Select onChange={item => setSelect({ ...select, prefix: item[0] })} _type={select.prefix} _list={[
                                [ 'none', 'Без префикса' ]
                            ]} />
                            <button className="btn" onClick={() => {
                                notifySend('В разработке', 'error')
                            }}>Установить</button>
                        </section>
                        <section>
                            <Select onChange={item => setSelect({ ...select, role: item[0] })} _type={select.role} _list={roles} />
                            <button className="btn" onClick={() => {
                                if(edit.data.role.tag === select.role)return notifySend('У данного администратора уже стоит такая роль', 'error')

                                // тут запрос на изменение роли
                                setEdit({ ...edit, data: {
                                    ...edit.data,
                                    role: edit.allRoles[select.role]
                                } })
                                notifySend(`Роль ${edit.data.login} была изменена`, 'success')

                            }}>Установить</button>
                        </section>
                        <section onClick={() => setDel(true)}>
                            <button className="btn" style={{background: '#fb615a', borderColor: '#fb615a'}}>Снять роль администратора</button>
                        </section>
                    </div>
                </>
            )}
        />
    )
}
function ModalInfo({ info, setInfo }) {
    function infoGenerateTimeCharts(data, style) {
        let obj = []

        data[0].map((item, i) => {
            let name = i

            if(style === 'day') name = ("00" + i).slice(2)
            else if(style === 'week') {
                switch(i) {
                    case 0: {
                        name = 'ПН'
                        break
                    }
                    case 1: {
                        name = 'ВТ'
                        break
                    }
                    case 2: {
                        name = 'СР'
                        break
                    }
                    case 3: {
                        name = 'ЧТ'
                        break
                    }
                    case 4: {
                        name = 'ПТ'
                        break
                    }
                    case 5: {
                        name = 'СБ'
                        break
                    }
                    case 6: {
                        name = 'ВС'
                        break
                    }
                }
            }
            if(style === 'month') name = i + 1

            obj.push({ name: name, value: item, afk: data[1][i] })
        })
        return obj
    }
    
    return (
        <Modal
            onClose={() => setInfo({ ...info, toggle: false })}

            classes="adminlist_modal_info"
            styles={{width: "63%"}}

            title="Информация об администраторе"
            body={(
                <>
                    <div className="accountpage">
                        <div className="wrap">
                            <Avatar image={info.data.avatar.image} />
                            <section>
                                <h1>{info.data.login}</h1>
                                <span>#{info.data.uid}</span>
                                <span>{!info.data.afkStatus ? 'Не в афк' : 'АФК: ' + timeConvert(info.data.afkStatus)}</span>
                            </section>
                        </div>
                        <div className="wrap stats">
                            <section>
                                <h1>Роль:</h1>
                                <h2>
                                    <span className="adminRole" style={{background: info.data.role.color}}>{info.data.role.name}</span>
                                </h2>
                            </section>
                            <section>
                                <h1>Дата постановления:</h1>
                                <h2>{moment(info.data.dateAt).format('LLL')}</h2>
                            </section>
                            <section>
                                <h1>Дата повышения:</h1>
                                <h2>{!info.data.dateEdit ? 'Не повышался' : moment(info.data.dateEdit).format('LLL')}</h2>
                            </section>
                            <section>
                                <h1>Последний раз заходил:</h1>
                                <h2>{!info.data.status ? (<span className="onlineStatus online">Online</span>) : (
                                        moment(info.data.status).format('LLL')
                                    )}</h2>
                            </section>
                        </div>
                    </div>
                    <div className="stats">
                        <h6 className="more">
                            Онлайн
                            <Select onChange={item => setInfo({ ...info, select: { ...info.select, gameTime: item[0] } })} _type={info.select.gameTime} _list={[
                                [ 'day', 'За день' ],
                                [ 'week', 'За неделю' ],
                                [ 'month', 'За месяц' ]
                            ]} />
                        </h6>
                        <div className="wrap">
                            <section>
                                <h1>Отыгранное время:</h1>
                                <h2>{timeConvert(info.data.gameTime[info.select.gameTime].general)}</h2>
                            </section>
                            <section>
                                <h1>Из него АФК:</h1>
                                <h2>{timeConvert(info.data.gameTime[info.select.gameTime].generalAfk)}</h2>
                            </section>

                            <div className="chart" style={{display: info.select.gameTime !== 'day' ? 'none' : 'block'}}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={infoGenerateTimeCharts([info.data.gameTime.day.more, info.data.gameTime.day.afk], 'day')}>
                                        <XAxis dataKey="name"/>
                                        <YAxis unit="" tickFormatter={time => timeConvert(time, true)} />

                                        <Tooltip formatter={(value, name) => [ `${name}: ${timeConvert(value)}` ]} />
                                        <Legend />

                                        <Line type="monotone" dataKey="value" stroke="#8884d8" name='Время' />
                                        <Line type="monotone" dataKey="afk" stroke="#afafaf" name='AFK' />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="chart" style={{display: info.select.gameTime !== 'week' ? 'none' : 'block'}}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={infoGenerateTimeCharts([info.data.gameTime.week.more, info.data.gameTime.week.afk], 'week')}>
                                        <XAxis dataKey="name"/>
                                        <YAxis unit="" tickFormatter={time => timeConvert(time, true)} />

                                        <Tooltip formatter={(value, name) => [ `${name}: ${timeConvert(value)}` ]} />
                                        <Legend />

                                        <Line type="monotone" dataKey="value" stroke="#8884d8" name='Время' />
                                        <Line type="monotone" dataKey="afk" stroke="#afafaf" name='AFK' />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="chart" style={{display: info.select.gameTime !== 'month' ? 'none' : 'block'}}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={infoGenerateTimeCharts([info.data.gameTime.month.more, info.data.gameTime.month.afk], 'month')}>
                                        <XAxis dataKey="name"/>
                                        <YAxis unit="" tickFormatter={time => timeConvert(time, true)} />

                                        <Tooltip formatter={(value, name) => [ `${name}: ${timeConvert(value)}` ]} />
                                        <Legend />

                                        <Line type="monotone" dataKey="value" stroke="#8884d8" name='Время' />
                                        <Line type="monotone" dataKey="afk" stroke="#afafaf" name='AFK' />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="stats">
                        <h6 className="more">
                            Выполненная работа
                            <Select onChange={item => setInfo({ ...info, select: { ...info.select, work: item[0] } })} _type={info.select.work} _list={[
                                [ 'day', 'За день' ],
                                [ 'week', 'За неделю' ],
                                [ 'month', 'За месяц' ],
                                [ 'all', 'За все время' ]
                            ]} />
                        </h6>
                        <div className="wrap">
                            <section>
                                <h1>Закрыто тикетов:</h1>
                                <h2>{info.data.work[info.select.work][0].toLocaleString()} штук</h2>
                            </section>
                            <section>
                                <h1>Репутация:</h1>
                                <h2>{info.data.work[info.select.work][1].toLocaleString()}</h2>
                            </section>
                            <section>
                                <h1>Выдано мутов:</h1>
                                <h2>{info.data.work[info.select.work][2].toLocaleString()} чел.</h2>
                            </section>
                            <section>
                                <h1>Посажено в деморган:</h1>
                                <h2>{info.data.work[info.select.work][3].toLocaleString()} чел.</h2>
                            </section>
                            <section>
                                <h1>Посажено в тюрьму:</h1>
                                <h2>{info.data.work[info.select.work][4].toLocaleString()} чел.</h2>
                            </section>
                            <section>
                                <h1>Выдано предупреждений:</h1>
                                <h2>{info.data.work[info.select.work][5].toLocaleString()} чел.</h2>
                            </section>
                            <section>
                                <h1>Заблокировано:</h1>
                                <h2>{info.data.work[info.select.work][6].toLocaleString()} чел.</h2>
                            </section>
                        </div>
                    </div>
                </>
            )}
        />
    )
}