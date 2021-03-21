<template>
  <NavBar :channels="channels" :channel="channel" />
  <div v-show="!loadingVideos">
    <div class="container">
      <div v-if="!mobile" class="sidebar hidden-sm hidden-xs">
        <VideoList :videoList="videoList" :play="play" />
      </div>
      <PlayerContainer v-if="playingVideo" :playingVideo="playingVideo" />
    </div>
  </div>
  <div v-show="loadingVideos">
    <h2 class="loading-message">
      <span v-html="videoMessage" />
      <img v-show="showSpinner" src="./assets/spin.svg" class="loading-img" alt="Loading Videos" />
    </h2>
  </div>
  <Modal />
</template>

<script>
import NavBar from './components/NavBar.vue';
import VideoList from './components/VideoList.vue';
import PlayerContainer from './components/PlayerContainer.vue';
import Modal from './components/Modal.vue';
import { mixElementsFromArraysOfArrays, getStorage, setStorage } from './services/utils';
import RedditVideoService from './services/reddit';
import YouTubeService from './services/youtube';
import channels from './defaultChannels';

import 'bootstrap/dist/css/bootstrap.min.css';

const redditService = RedditVideoService();
const youtubeService = YouTubeService();

const loadingVideosMessage = 'Loading Videos';

export default {
  name: 'App',
  components: {
    NavBar,
    PlayerContainer,
    VideoList,
    Modal,
  },
  data() {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return {
      autoplay: true,
      channel: null,
      channels,
      indexToPlay: 0,
      loadingVideos: true,
      mobile,
      playingVideo: null,
      showSpinner: true,
      videoList: [],
      videoMessage: loadingVideosMessage,
      videoPlaying: 0,
      videosWatched: [],
      voted: 0,
    };
  },
  mounted() {
    const paths = window.location.pathname.split('/').filter((a) => a);
    this.channel = paths.length === 1 ? paths[0] : 'general';
    this.fetchAllVideos();
    window.addEventListener('keyup', this.keys);
  },
  beforeUnmount() {
    window.removeEventListener('keyup', this.keys);
  },
  methods: {
    getSubReddits: (channel) => channels.find((c) => c.title == channel).subreddit,
    getYouTubeChannels: (channel) => channels.find((c) => c.title == channel).youtubeChannels,
    getChannelMinVotes: (channel) => channels.find((c) => c.title == channel).minNumOfVotes,
    /**
     * @param {string} subreddits
     */
    fetchAllVideos(subreddits) {
      let id, minNumOfVotes, ytChannels, promises;
      const { pathname } = window.location;
      this.loadingVideos = true;
      this.showSpinner = true;
      this.videoMessage = loadingVideosMessage;
      // if changing channel - changeChannel()
      if (!subreddits) {
        if (pathname.split('/').length === 3) {
          id = pathname.split('/')[pathname.split('/').length - 1];
        }

        if (pathname.split('/r/').length > 1) {
          subreddits = this.channel;
          promises = redditService.loadHot(subreddits, minNumOfVotes);
        } else {
          subreddits = this.getSubReddits(this.channel);
          ytChannels = this.getYouTubeChannels(this.channel);
          minNumOfVotes = this.getChannelMinVotes(this.channel);
          promises = Promise.all([
            redditService.loadHot(subreddits, minNumOfVotes),
            ytChannels ? youtubeService.loadChannels(ytChannels) : [],
          ]);
        }
      } else {
        this.channel = null;
        promises = Promise.all([redditService.loadHot(subreddits, minNumOfVotes)]);
      }
      this.videosWatched = getStorage('videosWatched') || [];
      promises
        .then((resolvers) => {
          const [redditVideos, youtubeVideos = []] = resolvers;
          if (window.location.search == '?debug') {
            // eslint-disable-next-line no-console
            console.log(
              redditVideos.map((v) => ({
                subreddit: v.permalink.split('/r/')[1].split('/')[0],
                title: v.title,
                link: v.permalink,
                youtubeId: v.youtubeId,
              }))
            );
            // eslint-disable-next-line no-console
            console.log(
              youtubeVideos.map((v) => ({
                title: v.title,
                link: v.permalink,
                youtubeId: v.youtubeId,
                publishedAt: v.publishedAt,
              }))
            );
          }
          this.showSpinner = false;
          if (redditVideos.length < 1 && youtubeVideos.length < 1) {
            this.videoMessage = "Sorry, we couldn't find any videos in /" + this.channel;

            if (this.searchInput) {
              this.videoMessage = `Sorry, we couldn't find any videos in /r/${this.searchInput}`;
            }
            return;
          }
          this.videoList = mixElementsFromArraysOfArrays([redditVideos, youtubeVideos]);
          // if (searchText) window.history.replaceState(null, null, '/r/' + searchText);
          this.loadingVideos = false;

          // this.playingVideo = redditVideos;
          if (pathname.split('/').length === 3 && pathname.indexOf('/r/') === -1) {
            // find video index to play
            let index = this.videoList.findIndex((v) => v.id === id);
            if (index !== -1) {
              this.indexToPlay = index;
              this.play(index);
              return;
            }
          }
          // this.watched(this.videoList[0].youtubeId);
          this.play(0);
        })
        .catch((error) => {
          this.videoMessage = 'Sorry, there was an error retrieving videos in /' + this.channel;
          if (this.searchInput) {
            this.videoMessage = `Sorry, there was an error retrieving videos /r/${this.searchInput}`;
          }
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    keys(evt) {
      evt = evt || window.event;
      if ('37' == evt.keyCode) {
        this.prevVideo();
      } else if ('39' == evt.keyCode) {
        this.nextVideo();
      }
    },
    playVideo: function (t) {
      if (!this.player || !this.player.loadVideoById) return;
      this.mobile ? this.player.cueVideoById(t.youtubeId) : this.player.loadVideoById(t.youtubeId);
    },
    /**
     * @param {number} i
     */
    play(i) {
      console.log('play', i);
      this.playingVideo = this.videoList[i];
      this.videoPlaying = i;
      this.voted = 0;
      this.watched(this.playingVideo.youtubeId);
      this.playVideo(this.playingVideo);
      if (!this.channel) return;
      if (this.playingVideo.permalink.includes('reddit.com')) {
        // window.history.replaceState(null, null, '/' + this.channel + '/' + this.playingVideo.id);
      }
      // else {
      //   console.log('youtube video');
      // }
    },
    watched(i) {
      if (-1 == this.videosWatched.indexOf(i)) {
        this.videosWatched.push(i);
        const t = JSON.stringify(this.videosWatched);
        setStorage('videosWatched', t);
      }
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 10px;
  -webkit-background-clip: content-box;
  background-clip: content-box;
  background-color: var(--dark);
}
#app {
  font-family: Open Sans, sans-serif;
  font-size: 13px;
  font-weight: 400;
}
.sidebar {
  display: table-cell;
  width: 360px;
}
.background-dark,
body {
  background-color: #000;
}

.loading-message {
  /* FIXME: this hack so the navbar doesn't jump when hiding/showing the videos and the loading spinner */
  height: 100vh;
  text-align: center;
}
.loading-img {
  height: 30px;
}

.container {
  background-color: #000;
  display: table;
  padding: 0;
  width: 100%;
}

.sidebar {
  display: table-cell;
  width: 360px;
}

@media (min-width: 993px) {
  .hide-desktop {
    display: none;
  }
}
</style>
