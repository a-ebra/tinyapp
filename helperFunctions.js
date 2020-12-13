const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

const urlsForUser = (user_id, urlDatabase) => {
  if (urlDatabase[user_id]) {
    return urlDatabase[user_id];
  } else {
    return [];
  }
};

const emailLookUp = (email, database) => {
  for (const userID in database) {
    if (database[userID].email === email) {
      return userID;
    }
  }
  return false;
};

module.exports = { generateRandomString, urlsForUser, emailLookUp };