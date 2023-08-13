import React from 'react'
import $ from 'jquery'
import 'jquery-mousewheel'

import moment from 'moment'
import 'moment/locale/ru'

import './admin.scss'
import timeConvert from '../../../modules/timeConvert'

import AdminTickets from './tickets/tickets'
import AdminList from './adminlist/adminlist'

export default function Admin({ accountData, bodyNav, openBodyNav }) {
    return (
        <div id="admin">
            {bodyNav === 'tickets' ? (<AdminTickets accountData={accountData} />) : ''}
            {bodyNav === 'adminlist' ? (<AdminList accountData={accountData} />) : ''}
        </div>
    )
}