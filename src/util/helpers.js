class StyleCalc {
    static colors = {
        default: ["gray", 900],
        radicals: ["gray", 500],
        hsk_1: ["yellow", 400],
        hsk_2: ["blue", 400],
        hsk_3: ["orange", 500],
        hsk_4: ["red", 500],
        hsk_5: ["indigo", 500],
        hsk_6: ["purple", 600],
    }
    static cardStyle(sectionIdx, level) {
        if (level == undefined || level == 0) {
            return "text-white border-white border-4 bg-opacity-0 opacity-30"
        }
        return "text-white textShadow"
    }
    static cardBgStyle(sectionIdx, level) {
        if (level == undefined || level == 0) {
            return ""
        }
        let percent = level*25
        let color = this.colors[sectionIdx][0]
        let weight = this.colors[sectionIdx][1]
        console.log(sectionIdx)
        return `bg-${color}-${weight} bg-opacity-${percent}`
    }
    static cardBgColor(section_id, lvl) {
        if (lvl == undefined) return 'background-color: rgba(0, 0, 0, 0.1)'
        return `background-color: ${this.colors[section_id][lvl]}`
    }
    static charTextColor(section_id, lvl) {
        lvl = lvl == undefined ? 0 : lvl
        if (lvl >= 3) return 'color: #fff';
        return `color: ${this.colors[section_id][4]}`
    }

}

let CharacterCalc = {
}

export {
    StyleCalc,
    CharacterCalc
}