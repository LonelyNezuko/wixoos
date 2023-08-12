import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import * as moment from 'moment'
import 'moment/locale/ru';

import Avatar from '../_modules/avatar/avatar';
import timeConvert from '../../modules/timeConvert';

import { Inventory } from './inventory/Inventory'
import Tickets from './tickets/tickets'
import Quests from './quests/Quests'
import Info from './info/Info'
import Settings from './settings/Settings'
import Shop from './shop/Shop'
import Admin from './admin/admin';

import { ImStatsBars } from 'react-icons/im'
import { MdInventory } from 'react-icons/md'
import { FaTasks } from 'react-icons/fa'
import { MdReportProblem } from 'react-icons/md'
import { RiShoppingCart2Fill } from 'react-icons/ri'
import { GoOrganization } from 'react-icons/go'
import { MdFamilyRestroom } from 'react-icons/md'
import { MdSettings } from 'react-icons/md'
import { MdAdminPanelSettings } from 'react-icons/md'

import { MdOutlineAttachMoney } from 'react-icons/md'
import { RiBankCardLine } from 'react-icons/ri'

import './menu.scss'

export default function Menu() {
	const [ accountData, setAccountData ] = React.useState({
		login: 'LonelyNezuko',

		uid: 1,
		cid: 2,

		char: {
			cash: [ 25231311, 351322 ],

			fraction: undefined,
			family: undefined
		},
		
		avatar: {
            image: 'https://gas-kvas.com/uploads/posts/2023-01/1673348613_gas-kvas-com-p-nazuko-anime-risunki-37.jpg'
        },

		googleAuth: false,
		email: 'test@mail.ru',
		onlySCID: false,

		donate: 7582938273,

		admin: {
			role: {
				tag: 'developer',
				color: '#f23a3a',
				name: 'Руководство'
			}
		},
		playedTime: [ 2312312, 293582 ]
	})

	const [ headerNav, setHeaderNav ] = React.useState(4)
	const [ bodyNav, setBodyNav ] = React.useState(4)

	const [ bodyNavList, setBodyNavList ] = React.useState([
		[], [], [], [], [], [], [], [], [],
	])
	const [ headerNavList, setHeaderNavList ] = React.useState([])

	function updateBodyNavList() {
		setBodyNavList([
			[
				[ 'Аккаунт' ],
				[ 'Персонаж' ],
				[ 'История пополнений' ],
				[ 'История наказаний' ],
				[ 'Имущество', false ],
			],
			[],
			[
				[ 'Активные' ],
				[ 'Ежедневные' ],
				[ 'Завершенные' ],
			],
			[],
			[
				[ 'Валюта', false ],
				[ 'VIP статус', false ],
				[ 'Транспорт', false ],
				[ 'Одежда', false ],
				[ 'Рулетка' ],
				[ 'inventory', true, true ],
				[ 'deposithistory', true, true ],
			],
			[],
			[],
			[
				[ 'Панель жалоб' ],
				[ 'Список админов' ],
				[ 'Настройки админки', false ]
			],
			[
				[ 'Игра', false ],
				[ 'Безопасность' ],
				[ 'Чат' ],
				[ 'Клавиши' ],
				[ 'Прицел', false ]
			],
		])
	}
	function updateHeaderNavList() {
		setHeaderNavList([
			[ (<ImStatsBars />), 'Информация' ],
			[ (<MdInventory />), 'Инвентарь' ],
			[ (<FaTasks />), 'Задания' ],
			[ (<MdReportProblem />), 'Жалобы' ],
			[ (<RiShoppingCart2Fill />), 'Магазин' ],
			[ (<GoOrganization />), 'Фракция', !accountData.char.fraction ? false : true ],
			[ (<MdFamilyRestroom />), 'Семья', !accountData.char.family ? false : true ],
			[ (<MdAdminPanelSettings />), 'Админка', !accountData.admin ? false : true ],
			[ (<MdSettings />), 'Настройки' ],
		])
	}

	React.useEffect(() => {
		updateHeaderNavList()
		updateBodyNavList()
	}, [accountData])


	function toggle(toggle) {
		if(!toggle) $('.menu').css('display', 'none')
		else $('.menu').css('display', 'flex')
	}

	function openHeaderNav(id) {
		if(headerNavList[id][2] === false)return
		ragemp.send('server::menu:openHeaderNav', { id })
		setHeaderNav(id)
		setBodyNav(0)
	}
	function openBodyNav(id) {
		if(bodyNavList[headerNav][id][1] === false)return
		ragemp.send('server::menu:openBodyNav', { headerNav: headerNav, id })
		setBodyNav(id)
	}



	React.useEffect(() => {
		ragemp.eventCreate('menu', (cmd, data) => {
			switch(cmd) {
				case 'toggle': {
					toggle(data.status)

					if(data.accountData) setAccountData(data.accountData)

					break
				}
				case 'setHeaderNav': {
					setHeaderNav(data.id)
					break
				}
				case 'setBodyNav': {
					setBodyNav(data.id)
					break
				}
			}
		})

		// Закрытие
		$('body').keydown(e =>
		{
			if($('.menu').css('display') !== 'none'
				&& e.keyCode === 27) {
				e.preventDefault()

				toggle(false)
				ragemp.send('server::menu:close', {}, true)
			}
		})
	}, [])

	return (
		<div id="menu" style={{display: 'flex'}}>
			<section className="menu-wrap">
				<div className="menu-header">
					<div className="menu-header-title">
						<div className="menu-header-title-nav">
							{headerNavList.map((item, i) => {
								return (<section onClick={() => openHeaderNav(i)} className={`${headerNav === i && 'menu-header-title-nav-sel'} ${item[2] === false && 'menu-header-title-nav-block'}`}>
									{item[0]}
									<span>{item[1]}</span>
								</section>)
							})}
						</div>
					</div>
					<div className="menu-header-char">
						<div className="menu-header-char-info">
							<h1>{accountData.login}</h1>
							<h2>#{accountData.uid} (CID: {accountData.cid})</h2>
							<h3>
								<span>
									<MdOutlineAttachMoney />
									{accountData.char.cash[0].toLocaleString()}
								</span>
								<span>
									<RiBankCardLine />
									{accountData.char.cash[1].toLocaleString()}
								</span>
							</h3>
						</div>
						<Avatar type="medium" image={accountData.avatar.image} />
					</div>
				</div>
				<div className={`menu-body ${JSON.stringify(bodyNavList[headerNav]) !== '[]' ? 'menu-body-choice' : ''}`}>
					<div className="menu-body-nav" style={JSON.stringify(bodyNavList[headerNav]) === '[]' ? {display: 'none'} : {display: 'block'}}>
						{(accountData.admin && headerNav === 7) ? (
							<div className="bodynavadmin">
								<div className="logo">
									<img src="assets/menu/admin/logo.png" />
								</div>
								<div className="info">
									<h1 className="login">{accountData.login} (ID: {accountData.uid})</h1>
									<span className="adminRole" style={{background: accountData.admin.role.color}}>{accountData.admin.role.name}</span>
									<div className="other">
										<span>{timeConvert(accountData.playedTime[0])} ({timeConvert(accountData.playedTime[1])})</span>
									</div>
								</div>
							</div>
						) : ''}

						{bodyNavList[headerNav].map((item, i) => {
							if(item[2])return (<></>)
							return (<h1 onClick={() => openBodyNav(i)} className={`${i === bodyNav && 'menu-body-nav-sel'} ${item[1] === false && 'menu-body-nav-block'}`} key={i}>{item[0]}</h1>)
						})}
					</div>


					{/* Pages */}
					<div className="menu-body-wrap" style={headerNav === 0 ? {overflow: 'visible'} : {}}>
						{headerNav === 0 ? (<Info />) : ''}
						{headerNav === 1 ? (<Inventory />) : ''}
						{headerNav === 2 ? (<Quests bodyNav={bodyNav} openBodyNav={openBodyNav} />) : ''}
						{headerNav === 3 ? (<Tickets accountData={accountData} />) : ''}
						{headerNav === 4 ? (<Shop accountData={accountData} bodyNav={bodyNav} openBodyNav={openBodyNav} />) : ''}
						{headerNav === 7 ? (<Admin accountData={accountData} bodyNav={bodyNav} openBodyNav={openBodyNav} />) : ''}
						{headerNav === 8 ? (<Settings accountData={accountData} bodyNav={bodyNav} />) : ''}
					</div>
				</div>
			</section>
		</div>
	)
}
