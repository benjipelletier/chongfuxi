class StyleCalc {
    static colors = {
        unreviewed: "black",
        radicals: [
            null,
            "#F9FAFB", // 2
            "E5E7EB", // 3
            "#9CA3AF", // 4
            "#4B5563" // 5
        ],
        hsk_1: [
            null,
            "#FFFBEB",
            "#FEF3C7",
            "#FDE68A",
            "#FCD34D"
        ],
        hsk_2: [
            null,
            "#EFF6FF",
            "#C7D2FE",
            "#818CF8",
            "#4F46E5"
        ],
        hsk_3: [
            null,
            "#FEF3C7",
            "#FCD34D",
            "#F59E0B",
            "#FBBF24",
        ],
        hsk_4: [
            null,
            "#FEF2F2",
            "#FECACA",
            "#F87171",
            "#DC2626"
        ],
        hsk_5: [
            null,
            "#EEF2FF",
            "#C7D2FE",
            "#818CF8",
            "#4F46E5"
        ],
        hsk_6: [
            null,
            "#F5F3FF",
            "#DDD6FE",
            "#A78BFA",
            "#7C3AED"
        ]
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