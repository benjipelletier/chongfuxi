<template>
    <div class="page">
        <div class="h-1/3 w-full flex items-center justify-center p-4">
        </div>
        <div class="z-10 h-1/3 w-full relative flex justify-center items-center">
            <div class="h-full absolute left-0 right-1/2 flex items-center">
                <div class="conveyor-bg left-conveyor justify-end overflow-hidden">
                    <button @mouseover="rewindHoverIdx = i" @mouseleave="rewindHoverIdx = -1" class="relative conveyor-block focus:outline-none active:outline-none hover:cursor-pointer" @click="rewind(i)" :class="{'correct': block.correct, 'incorrect': !block.correct}" v-for="(block, i) in progress.words.slice(0, currentIndex)" :key="block.word">
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
                    <div class="conveyor-block" v-for="block in progress.words.slice(currentIndex + 1)" :key="'conv-right-'+block.word">{{block.word}}</div>
                </div>
            </div>
            <!-- <swiper ref="mySwiper" class="w-full flex flex-row flex-wrap" :options="swiperOptions"> 
                <swiper-slide 
                    v-for="(char, i) in reviewSession.cards" 
                    class="py-4 flex items-center justify-center"
                    :key="i">
                    <div class="display-card h-20 w-min flex justify-center p-4 items-center rounded" 
                        :class="{'current-display-card': i == currentIndex,
                                    'disabled-display-card': i != currentIndex}">
                        <span class="text-4xl whitespace-nowrap text-gray-900">{{char}} </span>
                    </div>
                </swiper-slide>
            </swiper> -->
        </div>
        <div class="h-1/3"></div>
        <transition-group tag="div" class="w-screen h-screen flex justify-center items-center absolute" name="slide">
            <div class="main-wrapper z-10 absolute flex-col items-center justify-center rounded-3xl bg-opacity-25" v-for="i in [currentIndex]" :key="i">
                    <div class="pt-1 relative h-20">
                    </div>
                    <div class="char-card rounded-3xl relative" :class="{'correct-answer': answerCorrect, 'incorrect-answer': answerIncorrect}">
                        <div class="bottom-0 bg-gray-300 w-10/12 absolute overflow-hidden h-2 mb-4 text-xs flex rounded">
                            <div :style="`width: ${percent(numCorrect, reviewSession.cards.length)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                            <div :style="`width: ${percent(numIncorrect, reviewSession.cards.length)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                        </div>
                        <span :style="get_text_size">{{reviewSession.cards[i]}}</span>
                    </div>
                    <form @submit="onSubmit" class="w-full h-20 flex justify-center items-center">
                        <input ref="input" v-model.lazy.trim="inputText" class="input" placeholder="pinyin" spellcheck="false">
                    </form>
            </div>
        </transition-group>
        <div>
        </div>
    </div>
</template>


<script>
import { mapGetters } from 'vuex'


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
            rewindHoverIdx: -1,
            swiperOptions: {
                slidesPerView: "auto",
                centeredSlides: true,
                spaceBetween: 20,
                allowTouchMove: false,
            },

            currentText: "",
            inputText: "",
            answerCorrect: false,
            answerIncorrect: false,
            currentIndex: 0,
            progress: {
                words: [],
            }
        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.$swiper
        },
        get_text_size() {
            // dynamically change font size based on char count
            let size = 8
            if (this.currentText.length > 3) size = 4
            else if (this.currentText.length > 2) size = 6

            return `font-size: ${size}rem;`
        },
        numCorrect() {
            return this.progress.words.slice(0, this.currentIndex).filter(block => block.correct === true).length
        },
        numIncorrect() {
            return this.progress.words.slice(0, this.currentIndex).filter(block => block.correct === false).length
        },
        ...mapGetters({
            reviewSession: 'getReviewSession'
        })
    },
    methods: {
        onSubmit(e) {
            e.preventDefault();
            if (this.inputText == "") return;
            this.answerCorrect = Math.floor(Math.random() * 2) === 1 ? true : false;
            this.answerIncorrect = !this.answerCorrect;
            this.progress.words[this.currentIndex].correct = this.answerCorrect
            this.currentIndex++;
            // this.swiper.slideTo(this.currentIndex, 200, false)
            this.inputText = "";
            this.$nextTick(() => this.$refs.input[0].focus())
        },
        percent(num, denom) {
            return num*100/denom
        },
        rewind(idx) {
            this.currentIndex = idx
            this.rewindHoverIdx = -1
        },
        rewindActive(i) {
            return this.rewindHoverIdx == i
        },
        rewindHover(i) {
            this.rewindHoverIdx = i
        }
    },
    mounted() {
        this.$refs.input[0].focus()
        this.progress.words = this.reviewSession.cards.map(word => {
            return {
                word,
                correct: null
            }
        })
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
    height: 300px;
    background-color: white;
    margin-bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    box-shadow: var(--big-card-shadow-inset);
    transition: 0.2s background-color;
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


.incorrect-answer {
    background-color: rgba(255, 0, 0 0.4);
}
.form {
    margin: 0;
    padding: 0;
}


.input {
    height: 100%;
    width: 70%;
    caret-color: white;
    color: white;
    font-size: 3rem;
    background-color: transparent; 
    border: none;
    text-align: center;
    text-shadow: 0 2px 0 rgba(0,0,0,0.2);
    border-bottom: 4px solid rgba(0, 0, 0, 0.3);
    padding: 10px;
    box-sizing: border-box;
    caret-color: rgba(255, 255, 255, 0.8);
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

.page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #4158D0;
    background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
}

.conveyor-mid {
    width: 400px;
}

.conveyor-bg {
    @apply items-center flex space-x-2 w-full;
    @apply bg-gray-900 h-24 bg-opacity-30;
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