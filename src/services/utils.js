/**
 * e.g.
 * arrayOfArrays =
 * [[1,2,3], [4,5,6,7,8], [9,10]]
 *
 * return
 * [1, 4, 9, 2, 5, 10, 3, 6, 7, 8]
 *
 * TODO: if we skipped the video of a channel the 2nd video
 *
 * @param {Array<Array<>>} arrayOfArrays
 */
export function mixElementsFromArraysOfArrays(arrayOfArrays) {
  // find the smallest amount of videos for every channel
  const leastAmountOfVids = Math.min.apply(
    null,
    arrayOfArrays.map(arr => arr.length).filter(arr => arr)
  );

  if (arrayOfArrays.length === 1) {
    return arrayOfArrays;
  }

  if (arrayOfArrays.filter(arr => arr.length > 0).length === 0) {
    return [];
  }

  arrayOfArrays = arrayOfArrays.filter(a => a.length);
  let videos = [];
  // get one video of each channel in rotation
  for (let i = 0; i < leastAmountOfVids; i++) {
    for (let j = 0; j < arrayOfArrays.length; j++) {
      const vid = arrayOfArrays[j][i];
      videos.push(vid);
    }
  }
  // get the rest of videos
  for (let k = 0; k < arrayOfArrays.length; k++) {
    const vid = arrayOfArrays[k].slice(leastAmountOfVids);
    videos.push(...vid);
  }

  return videos;
}

export const getStorage = key => {
  if (storageAvailable() && localStorage.getItem(key)) {
    const t = localStorage.getItem(key);
    return JSON.parse(t);
  }
};

const storageAvailable = () => {
  try {
    const n = '__storage_test__';
    window.localStorage.setItem(n, n);
    window.localStorage.removeItem(n);
    return true;
  } catch (_) {
    return false;
  }
};

export const setStorage = (key, t) => {
  if (storageAvailable()) {
    localStorage.setItem(key, t);
  }
};
