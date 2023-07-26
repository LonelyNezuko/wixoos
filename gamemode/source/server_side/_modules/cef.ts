import logger from "./logger"

export default class CEF {
    private readonly player: PlayerMp
    private readonly eventname: string
    private readonly params: any
    private readonly cmd: string

    constructor(player: PlayerMp, eventname: string, cmd: string = '', params: any = null) {
        this.player = player
        this.eventname = eventname
        this.params = params
        this.cmd = cmd
    }


    send(): void {
        this.player.call('server::cef:send', [ this.eventname, this.cmd, this.params ])
    }
    add(callback: any): void {
        let temp: any = mp.events.getAllOf(this.eventname)
        if(temp.length) {
            mp.events.remove(this.eventname, temp[0])
        }

        mp.events.add(this.eventname, (_: PlayerMp, params: any) => {
            callback(JSON.parse(params))
        })
    }
}