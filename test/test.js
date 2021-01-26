const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

const app = require("../index");

chai.use(chaiHttp);

describe("Unauthenticated Tests", () => {
  describe("GET /", () => {
    it("Should return a 200 response", (done) => {
      chai
        .request(app)
        .get("/")
        .end((_err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("POST /signup", () => {
    it("Signup with already existing username: Should return status of 422", (done) => {
      chai
        .request(app)
        .post("/signup")
        .send({
          username: "username",
          password: "password",
        })
        .end((_err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });

  describe("POST /login", () => {
    it("Should successfully redirect", (done) => {
      chai
        .request(app)
        .post("/login")
        .send({
          username: "username",
          password: "password",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("GET /logout", () => {
    it("Should successfully redirect", (done) => {
      chai
        .request(app)
        .get("/logout")
        .end((_err, res) => {
          res.should.redirect;
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("GET /profile", () => {
    it("Should return a 401 response", (done) => {
      chai
        .request(app)
        .get("/profile")
        .end((_err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("GET /profile/:username", () => {
    it("Valid Username: Should return a 200 response", (done) => {
      chai
        .request(app)
        .get("/profile/username")
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });

    it("Invalid Username: Should return a 400 response", (done) => {
      chai
        .request(app)
        .get("/profile/invalidusername")
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("GET /messages", () => {
    it("Should return a 401 response", (done) => {
      chai
        .request(app)
        .get("/messages")
        .end((_err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("Tweets", () => {
    describe("GET /tweets", () => {
      it("Should return a 401 response", (done) => {
        chai
          .request(app)
          .get("/tweets")
          .end((_err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    describe("GET /tweets/user/:username", () => {
      it("Valid Username: Should return a 200 response", (done) => {
        chai
          .request(app)
          .get("/tweets/user/username")
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });

      it("Invalid Username: Should return a 400 response", (done) => {
        chai
          .request(app)
          .get("/tweets/user/invalidusername")
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });
});

describe("Authenticated Tests", () => {
  const agent = chai.request.agent(app);

  before("Log in with basic username and password", (done) => {
    agent
      .post("/login")
      .send({
        username: "username",
        password: "password",
      })
      .end((_res, _err) => done());
  });

  describe("GET /profile", () => {
    it("Should return a 200 response", (done) => {
      agent.get("/profile").then((res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
    });
  });

  describe("GET /messages", () => {
    it("Should return a 200 response", (done) => {
      agent.get("/messages").then((res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
    });
  });

  describe("GET /messages/:username", () => {
    it("Should return a 200 response", (done) => {
      agent.get("/messages/username2").then((res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
    });
  });

  describe("Create/Edit/Delete message", () => {
    before((done) => {
      agent
        .post("/messages/username2/send")
        .send({
          message: "This message was created by npm test",
        })
        .then((res) => {
          this.testMessage = res.body.messages[res.body.messages.length - 1];
          done();
        });
    });

    it("Create Message", (done) => {
      this.testMessage.should.be.a("object");
      this.testMessage.message.should.be.a("string");
      done();
    });

    it("Edit message", (done) => {
      agent
        .patch(`/messages/edit/${this.testMessage._id}`)
        .send({
          message: "This message was edited by npm test",
        })
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.message.should.be.a("string");
          done();
        });
    });

    it("Delete message", (done) => {
      agent.delete(`/messages/delete/${this.testMessage._id}`).then((res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.result.should.be.a("object");
        done();
      });
    });
  });

  describe("Create/Edit/Like/Retweet/Delete Tweet", () => {
    before((done) => {
      agent
        .post("/tweets/create")
        .send({
          tweet: "This tweet was created by npm test",
        })
        .then((res) => {
          this.testTweet = res.body.tweets[0];
          done();
        });
    });

    it("Create Tweet", (done) => {
      this.testTweet.should.be.a("object");
      this.testTweet.tweet.should.be.a("string");
      done();
    });

    it("Edit Tweet", (done) => {
      agent
        .patch(`/tweets/edit/${this.testTweet._id}`)
        .send({
          tweet: "This tweet was edited by npm test",
        })
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.tweet.should.be.a("string");
          done();
        });
    });

    it("Like Tweet", (done) => {
      agent.patch(`/tweets/like/${this.testTweet._id}`).then((res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.tweet.should.be.a("string");
        done();
      });
    });

    it("Retweet Tweet", (done) => {
      agent.patch(`/tweets/retweet/${this.testTweet._id}`).then((res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.tweet.should.be.a("string");
        done();
      });
    });

    it("Delete Tweet", (done) => {
      agent.delete(`/tweets/delete/${this.testTweet._id}`).then((res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.result.should.be.a("object");
        done();
      });
    });
  });
});
