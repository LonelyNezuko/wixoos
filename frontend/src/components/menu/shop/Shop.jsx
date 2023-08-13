import React from 'react'
import $ from 'jquery'
import ragemp from '../../../modules/ragemp'
import func from '../../../modules/func'

import './shop.scss'

import { HiShoppingCart } from 'react-icons/hi'
import { MdInventory } from 'react-icons/md'

import Roulette from './roullete/roulette'
import Inventory from './inventory/Inventory'
import Cash from './cash/cash'
import Packet from './packet/packet'
import Vip from './vip/vip'

export default function Shop({ bodyNav, openBodyNav, accountData }) {
	return (
		<div className="menuShop">
			<div className="menuShop-header">
				<button onClick={() => openBodyNav('inventory')} className={`btn ${bodyNav === 'inventory' && 'btn-sel'}`}>
					<MdInventory />
					Инвентарь
				</button>
				<section className="menuShop-header-balance">
					<img src='./assets/donate.png' />
					<h1>{accountData.donate.toLocaleString()}</h1>
				</section>
			</div>

			
			<div className="menu-shop-root">
				{bodyNav === 'cash' ? (<Cash />) : ''}
				{bodyNav === 'packet' ? (<Packet />) : ''}
				{bodyNav === 'vip' ? (<Vip />) : ''}
				{bodyNav === 'roulette' ? (<Roulette />) : ''}
				{bodyNav === 'inventory' ? (<Inventory />) : ''}
			</div>
		</div>
	)
}