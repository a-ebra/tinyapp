const { assert } = require('chai');

const { urlsForUser, emailLookUp } = require('../helperFunctions.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "11111a": { longURL: "http://www.reddit.com", userID: "userRandomID" },
  "22222b": { longURL: "http://www.yahoo.ca", userID: "user2RandomID"}
};

describe('emailLookUp', function() {
  it('should return a user with valid email', function() {
    const user = emailLookUp("user@example.com", users)
    const expectedOutput = "userRandomID";
    
    assert.equal(user.id, expectedOutput)
  });

  it('should return a user with valid email', function() {
    const user = emailLookUp("user@example.com", users)
    const expectedOutput = "false";
    
    assert.equal(user.id, expectedOutput)
  });
});

describe('urlsForuser', function() {
  it('should return urls that belong to a specific user ID', function() {
    const urlDatabse = urlsForUser("userRandomID", users)
    const expectedOutput = {"11111a": { longURL: "http://www.reddit.com", userID: "userRandomID" }
    
    assert.equal(urlDatabase, expectedOutput)
  });

  it('should return an empty object', function() {
    const user = emailLookUp("userXRandomID", users)
    const expectedOutput = {}
    
    assert.equal(urlDatabase, expectedOutput)
  });
});