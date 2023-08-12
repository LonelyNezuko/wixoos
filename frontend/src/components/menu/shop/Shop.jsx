import React from 'react'
import $ from 'jquery'
import ragemp from '../../../modules/ragemp'
import func from '../../../modules/func'

import './shop.scss'

import { HiShoppingCart } from 'react-icons/hi'
import { MdInventory } from 'react-icons/md'

import Roulette from './roullete/roulette'
import Inventory from './inventory/Inventory'

export default function Shop({ bodyNav, openBodyNav, accountData }) {
	return (
		<div className="menuShop">
			<div className="menuShop-header">
				<button style={{marginRight: '10px'}} onClick={() => openBodyNav(6)} className={`btn ${bodyNav === 6 && 'btn-sel'}`}>
					<HiShoppingCart />
					История пополнения
				</button>
				<button onClick={() => openBodyNav(5)} className={`btn ${bodyNav === 5 && 'btn-sel'}`}>
					<MdInventory />
					Инвентарь
				</button>
				<section className="menuShop-header-balance">
					<img src='./assets/donate.png' />
					<h1>{accountData.donate.toLocaleString()}</h1>
				</section>
			</div>

			
			<div className="menu-shop-root">
				{bodyNav === 4 ? (<Roulette />) : ''}
				{bodyNav === 5 ? (<Inventory />) : ''}
			</div>
		</div>
	)
}