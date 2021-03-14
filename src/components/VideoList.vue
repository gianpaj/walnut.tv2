<template>
  <div class="hello">
    <ul class="video-list list-unstyled pre-scrollable" id="toolbox">
      <li
        class="video"
        v-for="(video, index) in videoList"
        v-bind:key="video.index"
        v-bind:data-video-id="index"
        v-cloak
      >
        <a
          v-on:click="play(index)"
          v-bind:class="{ active: videoPlaying == index }"
        >
          <div class="video-thumbnail-image hidden-xs">
            <span class="video-watched">WATCHED</span>
            <!-- <span class="video-watched" v-if="hasBeenWatched(video.youtubeId)">WATCHED</span> -->
            <img
              class="video-image"
              v-bind:src="video.imgUrl"
              v-bind:alt="video.title"
            />
          </div>
          <!-- <div class="video-title" v-bind:title="video.title" v-bind:class="{ watched: hasBeenWatched(video.youtubeId)}"> -->
          <div class="video-title" v-bind:title="video.title">
            <!-- <h4>{{ video.title | maxChar }}</h4> -->
            <h4>{{ video.title }}</h4>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "VideoList",
  props: {
    videoList: Array,
    play: Function,
  },
  data() {
    return {
      videoPlaying: 0,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.video-list .video a {
  padding: 12px 10px;
  color: #dbdce5;
  display: block;
  border-left: 4px solid transparent;
}
.video-list .video a {
  padding: 12px 10px;
  color: #dbdce5;
  display: block;
  border-left: 4px solid transparent;
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

.navbar-form .vs__search {
  border: 0;
  color: var(--gray);
}

.vs__search:focus {
  box-shadow: none;
}

.vs__search::placeholder {
  color: var(--white);
}

.form-control-feedback {
  color: var(--light);
  right: initial;
  top: 11px;
}

.video-list {
  margin-bottom: 0;
}

.video-list li.video:last-child {
  border-bottom: 0;
}

.video-list .video a:hover {
  cursor: pointer;
  border-color: #000;
}

.video-list .video .active {
  background-color: #000;
  border-left: 4px solid var(--yellow);
}

.video-list .video .active:hover {
  border-color: var(--yellow);
}

.video-list .video a::after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.video-list .video .video-thumbnail-image {
  float: left;
  min-height: 40px;
  margin-right: 15px;
  position: relative;
}

.video-list .video-thumbnail-image .video-image {
  max-width: 70px;
}

.video-list .video .video-title {
  float: left;
  width: 230px;
  padding: 0;
}

.video-list .video .video-title h4 {
  font-size: 12px;
  line-height: 16px;
  padding: 0;
  margin: 0;
  color: white;
}

.video-list .video .video-thumbnail-image .video-watched {
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  padding: 2px 4px;
  background-color: #1d2122;
  font-size: 8px;
}

.video-list .video .video-title.watched h4 {
  color: var(--gray);
}

.pre-scrollable {
  height: 100vh;
  max-height: none;
  overflow-y: scroll;
}
</style>
