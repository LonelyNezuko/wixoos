import React from 'react'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui"
import 'jquery.scrollto'
import ragemp from '../../../modules/ragemp'

import './inventory.scss'

import InventoryContext from './context'

import { GiTopHat } from 'react-icons/gi'
import { IoMdGlasses } from 'react-icons/io'
import { IoEarSharp } from 'react-icons/io5'
import { IoWatch } from 'react-icons/io5'
import { IoHandRight } from 'react-icons/io5'
import { GiHeartNecklace } from 'react-icons/gi'

import { GiMonclerJacket } from 'react-icons/gi'
import { GiArmoredPants } from 'react-icons/gi'
import { GiSonicShoes } from 'react-icons/gi'

import { GiKevlarVest } from 'react-icons/gi'
import { TbParachute } from 'react-icons/tb'

import { GiHeavyBullets } from 'react-icons/gi'
import { GiAk47 } from 'react-icons/gi'

import { GiLightBackpack } from 'react-icons/gi'

export function Inventory() {
	const [ data, setData ] = React.useState({
		main: {
			weight: 30
		},
		backpack: {
			weight: 30
		}
	})
	const [ nearbyName, setNearbyName ] = React.useState('Окружение')

	const [ items, setItems ]  = React.useState([])
	const [ backpack, setBackpack ]  = React.useState([])
	const [ nearby, setNearby ] = React.useState([])
	const [ fastList, setFastList ] = React.useState([
		{}, {}, {}, {}
	])
	// { id: 1, name: 'Телефон', weight: .7, img: 'phone.png', count: 1, status: 100, type: 'phone' },


	function getWeight(i) {
		let weight = 0.0
		i.map(item => {
			if(item.hash) weight += item.weight * item.count
		})

		return weight.toFixed(1)
	}


	const [ charList, setCharList ] = React.useState([
		{ id: "hat", styles: {top: '2%', left: '50%', transform: 'translateX(-50%)'}, item: {} },
		{ id: "glassess", styles: {top: 'calc(2% + 56px)', left: '50%', transform: 'translateX(-50%)', height: "30px"}, item: {} },
		{ id: "ear", styles: {top: '5%', right: '21%', width: "30px"}, item: {} },

		{ id: "watches", styles: {top: '53%', right: '0%', transform: 'translateY(-50%)'}, item: {} },
		{ id: "bracelets", styles: {top: '53%', left: '0%', transform: 'translateY(-50%)'}, item: {} },
		
		{ id: "accesory", styles: {top: 'calc(2% + 46px * 2)', left: '50%', transform: 'translateX(-50%)'}, item: {} },
		{ id: "top", styles: {top: 'calc(2% + 46px * 4)', left: '50%', transform: 'translateX(-50%)'}, item: {} },

		{ id: "legs", styles: {bottom: '22%', left: '50%', transform: 'translateX(-50%)'}, item: {} },
		{ id: "shoes", styles: {bottom: '2%', left: '50%', transform: 'translateX(-50%)'}, item: {} },

		{ id: "weapon", styles: {bottom: '2%', left: '0', height: "calc(46px * 2 + 13px)"}, item: {} },
		{ id: "ammo", styles: {bottom: 'calc(2% + 56px * 2)', left: '0'}, item: {} },
		{ id: "armour", styles: {bottom: '2%', right: '0'}, item: {} },
		{ id: "parachute", styles: {bottom: 'calc(2% + 56px)', right: '0'}, item: {} },

		{ id: "backpack", styles: {bottom: 'calc(2% + 56px * 2)', right: '0'}, item: {} },
	])

	const [ itemSelect, setItemSelect ] = React.useState({
		toggle: false,
		position: [ 0, 0 ],
		item: {}
	})


	// Jquery Draggable
	const draggableRef = React.useRef([])
	const draggableRefNearby = React.useRef([])

	React.useEffect(() =>
	{
		draggableRef.current.map(item => {
			$(item).draggable({
				helper: 'clone',
				zIndex: 100,
				appendTo: 'body',
				containment: 'body',
				distance: 10
			})

			$(item).droppable({
				hoverClass: 'inventory-elem-hover',
				over: (event, ui) => {
					const target = event.target
					const targetParent = $(target).attr('data-parent')
				},
				drop: (event, ui) => {
		            const target = event.target
		            const targetParent = $(target).attr('data-parent')
		            const targetID = parseInt($(target).attr('data-id'))

		            const draggable = ui.draggable[0]
		            const draggableParent = $(draggable).attr('data-parent')
		            const draggableID = parseInt($(draggable).attr('data-id'))

		            if(targetParent === '#inventoryChar'
		            	&& targetParent === '#draggableParent')return

		            if(draggableParent === '#inventoryNearby'
		            	&& targetParent === '#inventoryChar')return

		            if(targetParent === '#inventoryFast'
		            	&& (draggableParent === '#inventoryChar'
		            		|| draggableParent === '#inventoryNearby'))return

		            ragemp.send('server::menu:inventory:transfer', {
		            	toParent: targetParent,
		            	toID: targetID,

		            	fromParent: draggableParent,
		            	fromID: draggableID,

		            	fromItem: draggableParent === '#inventoryNearby' ? nearby[draggableID] : null
		            })
		        }
			})


			$('.inventory #inventoryNearby .inventory-body-items').droppable({
				hoverClass: 'inventory-elem-hover-trash',
				drop: (event, ui) => {
		            const draggable = ui.draggable[0]
		            const draggableParent = $(draggable).attr('data-parent')
		            const draggableID = parseInt($(draggable).attr('data-id'))

		            if(draggableParent === '#inventoryNearby')return

		            ragemp.send('server::menu:inventory:trash', {
		            	fromParent: draggableParent,
		            	fromID: draggableID
		            })
		        }
			})
		})
	}, [items, backpack, charList, nearby, fastList, draggableRef.current, draggableRef])

	React.useEffect(() => {
		draggableRefNearby.current.map(item => {
			$(item).draggable({
				helper: 'clone',
				zIndex: 100,
				appendTo: 'body',
				containment: 'body',
				distance: 10
			})
		})
	}, [nearby])


	React.useMemo(() => {
		ragemp.eventCreate('menu:inventory', (cmd, data) => {
			switch(cmd) {
				case 'setItems': {
					if(data.items) setItems(data.items)
					if(data.backpack) setBackpack(data.backpack)
					if(data.charList) setCharList(data.charList)
					if(data.nearby) setNearby(data.nearby)
					if(data.fastList) setFastList(data.fastList)

					break
				}
				case 'setData': {
					setData(data)
					break
				}
				case 'setNearbyName': {
					setNearbyName(data.name)
					break
				}
			}
		})
	}, [])


	return (
		<div className="inventory" onClick={event => {
			if(itemSelect.toggle
				&& !$(event.target).closest('.inventorycontext').length
				&& !$(event.target).is('.inventorycontext')) {
				setItemSelect({
					toggle: false,
					position: [ 0, 0 ],
					item: {}
				})
			} 
		}}>
			<div className="inventory-wrap">
				<div style={{height: "217px"}} className="inventory-body" id="inventoryNearby" data-items={JSON.stringify(nearby)}>
					<h1>{nearbyName}</h1>
					<section style={{height: "168px"}} className="inventory-body-items inventory-elem-hover-trash-pre">
						<div className="inventory-body-items-wrap">
							{nearby.map((item, i) => {
								return (<InventoryItem i={i} item={item} _draggablePos={0} _parent={"#inventoryNearby"} draggableRef={draggableRef} />)
							})}
						</div>
					</section>
				</div>
				<div style={{height: "calc(100% - 217px - 20px)"}} className="inventory-body" id="inventoryBackpack" data-items={JSON.stringify(backpack)}>
					<h1>Рюкзак</h1>
					<div className="inventory-body-weight" style={data.backpack.weight === 0 ? {display: 'none'} : {display: 'block'}}>
						<h2>
							Вес
							<span>{getWeight(backpack)} / {data.backpack.weight} кг</span>
						</h2>
						<section>
							<section data-forUpdateHeight={nearby} style={{width: 100 / data.backpack.weight * getWeight(backpack) + "%"}}></section>
						</section>
					</div>
					<section className="inventory-body-items" style={data.backpack.weight === 0 ? {display: 'none'} : {display: 'block'}}>
						<div className="inventory-body-items-wrap">
							{backpack.map((item, i) => {
								return (<InventoryItem setItemSelect={setItemSelect} i={i} item={item} _draggablePos={items.length} _parent={"#inventoryBackpack"} draggableRef={draggableRef} />)
							})}
						</div>
					</section>
				</div>
			</div>
			<div className="inventory-wrap">
				<div className="inventory-char">
					<img className="inventory-char-img" src='./assets/inventory/character.png' />

					<div className="inventory-char-wrap" id="inventoryChar" data-items={JSON.stringify(charList)}>
						{charList.map((item, i) => {
							return (<InventoryItem i={i} item={item} _draggablePos={items.length + backpack.length} _parent={"#inventoryChar"} draggableRef={draggableRef} _id={`inventoryCharList-${item.id}`} _styles={item.styles} />)
						})}
					</div>
				</div>
				<div className="inventory-fast" id="inventoryFast" data-items={JSON.stringify(fastList)}>
					{fastList.map((item, i) => {
						return (<InventoryItem i={i} item={item} _draggablePos={items.length + backpack.length + charList.length} _parent={"#inventoryFast"} draggableRef={draggableRef} />)
					})}
				</div>
			</div>
			<div className="inventory-wrap">
				<div className="inventory-body" id="inventoryMain" data-items={JSON.stringify(items)}>
					<h1>Мои предметы</h1>
					<div className="inventory-body-weight">
						<h2>
							Вес
							<span>{getWeight(items)} / {data.main.weight} кг</span>
						</h2>
						<section>
							<section style={{width: 100 / data.main.weight * getWeight(items) + "%"}}></section>
						</section>
					</div>
					<section className="inventory-body-items">
						<div className="inventory-body-items-wrap">
							{items.map((item, i) => {
								return (<InventoryItem setItemSelect={setItemSelect} i={i} item={item} _draggablePos={0} _parent={"#inventoryMain"} draggableRef={draggableRef} />)
							})}
						</div>
					</section>
				</div>
			</div>
			<InventoryContext
				toggle={itemSelect.toggle}
				setItemSelect={setItemSelect}
				position={itemSelect.position}
				item={itemSelect.item}
				condition={itemSelect.condition}
				slot={itemSelect.slot}
				parent={itemSelect.parent} />
		</div>
	)
}


function InventoryItem({ i, item, _draggablePos, _parent, draggableRef, _id, _styles, setItemSelect }) {
	const charListSVG = [
		(<GiTopHat />), (<IoMdGlasses />), (<IoEarSharp />), (<IoWatch />), (<IoHandRight />), (<GiHeartNecklace />), (<GiMonclerJacket />), (<GiArmoredPants />), (<GiSonicShoes />), 
		(<GiAk47 />), (<GiHeavyBullets />), (<GiKevlarVest />), (<TbParachute />), (<GiLightBackpack />)
	]

	function getStatus(status) {
		if(status < 25)return 'verybad'
		if(status >= 25 && status < 50)return 'bad'
		if(status >= 50 && status < 75)return 'normal'
		if(status >= 75)return 'good'
	}

	return (
		<div
			data-id={i}
			ref={el => draggableRef.current[i + _draggablePos] = el}
			className={`inventory-elem ${item.charSet === true && 'inventory-char-set'}`}
			id={_id}
			style={_styles}
			data-parent={_parent}

			onClick={event => {
				if(setItemSelect && item.hash) setItemSelect({
					toggle: true,
					position: [ event.clientY, event.clientX ],
					item: item,
					condition: getStatus(item.status),
					slot: i,
					parent: _parent
				})
			}}
			onContextMenu={event => {
				event.preventDefault()
				if(setItemSelect && item.hash) {
					setItemSelect({
						toggle: true,
						position: [ event.clientY, event.clientX ],
						item: item,
						condition: getStatus(item.status),
						slot: i,
						parent: _parent
					})
				}
			}}
		>
			<div className="inventory-elem-drag">
				<div className="inventory-elem-img">
					{_parent === '#inventoryChar' ?
						!item.hash ? charListSVG[i] : (<img src={`assets/inventory/items/${item.item.img}`} />) :
						!item.hash ? '': (<img src={`assets/inventory/items/${item.img}`} />)}
				</div>
				{item.count >= 2 ? (<h3 className="inventory-elem-count">{item.count}</h3>) : ''}
				{(item.hash && item.status) ? (<button className={`inventory-elem-status inventory-elem-status-${getStatus(item.status)}`}></button>) : ''}
				{_parent === '#inventoryFast' ? (<h3 className="btn-key">{i + 1}</h3>) : ''}
			</div>
		</div>
	)
}


export function InventoryRenderItem({ item }) {
	return (
		<div className='inventory-elem'>
			<div className="inventory-elem-img">
				<img src={`assets/inventory/items/${item.img}`} />
			</div>
			{item.count >= 2 ? (<h3 className="inventory-elem-count">{item.count}</h3>) : ''}
		</div>
	)
}