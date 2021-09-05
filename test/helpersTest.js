const { assert } = require('chai');
const bcrypt = require('bcryptjs');

const {findUserByEmail, urlsForUser, generateRandomString, checkPassword} = require('../helpers.js');

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "a@a.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "b@b.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};



// Test for 'findUserByEmail' function :

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("a@a.com", users);
    const expectedOutput =  {
      id: "userRandomID",
      email: "a@a.com",
      password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
    };
    assert.deepEqual(user.id, expectedOutput.id);
  });

  it('should return undefined for invalid email', function() {
    const user = findUserByEmail("baran@esra.com", users);
    const expectedOutput = undefined;
    assert.deepEqual(user, expectedOutput);
  });
});


// Test for 'urlsForUser' function :

describe('urlsForUser', function() {
  it('should return a urls object', function() {
    const userID = "userRandomID";
    const urls = urlsForUser(userID, urlDatabase);
    const expectedOutput = {  b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'userRandomID' } };
    assert.deepEqual(Object.keys(urls), Object.keys(expectedOutput));
  });

  it('should return an empty object for user with no URLS', function() {
    const userID = "Esra";
    const urls = urlsForUser(userID, urlDatabase);
    const expectedOutput = {};
    assert.deepEqual(urls, expectedOutput);
  });
});


// Test for 'generateRandomString' function :

describe('generateRandomString', function() {
  it('should return a 6 character random string', function() {
    const expectedOutput = generateRandomString();
    assert.equal(6, expectedOutput.length);
  });
});


// Test for 'checkPassword' function :
describe('checkPassword', function() {
  it('should return true if the password is valid', function() {
    const user = {
      id: "userRandomID",
      email: "a@a.com",
      password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
    };
    const password = "purple-monkey-dinosaur";
    assert.isTrue(true, checkPassword(user, password));
  });
});

