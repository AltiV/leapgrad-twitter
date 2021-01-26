# Twitter Clone API Demo

![Heroku](https://pyheroku-badge.herokuapp.com/?app=twitter-api-clone-express&style=flat)

API Location: https://twitter-api-clone-express.herokuapp.com/

This is a backend application that simulates some functionalities of Twitter, including user authentication, sending messages to other users, and posting tweets.

## Techologies Used
- Node.js
- express

## Routes

### User Authentication

`/`
`/signup`
`/login`
`/logout`

### Profile

`/profile`

### Messages

`/messages`
`/messages/:username`
`/messages/:username/send`
`/messages/edit/:id`
`/messages/delete/:id`

### Tweets

`/tweets`
`/tweets/:id`
`/tweets/user/:username`
`/tweets/create`
`/tweets/edit/:id`
`/tweets/delete/:id`
`/tweets/like/:id`
`/tweets/retweet/:id`

## Installation & Running Application

Download or clone the repository, create a .env file copy/paste the text from .env.example, filling in your own strings, and run the following code:

```
$ npm install
$ npm run start
```

