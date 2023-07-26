import CONFIG_DEFAULT from '../configs/default.json'

const func: any = {}

func.random = (min: number, max: number) =>
{
    if(min === 0 && max === 0)return 0

    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
func.isJSON = (str: string) =>
{
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]'
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

func.distance = (pos1: any, pos2: any) =>
{
    return Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2) + Math.pow((pos2.z - pos1.z),2)))
}
func.distance2D = (pos1: any, pos2: any) =>
{
    return Math.abs(Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2)))
}

func.getSubnet = (ip: any) =>
{
    let status = false
    for(var i in ip)
    {
        if(ip[i] === '.')
        {
            if(!status) status = true
            else
            {
                return ip.substring(0, i)
            }
        }
    }
    return false
}

func.getCameraOffset = (pos: any, angle: number, dist: number) =>
{
    angle = angle * 0.0174533;

    pos.y = pos.y + dist * Math.sin(angle);
    pos.x = pos.x + dist * Math.cos(angle);

    return pos;
}

func.validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/
    if(!re.test(email))return false

    const m = email.substr(0, email.indexOf('@'))
    if(m.length < 4)return false

    return true
}
func.validatePassword = (password: string) => {
    if(password.length < CONFIG_DEFAULT.passwordLength[0] || password.length > CONFIG_DEFAULT.passwordLength[1])return false

    const re = /[а-яА-ЯЁё]/
    if(re.test(password))return false

    return true
}


export default func