import React from 'react'

import $ from 'jquery'
import 'jquery.scrollto'

import ragemp from '../../../modules/ragemp'

import moment from 'moment'
import 'moment/locale/ru'

import Avatar from '../../_modules/avatar/avatar'
import timeConvert from '../../../modules/timeConvert'
import { Stickers, StickersRenderMessage, stickerRegExp } from '../../_modules/stikers/stickers'

import './tickets.scss'

import { MdSupportAgent } from 'react-icons/md'
import { HiDotsVertical } from 'react-icons/hi'

export default function Tickets({ accountData }) {
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
        }, adminName: 'LonelyNezuko', messages: [
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
        }, adminName: '', messages: [
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
        ragemp.eventCreate('menu:tickets', (cmd, data) => {
            switch(cmd) {
                case 'updateTickets': {
                    setTickets(data)
                    break
                }
            }
        })
    }, [])
    React.useEffect(() => {
        if(ticketSelect !== -1) {
            const ticket = tickets[ticketSelect]
            if(!ticket || !ticket.id || !ticket.messages)return

            const messagesBody = $('#menu #tickets .messages')
            const height = messagesBody[0].scrollHeight - messagesBody.outerHeight()
            const scroll = messagesBody.scrollTop()

            messagesBody.scrollTo(messagesBody.find('.message:last-child'))
        }
    }, [ticketSelect, [tickets.messages]])

    return (
        <div className="tickets" id="tickets">
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
                            <div className="sender">{!item.adminName.length ? 'Администратор еще взялся за Ваш тикет' : `Администратор: ${item.adminName}`}</div>
                            <div className={`lastmessage ${lastmessage.views.indexOf(accountData.uid) === -1 && 'new'}`}>
                                {lastmessage.text.match(stickerRegExp) ? (
                                    <span style={{color: '#ed6b9a'}}>Стикер</span>
                                ) : lastmessage.text.length > 50 ? lastmessage.text.substring(0, 50) + '...' : lastmessage.text}
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
                            <span>Выберите нужный тикет</span>
                        </div>
                    </div>
                ) : (
                    <div className="wrapper">
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
                        <div className='form'>
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