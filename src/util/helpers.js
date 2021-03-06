let StyleCalc = {
    cardBgColor(color, lvl) {
        if (lvl == 0) return 'background-color: rgba(0, 0, 0, 0.1)';
        let hue = color[0];
        let sat = color[1];
        let light = color[2];
        light = 100 - ((100 - light) / 5)*lvl;
        return `background-color: hsl(${hue}, ${sat}%, ${light}%)`
    },
    charTextColor(color, lvl) {
        if (lvl > 2) return 'color: #fff;'
        let hue = color[0];
        let sat = color[1];
        let light = color[2];
        return `color: hsl(${hue}, ${sat}%, ${light}%)`
    }

}

export {
    StyleCalc
}