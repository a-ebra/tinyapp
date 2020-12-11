const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6)
}

const urlsForUser = (id) => {
  const userURLs = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
};

const emailLookUp = (email) => {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
  return false;
};

module.exports = { generateRandomString, urlsForUser, emailLookUp, userInfo };