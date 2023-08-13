import React from 'react'
import $ from 'jquery'
import ragemp from '../../../modules/ragemp'

import { InventoryRenderItem } from '../inventory/Inventory'

import './quests.scss'

import { IoMdStar } from 'react-icons/io'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { HiDotsHorizontal } from 'react-icons/hi'

export default function Shop({ bodyNav, openBodyNav }) {
	const [ quests, setQuests ] = React.useState([
		[ // активные
			{ id: 1, name: 'Новая жизнь', desc: 'Очнувшись в незнакомом для меня месте и ничего не помня о том, что было ранее в моей жизни, меня встретил валонтер, Майкл.<br />Приняв меня за бездомного, он предложил мне помощь, в которой я не смог отказать. Хотя может я и есть бездномный, кто знает...<br /><br />Дав не много средств на первое время он отправил меня в различные места, дабы я начал приспосабливаться к обществу и все же вспомнил о своей жизни.<br /><br />Так начинается мой путь становления собой...',
			tasks: [
				{ status: 'completed', name: 'С первым автобусом отправиться в мэрию и восстановить документы' },
				{ status: 'completed', name: 'После мэрии добраться до биржи труда и устроиться на работу' },
				{ status: 'completed', name: 'Заработать 1.000$ на выбранной работе' },
				{ status: 'inprocess', name: 'Добраться до магазина 24.7 и приобрести там телефон' },
				{ status: '', name: 'Отправиться в магазин одежды и прикупить новой одежды' },
				{ status: '', name: 'Вернуться к Майклу и узнать, что делать дальше' },
			], rewards: [
				{ name: 'cash', weight: 0.0001, img: 'cash.png', count: 2500, status: 100, type: 'cash' }
			], traking: true },
			{ id: 1, name: 'Опять мусорки', desc: 'Очнувшись в незнакомом для меня месте и ничего не помня о том, что было ранее в моей жизни, меня встретил валонтер, Майкл.<br />Приняв меня за бездомного, он предложил мне помощь, в которой я не смог отказать. Хотя может я и есть бездномный, кто знает...<br /><br />Дав не много средств на первое время он отправил меня в различные места, дабы я начал приспосабливаться к обществу и все же вспомнил о своей жизни.<br /><br />Так начинается мой путь становления собой...',
			tasks: [
				{ status: 'inprocess', name: 'Найти в мусорке какой-либо предмет' }
			], rewards: [
				{ name: 'cash', weight: 0.0001, img: 'cash.png', count: 500, status: 100, type: 'cash' }
			], traking: false }
		],
		[ // ежедневные
			{ id: 1, name: 'Опять мусорки', desc: 'Очнувшись в незнакомом для меня месте и ничего не помня о том, что было ранее в моей жизни, меня встретил валонтер, Майкл.<br />Приняв меня за бездомного, он предложил мне помощь, в которой я не смог отказать. Хотя может я и есть бездномный, кто знает...<br /><br />Дав не много средств на первое время он отправил меня в различные места, дабы я начал приспосабливаться к обществу и все же вспомнил о своей жизни.<br /><br />Так начинается мой путь становления собой...',
			tasks: [
				{ status: 'inprocess', name: 'Найти в мусорке какой-либо предмет' }
			], rewards: [
				{ name: 'cash', weight: 0.0001, img: 'cash.png', count: 500, status: 100, type: 'cash' }
			], traking: false }
		],
		[]
	])
	const [ select, setSelect ] = React.useState(0)

	function getProgress(quest) {
		let count = 0
		quest.tasks.map(item => {
			if(item.status === 'completed') count ++
		})

		return (count * 100 / quest.tasks.length)
	}
	function getInProcessTask(quest) {
		return quest.tasks.find(el => el.status === 'inprocess')
	}


	React.useMemo(() => {
		ragemp.eventCreate('menu:quests', (cmd, data) => {
			switch(cmd) {
				case 'setQuests': {
					setQuests(data)
					break
				}
			}
		})
	}, [])

	const bodyNavIndex = { actives: 0, dailys: 1, completed: 2 }
	return (
		<div className="menuQuests">
			{!quests[bodyNavIndex[bodyNav]].length ? (
				<h6 className="menu-body-notfound">
					<span>У Вас нет {bodyNav === 'actives' ? 'активных' : bodyNav === 'dailys' ? 'ежедневных' : bodyNav === 'completed' ? 'завершенных' : ''} заданий</span>
				</h6>
			) : (
				<div className="menuQuests-body">
					<div className="list">
						{quests[bodyNavIndex[bodyNav]].map((item, i) => {
							return (
								<div onClick={() => setSelect(i)} key={i} className={`elem ${select === i ? 'selected' : ''}`}>
									<div className="header">
										{item.traking ? (
											<div className="star">
												<IoMdStar />
											</div>
										) : ''}
										<div className="title">{item.name}</div>
									</div>
									<div className="progress">
										<div style={{width: getProgress(item) + '%'}}></div>
									</div>
									<div className="task">{!getInProcessTask(item) ? 'Нет активного задания' : getInProcessTask(item).name}</div>
								</div>
							)
						})}
					</div>
					<div className="info">
						<div className="header">
							{quests[bodyNavIndex[bodyNav]][select].traking ? (
								<div className="star">
									<IoMdStar />
								</div>
							) : ''}
							<div className="title">{quests[bodyNavIndex[bodyNav]][select].name}</div>
						</div>
						<div className="progress">
							<div style={{width: getProgress(quests[bodyNavIndex[bodyNav]][select]) + '%'}}></div>
						</div>
						<div className="desc" dangerouslySetInnerHTML={{__html: quests[bodyNavIndex[bodyNav]][select].desc}}></div>
						<div className="tasks">
							{quests[bodyNavIndex[bodyNav]][select].tasks.map((item, i) => {							
								if(!item.status)return (<></>)
								return (
									<section key={i} className={item.status}>
										<div className="status">
											{item.status === 'completed' ? (<IoCheckmarkCircle />) : (<HiDotsHorizontal />)}
										</div>
										<h1>{item.name}</h1>
									</section>
								)
							})}
						</div>
						<div className="rewards">
							<h1 className="title">Награда:</h1>
							<section className="items">
								{quests[bodyNavIndex[bodyNav]][select].rewards.map((item, i) => {
									return (<InventoryRenderItem key={i} item={item} />)
								})}
							</section>
						</div>
						<div className={`traking ${quests[bodyNavIndex[bodyNav]][select].traking ? 'on' : ''}`}>
							<button onClick={() => ragemp.send('server::quests:traking', { id: quests[bodyNavIndex[bodyNav]][select].id })} className="btn">{quests[bodyNavIndex[bodyNav]][select].traking ? 'Отслеживается' : 'Отслеживать'}</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}