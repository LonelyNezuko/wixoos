import logger from "../_modules/logger"

let dbhandle: any = null

import CONFIG from './config.json'
const mysql2 = require('mysql2')

const mysql = {
    init: async (callback: any) =>
    {
        try
        {
            dbhandle = await mysql2.createPool(CONFIG)
            dbhandle.query('set global wait_timeout=172800', [], (err: any, res: any) =>
            {
                if(err)return logger.error('mysql.init', err)
            
                logger.log('MySQL init: OK!')
                callback()
            })
        }
        catch(e: any)
        {
            logger.error('MySQL init: error', e)
        }
    },
    query: (query: string, args: any[] = [], callback: any = null) =>
    {
        dbhandle.query(query, args, callback)
    }
}
export default mysql
