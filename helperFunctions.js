  const urlDatabase = {
    // "b2xVn2": "http://www.lighthouselabs.ca",
    // "9sm5xK": "http://www.google.com"
  };

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6)
}

const urlsForUser = (id, urlDatabase) => {
  const userURLs = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
};

const emailLookUp = (email, database) => {
  console.log(database)
  for (const userID in database) {
    if (database[userID].email === email) {
      return userID;
    }
  }
  return false;
};

module.exports = { generateRandomString, urlsForUser, emailLookUp };