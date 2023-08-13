import './keys'

import '../interface/events'


import logger from '../_modules/logger'
mp.events.add('server::logger:log', (player: PlayerMp, text: string | number): void => {
    logger.log(text)
})