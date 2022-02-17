export const removeDups = (postArr) => {
  const cache = {};
  const posts = [];
  postArr.forEach((post) => {
    cache[post.id] ? (cache[post.id] += 1) : (cache[post.id] = 1);
    if (cache[post.id] < 2) posts.push(post);
  });
  return posts;
};
