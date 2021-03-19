<template>
  <div class="hello">
    <div class="navbar navbar-inverse">
      <div class="header-container">
        <div class="navbar-header">
          <a class="navbar-brand" href="/"
            ><img src="../assets/walnut-logo.svg" class="walnut-logo" alt="Walnut.tv Logo"
          /></a>
          <!-- <div class="hide-mobile-landscape hide-desktop collapse-container">
            <button
              aria-expanded="false"
              class="hide-mobile-landscape navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#navbar-collapse-1"
              type="button"
            >
              <span class="sr-only">Toggle navigation</span>
              <span>{{ channel }}</span>
            </button>
            <div class="collapse navbar-collapse" id="navbar-collapse-1">
              <ul class="nav navbar-nav">
                <li
                  v-for="item in channels"
                  v-bind:class="{
                    active: item.title == channel && !searchInput,
                  }"
                >
                  <a v-on:click="changeChannel(item.title)">
                    {{ item.title }}
                  </a>
                </li>
              </ul>
            </div>
          </div> -->
          <div class="hide-mobile-portrait mobile-navbar-portrait">
            <ul class="nav navbar-nav">
              <li
                v-for="item in channels"
                v-bind:key="item.title"
                v-bind:class="{ active: item.title == channel && !searchInput }"
              >
                <a v-on:click="changeChannel(item.title)">
                  {{ item.title }}
                </a>
              </li>
            </ul>
            <!-- <form
              class="hide-mobile-portrait navbar-form"
              v-on:submit="onSubmit($event)"
            >
              <div class="form-group">
                <span
                  class="glyphicon glyphicon-search form-control-feedback"
                ></span>
                <v-select
                  placeholder="search"
                  label="title"
                  :on-search="onSearch"
                  :on-change="onChange"
                  :options="options"
                  v-model="searchInput"
                >
                  <! -- :value.sync="searchInput" -- >
                  <!- - eslint-disable-next-line vue/no-deprecated-slot-scope-attribute, vue/no-deprecated-slot-attribute -- >
                  <template slot="option" slot-scope="option">
                    <span class="fa-youtube"></span>
                    {{ option }}
                  </template>
                  <!- - eslint-disable-next-line vue/no-deprecated-slot-scope-attribute, vue/no-deprecated-slot-attribute -- >
                  <template slot="no-options">
                    <slot name="no-options"></slot>
                  </template>
                </v-select>
              </div>
            </form> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    channels: Array,
  },
  data() {
    return {
      searchInput: '',
      //   videoPlaying: 0,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown-menu {
  padding: 10px 0;
  font-size: 13px;
  min-width: 180px;
}

.dropdown-menu > li > a {
  padding: 6px 20px;
  color: #2e3436;
}
.navbar {
  border-radius: 0;
  min-height: 50px;
  margin-bottom: 0;
}

.navbar-header {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  width: 100%;
}

@media screen and (max-width: 992px) {
  .navbar-toggle {
    margin-right: 0;
  }
}

@media screen and (max-width: 992px) {
  .collapse-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 86px;
  }
}
.navbar-toggle span {
  color: #fff;
  text-transform: uppercase;
}
.navbar-inverse .navbar-nav > li > a {
  color: var(--gray2);
  font-weight: 600;
  padding-left: 14px;
  padding-right: 14px;
}

@media screen and (max-width: 992px) {
  .navbar-inverse .navbar-nav > li > a {
    font-size: 12px;
    padding: 10px 6px;
  }
}

.navbar-form {
  padding-right: 0;
}

@media screen and (max-width: 992px) {
  .navbar-form {
    margin: 10px 0;
    padding: 0;
  }
}

@media screen and (max-width: 992px) and (orientation: landscape) {
  .mobile-navbar-portrait {
    align-items: center;
    display: flex;
  }
}

@media screen and (min-width: 993px) {
  .mobile-navbar-portrait {
    display: inline-flex;
  }
}

.navbar-form .form-control {
  border: 0;
  color: #ccc;
  padding-left: 34px !important;
}

.form-control:focus {
  box-shadow: none;
}

.form-control::placeholder {
  color: #555;
}

.form-control-feedback {
  color: #565656;
  right: initial;
  top: 11px;
}
.navbar-inverse {
  background-color: var(--dark);
  border: none;
}

.navbar-inverse .navbar-nav > .active > a,
.navbar-inverse .navbar-nav > .active > a:focus,
.navbar-inverse .navbar-nav > .active > a:hover {
  background-color: transparent;
}
.navbar-brand {
  display: flex;
  padding: 0;
  margin: 0 20px 0 0;
}

@media screen and (max-width: 992px) {
  .navbar-brand {
    align-self: flex-start;
  }
}

@media screen and (min-width: 992px) {
  .navbar-brand {
    display: flex;
  }
}

.walnut-logo {
  width: 15px;
}

.navbar-nav li {
  cursor: pointer;
  text-transform: uppercase;
}

.header-container {
  padding-left: 30px;
  padding-right: 30px;
}

@media screen and (max-width: 992px) {
  .header-container {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
