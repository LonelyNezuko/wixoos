export const commands: any = {}
export function addCommand(keyName: any, settings?: any, func?: any)
{
    if(typeof keyName === 'object')
    {
        for(var i in keyName) commands[i] = keyName[i]
    }
    else commands[keyName] = { settings, func }
}