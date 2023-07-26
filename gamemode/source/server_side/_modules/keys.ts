export const keys: any = {}
export function addKey(keyName: any, func?: any)
{
    if(typeof keyName === 'object')
    {
        for(var i in keyName) keys[i] = keyName[i]
    }
    else keys[keyName] = { func }
}