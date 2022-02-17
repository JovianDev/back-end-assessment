import axios from 'axios';
import { removeDups } from '../services';

export const postsController = {};

postsController.getPosts = async (req, res, next) => {
  const params = req.query;

  if (!params.tags) {
    return next('The tags parameter is required');
  }
  if (params.sortby) {
    if (
      params.sortby !== 'id' &&
      params.sortby !== 'reads' &&
      params.sortby !== 'likes' &&
      params.sortby !== 'popularity'
    ) {
      return next('The sortBy parameter is invalid');
    }
  }
  if (params.direction) {
    if (params.direction !== 'asc' && params.direction !== 'desc') {
      return next('The direction parameter is invalid');
    }
  }

  try {
    let tags = params.tags.split(',');
    //async calls to API one tag at a time by mapping through each tag
    let response = await Promise.all(
      tags.map(async (tag) => {
        let tagResponse = await axios.get(
          `https://api.hatchways.io/assessment/blog/posts?tag=${tag}`
        );
        return tagResponse.data.posts;
      })
    );

    const dir = params.direction || 'asc';
    const sortParam = params.sortby || 'id';

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
