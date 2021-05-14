<template>
    <div class="page section">
        <div>
            <!-- <swiper ref="mySwiper" class="char-list-container" :options="swiperOptions"
                :allowTouchMove="false">
                <swiper-slide class="swiper-slide"  v-for="(char, i) in reviewSession.cards" :key="i">
                    <div class="rounded display-card-wrapper">
                        <div class="display-card rounded" 
                            :class="{'current-display-card': i == currentIndex,
                                    'disabled-display-card': i != currentIndex}">
                            {{char}} 
                        </div>
                    </div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper> -->
            <div class="char-list-container">
                <div class="rounded display-card-wrapper" 
                    v-for="(char, i) in reviewSession.cards" 
                    :key="i">
                    <div class="display-card rounded" 
                        :class="{'current-display-card': i == currentIndex,
                                 'disabled-display-card': i != currentIndex}">
                        {{char}} 
                    </div>
                </div>
            </div>
        </div>
        <transition-group tag="div" class="cards-wrapper" name="slide">
            <div class="card-background" v-for="i in [currentIndex]" :key="i">
                    <div class="char-card" :class="{'correct-answer': answerCorrect, 'incorrect-answer': answerIncorrect}">
                        <span :style="get_text_size">{{reviewSession.cards[i]}}</span>
                    </div>
                    <form @submit="onSubmit" class="input-container">
                        <input ref="input" v-model="inputText" class="input" placeholder="pinyin" spellcheck="false">
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
    props: [
    ],
    data() {
        return {
            swiperOptions: {
                slidesPerView: 10,
                // centeredSlides: true,

            },
            currentText: "",
            inputText: "",
            answerCorrect: false,
            answerIncorrect: false,
            characters: ["你", "好", "吗", "你", "好", "吗", "你", "好", "吗", "你", "好", "吗", "你", "好", "吗"],
            currentIndex: 0
        }
    },
    computed: {

        get_text_size() {
            // dynamically change font size based on char count
            let size = 8
            if (this.currentText.length > 3) size = 4
            else if (this.currentText.length > 2) size = 6

            return `font-size: ${size}rem;`
        },
        ...mapGetters({
            reviewSession: 'getReviewSession'
        })
    },
    methods: {
        onSubmit(e) {
            e.preventDefault();
            if (this.inputText.trim() == "") return;
            this.answerCorrect = Math.floor(Math.random() * 2) === 1 ? true : false;
            this.answerIncorrect = !this.answerCorrect;
            this.currentIndex++;
            this.inputText = "";
            this.$nextTick(() => this.$refs.input[0].focus())
        }
    },
    mounted() {
        this.$refs.input[0].focus()
    },
}

</script>

<style scoped>

.section {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    background-color: #4158D0;
    background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
}

.section > div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.char-list-container {
    width: 100%;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    /* box-shadow: 0px 3px 0 rgb(0, 0, 0, 0.1); */
}

.swiper-slide {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.display-card-wrapper {
    position: relative; 
    width: 50px;
    height: 60px;
    margin: 0.5rem;
}

.display-card {
    padding: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    font-weight: 500;
    /* box-shadow: 2px 2px 0 rgb(204 197 185 / 50%); */
    color: rgb(0,0,0,0.2);
    background-color: rgb(0,0,0,0.1);
    transition: all 0.2s;
    position: absolute;
    bottom: 0;
}


.current-display-card, .display-card:hover {
    /* position: absolute; */
    /* background-color: red; */
    background-color: white;
    color: black;
    bottom: 5px;
    box-shadow: 0 0px 0 5px rgb(0,0,0,0.2);
}

.cards-wrapper {
    position: relative;
    overflow: hidden;
    height: 70%;
}

.behind {
    position: absolute;
}

.card-background {
    background-color: rgb(0,0,0,0.2);
    height: 500px;
    width: 400px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 2rem;
    box-shadow: var(--big-card-shadow-inset);
    position: absolute;
}

.char-card {
    background-color: white;
    border-radius: 2rem;
    height: 70%;
    width: 90%;
    top:10px;
    margin: 20px;
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

.input-container {
    width: 100%;
    height: 15%;
    margin: auto;
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
    border-bottom: 2px solid rgba(0, 0, 0, 0.3);
    transition: 0.2s border-bottom;
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
}

.section {
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>