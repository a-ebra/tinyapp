//helper function: email lookup for existing users in database
const emailLookUp = (email) => {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
  return false;
};
