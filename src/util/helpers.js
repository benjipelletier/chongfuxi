import store from '../store'

class StyleCalc {
    static colors = {
        default: ["gray", 500],
        radicals: ["gray", 500],
        hsk_1: ["yellow", 400],
        hsk_2: ["blue", 400],
        hsk_3: ["orange", 500],
        hsk_4: ["red", 500],
        hsk_5: ["indigo", 500],
        hsk_6: ["purple", 600],
    }
    static cardStyle(sectionIdx, level, word) {
        if (level === undefined) {
            const hsk_id = StyleCalc.getSectionIdFromWord(word)
            console.log(hsk_id)
            let border = 'border-white'
            if (this.colors[hsk_id] && !this.colors[sectionIdx]) {
                border = `border-${this.colors[hsk_id][0]}-${this.colors[hsk_id][1]}`
                console.log('HAS ', hsk_id, word)
            } 
            return `text-white ${border} border-4 bg-opacity-0 opacity-30`
        }
        return "text-white textShadow"
    }
    static cardBgStyle(sectionIdx, level, word) {
        console.log(word)
        if (level === undefined) {
            return "not-reviewed"
        }
        let color = this.colors["default"][0]
        let weight = this.colors["default"][1]
        const hsk_id = StyleCalc.getSectionIdFromWord(word)
        if (this.colors[sectionIdx]) {
            color = this.colors[sectionIdx][0]
            weight = this.colors[sectionIdx][1]
        } else if (this.colors[hsk_id]) {
            color = this.colors[hsk_id][0]
            weight = this.colors[hsk_id][1]
        }

        let percent
        if (level <= 5) {
            percent = 20
        } else if (level <= 9) {
            percent = 40 + (level - 6)*20
        } else if (level === 10) {
            return `bg-gradient-to-tr from-${color}-500 to-${color}-400 bg-opacity-100`
        } 
        return `bg-${color}-${weight} bg-opacity-${percent}`
    }
    static getSectionIdFromWord(word) {
        for (let i = 0; i < store.getters.getSections.length; ++i) {
            const section = store.getters.getSections[i]
            if (section.words.includes(word)) return section.id
        }
        return undefined
    }
}

let CharCalc = {
}

export {
    StyleCalc,
    CharCalc
}