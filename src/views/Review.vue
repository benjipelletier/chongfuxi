<template>
    <div class="bg-gray-800 min-h-screen">
        <div class="z-10 w-full h-2 flex fixed top-16">
            <div :style="`width: ${percent(numCorrect, reviewSession.cards.length)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
            <div :style="`width: ${percent(numIncorrect, reviewSession.cards.length)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            <div :style="`width: ${percent(currentIndex - numCorrect - numIncorrect, reviewSession.cards.length)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-500"></div>
        </div>
        <!-- <div class="w-full h-2 fixed top-16 flex space-x-1">
            <div v-for="(resp, i) in reviewProgress" :key="i" class="flex-grow h-full" :class="{'bg-green-500': resp.correct === true, 'bg-red-500': resp.correct === false}"></div>
        </div> -->
        <div class="w-full min-h-screen flex flex-col pt-16">
            <div class="w-full flex flex-col my-10 space-y-2">
                <div class="w-full flex justify-center overflow-hidden"> 
                    <div class="relative flex items-center">
                        <!-- card --> 
                        <div class="w-96 flex-col justify-center rounded-t-xl rounded-b p-4 bg-white" v-for="i in [currentIndex]" :key="i">
                            <div v-if="currentState.matches('stats')" class="flex flex-col justify-center items-center text-3xl font-bold">
                                <pie-chart  :dataset="{borderWidth: 0}" :colors="['#10B981', '#EF4444']" :data="{'Correct': numCorrect, 'Incorrect': numIncorrect, 'Unanswered': reviewProgress.length-numCorrect-numIncorrect}"></pie-chart>
                                <div>Correct: {{numCorrect}}/{{reviewProgress.length}}</div>
                                <div>Incorrect: {{numIncorrect}}/{{reviewProgress.length}}</div>
                            </div>
                            <div v-else class="flex justify-center items-center p-4 whitespace-nowrap">
                                <span :class="cardTextSize(currentCardData.word)">{{currentCardData.word}}</span>
                                <div v-if="getReviewLevel(currentCardData.word) !== undefined" class="w-8 h-8 bg-gray-800 absolute right-0 top-0 m-2 rounded text-white text-xl font-regular flex justify-center items-center">
                                    {{getReviewLevel(currentCardData.word)}}
                                </div>
                            </div>
                        </div>
                        <!-- left conveyor -->
                        <div class="absolute right-full flex justify-end space-x-4 mr-4">
                            <button @mouseover="rewindHoverIdx = i" @mouseleave="rewindHoverIdx = -1" class="relative conveyor-block focus:outline-none active:outline-none hover:cursor-pointer" @click="rewind(i)" :class="{'correct': block.correct === true, 'incorrect': block.correct === false}" v-for="(block, i) in reviewProgress.slice(0, currentIndex)" :key="block.word">
                                <div class="w-full h-full absolute flex justify-center items-center">
                                    <svg v-if="rewindActive(i)" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="#d6d6d6">
                                        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                    </svg>
                                </div>
                                <span :class="{'text-white text-opacity-0': rewindActive(i)}">{{block.word}}</span>
                            </button>
                        </div>
                        <div class="absolute left-full flex space-x-4 ml-4">
                            <div class="conveyor-block ring-inset ring-2 ring-gray-700" v-for="(block, i) in reviewProgress.slice(currentIndex + 1)" :key="'conv-right-'+i">{{block.word}}</div>
                        </div>
                    </div>
                </div>
                <div v-if="currentState.matches('noDef')" class="w-full flex justify-center">
                    <div class="bg-red-500 py-1 px-2 w-96 rounded-t rounded-b-xl text-xl font-light text-white flex flex-row justify-center items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        <span>Definition not found</span>
                    </div>
                </div>
                <div v-if="currentState.matches('new')" class="w-full flex justify-center">
                    <div class="bg-green-500 py-1 px-2 w-96 rounded-t rounded-b text-xl font-light text-white flex flex-row justify-center items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" />
                        </svg>
                        <span>New Word</span>
                    </div>
                </div>
                <div class="w-full flex flex-col items-center space-y-2">
                    <!-- input -->
                    <!-- <form v-if="!currentState.matches('stats')" @submit="onSubmit" class="w-full h-full flex justify-center items-center">
                        <input ref="input" v-model.trim="inputText" class="input w-full text-5xl text-gray-200 py-2 bg-gray-900" placeholder="response" spellcheck="false">
                    </form> -->
                    <!-- pinyin -->
                    <div v-if="showOverride" class="w-96 bg-gray-900 h-10 rounded flex ">
                        <button @click="overrideCorrect(false)" class="flex-grow flex justify-center items-center text-gray-700 hover:bg-red-500 rounded-l focus:outline-none hover:text-white active:bg-opacity-80">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <button @click="overrideCorrect(true)" class="flex-grow flex justify-center items-center text-gray-700 hover:bg-green-500 rounded-r focus:outline-none hover:text-white active:bg-opacity-80">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </div>
                    <div v-if="showAnswer" class="w-96 bg-gray-900 text-white rounded flex justify-center relative h-14 ring-inset" :class="{'ring-4 ring-green-500': !currentState.matches('review.pinyin') && currentCardData.pinyinMatch.found === true, 'ring-4 ring-red-500': !currentState.matches('review.pinyin') && currentCardData.pinyinMatch.found === false}">
                        <form v-if="currentState.matches('review.pinyin')" @submit="onSubmitPinyin">
                            <input ref="pinyinInputRef" v-model.trim="pinyinInput" class="input w-full text-4xl text-gray-200 py-2 bg-gray-900 rounded" placeholder="pinyin" spellcheck="false" :disabled="!currentState.matches('review.pinyin')">
                        </form>
                        <div v-else class="flex w-full h-full justify-center rounded">
                            <div v-for="(defs, i) in currentCardData.definition.definitions" :key="'defn'+i" class="flex justify-center items-center text-3xl font-regular flex-1 first:rounded-l last:rounded-r text-shadow" :class="{'bg-green-500': i === currentCardData.pinyinMatch.idx}">
                                {{numberToToneMarks(defs.pinyin)}}
                            </div>
                        </div>
                        <div class="absolute text-right right-full w-full font-bold text-5xl opacity-10 top-0 whitespace-nowrap mr-4" style="direction: rtl" >
                            拼音
                        </div>
                    </div>
                    <!-- meaning -->
                    <div v-if="showAnswer" ref="meaningSection" class="w-96 bg-gray-900 text-white rounded-t rounded-b-xl relative ring-inset"  :class="{'ring-4 ring-green-500': currentState.matches('answer') && currentCardData.meaningMatch.found === true, 'ring-4 ring-red-500':  currentState.matches('answer') && currentCardData.meaningMatch.found === false}">
                        <form v-if="currentState.matches('review')" @submit="onSubmitMeaning">
                            <input ref="meaningInputRef" v-model.trim="meaningInput" class="w-full input text-4xl text-gray-200 py-10 rounded-t rounded-b-xl rounded-br bg-gray-900" placeholder="meaning" spellcheck="false" :disabled="!currentState.matches('review.meaning')">
                        </form>
                        <div v-else class="h-full flex p-2">
                            <div v-for="(defs, i) in currentCardData.definition.definitions" :key="'defn'+i" class=" flex flex-wrap h-full flex-1 font-regular text-shadow">
                                <div v-for="(meaning, j) in defs.meanings" :key="'defn'+j" class="m-1 bg-gray-800 py-2 px-4 rounded text-gray-200 text-lg w-full" :class="{'bg-green-500': currentCardData.meaningMatch.found && currentCardData.meaningMatch.idx[0] === i && currentCardData.meaningMatch.idx[1] === j}">
                                    {{meaning}}
                                </div>
                            </div>
                        </div>
                        <div class="absolute text-right right-full top-0 w-full font-bold text-5xl opacity-10 whitespace-nowrap mr-4" style="direction: rtl" >
                            释义
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'
import { Progress } from '@/js/models/progress.js'
import { createMachine, interpret } from 'xstate';
import * as pinyinUtil from 'pinyin-tone'
import Vue from 'vue'

const stateMachine = createMachine({
    initial: 'review',
    states: {
        review: {
            initial: 'pinyin',
            states: {
                pinyin: { on: { MEANING: 'meaning' }},
                meaning: { on: {}},
            },
            on: {
                NODEF: 'noDef',
                NEW: 'new',
                END: 'stats',
                ANSWER: 'answer',
                RESTART: 'review.pinyin'
            }
        },
        answer: {
            on: {
                NODEF: 'noDef',
                END: 'stats',
                RESTART: 'review.pinyin'
            }
        },
        noDef: {
            on: { 
                END: 'stats',
                RESTART: 'review.pinyin'
            }
        },
        new: {
            on: {
                RESTART: 'review.pinyin',
                END: 'stats'
            }
        },
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
            pinyinInput: "",
            meaningInput: "",
            currentIndex: 0,
            rewindHoverIdx: -1,
            reviewProgress: [],
            allowPageEnter: true
        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.$swiper
        },
        numCorrect() {
            return this.reviewProgress.slice(0, this.currentIndex).filter(block => block.correct === true).length
        },
        numIncorrect() {
            return this.reviewProgress.slice(0, this.currentIndex).filter(block => block.correct === false).length
        },
        currentCardData() {
            return this.reviewProgress[this.currentIndex]
        },
        showAnswer() {
            return this.currentState.matches('review') || this.currentState.matches('answer') || this.currentState.matches('new')
        },
        showOverride() {
            return this.currentState.matches('review') || this.currentState.matches('answer') 
        },
        ...mapGetters({
            reviewSession: 'getReviewSession',
            userProgress: 'getUserProgress',
            getReviewLevel: 'getReviewLevel'
        })
    },
    methods: {
        ...mapActions(['updateUserProgress', 'setGlobalSelectMode']),
        cardTextSize(text) {
            // dynamically change font size based on char count
            if (text.length >= 4) return 'text-7xl'
            else if (text.length == 3) return 'text-8xl'
            return 'text-9xl'
        },
        numberToToneMarks(py) {
            return pinyinUtil(py.replace(/u:/g, 'v'))
        },
        focusPinyin() {
            if (this.$refs.pinyinInputRef) {
                Vue.nextTick(() => this.$refs.pinyinInputRef.focus())
            }
        },
        focusMeaning() {
            if (this.$refs.meaningInputRef) {
                Vue.nextTick(() => this.$refs.meaningInputRef.focus())
            }
        },
        pageEnter() {
            if (!this.allowPageEnter) return

            if (this.currentState.matches('review.pinyin')) {
                this.focusPinyin()
            } else if (this.currentState.matches('review.meaning')) {
                this.focusMeaning()
            } else if (this.currentState.matches('answer')) {
                this.advanceCard()
            } else if (this.currentState.matches('noDef')) {
                this.advanceCard()
            } else if (this.currentState.matches('new')) {
                this.advanceCard()
            } else if (this.currentState.matches('stats')) {
                this.$router.push({ path: '/' })
            }
        },
        advanceCard() {
            if (this.reviewSession.isSRS) {
                this.currentCardData.put()
                .then(response => {
                    console.log(response)
                    this.updateUserProgress(response)
                })
                .catch(e => {
                    console.log(e)
                })
            }
            this.currentIndex++
            if (this.currentIndex >= this.reviewProgress.length) {
                this.send('END')
            } else {
                this.send('RESTART')
                setTimeout(() => {
                    this.focusPinyin()
                }, 100)
            }
        },
        onSubmitPinyin(e) {
            e.preventDefault();
            const input = this.pinyinInput

            if (input === "") return
            this.pinyinInput = ""
            console.log('py INPUT ', input)

            this.currentCardData.definitionPromise
            .then(definition => {
                this.currentCardData.definition = definition
                return definition.getIdxMatchPinyin(input)
            }).then(matchedIdx => {
                this.currentCardData.setPinyinMatch(true, matchedIdx)
            }).catch(e => {
                this.currentCardData.setPinyinMatch(false, null)
                console.log('Definition error: ', e)
            }).finally(() => {
                this.send('MEANING')
                this.focusMeaning()
            })
        },
        onSubmitMeaning(e) {
            e.preventDefault()
            if (this.meaningInput === "") return

            this.allowPageEnter = false

            const input = this.meaningInput
            this.meaningInput = ""
            console.log('meaning INPUT ', input)

            this.currentCardData.definitionPromise
            .then(definition => {
                return definition.getIdxMatchMeaning(input)
            }).then(meaningIdx => {
                this.currentCardData.setMeaningMatch(true, meaningIdx)
            }).catch(e => {
                this.currentCardData.setMeaningMatch(false, null)
                console.log('Definition error: ', e)
            }).finally(() => {
                this.send('ANSWER')
            })
        },
        setCurrentDefn() {
            console.log('set curre')
            this.currentCardData.setDefinitionPromise()
            this.currentCardData.definitionPromise
            .catch(e => {
                this.send('NODEF')
                console.log(e)
            })
        },
        checkNewCard() {
            if (this.reviewSession.isSRS) {
                if (this.userProgress.newHas(this.currentCardData.word)) {
                    this.send('NEW')
                    this.currentCardData.setNew(true)
                }
            }
        },
        percent(num, denom) {
            return num*100/denom
        },
        rewind(idx) {
            for (let i = this.currentIndex; i >= idx; --i) {
                this.reviewProgress[i].correct = null
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
        },
        keyupEventHandler(ev) {
            if (ev.key == 'Enter') {
                console.log('keyup')
                this.pageEnter()
                this.allowPageEnter = true
            }
        },
        overrideCorrect(correct) {
            this.currentCardData.overrideCorrect(correct)
            this.advanceCard()
        }
    },
    created() {
        console.log('mapping')
        this.reviewProgress = this.reviewSession.cards.map(word => {
            return new Progress({ word })
        })
        console.log('mapped')
        this.checkNewCard()
        this.setCurrentDefn()
        window.addEventListener('keyup', this.keyupEventHandler);
        console.log('starting state')
        this.stateMachine.onTransition((state) => {
            this.currentState = state;
        }).start()
        console.log('started state')
    },
    destroyed() {
        console.log('DONE')
        window.removeEventListener('keyup', this.keyupEventHandler)
    },
    mounted() {
        this.focusPinyin()
        console.log('mounted')
    },
    watch: {
        currentIndex: function() {
            if (this.currentIndex < this.reviewProgress.length) {
                this.checkNewCard()
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

.text-shadow {
    text-shadow: 1px 1px rgba(0, 0, 0, 0.4);
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
    @apply px-4 py-6 bg-gray-900 bg-opacity-50 text-gray-300 flex justify-center items-center rounded h-10 text-2xl font-light;
    @apply whitespace-nowrap;
}
.conveyor-block.correct {
    @apply ring-inset ring-2 ring-green-500
}
.conveyor-block.incorrect {
    @apply ring-inset ring-2 ring-red-500
}

</style>