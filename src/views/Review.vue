<template>
    <div class="page section">
        <div class="bg" :class="{'correct-answer': answer_correct, 'incorrect-answer': answer_incorrect}">
            <div class="char-card"> 
                <span :style="get_text_size">{{currentText}}</span>
            </div>
                <form @submit="onSubmit" class="input-container">
                    <input v-model="input_text" class="input" placeholder="pinyin" spellcheck="false">
                </form>
        </div>
    </div>
</template>


<script>
export default {
    name: "Review",
    data() {
        return {
            currentText: "但是",
            input_text: "",
            answer_correct: false,
            answer_incorrect: false,
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
    },
    methods: {
        onSubmit(e) {
            e.preventDefault();
            this.answer_correct = Math.floor(Math.random() * 2) === 1 ? true : false;
            this.answer_incorrect = !this.answer_correct;
            console.log(this.input_text)
        }
    }
}
</script>

<style scoped>
.bg {background-color: hsl(45, 100%, 50%); 
    height: 500px;
    width: 400px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 2rem;
    box-shadow: 0 2px 2px rgb(204 197 185 / 50%);
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
    box-shadow: 0 5px 0 rgb(184, 184, 184);
}


@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}


.correct-answer {
    background-color: hsl(100, 80%, 50%);
    transition: 0.2s background-color;
}

.incorrect-answer {
    background-color: hsl(0, 80%, 50%);
    transition: 0.2s background-color;
    animation: shake 0.7s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
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
    text-shadow: 0 2px 0 rgb(184, 184, 184);
    border-bottom: 2px solid rgba(255, 255, 255, 0.4);
    transition: 0.2s border-bottom;
    padding: 10px;
    box-sizing: border-box;
    caret-color: rgba(255, 255, 255, 0.8);
}

.input:focus {
    outline: none;
    border-bottom: 5px solid white;
}

.input:hover {
    outline: none;
    border-bottom: 5px solid white;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
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