# Twitter Clone API Demo

![Heroku](https://pyheroku-badge.herokuapp.com/?app=twitter-api-clone-express&style=flat)

API Location: https://twitter-api-clone-express.herokuapp.com/

This is a backend application that simulates some functionalities of Twitter, including user authentication, sending messages to other users, and posting tweets.

## Techologies Used
- Node.js
- express

## Routes

Note that some routes require the user to be logged in.

### Authentication

| Description | Route     | Method | Request Body       |
|-------------|-----------|--------|--------------------|
| Home Page   | `/`       | `GET`  |                    |
| Signup      | `/signup` | `POST` | username, password |
| Login       | `/login`  | `POST` | username, password |
| Logout      | `/logout` | `GET`  |                    |

### Profile

| Description                        | Route                | Method | Request Body |
|------------------------------------|----------------------|--------|--------------|
| Show Profile of Authenticated User | `/profile`           | `GET`  |              |
| Show Profile of Provided User      | `/profile/:username` | `GET`  |              |

### Messages

| Description                         | Route                      | Method   | Request Body |
|-------------------------------------|----------------------------|----------|--------------|
| Show Received Messages              | `/messages`                | `GET`    |              |
| Show Messages Between Provided User | `/messages/:username`      | `GET`    |              |
| Send Message to Provided User       | `/messages/:username/send` | `POST`   | message      |
| Edit Message                        | `/messages/edit/:id`       | `PATCH`  | message      |
| Delete Message                      | `/messages/delete/:id`     | `DELETE` |              |

### Tweets

| Description                           | Route                    | Method   | Request Body |
|---------------------------------------|--------------------------|----------|--------------|
| Show All Tweets of Authenticated User | `/tweets`                | `GET`    |              |
| Show Tweet by ID                      | `/tweets/:id`            | `GET`    |              |
| Show All Tweets of Provided User      | `/tweets/user/:username` | `POST`   |              |
| Create Tweet                          | `/tweets/create`         | `POST`   | tweet        |
| Edit Tweet                            | `/tweets/edit/:id`       | `PATCH`  | tweet        |
| Delete Tweet                          | `/tweets/delete/:id`     | `DELETE` |              |
| Like/Unlike Tweet                     | `/tweets/like/:id`       | `PATCH`  |              |
| Retweet Tweet                         | `/tweets/retweet/:id`    | `PATCH`  |              |

## Installation & Running Application

Download or clone the repository, create a .env file copy/paste the text from .env.example, filling in your own strings, and run the following code:

```
$ npm install
$ npm run start
```

