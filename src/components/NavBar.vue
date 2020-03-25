<template>
  <header class="navbar" :class="{ offline: !networkOnLine }">
    <div class="navbar-header">
      <router-link to="/home">
        <div class="navbar-brand">
          <img alt="walnut.tv logo" class="logo" src="@/assets/img/walnut-logo.svg" />
        </div>
      </router-link>
      <ul class="nav navbar-nav">
        <li v-for="item in channels" :key="item.title" :class="{ active: item.title == channel && !searchInput }">
          <a @click="changeChannel(item.title)"> {{ item.title }} </a>
        </li>
      </ul>

      <div class="links">
        <!-- desktop -->
        <nav class="nav-links">
          <div class="nav-item">
            <router-link to="/products">Products</router-link>
          </div>
          <div v-if="!isUserLoggedIn && networkOnLine" class="nav-item">
            <router-link to="/login">Login</router-link>
          </div>
          <div v-if="isUserLoggedIn && networkOnLine" class="nav-item logout-item" @click="logout">
            <a>Logout</a>
          </div>
          <div v-if="!networkOnLine" class="nav-item offline-label">Offline</div>
        </nav>

        <img v-if="isUserLoggedIn && networkOnLine" class="user-picture can-hide" :src="user.photoURL" alt="Avatar" />
      </div>
    </div>
  </header>
</template>

<script>
import firebase from 'firebase/app';
import { mapGetters, mapState } from 'vuex';

const channels = [
  {
    title: 'general',
    subreddit: 'videos',
    minNumOfVotes: 100,
    // youtubeChannels: 'UCsvn_Po0SmunchJYOWpOxMg;UCzQUP1qoWDoEbmsQxvdjxgQ',
  },
  {
    title: 'curious',
    subreddit: 'curiousvideos;mealtimevideos;futurology;educativevideos;watchandlearn;sciencevideos',
    minNumOfVotes: 3,
    youtubeChannels:
      'UCzQUP1qoWDoEbmsQxvdjxgQ;UC4a-Gbdw7vOaccHmFo40b9g;UCpVm7bg6pXKo1Pr6k5kxG9A;UCvJiYiBUbw4tmpRSZT2r1Hw;UCGs1JjiRBEKMlVD4eUxJ2ww;UCX6b17PVsYBQ0ip5gyeme-Q;UCDsElQQt_gCZ9LgnW-7v-cQ;UCmmPgObSUPw1HL2lq6H4ffA;UCtGG8ucQgEJPeUPhJZ4M4jA;UC7IcJI8PUf5Z3zKxnZvTBog;UCGi_crMdUZnrcsvkCa8pt-g;UCZYTClx2T1of7BRZ86-8fow;UCC552Sd-3nyi_tk2BudLUzA;UC6107grRI4m0o2-emgoDnAA;UCUHW94eEFW7hkUMVaZz4eDg;UC06E4Y_-ybJgBUMtXx8uNNw;UC9uD-W5zQHQuAVT2GdcLCvg',
  },
  {
    title: 'science',
    subreddit: 'physics;biology;psychology;lectures;space;philosophy;math',
    minNumOfVotes: 3,
  },
  {
    title: 'documentaries',
    subreddit: 'documentaries',
    minNumOfVotes: 10,
  },
  {
    title: 'music',
    subreddit: 'listentothis',
    minNumOfVotes: 5,
  },
  {
    title: 'active',
    subreddit: 'climbing;kayaking;theocho;surfing;sports;adrenaline',
    minNumOfVotes: 1,
    youtubeChannels:
      'UCSqk_coiJhy9FMyr_Go8ftg;UCB5nIbygLmBO6hBjhilxREQ;UCFXRhM8mT2spmusw-HoyENA;UCe0TLA0EsQbE-MjuHXevj2A;UCHI0kOgUQRkJcEBmDsHVh1A;UCHVdwBKQFsAD2rNF0JwE-cg',
  },
  {
    title: 'food',
    subreddit: 'veganrecipes;permaculture;FoodVideos;cookingvideos',
    textColor: '',
    minNumOfVotes: 5,
    youtubeChannels:
      'UCbpMy0Fg74eXXkvxJrtEn3w;UCUnFheTbVpASikm0YPb8pSw;UCD5WWnRed32y3xGwmrDhUiQ;UCHmdRuKUSB7xrbv8uC0TKxg;UCpSgg_ECBj25s9moCDfSTsA;UCpprBWvibvmOlI8yJOEAAjA;UCJHA_jMfCvEnv-3kRjTCQXw;UCxr2d4As312LulcajAkKJYw;UCwZcpfUOuLH9UEXvFPHIAWQ;UCb75CvYbm5BXpbEkGqFKABw;UC1GO0P2HsI0XLiMalC5_wQw;UCQBG3PzyQKY8ieMG2gDAyOQ;UCekQr9znsk2vWxBo3YiLq2w;UCD5WWnRed32y3xGwmrDhUiQ;UCPD_bxCRGpmmeQcbe2kpPaA;UCxD2E-bVoUbaVFL0Q3PvJTg;UCxAS_aK7sS2x_bqnlJHDSHw;UCaLfMkkHhSA_LaCta0BzyhQ;UCJFp8uSYCjXOMnkUyb3CQ3Q;UCzH5n3Ih5kgQoiDAQt2FwLw;UCRIZtPl9nb9RiXc9btSTQNw;UCIEv3lZ_tNXHzL3ox-_uUGQ;UChBSJmgtiMGG1IUUuzj9Acw;UCARXOI1UlItgIevoI5jZViQ',
  },
  {
    title: 'crafts',
    subreddit: 'artisanvideos;maker;howto;woodworking;FastWorkers',
    minNumOfVotes: 5,
    youtubeChannels: 'UCIxAaCJ84uefATKmazDyIjw;UCuGS1iJpM_4ZYFp62mia2xQ',
  },
];

export default {
  data() {
    return {
      // TODO: add to firebase
      channels,
      channel: null,
    };
  },
  computed: {
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle', 'appShortTitle']),
  },
  methods: {
    async logout() {
      await firebase.auth().signOut();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  right: 0;
  height: $navbar-height;
  background-color: $navbar-color;
  box-sizing: border-box;
  border-bottom: 1px solid #eaecef;
  line-height: 2.2rem;

  @media (max-width: 500px) {
    padding: 0.7rem 0.7rem;

    .can-hide {
      display: none;
    }
  }

  .logo {
    height: 25px;
    padding-right: 8px;
  }

  .navbar-nav {
    margin: 7.5px -15px;
    @media (min-width: 768px) {
      float: left;
      margin: 0;
    }

    > li > a {
      color: $gray2-color;
      font-weight: 600;
      padding-left: 14px;
      padding-right: 14px;

      @media screen and (max-width: 992px) {
        font-size: 12px;
        padding: 10px 6px;
      }
    }
  }

  .links {
    padding-left: 1.5rem;
    box-sizing: border-box;
    white-space: nowrap;
    position: absolute;
    right: 1.5rem;
    top: 0.7rem;
    display: flex;

    .nav-links {
      display: flex;
      align-items: center;
      justify-content: center;

      .nav-item {
        position: relative;
        display: inline-block;
        margin-left: 1.5rem;
        line-height: 2.2rem;

        &:first-child {
          margin-left: 0;
        }

        a {
          font-weight: 500;
          text-decoration: none;
          color: $navbar-link-color;
          border-color: #2c3e50;
          line-height: 1.4rem;
          display: inline-block;
          cursor: pointer;
        }

        @mixin activatedLink() {
          margin-bottom: -2px;
          border-bottom: 2px solid $vue-color;
        }

        .router-link-active {
          @include activatedLink;
        }

        @media (hover) {
          :hover {
            @include activatedLink;
          }
        }
      }
    }
  }

  &.offline {
    background: $navbar-offline-color;
    .links .nav-links .nav-item a {
      color: white;
    }
  }

  .user-picture {
    max-height: 32px;
    margin-left: 1.5rem;
    border-radius: 50%;
  }

  .offline-label {
    padding: 0px 10px;
    border: 1px solid white;
    border-radius: 5px;
    color: white;
    margin-left: 1.5rem;
  }
}
</style>
