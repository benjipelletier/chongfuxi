<template>
    <div @keyup.enter="pageEnter" tabindex="0" class="bg-gray-800 min-h-screen">
        <div class="w-full flex flex-col justify-center pt-16 space-y-2">
            <div class="w-full h-2 flex">
                <div :style="`width: ${percent(numCorrect, reviewSession.cards.length)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                <div :style="`width: ${percent(numIncorrect, reviewSession.cards.length)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            </div>
            <!-- <div class="w-full h-2 flex">
                <div v-for="(resp, i) in vocabResponses" :key="i" class="w-full h-full" :class="{'bg-green-500': resp.correct === true, 'bg-red-500': resp.correct === false}"></div>
            </div> -->
            <div class="w-full flex justify-center overflow-hidden"> 
                <div class="relative flex items-center">
                    <!-- card --> 
                    <div class="z-20 w-96 flex-col justify-center rounded-t-xl rounded-b p-4 bg-white" v-for="i in [currentIndex]" :key="i">
                        <div v-if="currentState.matches('stats')">
                            sdf
                        </div>
                        <div v-else class="flex justify-center items-center p-4 whitespace-nowrap">
                            <span class="text-9xl">{{reviewSession.cards[i]}}</span>
                        </div>
                    </div>
                    <!-- left conveyor -->
                    <div class="absolute right-full flex justify-end space-x-2 mr-2">
                        <button @mouseover="rewindHoverIdx = i" @mouseleave="rewindHoverIdx = -1" class="relative conveyor-block focus:outline-none active:outline-none hover:cursor-pointer" @click="rewind(i)" :class="{'correct': block.correct, 'incorrect': !block.correct}" v-for="(block, i) in vocabResponses.slice(0, currentIndex)" :key="block.word">
                            <div class="w-full h-full absolute flex justify-center items-center">
                                <svg v-if="rewindActive(i)" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="#d6d6d6">
                                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                </svg>
                            </div>
                            <span :class="{'text-white text-opacity-0': rewindActive(i)}">{{block.word}}</span>
                        </button>
                    </div>
                    <div class="absolute left-full flex space-x-2 ml-2">
                        <div class="conveyor-block" v-for="(block, i) in vocabResponses.slice(currentIndex + 1)" :key="'conv-right-'+i">{{block.word}}</div>
                    </div>
                </div>
            </div>
            <div v-if="currentCardData && currentCardData.defNotFound" class="w-full flex justify-center">
                <!-- <div v-if="hasDef" :class="{'bg-indigo-500 text-indigo-100': currentState.matches('pinyin'), 'bg-orange-500 text-orange-100': currentState.matches('meaning')}" class="bg-indigo-500 py-1 px-4 rounded text-xl font-light">{{currentState.matches('pinyin') ? 'pinyin' : 'meaning'}}</div> -->
                <div class="bg-red-500 py-1 px-2 rounded text-xl font-light text-white flex flex-row justify-center items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span>Definition not found</span>
                </div>
            </div>
            <div class="w-full flex flex-col items-center space-y-2">
                <!-- input -->
                <!-- <form v-if="!currentState.matches('stats')" @submit="onSubmit" class="w-full h-full flex justify-center items-center">
                    <input ref="input" v-model.trim="inputText" class="input w-full text-5xl text-gray-200 py-2 bg-gray-900" placeholder="response" spellcheck="false">
                </form> -->
                <!-- pinyin -->
                <div class="bg-gray-900 text-white rounded flex justify-center relative ring-inset w-96" :class="{'ring-4 ring-green-500': showPinyinAnswer && shownAnswer.pyMatch.found, 'ring-4 ring-red-500': showPinyinAnswer && !shownAnswer.pyMatch.found}">
                    <form v-if="currentState.matches('pinyin')" @submit="onSubmit" class="w-full h-full flex justify-center items-center">
                        <input ref="input" v-model.trim="inputText" class="input w-full text-4xl text-gray-200 py-2 bg-gray-900 rounded" placeholder="pinyin" spellcheck="false">
                    </form>
                    <div v-else>
                        <span class="text-4xl" v-if="shownAnswer.pyMatch.found">{{shownAnswer.definition.getPinyin(shownAnswer.pyMatch.idx)}}</span>
                        <div v-else-if="shownAnswer.definition.isDuoYinCi()" v-for="(py, i) in shownAnswer.definition.getPinyins()" :key="'defn'+i" class="m-1 bg-gray-800 p-2 rounded text-gray-200 text-md">
                            {{py}}
                        </div>
                        <span class="text-5xl" v-else>{{shownAnswer.definition.getPinyins()[0]}}</span>
                    </div>
                    <div class="absolute text-right right-full w-full font-bold text-5xl opacity-10 whitespace-nowrap mr-4" style="direction: rtl" >
                        拼音
                    </div>
                </div>
                <!-- meaning -->
                <div class="bg-gray-900 text-white rounded-t rounded-b-xl relative w-96 h-20 ring-inset"  :class="{'ring-4 ring-green-500': showMeaningAnswer && shownAnswer.meaningMatch.found, 'ring-4 ring-red-500':  showMeaningAnswer && !shownAnswer.meaningMatch.found}">
                    <form v-if="!currentState.matches('answer')" @submit="onSubmit" class="w-full h-full flex justify-center items-center">
                        <input ref="input" v-model.trim="inputText" class="input w-full h-full text-4xl text-gray-200 py-2 bg-gray-900 rounded-t rounded-b-xl" placeholder="meaning" spellcheck="false">
                    </form>
                    <div v-else class="w-full h-full flex flex-row flex-wrap">
                        <div v-for="(defn, i) in shownAnswer.definition.getMeanings(shownAnswer.pyMatch.idx)" :key="'defn'+i" class="m-1 bg-gray-800 py-2 px-4 rounded text-gray-200 text-md">
                            {{defn}}
                        </div>
                    </div>
                    <div class="absolute text-right right-full top-0 w-full font-bold text-5xl opacity-10 whitespace-nowrap mr-4" style="direction: rtl" >
                        意思
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { Definition } from '@/js/models/definition.js'
import { createMachine, interpret } from 'xstate';

const stateMachine = createMachine({
    initial: 'pinyin',
    states: {
        pinyin: { on: { MEANING: 'meaning', END: 'stats' }},
        meaning: { on: { PINYIN: 'pinyin', END: 'stats' }},
        stats: {
            type: 'final'
        }
    }
})


export default {
    name: "Review",
    components: {
    },
    directives: {
    },
    props: [
    ],
    data() {
        return {
            stateMachine: interpret(stateMachine),
            currentState: stateMachine.initialState,
            inputText: "",
            currentIndex: 0,
            rewindHoverIdx: -1,
            vocabResponses: [],
            shownAnswer: null,
        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.$swiper
        },
        numCorrect() {
            return this.vocabResponses.slice(0, this.currentIndex).filter(block => block.correct === true).length
        },
        numIncorrect() {
            return this.vocabResponses.slice(0, this.currentIndex).filter(block => block.correct === false).length
        },
        currentCardData() {
            return this.vocabResponses[this.currentIndex]
        },
        showPinyinAnswer() {
            return this.shownAnswer && this.shownAnswer.pyMatch !== null && this.shownAnswer.definition !== null 
        },
        showMeaningAnswer() {
            return this.shownAnswer && this.shownAnswer.meaningMatch !== null && this.shownAnswer.definition !== null 
        },
        hasDef() {
            return this.currentCardData && !this.currentCardData.defNotFound
        },
        ...mapGetters({
            reviewSession: 'getReviewSession'
        })
    },
    methods: {
        get_text_size(text) {
            // dynamically change font size based on char count
            let size = 8
            if (text.length > 3) size = 4
            else if (text.length > 2) size = 6

            return `font-size: ${size}rem;`
        },
        pageEnter() {
            if (this.$refs.input) {
                this.$refs.input.focus()
            }
        },
        async onSubmit(e) {
            e.preventDefault();
            const input = this.inputText
            this.inputText = ""

            if (this.currentCardData.defNotFound) {
                this.currentIndex++
                if (this.currentIndex >= this.vocabResponses.length) {
                    this.send('END')
                }
            }

            if (input === "") return
            console.log('INPUT ', input)

            if (this.currentState.matches('pinyin')) {
                this.currentCardData.definitionPromise
                .then(definition => {
                    this.currentCardData.definition = definition
                    return definition.getIdxMatchPinyin(input)
                }).then(matchedIdx => {
                    this.currentCardData.pyMatch = {
                        found: true, 
                        idx: matchedIdx,
                    }
                }).catch(e => {
                    this.currentCardData.pyMatch = {
                        found: false,
                    }
                    console.log('Definition error: ', e)
                }).finally(() => {
                    this.shownAnswer = this.currentCardData
                    this.send('MEANING')
                    this.$nextTick(() => this.$refs.input.focus())
                })
            } else if (this.currentState.matches('meaning')) {
                this.currentCardData.definitionPromise
                .then(definition => {
                    return definition.getIdxMatchMeaning(this.currentCardData.pyMatch.idx, input)
                }).then(meaningIdx => {
                    this.currentCardData.meaningMatch = {
                        found: true,
                        idx: meaningIdx
                    }
                    this.currentCardData.correct = true
                }).catch(err => {
                    this.currentCardData.meaningMatch = {
                        found: false,
                    }
                    console.log(err)
                    this.currentCardData.correct = false
                }).finally(() => {
                    this.currentIndex++;
                    if (this.currentIndex < this.vocabResponses.length) {
                        this.send('PINYIN')
                    } else {
                        this.send('END')
                    }
                    this.$nextTick(() => this.$refs.input.focus())
                })
            } 
        },
        setCurrentDefn() {
            this.currentCardData.definitionPromise = Definition.get(this.reviewSession.cards[this.currentIndex])
            .then(response => {
                console.log('found definition for ', this.currentCardData.word)
                return response
            }).catch(err => {
                console.log(err)
                this.currentCardData.defNotFound = true
            })
        },
        percent(num, denom) {
            return num*100/denom
        },
        rewind(idx) {
            for (let i = this.currentIndex; i >= idx; --i) {
                this.vocabResponses[i].correct = null
            }
            this.currentIndex = idx
            this.rewindHoverIdx = -1
            this.send('REWIND')
        },
        rewindActive(i) {
            return this.rewindHoverIdx == i
        },
        rewindHover(i) {
            this.rewindHoverIdx = i
        },
        send(event) {
            this.stateMachine.send(event)
        }
    },
    mounted() {
        this.$refs.input.focus()
        this.vocabResponses = this.reviewSession.cards.map(word => {
            return {
                word,
                definitionPromise: null,
                definition: null,
                defNotFound: false,
                // response data
                pyMatch: null,
                meaningMatch: null,
                correct: null
            }
        })
        this.setCurrentDefn()
    },
    created() {
        this.stateMachine.onTransition((state) => {
            this.currentState = state;
        }).start()
    },
    watch: {
        currentIndex: function() {
            if (this.currentIndex < this.vocabResponses.length) {
                this.setCurrentDefn()
            }
        }
    }
}

</script>

<style scoped>
.swiper-slide {
    width: fit-content;
}


.display-card {
    /* box-shadow: 2px 2px 0 rgb(204 197 185 / 50%); */
    color: rgb(0,0,0,0.2);
    background-color: rgb(0,0,0,0.1);
    transition: all 0.2s;
    font-weight: 300;
}

.current-display-card {
    /* position: absolute; */
    /* background-color: red; */
    background-color: white;
    color: black;
    position: relative;
    bottom: 10px;
    box-shadow: 0 0px 0 5px rgb(0,0,0,0.2);
    opacity: 100%;
    font-weight: 500;
}

.disabled-display-card {
    opacity: 50%;
}

.card-background {
    /* background-color: rgb(0,0,0,0.2); */
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 2rem;
    box-shadow: var(--big-card-shadow-inset);
    position: absolute;
}

.slide-leave-active,
.slide-enter-active {
  transition: all 0.3s ease;
}

.slide-enter-active {
    transition-delay: 0.1s;
}

.slide-enter {
    opacity: 0;
}
.slide-leave-to {
    opacity: 0;
}

.correct-answer {
    @apply bg-gradient-to-tr from-green-500 to-green-400;
}

.incorrect-answer {
    @apply bg-gradient-to-tr from-red-500 to-red-400;
}

.input {
    caret-color: white;
    text-align: center;
}

.input::placeholder {
    @apply text-gray-800;
}

.input:focus::placeholder {
    @apply text-gray-700;
}

.input:focus {
    outline: none;
}

.input:hover {
    outline: none;
}

input::placeholder {
  color: rgba(0,0,0,0.3);
  text-shadow: none;
}


.conveyor-mid {
    width: 400px;
}

.conveyor-bg {
    @apply items-center flex space-x-2 w-full;
}

.conveyor-bg.right-conveyor {
    padding-left: 210px;
}
.conveyor-bg.left-conveyor {
    padding-right: 210px;

}

.main-wrapper {
    width: 400px;
}

.conveyor-block {
    @apply px-4 py-6 bg-gray-700 bg-opacity-50 text-gray-300 flex justify-center items-center rounded h-10 text-2xl font-light;
    @apply whitespace-nowrap;
}
.conveyor-block.correct {
    @apply ring-inset ring-2 ring-green-500
}
.conveyor-block.incorrect {
    @apply ring-inset ring-2 ring-red-500
}

</style>