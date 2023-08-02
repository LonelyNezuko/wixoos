import React from 'react'
import $ from 'jquery'
import ragemp from '../../../modules/ragemp'
import func from '../../../modules/func'

import './shop.scss'

import { HiShoppingCart } from 'react-icons/hi'
import { MdInventory } from 'react-icons/md'

import Roullete from './roullete/Roullete'
import Inventory from './inventory/Inventory'

export default function Shop(props) {
	return (
		<div className="menu-shop">
			<div className="menu-shop-header">
				<button style={{marginRight: '10px'}} onClick={() => props.openBodyNav(6)} className={`btn ${props.bodyNav === 6 && 'btn-sel'}`}>
					<HiShoppingCart />
					История пополнения
				</button>
				<button onClick={() => props.openBodyNav(5)} className={`btn ${props.bodyNav === 5 && 'btn-sel'}`}>
					<MdInventory />
					Инвентарь
				</button>
				<section className="menu-shop-header-balance">
					<img src='./assets/donate.png' />
					<h1>{props.accountData.donate.toLocaleString()}</h1>
				</section>
			</div>

			<div className="menu-shop-root menu-shop-inventory" style={{display: props.bodyNav !== 5 ? 'none' : 'flex'}}>
				<Inventory />
			</div>

			<div className="menu-shop-root menu-shop-roulette" style={{display: props.bodyNav !== 4 ? 'none' : 'block'}}>
				<Roullete />
			</div>
		</div>
	)
}