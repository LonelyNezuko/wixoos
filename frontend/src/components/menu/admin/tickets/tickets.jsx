import React from 'react'

import $ from 'jquery'
import 'jquery.scrollto'

import ragemp from '../../../../modules/ragemp'

import moment from 'moment'
import 'moment/locale/ru'

import Avatar from '../../../_modules/avatar/avatar'
import timeConvert from '../../../../modules/timeConvert'
import { Stickers, StickersRenderMessage, stickerRegExp } from '../../../_modules/stikers/stickers'

// import './tickets.scss'

import { MdSupportAgent } from 'react-icons/md'
import { HiDotsVertical } from 'react-icons/hi'

export default function AdminTickets({ accountData }) {
    const [ tickets, setTickets ] = React.useState([
        { id: 123512, owner: {
            id: -1,

            name: 'Nezuko Kamado',
            cid: 5920,

            login: 'MyAngelNezuko',
            uid: 295,

            fraction: 'Не состоит',
            job: 'Лесоруб (1 ур.)',
            family: 'Kamado',

            mute: 283,
            jail: 0,
            warns: 1,

            avatar: {
                image: 'https://phonoteka.org/uploads/posts/2023-03/1680058913_phonoteka-org-p-nedzuko-kamado-art-pinterest-74.jpg'
            }
        }, messages: [
            { text: 'Nezuko Kamado открыл тикет #123512', sender: 'system', date: new Date() },
            { text: 'Помогите, у меня в ванной крокодил', sender: {
                name: 'Nezuko Kamado',
                cid: 5920,

                login: 'MyAngelNezuko',
                uid: 295,

                avatar: {
                    image: 'https://phonoteka.org/uploads/posts/2023-03/1680058913_phonoteka-org-p-nedzuko-kamado-art-pinterest-74.jpg'
                }
            }, date: new Date(), views: [ 295, 1 ] },
            { text: 'Уже лечу на помощь', sender: {
                name: 'Nezuko Kun',
                cid: 5,

                login: 'LonelyNezuko',
                uid: 1,

                avatar: {
                    image: 'https://gas-kvas.com/uploads/posts/2023-01/1673348613_gas-kvas-com-p-nazuko-anime-risunki-37.jpg'
                }
            }, date: new Date(), views: [ 1, 295 ] },
            { text: 'Уже лечу на помощь', sender: {
                name: 'Nezuko Kun',
                cid: 5,

                login: 'dasda',
                uid: 23,

                avatar: {
                    image: 'https://phonoteka.org/uploads/posts/2022-09/1663430180_37-phonoteka-org-p-zenitsu-art-oboi-pinterest-51.jpg'
                }
            }, date: new Date(), views: [ 1, 295 ] },
            { text: 'Администратор LonelyNezuko телепортировался к Nezuko Kamado', sender: 'system', date: new Date() },
            { text: 'Администратор LonelyNezuko закрыл тикет #123512', sender: 'system', date: new Date() },
            { text: '[stk:paimon_timetoeat.webp]', sender: {
                name: 'Nezuko Kun',
                cid: 5920,

                login: 'dasda',
                uid: 295,

                avatar: {
                    image: 'https://phonoteka.org/uploads/posts/2022-09/1663430180_37-phonoteka-org-p-zenitsu-art-oboi-pinterest-51.jpg'
                }
            }, date: new Date(), views: [ 1, 295 ] },
        ] },
        { id: 123512, owner: {
            id: -1,

            name: 'Nezuko Kun',
            cid: 5920,

            login: 'MyAngelNezuko',
            uid: 295,

            fraction: 'Не состоит',
            job: 'Лесоруб (2 ур.)',
            family: 'Kamado',

            mute: 283,
            jail: 0,
            warns: 1,

            avatar: {
                image: 'https://phonoteka.org/uploads/posts/2023-03/1680058913_phonoteka-org-p-nedzuko-kamado-art-pinterest-74.jpg'
            }
        }, messages: [
            { text: 'Nezuko Kamado открыл тикет #123512', sender: 'system', date: new Date() },
            { text: 'Помогите, у меня в ванной крокодил', sender: {
                name: 'Nezuko Kamado',
                cid: 5920,

                login: 'MyAngelNezuko',
                uid: 295,

                avatar: {
                    image: 'https://phonoteka.org/uploads/posts/2023-03/1680058913_phonoteka-org-p-nedzuko-kamado-art-pinterest-74.jpg'
                }
            }, date: new Date(), views: [ 295 ] }
        ] }
    ])
    const [ ticketSelect, setTicketSelect ] = React.useState(-1)

    const [ helpToggle, setHelpToggle ] = React.useState(false)
    const [ actionToggle, setActionToggle ] = React.useState(false)

    const [ helpList, setHelpList ] = React.useState([
        { hash: "help", name: "Сейчас помогу", text: "Сейчас Вам помогу, ожидайте." },
        { hash: "wait", name: "Подождите", text: "Пожалуйста подождите, проверяю информацию..." },
        { hash: "notviolate", name: "Игрок не нарушает", text: "Игрок, на которого Вы жалуетесь не нарушает." },
        { hash: "punished", name: "Наказал нарушителя", text: "Игрок, на которого Вы пожаловались был наказан." },
        { hash: "rejoin", name: "Перезайдите", text: "Попробуйте перезайти на сервер и/или в игру." },
        { hash: "gg", name: "Приятной игры", text: "Приятной игры на Wixoos :)" },

        { hash: "privet", name: "Привет", text: "Приветствую! Начинаю работать по Вашему тикету.", custom: true },
        { hash: "poka", name: "Пока", text: "Закрываю Ваш тикет.", custom: true }
    ])
    const [ actionList, setActionList ] = React.useState([
        { hash: "spectate", name: "Следить за игроком" },
        { hash: "spectateintruder", name: "Следить за нарушителем" },
        { hash: "goto", name: "Телепортироваться к игроку" },
        { hash: "gethere", name: "Телепортировать игрока к себе" },
        { hash: "plveh", name: "Выдать транспорт" },
        { hash: "slap", name: "Подкинуть игрока" },
        { hash: "changeticketadmin", name: "Передать тикет другому администратору", color: "#e0473f" },
        { hash: "closeticket", name: "Закрыть тикет", color: "#e0473f" }
    ])


    function onMessageSubmit(message, target = accountData) {
        if(!message.length)return false

        const ticketid = ticketSelect
        if(ticketid === -1 || !tickets[ticketid] || !tickets[ticketid].id)return

        setTickets(old => {
            const ticket = old[ticketid]
            ticket.messages.push({
                text: message, sender: {
                    name: target.name,
                    cid: target.cid,
    
                    login: target.login,
                    uid: target.uid,
    
                    avatar: target.avatar
                }, date: new Date(), views: [ target.uid ]
            })

            old[ticketid] = ticket
            return [...old]
        })
    }


    React.useMemo(() => {
        ragemp.eventCreate('admin:tickets', (cmd, data) => {
            switch(cmd) {
                case 'updateTickets': {
                    setTickets(data)
                    break
                }
                case 'updateHelpList': {
                    setHelpList(data)
                    break
                }
                case 'updateActionList': {
                    setActionList(data)
                    break
                }
            }
        })
    }, [])
    React.useEffect(() => {
        if(ticketSelect !== -1) {
            const ticket = tickets[ticketSelect]
            if(!ticket || !ticket.id || !ticket.messages)return

            const messagesBody = $('#admin .tickets .messages')
            const height = messagesBody[0].scrollHeight - messagesBody.outerHeight()
            const scroll = messagesBody.scrollTop()

            messagesBody.scrollTo(messagesBody.find('.message:last-child'))
        }
    }, [ticketSelect, [tickets.messages], actionToggle, helpToggle])

    return (
        <div className="tickets">
            <div className="list">
                {tickets.map((item, i) => {
                    let lastmessage = {}
                    let firstmessage = {}

                    firstmessage = item.messages.find(f => f.sender !== 'system')

                    let tmp = [...item.messages]
                    lastmessage = tmp.reverse().find(f => f.sender !== 'system')

                    return (
                        <section key={i} onClick={() => setTicketSelect(i)} className={`elem ${ticketSelect === i && 'selected'}`}>
                            <div className="title">
                                Тикет #{item.id}
                                <span>{moment(item.date).format('HH:mm')}</span>
                            </div>
                            <div className="sender">от {firstmessage.sender.name}</div>
                            <div className={`lastmessage ${lastmessage.views.indexOf(accountData.uid) === -1 && 'new'}`}>
                                {lastmessage.text.match(stickerRegExp) ? (
                                    <span style={{color: '#ed6b9a'}}>Стикер</span>
                                ) : lastmessage.text.length > 35 ? lastmessage.text.substring(0, 35) + '...' : lastmessage.text}
                            </div>
                        </section>
                    )
                })}
            </div>
            <div className="chat">
                {ticketSelect === -1 ? (
                    <div className="noselected">
                        <div className="wrap">
                            <MdSupportAgent />
                            <span>Для дальнейшей работы выберите доступный тикет</span>
                        </div>
                    </div>
                ) : (
                    <div className="wrapper">
                        <div className="account">
                            <div className="main">
                                <Avatar image={tickets[ticketSelect].owner.avatar.image} />
                                <h1>
                                    {tickets[ticketSelect].owner.name}
                                    {tickets[ticketSelect].owner.id === -1 ? (<span className="onlineStatus">Offline</span>) : (<span className="onlineStatus online">Online</span>)}
                                </h1>
                            </div>
                            <div className="info">
                                <section>
                                    <h1>CID:</h1>
                                    <span>{tickets[ticketSelect].owner.cid}</span>
                                </section>
                                <section>
                                    <h1>Account:</h1>
                                    <span>{tickets[ticketSelect].owner.login}</span>
                                </section>
                                <section>
                                    <h1>UID:</h1>
                                    <span>{tickets[ticketSelect].owner.uid}</span>
                                </section>
                            </div>
                            <div className="info">
                                <section>
                                    <h1>Fraction:</h1>
                                    <span>{tickets[ticketSelect].owner.fraction}</span>
                                </section>
                                <section>
                                    <h1>Job:</h1>
                                    <span>{tickets[ticketSelect].owner.job}</span>
                                </section>
                                <section>
                                    <h1>Family:</h1>
                                    <span>{tickets[ticketSelect].owner.family}</span>
                                </section>
                            </div>
                            <div className="info">
                                <section>
                                    <h1>Mute:</h1>
                                    <span>{!tickets[ticketSelect].owner.mute ? 'Нет' : timeConvert(tickets[ticketSelect].owner.mute)}</span>
                                </section>
                                <section>
                                    <h1>Jail:</h1>
                                    <span>{!tickets[ticketSelect].owner.jail ? 'Нет' : timeConvert(tickets[ticketSelect].owner.jail)}</span>
                                </section>
                                <section>
                                    <h1>Warns:</h1>
                                    <span>{tickets[ticketSelect].owner.warns} / 4</span>
                                </section>
                            </div>
                            <div className="other">
                                <button>
                                    <HiDotsVertical />
                                </button>
                            </div>
                        </div>
                        <div className="messages">
                            {tickets[ticketSelect].messages.map((item, i) => {
                                if(item.sender === 'system')return (
                                    <div key={i} className="message system">
                                        <span>{item.text}</span>
                                    </div>
                                )
                                return (
                                    <div key={i} className={`message ${item.sender.uid !== tickets[ticketSelect].owner.uid && 'reverse'}`}>
                                        <div className="info">
                                            <div className="time">{moment(item.date).calendar({
                                                sameDay: 'HH:mm',
                                                sameElse: 'Do MMM'
                                            })}</div>
                                            <Avatar image={
                                                item.sender.uid === accountData.uid ? accountData.avatar.image
                                                : item.sender.uid === tickets[ticketSelect].owner.uid ? tickets[ticketSelect].owner.avatar.image
                                                : item.sender.avatar.image} />
                                        </div>
                                        <div className="text">
                                            <RenderText text={item.text} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {helpToggle ? (
                            <div className="help">
                                {helpList.map((item, i) => {
                                    return (<div onClick={elem => onMessageSubmit(item.text)} key={i} className={`btn ${item.custom && 'selected'} hover`} data-hash={item.hash} data-text={item.text}>{item.name}</div>)    
                                })}
                            </div>
                        ) : ''}
                        {actionToggle ? (
                            <div className="help">
                                {actionList.map((item, i) => {
                                    return (<div onClick={() => ragemp.send('server::admin:tickets:action', { hash: item.hash })} key={i} className={`btn`} style={{background: item.color || ""}} data-hash={item.hash}>{item.name}</div>)    
                                })}
                            </div>
                        ) : ''}
                        <div className={`form ${(actionToggle || helpToggle) && 'helper'}`}>
                            <div onClick={() => { setHelpToggle(!helpToggle); setActionToggle(false) }}  className={`btn ${helpToggle && 'selected'}`}>Фразы</div>
                            <div onClick={() => { setActionToggle(!actionToggle); setHelpToggle(false) }} className={`btn ${actionToggle && 'selected'}`}>Действия</div>
                            <input onKeyDown={event => {
                                if(event.key === 'Enter') {
                                    event.preventDefault()
                                    onMessageSubmit(event.target.value)

                                    event.target.value = ""
                                }
                            }} type="text" placeholder="Напишите ответ" maxLength={255} />
                            <Stickers onStickerClick={path => {
                                onMessageSubmit(path)
                            }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function RenderText({ text }) {
    if(text.match(stickerRegExp))return (<StickersRenderMessage stickerpath={text} />)
    return (
        <>{text}</>
    )
}