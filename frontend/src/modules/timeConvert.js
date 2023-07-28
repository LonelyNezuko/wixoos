export default function timeConvert(seconds, short = false) {
    seconds = Number(seconds);

    var y = Math.floor(seconds / (3600*24*30*12));
    var mh = Math.floor(seconds / (3600*24*30));
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var yDisplay = y > 0 ? y + (y == 1 || !short ? " г. " : "г ") : "";
    var mhDisplay = mh > 0 ? mh + (mh == 1 || !short ? " мес. " : "мес ") : "";
    var dDisplay = d > 0 ? d + (d == 1 || !short ? " дн. " : "д ") : "";
    var hDisplay = h > 0 ? h + (h == 1 || !short ? " час. " : "ч ") : "";
    var mDisplay = m > 0 ? m + (m == 1 || !short ? " мин. " : "м ") : "";
    var sDisplay = s >= 0 ? s + (s == 1 || !short ? " сек." : "с ") : "";

    if(m > 0 || h > 0) sDisplay = ""
    if(d > 0) mDisplay = ""
    if(mh > 0) hDisplay = ""

    return yDisplay + mhDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
}