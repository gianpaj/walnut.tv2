/* eslint-disable no-undef */
<template>
  <div class="main-content">
    <div class="video-container pre-scrollable">
      <div class="embed-container">
        <div class="videoPlayer">
          <youtube :video-id="videoId" ref="youtube" @playing="playing"></youtube>
        </div>
      </div>
      <div class="video-details">
        <a href="{{ playingVideo['permalink'] }}" target="_blank">
          <h2 v-cloak>{{ playingVideo['title'] }}</h2>
        </a>
        <img alt="share" title="share" class="share-icon pull-left" src="/img/share.svg" @click="share(playingVideo)" />
        <!-- <div v-if="playingVideo['ups']">
            <svg
                alt="upvote"
                title="upvote"
                class="up-vote pull-right"
                v-on:click="vote(playingVideo.id, 1)"
                viewBox="0 0 292.362 292.362"
                :class="{ active: voted == 1 }"
            >
                <g>
                <path
                    d="M286.935,197.286L159.028,69.379c-3.613-3.617-7.895-5.424-12.847-5.424s-9.233,1.807-12.85,5.424L5.424,197.286
                    C1.807,200.9,0,205.184,0,210.132s1.807,9.233,5.424,12.847c3.621,3.617,7.902,5.428,12.85,5.428h255.813
                    c4.949,0,9.233-1.811,12.848-5.428c3.613-3.613,5.427-7.898,5.427-12.847S290.548,200.9,286.935,197.286z"
                />
                </g>
            </svg>
            <svg
                alt="downvote"
                title="downvote"
                class="down-vote pull-right"
                v-on:click="vote(playingVideo.id, -1)"
                viewBox="0 0 292.362 292.362"
                :class="{ active: voted == -1 }"
            >
                <g>
                <path
                    d="M286.935,197.286L159.028,69.379c-3.613-3.617-7.895-5.424-12.847-5.424s-9.233,1.807-12.85,5.424L5.424,197.286
            C1.807,200.9,0,205.184,0,210.132s1.807,9.233,5.424,12.847c3.621,3.617,7.902,5.428,12.85,5.428h255.813
            c4.949,0,9.233-1.811,12.848-5.428c3.613-3.613,5.427-7.898,5.427-12.847S290.548,200.9,286.935,197.286z"
                />
                </g>
            </svg>

            <span v-if="voted" class="up-vote-num pull-right">{{ playingVideo['ups'] | shortNumber }}</span>
            </div> -->
      </div>
      <div class="terms-container">
        <a class="terms" target="_black" href="https://www.youtube.com/t/terms">YouTube ToS</a> &nbsp;
        <a class="terms" target="_black" href="https://policies.google.com/privacy">Google Privacy Policy</a>
      </div>
      <div class="video-controls hide-desktop">
        <svg
          alt="previous"
          title="previous"
          class="prev-video pull-left"
          v-on:click="prevVideo()"
          viewBox="0 0 292.362 292.362"
        >
          <!-- :class="{ disabled: videoPlaying < videoList.length }" -->
          <g>
            <path
              d="M286.935,197.286L159.028,69.379c-3.613-3.617-7.895-5.424-12.847-5.424s-9.233,1.807-12.85,5.424L5.424,197.286
  C1.807,200.9,0,205.184,0,210.132s1.807,9.233,5.424,12.847c3.621,3.617,7.902,5.428,12.85,5.428h255.813
  c4.949,0,9.233-1.811,12.848-5.428c3.613-3.613,5.427-7.898,5.427-12.847S290.548,200.9,286.935,197.286z"
            />
          </g>
        </svg>
        <svg
          alt="next"
          title="next"
          class="next-video pull-right"
          v-on:click="nextVideo()"
          viewBox="0 0 292.362 292.362"
        >
          <!-- :class="{ disabled: videoPlaying >= videoList.length - 1 }" -->
          <g>
            <path
              d="M286.935,197.286L159.028,69.379c-3.613-3.617-7.895-5.424-12.847-5.424s-9.233,1.807-12.85,5.424L5.424,197.286
  C1.807,200.9,0,205.184,0,210.132s1.807,9.233,5.424,12.847c3.621,3.617,7.902,5.428,12.85,5.428h255.813
  c4.949,0,9.233-1.811,12.848-5.428c3.613-3.613,5.427-7.898,5.427-12.847S290.548,200.9,286.935,197.286z"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
// import VueYoutube from 'vue-youtube';

export default {
  name: 'PlayerContainer',
  props: {
    playingVideo: Object,
  },
  // components: { VueYoutube },
  data() {
    return {
      videoPlaying: 0,
      videoId: this.$props.playingVideo.youtubeId,
    };
  },
  methods: {
    share(video) {
      let url;
      if (this.channel && this.playingVideo.permalink.includes('reddit.com')) {
        url = `https://walnut.tv/${this.channel}/${video.id}`;
      } else {
        // YouTube
        url = this.playingVideo.permalink;
      }
      // TODO use a Vue JS model
      // $('#shareModal').modal('show');
      document.querySelector('#url-text').value = url;
    },
    prevVideo() {},
    nextVideo() {},

    onPlayerReady() {
      // if we're playing a specific video (e.g. /general/b97ih5)
      this.videoList[this.indexToPlay] && this.play(this.indexToPlay);
    },
    onPlayerError() {
      this.nextVideo();
    },
    onPlayerStateChange(t) {
      0 === t.data && this.autoplay && this.nextVideo();
    },
  },
};
</script>

<style>
.main-content {
  background: #000;
  display: table-cell;
  float: right;
  width: 100%;
}

.video-container {
  padding: 15px 30px 0;

  /* .flex-column */
  -ms-flex-direction: column !important;
  flex-direction: column !important;

  /* row */
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;

  /* .justify-content-between */
  -ms-flex-pack: justify !important;
  justify-content: space-between !important;
}

@media screen and (max-width: 992px) {
  .video-container {
    padding: 5px 10px 0;
  }
}

.video-container .video-details {
  padding: 20px 0 0;

  /* col */
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;
}

@media screen and (max-width: 992px) {
  .video-container .video-details {
    margin: 40px 10px;
  }
}

.video-container .video-controls {
  padding: 20px 0 40px;
}

.video-container .video-details .share-icon,
.video-container .video-details .up-vote,
.video-container .video-details .down-vote {
  cursor: pointer;
  fill: #fff;
  width: 20px;
}

.video-container .video-controls .next-video,
.video-container .video-controls .prev-video {
  cursor: pointer;
  fill: #fff;
  width: 30px;
}

.video-container .video-controls .next-video.disabled,
.video-container .video-controls .prev-video.disabled {
  fill: var(--gray);
}

.video-container .video-details .up-vote.active,
.video-container .video-details .down-vote.active {
  fill: var(--yellow);
}

.video-container .video-details .down-vote {
  transform: rotate(180deg);
}

.video-container .video-controls .prev-video {
  transform: rotate(-90deg);
}

.video-container .video-controls .next-video {
  transform: rotate(90deg);
}

.video-container .embed-container {
  position: relative;
  padding-bottom: 47%;
  height: 0;
  /* overflow: hidden; */

  /* .col */
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;
}

.embed-container embed,
.embed-container iframe,
.embed-container object {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.pre-scrollable {
  height: 100vh;
  max-height: none;
  overflow-y: scroll;
}

.video-details h2 {
  color: #fff;
  font-size: 24px;
}

@media screen and (max-width: 992px) {
  .video-details h2 {
    font-size: 18px;
  }
}

.terms-container {
  padding-bottom: 1rem;

  /* col */
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;

  /* .align-items-end  */
  -ms-flex-align: end !important;
  align-items: flex-end !important;

  /* row */
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  /* margin-right: -15px; */
  /* margin-left: -15px; */
}

.terms {
  color: var(--gray);
}

.terms:active,
.terms:hover,
.terms:focus {
  color: var(--gray2);
  text-decoration: none;
}
</style>