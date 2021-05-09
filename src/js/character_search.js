// import Fuse from 'fuse.js'
import axios from 'axios'

const URL_BASE = 'http://localhost:3000'

// import file_other from '../../server/data/dictionary.json'

// const options = {
//   threshold: 0.3,
//   keys: ['simplified', 'traditional', 'pronunciations.pinyin', 'pronunciations.toneless']
// }

// const fuse = new Fuse(file, options)

// console.log(fuse.search('ni hao3'))

export default {
    async search(input) {
        try {
            var response = await axios.get(URL_BASE + `/definitions/${input}`);
        } catch (e) {
            return {}
        }
        console.log(response.data)
        return response.data
    }
    // async search(input) {
    //     if (input === "") return []
    //     input = input.toLowerCase()
    //     return file.filter(word => {
    //         return word['simplified'].startsWith(input) ||
    //             word['traditional'].startsWith(input) ||
    //             this.matchPronunciation(word['pronunciations'], input)
    //     }).slice(0, 4)
    // },
    // matchPronunciation(pronunciations, input) {
    //     input = input.replace(/ /g, '')
    //     input = input.replace(/[0-9]/g, '')
    //     for (let pron of pronunciations) {
    //         let pinyin = pron['pinyin'].split(" ")
    //         let toneless = pron['toneless']
    //         if (this.matchPinyin(pinyin, toneless, input)) return true
    //     }
    //     return false
    // },
    // matchPinyin(pinyin, toneless, input) {
    //     return toneless.replace(/ /g, '').startsWith(input)
    //     let inputIdx = 0
    //     for (let i = 0; i < pinyin.length; ++i) {
    //         if (input[inputIdx] == ' ') {
    //             i--
    //             inputIdx++
    //             continue
    //         } 
    //         inputIdx = Math.max(
    //             this.matchSyl(pinyin[i], input, inputIdx),
    //             this.matchSyl(toneless[i], input, inputIdx)
    //         )

    //         if (inputIdx >= input.length) {
    //             if (i + 1 == pinyin.length) { // last
    //                 return true
    //             }
    //         } else if (inputIdx == -1) {
    //             return false
    //         }
    //     }
    //     return false
    // },
    // matchSyl(syl, input, startIdx) {
    //     let endIdx = -1
    //     let sylIdx = 0
    //     for (let i = startIdx; i < input.length; ++i) {
    //         if (input[i] != syl[sylIdx]) return endIdx
    //         endIdx = i + 1
    //         sylIdx++
    //     }
    //     return endIdx
    // }
}