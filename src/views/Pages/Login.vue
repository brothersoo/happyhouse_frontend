<template>
  <div>
    <!-- Header -->
    <!-- content에 자신의 OAuth2.0 클라이언트ID를 넣습니다. --> 
 <!--<meta name ="google-signin-client_id" content="592971916286-k121r5vuo8tsd8h0fe3t28enaqqie8cf.apps.googleusercontent.com">-->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9"> 
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white">Welcome!</h1>
              <p class="text-lead text-white">Use these awesome forms to login or create new account in your project for
                free.</p>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <b-container class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <b-card-header class="bg-transparent pb-5"  >
              <div class="text-muted text-center mt-2 mb-3"><small>Sign in with</small></div>
              <div class="btn-wrapper text-center">
                <a href="#" class="btn btn-neutral btn-icon" id="GgCustomLogin">
                  <span class="btn-inner--icon"><img src="img/icons/common/github.svg"></span>
                  <span class="btn-inner--text">Github</span>
                </a>
                <a href="javascript:void(0)" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"><img src="img/icons/common/google.svg"></span>
                  <span class="btn-inner--text">Google</span>
                </a>
              </div>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>Or sign in with credentials</small>
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative
                              class="mb-3"
                              name="Id"
                              :rules="{required: true}"
                              prepend-icon="ni ni-hat-3"
                              placeholder="ID"
                              v-model="user.userid">
                  </base-input>

                  <base-input alternative
                              class="mb-3"
                              name="Password"
                              :rules="{required: true, min: 6}"
                              prepend-icon="ni ni-lock-circle-open"
                              type="password"
                              placeholder="Password"
                              v-model="user.password">
                  </base-input>

                  <b-form-checkbox v-model="user.rememberMe">Remember me</b-form-checkbox>
                  <div class="text-center">
                    <base-button type="primary" native-type="submit" class="my-4">Sign in</base-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
          <b-row class="mt-3">
            <b-col cols="6">
              <router-link to="/dashboard" class="text-light"><small>Forgot password?</small></router-link>
            </b-col>
            <b-col cols="6" class="text-right">
              <router-link to="/register" class="text-light"><small>Create new account</small></router-link>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container> -->
  </div> 
</template>
<script>
// import { mapState, mapActions } from "vuex";

  export default {
    data() {
      return {
        userid: '',
        password: '',
        rememberMe: false
      };
    },
//     computed: {
//       ...mapState(["isLogin", "isLoginError"]),
//     },
    methods: {
//       ...mapActions(["userConfirm", "getUserInfo"]),
      loginSubmit(){
        let saveData = {};
        saveData.userId = this.useiId;
        saveData.userPwd = this.userPassword;

        try {
          http
            .post("/login", JSON.stringify(saveData), {
              headers: {
                "Content-Type": `application/json`,
              },
            })
            .then((res) => {
              if (res.status === 200) {
                this.$store.commit("SET_LOGIN", res.data);
                this.$router.push("/");
              }
            });
        } catch (error) {
          console.error(error);
        }
      }
//       init() {
//         gapi.load('auth2', () => {
//           gapi.auth2.init();
//           options = new gapi.auth2.SigninOptionsBuilder();
//           options.setPrompt('select_account');
//               // 추가는 Oauth 승인 권한 추가 후 띄어쓰기 기준으로 추가
//           options.setScope('email profile openid https://www.googleapis.com/auth/user.birthday.read');
//               // 인스턴스의 함수 호출 - element에 로그인 기능 추가
//               // GgCustomLogin은 li태그안에 있는 ID, 위에 설정한 options와 아래 성공,실패시 실행하는 함수들
//           gapi.auth2.getAuthInstance().attachClickHandler('GgCustomLogin', options, onSignIn, onSignInFailure);
//       })
//       },
//       async onSubmit() {
//         await this.userConfirm(this.user);
//         let token = sessionStorage.getItem("access-token");
//         if (this.isLogin) {
//           await this.getUserInfo(token);
//           this.$router.push("/");
//         }
//       },
//       onSignIn(googleUser) {
//         var access_token = googleUser.getAuthResponse().access_token
//         $.ajax({
//             // people api를 이용하여 프로필 및 생년월일에 대한 선택동의후 가져온다.
//           url: 'https://people.googleapis.com/v1/people/me'
//               // key에 자신의 API 키를 넣습니다.
//           , data: {personFields:'birthdays', key:'AIzaSyARCvy4W2xIX3UUpK_9dMTpnNcv4hl4yHE', 'access_token': access_token}
//           , method:'GET'
//         })
//         .done(function(e){
//               //프로필을 가져온다.
//           var profile = googleUser.getBasicProfile();
//           console.log(profile)
//         })
//         .fail(function(e){
//           console.log(e);
//         })
//       },
//       onSignInFailure(t){
//         console.log(t);
//       }
    },

  };
</script>
<!--<script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>-->
