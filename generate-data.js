const { faker } = require('@faker-js/faker');
const fs = require('fs');

const randomPostList = (n) => {
  if (n < 1) return [];

  const postList = [];

  // loop and push post
  Array.from(new Array(n)).forEach(() => {
    const post = {
      id: faker.datatype.uuid(),
      author: faker.name.findName(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraphs(),
      imageUrl: faker.image.image(1368, 400, true),
      createdAt: Date.now(),
      updateAt: Date.now(),
    };

    postList.push(post);
  });

  return postList;
};

(() => {
  // random data
  const postList = randomPostList(48);

  // prepare db object
  const db = {
    posts: postList,
  };

  // write db object to db json
  fs.writeFile('db.json', JSON.stringify(db), () => {
    console.log('Generate data successfully');
  });
})();
