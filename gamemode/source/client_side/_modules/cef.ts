import logger from "./logger"

let browser: BrowserMp
let cefActive = false

const cef = {
    init: (callback: any): void =>
    {
        browser = mp.browsers.new('http://localhost:3000/index.html')
        // browser = mp.browsers.new('package://ui/index.html')
        mp.events.add('browserDomReady', () =>
        {
            cefActive = true
            logger.log('CEF init')

            callback()
            cef.events()
        })
    },
    emit: (eventname: string, cmd: string, data: any = {}, log: boolean = true): void =>
    {
        if(!cefActive)return

        browser.execute(`window.eventTrigger('${eventname}', '${cmd}', '${JSON.stringify(data)}')`)
        if(log === true) logger.log(`window.eventTrigger('${eventname}', '${cmd}', '${JSON.stringify(data)}')`, false, true)
    },
    

    events: (): void => {
        mp.events.add('cef::event', (data: string): void => {
            data = JSON.parse(data)

            if(data[0].indexOf('client::') === 0) mp.events.call(data[0].replace('client::', 'cef::'), data[1])
            else if(data[0].indexOf('server::') === 0) mp.events.callRemote(data[0].replace('server::', 'cef::'), JSON.stringify(data[1]))
            else logger.error(`${data[0]} from cef unknown`)

            logger.log(`cef::event --- ${data[0]}`)
        })

        mp.events.add('server::cef:send', (eventname: string, cmd: string, params: any) => {
            cef.emit(eventname, cmd, params)
        })
    }
}

export default cef