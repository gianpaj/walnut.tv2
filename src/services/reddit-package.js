// https://github.com/sahilm/reddit.js/blob/master/reddit.js

const reddit = {};
reddit.hot = function(subreddit) {
  return listing({
    subreddit: subreddit,
    resource: 'hot',
  });
};

reddit.top = function(subreddit) {
  return listing(
    {
      subreddit: subreddit,
      resource: 'top',
    },
    ['t']
  );
};

reddit.controversial = function(subreddit) {
  return listing(
    {
      subreddit: subreddit,
      resource: 'controversial',
    },
    ['t']
  );
};

reddit['new'] = function(subreddit) {
  return listing({
    subreddit: subreddit,
    resource: 'new',
  });
};

reddit.about = function(subreddit) {
  return fetch({
    subreddit: subreddit,
    resource: 'about',
  });
};

reddit.random = function(subreddit) {
  return fetch({
    subreddit: subreddit,
    resource: 'random',
  });
};

reddit.info = function(subreddit) {
  const on = {
    subreddit: subreddit,
    resource: 'api/info',
  };
  return withFilters(on, ['id', 'limit', 'url']);
};

reddit.comments = function(article, subreddit) {
  const on = {
    subreddit: subreddit,
    resource: 'comments/' + article,
  };
  return withFilters(on, ['comment', 'context', 'depth', 'limit', 'sort']);
};

reddit.recommendedSubreddits = function(srnames) {
  const on = {
    resource: 'api/recommend/sr/' + srnames,
  };
  return withFilters(on, ['omit']);
};

reddit.subredditsByTopic = function(query) {
  const on = {
    resource: 'api/subreddits_by_topic',
    params: {
      query: query,
    },
  };
  return fetch(on);
};

reddit.search = function(query, subreddit) {
  const on = {
    subreddit: subreddit,
    resource: 'search',
    params: {
      q: query,
    },
  };
  return withFilters(on, ['after', 'before', 'count', 'limit', 'restrict_sr', 'show', 'sort', 'syntax', 't']);
};

reddit.searchSubreddits = function(query) {
  return listing({
    resource: 'subreddits/search',
    params: {
      q: query,
    },
  });
};

reddit.popularSubreddits = function() {
  return listing({
    resource: 'subreddits/popular',
  });
};

reddit.newSubreddits = function() {
  return listing({
    resource: 'subreddits/new',
  });
};

reddit.user = function(username, where) {
  const on = {
    resource: 'user/' + username + (typeof where === 'undefined' ? '' : '/' + where),
  };
  return withFilters(on, ['show', 'sort', 't', 'type', 'username', 'after', 'before', 'count', 'limit', 'sr_detail']);
};

function listing(on, extras) {
  extras = extras || [];
  return withFilters(on, ['after', 'before', 'count', 'limit', 'show'].concat(extras));
}

function fetch(on) {
  return {
    fetch: function(res, err) {
      getJSON(redditUrl(on), res, err);
    },
  };
}

function withFilters(on, filters) {
  const ret = {};
  on.params = on.params || {};
  filters = filters || [];

  const without = function(object, key) {
    const ret = {};
    for (const prop in object) {
      if (Object.prototype.hasOwnProperty.call(object, prop) && prop !== key) {
        ret[prop] = object[prop];
      }
    }
    return ret;
  };

  const filter = function(f) {
    if (f === 'show') {
      return function() {
        on.params[f] = 'all';
        return without(this, f);
      };
    } else {
      return function(arg) {
        on.params[f] = arg;
        return without(this, f);
      };
    }
  };

  for (let i = 0; i < filters.length; i++) {
    ret[filters[i]] = filter(filters[i]);
  }
  ret.fetch = function(res, err) {
    getJSON(redditUrl(on), res, err);
  };
  return ret;
}

function redditUrl(on) {
  let url = 'https://www.reddit.com/';
  const keys = function(object) {
    const ret = [];
    for (const prop in object) {
      if (Object.prototype.hasOwnProperty.call(object, prop)) {
        ret.push(prop);
      }
    }
    return ret;
  };

  if (on.subreddit !== undefined) {
    url += 'r/' + on.subreddit + '/';
  }
  url += on.resource + '.json';
  if (keys(on.params).length > 0) {
    const qs = [];
    for (const param in on.params) {
      if (Object.prototype.hasOwnProperty.call(on.params, param)) {
        qs.push(encodeURIComponent(param) + '=' + encodeURIComponent(on.params[param]));
      }
    }
    url += '?' + qs.join('&');
  }
  return url;
}

function getJSON(url, res, err) {
  get(
    url,
    function(data) {
      res(JSON.parse(data));
    },
    err
  );
}

function get(url, res, err) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    return res(xhr.response);
  };
  xhr.onerror = function() {
    if (err !== undefined) {
      return err(xhr.response);
    }
  };
  xhr.send();
}

export default reddit;
