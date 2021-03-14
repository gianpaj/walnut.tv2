import reddit from './reddit-package'
import { mixElementsFromArraysOfArrays } from "./utils";

const youtubeURL = "http://www.youtube.com/watch?v=";
const embedLength = "/embed/".length;

export default function RedditVideoService() {
  /**
   * @returns {boolean}
   */
  function isVideoObject(obj) {
    const { data } = obj;
    // reddit videos
    if (data.is_video === true) return true;

    // debug only - return only reddit videos
    // return false;

    if (data.media !== null) {
      return (
        data.media.type.includes("youtube.com") ||
        data.media.type.includes("vimeo.com")
      );
    }
    return false;
  }

  /**
   * @returns {boolean}
   */
  function filterByUpvotes(video, upsMin) {
    return video.data.ups >= upsMin;
  }

  const toYouTubeImgUrl = (id) =>
    `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

  function childObjectToDomainVideoModel(video) {
    const { data } = video;
    const result = {};
    result.title = data.title;
    result.id = data.id;
    result.permalink = `https://www.reddit.com/${data.permalink}`;
    result.created_utc = data.created_utc;
    result.ups = data.ups;
    result.voted = 0;

    // reddit video
    if (data.is_video) {
      result.videoUrl = data.media.reddit_video.fallback_url;
      result.type = "reddit";
      return result;
    }

    // youtube video
    if (data.media.type === "youtube.com") {
      const { oembed } = data.media;
      result.type = "youtube";

      if (oembed.url && oembed.url.indexOf(youtubeURL) === 0) {
        return (result.videoUrl = oembed.html.substring(youtubeURL.length));
      }
      const { html } = oembed;
      const startIndex = html.indexOf("/embed/") + embedLength;
      const endIndex = html.indexOf("?");
      result.videoUrl = html.substring(startIndex, endIndex);
      result.youtubeId = html.substring(startIndex, endIndex);
      result.imgUrl = toYouTubeImgUrl(html.substring(startIndex, endIndex));
    }

    // vimeo video
    if (data.media.type === "vimeo.com") {
      result.videoUrl = "vimeo.com";
      result.type = "vimeo";
    }

    return result;
  }

  // eslint-disable-next-line no-unused-vars
  function dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      const result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  function _loadHot(channel, upsMin, after) {
    return new Promise((result, reject) => {
      if (typeof channel !== "string") {
        return reject(
          new Error("Bad channel argument value. Channel should be a string")
        );
      }
      let query = reddit.hot(channel).limit(50);
      if (after) query = query.after(after);

      query.fetch(
        (res) => {
          if (res.error) return reject(res);
          let videos = res.data.children.filter(isVideoObject);

          if (upsMin) {
            videos = videos.filter((vid) => filterByUpvotes(vid, upsMin));
          }

          videos = videos
            .map(childObjectToDomainVideoModel)
            .filter((v) => v.type === "youtube");

          result(videos);
        },
        // err contains the error from Reddit
        (err) => reject(err)
      );
    });
  }

  /**
   * Get videos from subreddit(s)
   *
   * @param {string} channel_s one or more channels - e.g. 'funny' or' 'funny;cool'
   * @param {number} upsMin minimum amount of up votes per video
   * TODO: @ param {*} after reddit id to load more videos for multiple channels
   */
  async function loadHot(channel_s, upsMin) {
    const channel_arr = channel_s.split(";");
    // console.warn("fetching", channel_s.length, "channels");
    const promises = channel_arr.map((channel) => _loadHot(channel, upsMin));

    const arrayOfArrayOfVideos = await Promise.all(promises);

    let videos = mixElementsFromArraysOfArrays(arrayOfArrayOfVideos);

    const uniq = {};
    // remove duplicate videos
    videos = videos.filter(
      (arr) => !uniq[arr.videoUrl] && (uniq[arr.videoUrl] = true)
    );

    return [].concat.apply([], videos);
    // .sort(dynamicSort("created_utc"));
  }

  // public interface
  return {
    loadHot,
  };
}
