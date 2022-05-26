<template>
  <card>
    <b-row align-v="center" slot="header" >
      <b-col cols="8">
        <h3 class="mb-0">Edit profile </h3>
      </b-col>
      <b-col cols="4" class="text-right">
        <a href="#!" class="btn btn-sm btn-primary">Settings</a>
      </b-col>
    </b-row>

    <b-form @submit.prevent="updateProfile">
      <h6 class="heading-small text-muted mb-4">User information</h6>

      <div class="pl-lg-4">
        <b-row>
          <b-col lg="6">
            <base-input
              type="text"
              label="Username"
              placeholder="Username"
              v-model="userInfo.userName"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="text"
              label="Tel"
              placeholder="PhoneNum"
              v-model="userInfo.userTel"
            >
            </base-input>
          </b-col>
        </b-row>
        <b-row >
          <b-col lg="12">
            <base-input
              type="text"
              label="Address"
              placeholder="Address"
              v-model="userInfo.userAddr"
            >
            </base-input>
          </b-col>
        </b-row>
      </div>
      <hr class="my-4">
      <div class="text-center">
        <b-button type="submit" variant="primary" class="mt-4">Save</b-button>
      </div>
    </b-form>
  </card>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      userInfo: {
        // userId: '',
        userName: '',
        userPwd: '',
        userAddr: '',
        userTel: '',
      },
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions(["updateUser"]),
    init() {
      this.userInfo.userName = this.user.userName;
    },
    updateProfile() {
      console.log("updateProfile 호출");
      // this.updateUser(this.userInfo);
      let token = sessionStorage.getItem("access-token");
      this.updateUser(this.token);
      // alert('Your data: ' + JSON.stringify(this.user));
    }
  }
};
</script>
<style></style>
