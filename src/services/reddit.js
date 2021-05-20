/* eslint-disable no-unused-vars */
import offlineReddittData from '../offlineReddittData';
import reddit from './reddit-package';
import { mixElementsFromArraysOfArrays } from './utils';

const youtubeURL = 'http://www.youtube.com/watch?v=';
const embedLength = '/embed/'.length;

/**
 * @typedef Video
 *
 * @property {string} type 'reddit' | 'youtube' | 'vimeo
 * @property {string} title
 * @property {string} id
 * @property {string} youtubeId
 * @property {string} permalink
 * @property {string} imgUrl
 * @property {string} created_utc
 * @property {number} ups
 * @property {number} voted
 */

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
      return data.media.type.includes('youtube.com') || data.media.type.includes('vimeo.com');
    }
    return false;
  }

  /**
   * @param {VideoResponse} video
   * @param {number} upsMin
   *
   * @returns {boolean}
   */
  function filterByUpvotes(video, upsMin) {
    return video.data.ups >= upsMin;
  }

  const toYouTubeImgUrl = id => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

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
      result.type = 'reddit';
      return result;
    }

    // youtube video
    if (data.media.type === 'youtube.com') {
      const { oembed } = data.media;
      result.type = 'youtube';

      if (oembed.url && oembed.url.indexOf(youtubeURL) === 0) {
        return (result.videoUrl = oembed.html.substring(youtubeURL.length));
      }
      const { html } = oembed;
      const startIndex = html.indexOf('/embed/') + embedLength;
      const endIndex = html.indexOf('?');
      result.videoUrl = html.substring(startIndex, endIndex);
      result.youtubeId = html.substring(startIndex, endIndex);
      result.imgUrl = toYouTubeImgUrl(html.substring(startIndex, endIndex));
    }

    // vimeo video
    if (data.media.type === 'vimeo.com') {
      result.videoUrl = 'vimeo.com';
      result.type = 'vimeo';
    }

    return result;
  }

  // eslint-disable-next-line no-unused-vars
  function dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  /**
   * Load "hottest" video-only reddit posts
   *
   * @param {string} subreddit
   * @param {number} [upsMin]
   * @param {*} after
   *
   * @returns {Array<Videos>}
   */
  function _loadHot(subreddit, upsMin, after) {
    return new Promise((result, reject) => {
      if (typeof subreddit !== 'string') {
        return reject(new Error('Bad subreddit argument value. subreddit should be a string'));
      }
      let query = reddit.hot(subreddit).limit(50);
      if (after) query = query.after(after);

      // console.log(subreddit);
      if (subreddit == 'curiousvideos') {
        // TODO: support "thumbnail": "nsfw"
        const videos = [
          {
            title: 'curious That time the winning team on Survivor were tortured.',
            id: 'mkby6c',
            youtubeId: 'LC1Y0qT9X9Q',
            permalink: `https://www.reddit.co/r/videos/comments/mkby6c/that_time_the_winning_team_on_survivor_were/`,
            imgUrl: 'https://i.ytimg.com/vi/LC1Y0qT9X9Q/hqdefault.jpg',
            created_utc: '',
            ups: '',
            voted: '',
          },
          {
            title:
              'curious Have you ever had a moment in your life where everything just lined up perfectly for you like this man here?',
            id: 1,
            youtubeId: 'a1',
            permalink: `https://www.reddit.com/1`,
            imgUrl: '',
            created_utc: '',
            ups: '',
            voted: '',
          },
        ];
        return result(videos);
      }
      if (subreddit == 'videos') {
        // TODO: support "thumbnail": "nsfw"
        const videos = [
          {
            title: 'General time the winning team on Survivor were tortured.',
            id: 'mkby6c',
            youtubeId: 'LC1Y0qT9X9Q',
            permalink: `https://www.reddit.co/r/videos/comments/mkby6c/that_time_the_winning_team_on_survivor_were/`,
            imgUrl: 'https://i.ytimg.com/vi/LC1Y0qT9X9Q/hqdefault.jpg',
            created_utc: '',
            ups: '',
            voted: '',
          },
          {
            title:
              'general you ever had a moment in your life where everything just lined up perfectly for you like this man here?',
            id: 1,
            youtubeId: 'a1',
            permalink: `https://www.reddit.com/1`,
            imgUrl: '',
            created_utc: '',
            ups: '',
            voted: '',
          },
        ];
        return result(videos);
      }

      // eslint-disable-next-line no-unreachable
      query.fetch(
        res => {
          if (res.error) return reject(res);
          let videos = res.data.children.filter(isVideoObject);

          if (upsMin) {
            videos = videos.filter(vid => filterByUpvotes(vid, upsMin));
          }

          videos = videos.map(childObjectToDomainVideoModel).filter(v => v.type === 'youtube');

          result(videos);
        },
        // err contains the error from Reddit
        err => reject(err)
      );
    });
  }

  /**
   * Get videos from subreddit(s)
   *
   * @param {string} subreddits one or more subreddit - e.g. 'funny' or' 'funny;cool'
   * @param {number} upsMin minimum amount of up votes per video
   */
  async function loadHot(subreddits, upsMin) {
    const subredditsArr = subreddits.split(';');
    const promises = subredditsArr.map(subreddit => _loadHot(subreddit, upsMin));

    const arrayOfArrayOfVideos = await Promise.all(promises);

    let videos = mixElementsFromArraysOfArrays(arrayOfArrayOfVideos);

    const uniq = {};
    // remove duplicate videos
    videos = videos.filter(arr => !uniq[arr.videoUrl] && (uniq[arr.videoUrl] = true));

    return [].concat.apply([], videos);
    // .sort(dynamicSort("created_utc"));
  }

  // public interface
  return {
    loadHot,
  };
}
