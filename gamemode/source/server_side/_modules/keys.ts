export const keys: any = {}
export function addKey(keyName: any, keyCode?: number, func?: any)
{
    if(typeof keyName === 'object')
    {
        for(var i in keyName) keys[i] = keyName[i]
    }
    else keys[keyName] = { keyCode, func }
}