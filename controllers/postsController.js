import axios from 'axios';

export const postsController = {};

postsController.getPosts = async (req, res, next) => {
  console.log('PARAMS ', req.query);

  if (!req.query.tags) {
    return next('The tags parameter is required');
  }
  if (req.query.sortby) {
    if (
      req.query.sortby !== 'id' &&
      req.query.sortby !== 'reads' &&
      req.query.sortby !== 'likes' &&
      req.query.sortby !== 'popularity'
    ) {
      return next('The sortBy parameter is invalid');
    }
  }
  if (req.query.direction) {
    if (req.query.direction !== 'asc' && req.query.direction !== 'desc') {
      return next('The direction parameter is invalid');
    }
  }

  try {
    let tags = req.query.tags.split(',');
    //async calls to API one tag at a time by mapping through each tag
    let response = await Promise.all(
      tags.map(async (tag) => {
        let tagResponse = await axios.get(
          `https://api.hatchways.io/assessment/blog/posts?tag=${tag}`
        );
        return tagResponse.data.posts;
      })
    );
    //would usually have helper fxns in a utils file and import but here for sake of review
    // helper fxn to remove duplicate posts that happened to have multiple queried tags
    const removeDups = (postArr) => {
      const cache = {};
      const posts = [];
      postArr.forEach((post) => {
        cache[post.id] ? (cache[post.id] += 1) : (cache[post.id] = 1);
        if (cache[post.id] < 2) posts.push(post);
      });
      return posts;
    };
    const dir = req.query.direction || 'asc';
    const sortParam = req.query.sortby || 'id';

    let uniquePosts = removeDups([...response.flat(tags.length)]).sort(
      (a, b) => {
        return dir === 'desc'
          ? b[sortParam] - a[sortParam]
          : a[sortParam] - b[sortParam];
      }
    );

    res.locals.posts = uniquePosts;
    return next();
  } catch (error) {
    return next(error);
  }
};
