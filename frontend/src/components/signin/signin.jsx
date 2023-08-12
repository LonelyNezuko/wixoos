import React from 'react'
import $ from 'jquery'

import ragemp from '../../modules/ragemp'

import CircleLoader from '../_modules/circleLoader/circleLoader'

import './signin.scss'

import { FaUser } from 'react-icons/fa'
import { MdPassword } from 'react-icons/md'

import { RiUserAddFill } from 'react-icons/ri'
import { FaPassport } from 'react-icons/fa'
import { MdSecurity } from 'react-icons/md'
import { SiMaildotru } from 'react-icons/si'
import { FaHashtag } from 'react-icons/fa'
import func from '../../modules/func'

export default function Signin() {
    const [ toggle, setToggle ] = React.useState(false)
    const [ type, setType ] = React.useState('auth')

    const [ loader, setLoader ] = React.useState([ false, false ])

    function notf(type, where, message) {
        $('#signin').find(where).find('.notf').append(`<div class="${type}">${message}</div>`)

        const elem = $('#signin').find(where).find('.notf div:last-child')
        setTimeout(() => elem.addClass('show'), 50)

        setTimeout(() => {
            elem.removeClass('show')
            setTimeout(() => elem.remove(), 600)
        }, 5000)
    }

    function submit(type) {
        if(type === 'auth') {
            const
                login = $('#signin .auth #signinAuthLogin').val(),
                password = $('#signin .auth #signinAuthPassword').val(),

                remember = $('#signin .auth #signinAuthRemember').is(":checked")

            if(!login.length)return notf('error', '.auth', 'Для продолжения авторизации введите логин аккаунта')
            if(!password.length)return notf('error', '.auth', 'Для продолжения авторизации введите пароль от аккаунта')

            setLoader([ true, false ])
            ragemp.send('server::signin:submit:auth', { login, password, remember })
        }
        else if(type === 'registry') {
            const
                login = $('#signin .registry #signinRegistryLogin').val(),
                password = $('#signin .registry #signinRegistryPassword').val(),
                passwordRe = $('#signin .registry #signinRegistryPasswordRe').val(),
                email = $('#signin .registry #signinRegistryMail').val(),
                promo = $('#signin .registry #signinRegistryPromo').val(),

                remember = $('#signin .registry #signinRegistryRemember').is(":checked")
            
            if(!login.length)return notf('error', '.registry', 'Для продолжения регистрации придумайте логин аккаунта')
            if(!password.length)return notf('error', '.registry', 'Для продолжения регистрации придумайте пароль от аккаунта')
            if(!passwordRe.length)return notf('error', '.registry', 'Для продолжения регистрации повторите пароль от аккаунта')
            if(!email.length)return notf('error', '.registry', 'Для продолжения регистрации укажите свою почту')

            if(!func.validatePassword(password))return notf('error', '.registry', 'Ошибка проверки пароля: <br /><span>Длина пароля должна быть от 4, до 64 символов</span><br /><span>В пароле не должно быть латиницы</span>')
            if(password !== passwordRe)return notf('error', '.registry', 'Введенные пароли не совпадают с друг-другом')
            if(!func.validateEmail(email))return notf('error', '.registry', 'Ошибка проверки почты: <br /><span>Пример: mail@domen.com</span><br /><span>Длина почты (без домена) не меньше 4х символов</span>')

            setLoader([ false, true ])
            ragemp.send('server::signin:submit:registry', { login, password, email, remember })
        }
    }
    React.useEffect(() => {
		ragemp.eventCreate('signin', (type, data) => {
            setLoader([ false, false ])

			switch(type) {
				case 'toggle': {
					setToggle(data.status)
					break
				}
				case 'setType': {
					setType(data.type)
					break
				}
				case 'notf': {
					notf(data.type, data.where, data.message)
					break
				}
				case 'setData': {
					$('#signin .auth #signinAuthLogin').val(data.login)
					$('#signin .auth #signinAuthPassword').val(data.password)
					$('#signin .auth #signinAuthRemember').prop('checked', true)
					break
				}
			}
		})
	}, [])

    return (
        <div id="signin" style={{display: !toggle ? 'none' : 'block'}}>
            <div className="pageWrapper">
                <div onClick={() => {
                    if(!loader[0] && !loader[1]) setType('auth')
                }} className={`page auth ${type === 'auth' ? 'selected' : ''}`}
                    style={{backgroundImage: 'url(assets/signin/authbg.jpg)', transform: type === 'registry' ? 'translateX(-23%)' : 'none'}}>
                    <div className="blackbg"></div>
                    <div className="blackbg2"></div>

                    <div className="wrapper">
                        <div className="body">
                            <div className="logo">
                                <img src="assets/logo/full.png" />
                            </div>
                            <div className="desc">Интересный факт: <br/>Если капибара чем-то недовольна, то она издаёт звуки, похожие на тявканье, но гораздо тише, чем у собак</div>
                            <div className="form">
                                <div className="input">
                                    <input disabled={loader[0]} id="signinAuthLogin" type="text" placeholder="Логин Вашего аккаунта *" autoComplete='off' />
                                    <FaUser />
                                </div>
                                <div className="input">
                                    <input disabled={loader[0]} id="signinAuthPassword" type="password" placeholder="Пароль от Вашего аккаунта *" autoComplete='off' />
                                    <MdPassword />
                                </div>
                                <div className="other">
                                    <div className="input">
                                        <input disabled={loader[0]} id="signinAuthRemember" type="checkbox" />
                                        <label htmlFor="signinAuthRemember">Запомнить меня</label>
                                    </div>
                                </div>
                            </div>
                            <div className="action">
                                <div className="help">
                                    <button>Я не помню пароль от аккаунта</button>
                                    <button>Я не помню логин аккаунта</button>
                                </div>
                                {loader[0] ? (
                                    <div className="btn disabled loader">
                                        <CircleLoader />
                                    </div>
                                ) : <div className={`btn ${loader[1] ? 'disabled' : ''}`} onClick={() => submit('auth')}>ВОЙТИ В АККАУНТ</div>}
                            </div>
                        </div>
                    </div>

                    <div className="notf"></div>
                </div>
                <div onClick={() => {
                    if(!loader[0] && !loader[1]) setType('registry')
                }} className={`page registry ${type === 'registry' ? 'selected' : ''}`} style={{backgroundImage: 'url(assets/signin/registrybg.jpg)'}}>
                    <div className="blackbg"></div>
                    <div className="blackbg2"></div>

                    <div className="wrapper">
                        <div className="body">
                            <div className="logo">
                                <img src="assets/logo/full.png" />
                            </div>
                            <div className="desc">Представьте, что за мир скрыт за этой манящей кнопкой.<br/>Не попробуешь - не узнаешь!</div>
                            <div className="form">
                                <div className="input">
                                    <input disabled={loader[1]} id="signinRegistryLogin" type="text" placeholder="Придумайте логин аккаунта *" autoComplete='off' />
                                    <RiUserAddFill />
                                </div>
                                <div className="input">
                                    <input disabled={loader[1]} id="signinRegistryPassword" type="password" placeholder="Придумайте пароль для аккаунта *" autoComplete='off' />
                                    <FaPassport />
                                </div>
                                <div className="input">
                                    <input disabled={loader[1]} id="signinRegistryPasswordRe" type="password" placeholder="Повторите пароль для безопасности *" autoComplete='off' />
                                    <MdSecurity />
                                </div>
                                <div className="input">
                                    <input disabled={loader[1]} id="signinRegistryMail" type="text" placeholder="Укажите свою почту *" autocomplete='off' />
                                    <SiMaildotru />
                                </div>
                                <div className="input">
                                    <input disabled={loader[1]} id="signinRegistryPromo" type="text" placeholder="Есть промокод?" autocomplete='off' />
                                    <FaHashtag />
                                </div>
                                <div className="other">
                                    <div className="input">
                                        <input disabled={loader[1]} id="signinRegistryRemember" type="checkbox" />
                                        <label htmlFor="signinRegistryRemember">Запомнить меня</label>
                                    </div>
                                </div>
                            </div>
                            <div className="action">
                                {loader[1] ? (
                                    <div className="btn disabled loader">
                                        <CircleLoader />
                                    </div>
                                ) : <div className={`btn ${loader[0] ? 'disabled' : ''}`} onClick={() => submit('registry')}>НАЧАТЬ НОВУЮ ЖИЗНЬ</div>}
                            </div>
                        </div>
                    </div>

                    <div className="notf"></div>

                    {/* загрушка чтоб полосы на стыке слоев не было */}
                    <div className="sd">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem voluptatum eligendi consequatur reiciendis exercitationem nisi ad atque, doloribus tempore labore animi consequuntur! Eius ipsam fuga explicabo repellendus voluptas accusantium provident.</div>
                </div>
            </div>
        </div>
    )
}