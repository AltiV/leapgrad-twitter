const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

const app = require("../index");

chai.use(chaiHttp);

describe("GET /", () => {
  it("Should return a 200 response", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("POST /signup", () => {
  it("Should return status of 422", (done) => {
    chai
      .request(app)
      .post("/signup")
      .send({
        username: "username",
        password: "password",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(422);
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
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("POST /profile", () => {
  it("Should work", (done) => {
    chai
      .request(app)
      .get("/profile")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });
});

describe("GET /logout", () => {
  it("Should successfully redirect", () => {
    chai
      .request(app)
      .get("/logout")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.redirect;
        expect(res).to.have.status(200);
        done();
      });
  });
});
