<template>
    <div v-show="show" class="joinCommunity">
        <!-- virtual bk -->
        <div class="virtual-bk"></div>
        <div class="community-board">
            <!-- board title -->
            <div class="community-content">
                <div class="img-circle" v-imgSrc:src="data.img"></div>
                <div class="community-board-detail">
                    <h3>{{ data.name }}</h3>
                    <span>{{ data.title }}</span>
                </div>
            </div>

            <!-- email valid area -->
            <div class="email-valid">
                <span>
                    {{
                        (!emailValid)? "ENTER EMAIL VALID" : "WE' SENT YOU A CONFIRMATION EMAIL"
                    }}
                </span>
                <input v-if="!emailValid" type="text" name="valid-email" v-model="emailValue" placeholder="example@gju.edu.jo" />
                <span class="error" v-if="emailError.state"> {{emailError.message}} </span>
                <span v-if="emailValid" class="sent-text">
                    Check your email to activate your <p>{{ data.name }}</p> community membership
                </span>
                <button ref="join_btn" v-if="!emailValid" @click="validEmail" disabled="disabled" >Join</button>
                <button @click="goMain" class="email-sent-btn" v-if="emailValid">
                    <checkIcon :color="'#8c8a8a'" />
                    E-mail sent
                </button>
            </div>
            <!-- join btn -->
        </div>
    </div>
</template>

<script>
import dialogs from '../../services/dialogs.js';

// import components for this
import checkIcon from '../../icon/CheckIcon.vue';

// regex
let emailRegex = /^((?!\.)[\w-_.]*[^.])(@gju.edu.jo)$/;

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'joinCommunity',
    data () {
        return {
            emailValue: '',
            emailValid: false,
            emailError: new Error()
        }
    },
    props: {
        data: {
            type: Object,
            required: true,
            default: {}
        },
        show: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    watch: {
        emailValue: function () {
            if (this.emailValue === '') {
                this.$refs.join_btn.setAttribute('disabled', 'disabled');
            } else {
                this.$refs.join_btn.removeAttribute('disabled');
            }
            this.emailError.state = false;
        }
    },
    methods: {
        validate: function () {
            let globalError = false;
            if (!emailRegex.test(this.emailValue)) {
                this.emailError.state = true;
                this.emailError.message = 'Your e-mail must be GJU e-mail';
                globalError = true;
            }

            return globalError;
        },
        validEmail: function () {
            if (this.validate()) {
                dialogs.message('Incorrect email.', { duration: 10, state: 'error' });
                return;
            }

            dialogs.message('Successfully E-mail validate', { duration: 10, state: 'success' });
            this.emailValid = true;
        },
        goMain: function () {
            this.$router.push({ name: 'main' });
        }
    },
    components: {
        checkIcon
    }
}
</script>