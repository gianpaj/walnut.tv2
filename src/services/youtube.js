// TEMP
/* eslint-disable no-unused-vars */
import { mixElementsFromArraysOfArrays } from './utils';

const youtubeApiKey = 'AIzaSyD342vuWxFeyEMKANx58qKyECeNsxlv0f8';

export default function YouTubeService() {
  // function search(query) {
  //   // from youtube-api-v3-search npm
  //   // eslint-disable-next-line no-undef
  //   return searchYoutube(youtubeApiKey, {
  //     part: "snippet",
  //     type: "video",
  //     maxResults: "25",
  //     // videoEmbeddable: 'true',
  //     q: query,
  //   }).then(formatResults);
  // }
  async function loadChannels(channel_s) {
    channel_s = channel_s.split(';');
    // const searches = channel_s.map(channel => getYouTubeChannelSearch(channel));
    // const arrayOfArrayOfVideos = await Promise.all(searches);

    return [
      {
        id: 'videoId', // reddit id
        permalink: `https://www.youtube.com/watch?v=${'videoId'}`,
        title: 'decodeEntities(res.snippet.title)',
        channelTitle: 'channelTitle',
        description: 'description',
        youtubeId: 'videoId',
        imgUrl: toYouTubeImgUrl('videoId'),
        publishedAt: new Date().toString(),
      },
    ];

    // const videos = mixElementsFromArraysOfArrays(arrayOfArrayOfVideos);
    // return [].concat.apply([], videos);
  }
  function getYouTubeChannelSearch(channel) {
    // from youtube-api-v3-search npm
    // eslint-disable-next-line no-undef
    return searchYoutube(youtubeApiKey, {
      part: 'snippet',
      type: 'video',
      maxResults: '25',
      publishedAfter: new Date(new Date() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours back => yesterday
      channelId: channel,
      order: 'date',
    }).then(formatResults);
  }
  function formatResults(results) {
    if (!results.items) return null;
    return results.items.map(res => ({
      id: res.id.videoId, // reddit id
      permalink: `https://www.youtube.com/watch?v=${res.id.videoId}`,
      title: decodeEntities(res.snippet.title),
      channelTitle: res.snippet.channelTitle,
      description: res.snippet.description,
      youtubeId: res.id.videoId,
      imgUrl: toYouTubeImgUrl(res.id.videoId),
      publishedAt: res.snippet.publishedAt,
    }));
  }
  return {
    // search,
    loadChannels,
  };
}

const toYouTubeImgUrl = id => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

const decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  const element = document.createElement('div');

  function decodeHTMLEntities(str) {
    if (str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();
