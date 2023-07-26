import logger from "../_modules/logger"

mp.events.add("cef::keypressed", (data: any) =>
{
    mp.events.callRemote('server::key', JSON.stringify(data))
})