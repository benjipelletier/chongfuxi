<template>
    <div class="bg-gray-800 min-h-screen">
        <div class="w-full flex flex-col justify-center pt-16">
            <div class="w-full bg-gray-900 relative"> 

                <div class="z-0 h-full w-full absolute">
                    <div class="h-full absolute left-0 right-1/2 flex items-center">
                        <div class="conveyor-bg left-conveyor justify-end overflow-hidden">
                            <button @mouseover="rewindHoverIdx = i" @mouseleave="rewindHoverIdx = -1" class="relative conveyor-block focus:outline-none active:outline-none hover:cursor-pointer" @click="rewind(i)" :class="{'correct': block.correct, 'incorrect': !block.correct}" v-for="(block, i) in vocabResponses.slice(0, currentIndex)" :key="block.word">
                                <div class="w-full h-full absolute flex justify-center items-center">
                                    <svg v-if="rewindActive(i)" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="#d6d6d6">
                                        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                    </svg>
                                </div>
                                <span :class="{'text-white text-opacity-0': rewindActive(i)}">{{block.word}}</span>
                            </button>
                        </div>
                    </div>
                    <div class="h-full absolute right-0 left-1/2 flex items-center"> 
                        <div class="conveyor-bg right-conveyor overflow-hidden">
                            <div class="conveyor-block" v-for="(block, i) in vocabResponses.slice(currentIndex + 1)" :key="'conv-right-'+i">{{block.word}}</div>
                        </div>
                    </div>
                </div>
                <transition-group tag="div" class="w-full flex justify-center py-10" name="slide">
                    <div class="w-72 z-20 flex-col justify-center rounded-3xl char-card relative" v-for="i in [currentIndex]" :key="i"
                    :class="{
                        'correct-answer': currentState.matches('answer') && vocabResponses[i].correct === true,
                        'incorrect-answer': currentState.matches('answer') && vocabResponses[i].correct === false, }"
                    >
                                <div v-if="currentState.matches('stats')">
                                    sdf
                                </div>
                                <div v-else class="flex flex-col">
                                    <div v-if="currentState.matches('answer')" class="h-1/5 w-full flex justify-center items-center">
                                        <span v-if="vocabResponses[i].matchedDefn"> {{vocabResponses[i].matchedDefn.pinyin}}</span>
                                    </div>
                                    <div class="flex-grow h-3/5 w-full flex justify-center items-center">
                                        <span :style="get_text_size(reviewSession.cards[i])">{{reviewSession.cards[i]}}</span>
                                    </div>
                                    <div v-if="currentState.matches('answer')" class="h-1/5 w-full">
                                        <div v-if="vocabResponses[i].matchedDefn" class="flex">
                                            <span v-for="(meaning, j) in vocabResponses[i].matchedDefn.meaning" :key="j">{{meaning}}</span>
                                        </div>
                                    </div>
                                </div>
                    </div>
                </transition-group>
            </div>
            <div class="w-full h-2 bg-gray-900 flex">
                <div :style="`width: ${percent(numCorrect, reviewSession.cards.length)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                <div :style="`width: ${percent(numIncorrect, reviewSession.cards.length)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            </div>
            <div class="w-full py-10 flex flex-col items-center space-y-8">
                <form @submit="onSubmit" class="w-full h-full flex justify-center items-center">
                    <input ref="input" v-model.trim="inputText" class="input text-5xl text-gray-200" placeholder="pinyin" spellcheck="false" :readonly="currentState.matches('answer')">
                </form>
                <div v-if="showedAnswer.pinyin" class="bg-gray-900 py-6 px-8 text-6xl text-white rounded-lg flex justify-center items-center">
                    <span>{{showedAnswer.pinyin}}</span>
                    <div class="absolute -left-full top-0 w-full text-right px-8 font-bold text-5xl opacity-10" >
                        拼音
                    </div>
                </div>
                <div v-if="showedAnswer.defn" class="bg-gray-900 p-4 text-xl text-white rounded-lg flex justify-center items-center space-x-4 relative">
                    <div v-for="(defn, i) in showedAnswer.defn" :key="'defn'+i" class="justify-center items-center bg-gray-700 py-2 px-4 rounded text-gray-200">
                        {{defn}}
                    </div>
                    <div class="absolute -left-full top-0 w-full text-right px-8 font-bold text-5xl opacity-10" >
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
    initial: 'review',
    states: {
        review: {
            states: {
                pinyin: { on: { NEXT: 'defn' }},
                defn: { on: { NEXT: 'pinyin' }}
            }
        },
        answer: {
            initial: 'pinyin',
            on: {
                NEXT: [
                    {
                        target: 'stats',
                        cond: (ctx, evt) => { console.log('evt', evt.query.isLast); return evt.query.isLast }
                    },
                    {
                        target: 'review',
                    }
                ],
                REWIND: 'review'
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
            inputText: "",
            currentIndex: 0,
            rewindHoverIdx: -1,
            vocabResponses: [],
            swiperOptions: {
                slidesPerView: "auto",
                centeredSlides: true,
                spaceBetween: 20,
                allowTouchMove: false,
            },
            showedAnswer: {
                pinyin: null,
                defn: ['hello', 'nice', 'cool']
            }
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
        async onSubmit(e) {
            e.preventDefault();

            if (this.inputText === "") return
            console.log('INPUT ', this.inputText)

            if (this.currentState.matches('review')) {

                Definition.get(this.reviewSession.cards[this.currentIndex])
                .then(response => {
                    this.vocabResponses[this.currentIndex].definition = response
                    return response.getDefnByPinyin(this.inputText)
                }).then(defn => {
                    this.vocabResponses[this.currentIndex].matchedDefn = defn
                    this.vocabResponses[this.currentIndex].correct = true
                }).catch(e => {
                    console.log('Definition error: ', e)
                    this.vocabResponses[this.currentIndex].correct = false
                })


            } else if (this.currentState.matches('answer')) {
                // next card
                this.currentIndex++;
                this.inputText = "";
                this.$nextTick(() => this.$refs.input[0].focus())
            } 

            this.send({ type: 'NEXT', query: { isLast: this.currentIndex === this.reviewSession.cards.length}})
            return

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
                definition: null,
                matchedDefn: null,
                correct: null
            }
        })
    },
    created() {
        this.stateMachine.onTransition((state) => {
            this.currentState = state;
        }).start()
    },
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

.char-card {
    background-color: white;
    margin-bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    box-shadow: var(--big-card-shadow-inset);
    transition: 0.2s box-shadow
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
    background-color: transparent;
    text-align: center;
    @apply py-2 bg-gray-700 rounded-lg;
}

.input::placeholder {
    @apply text-gray-800;
}

.input:focus::placeholder {
    @apply text-gray-700;
}

.input:focus {
    outline: none;
    @apply border-b-0 border-gray-800 bg-gray-900 shadow-xl;
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