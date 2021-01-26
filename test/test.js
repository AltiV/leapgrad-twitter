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
