<template>
    <div v-show="show" class="joinCommunity">
        <!-- virtual bk -->
        <div class="virtual-bk"></div>
        <div class="community-board">
            <!-- board title -->
            <div class="community-content">
                <div class="img-circle" :style="{'background': 'url(' + data.img_url + ')'}"></div>
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
                <input v-if="!emailValid" type="text" name="valid-email" v-model="emailValue" :placeholder="'example' + data.domain" />
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
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';

// import components for this
import dialogs from '../../services/dialogs.js';
import checkIcon from '../../icon/CheckIcon.vue';

// regex
let emailRegexForGju = /^((?!\.)[\w-_.]*[^.])(@gju.edu.jo)$/;
let emailRegexForBank = /^((?!\.)[\w-_.]*[^.])(@bankaletihad.com)$/;

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
            bank_img: process.env.ROUTE_BASE + 'static/img/bank.png',
            emailError: new Error()
        };
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
    computed: {
        ...mapGetters({
            signData: 'auth/singupData'
        })
    },
    methods: {
        ...mapActions({
            doRegister: 'auth/register',
            autoLogin: 'auth/login'
        }),
        validate: function () {
            let globalError = false;
            if (this.data.id === 1) {
                if (!emailRegexForBank.test(this.emailValue)) {
                    this.emailError.state = true;
                    this.emailError.message = 'Your e-mail must be Bank Al Etihad e-mail';
                    globalError = true;
                }
            } else {
                if (!emailRegexForGju.test(this.emailValue)) {
                    this.emailError.state = true;
                    this.emailError.message = 'Your e-mail must be GJU e-mail';
                    globalError = true;
                }
            }
            return globalError;
        },
        validEmail: function () {
            if (this.validate()) {
                dialogs.message('Incorrect email.', { duration: 10, state: 'error' });
                return;
            }

            // verify email
            const email = this.emailValue;
            const pass = '123456';
            const auth = firebase.auth();
            const promise = auth.createUserWithEmailAndPassword(email, pass);
            promise.catch(event => console.log('promise', event.message));

            let vm = this;
            auth.onAuthStateChanged(firebaseUser => {
                if (firebaseUser) {
                    firebaseUser.sendEmailVerification().then(function () {
                        if (vm.data.signStatus === 'signup') {
                            let data = vm.signData;
                            data['email'] = vm.emailValue;
                            // new register
                            vm.doRegister(data).then(response => {
                                console.log('response', response);
                            }).catch((err) => {
                                console.log('err', err);
                            });
                        } else {
                            this.emailValid = true;
                        }
                    }, function (error) {
                        // window.alert('not send Verification');
                    });
                } else {
                    console.log('not logged in');
                }
            })
            console.log('auth', promise);
            dialogs.message('Successfully E-mail validate', { duration: 10, state: 'success' });
            this.emailValid = true;
        },
        goMain: function () {
            if (this.data.signStatus === 'signup') {
                this.$router.push({ name: 'main' });
            } else {
                this.$router.push({ name: 'main' });
            }
        }
    },
    components: {
        checkIcon
    }
};
</script>