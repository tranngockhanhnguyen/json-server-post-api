# Posts API

This is just a simple RESTAPI powered by json-server.
This project is aimed to use for testing and learning only.

🎉 Post API Guide
API_URL: https://js-post-api.herokuapp.com/api
Get a list of posts
GET /posts
Supported query params:

_limit: Limit the number of items per page.
_page: Current page.
_sort: Indicate which field should be sorted on
_order: Indicate sort direction.
Eg: Get page 2 posts with 10 posts/page

GET /posts/:postId?_limit=10&_page=2
Eg: Sort post to get the latest posts first.

GET /posts/:postId?_sort=updatedAt&_order=desc
To get a post detail
GET /posts/:postId
To add a new post
POST /posts
Sample payload:

{
  title: 'Some cool title',
  author: 'Tran Nguyen',
  description: 'Awesome post',
  imageUrl: 'https://picsum.photos/id/580/1368/400',
}
To update a post
PATCH /posts/:postId
Please ONLY include changes to your payload:

{
  id: 'your-post-id',
  title: 'My new title',
}
To remove a post
DELETE /posts/:postId

Run dev:

```sh
yarn dev
```

Prod start:

```sh
yarn start
```
