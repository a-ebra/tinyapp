const express = require("express");
const app = express();
app.set("view engine", "ejs");
const bcrypt = require("bcrypt");
const PORT = 8080; // default port 8080

// *************** parsers ***************
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: "keys",
  keys: ["banana"],

  maxAge: 48 * 60 * 60 * 1000
}));

// *************** helper functions ***************

const {
  generateRandomString,
  emailLookUp,
  urlsForUser,
} = require("./helperFunctions");

//user object declaration
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "aqil@aqil.com",
    password: bcrypt.hashSync("aqil", 10)
  },
//  "user2RandomID": {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk"
//   }
};

const urlDatabase = {
  // a1111a: {longURL: "http://youtube.com", userId: "randomUser"}
};

// ***************  GET Methods ***************
app.get("/", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.redirect("/login");
  } else {
    return res.redirect("/urls");
  }
});

app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;
  const userURLs = urlsForUser(user_id, urlDatabase);
  if (!user_id) {
    return res.status(404).send("You are not logged in.");
  } else {
    const templateVars = { urls: userURLs, user: users[user_id] };
    res.render("urls_index.ejs", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.redirect("/login");
  } else {
    const templateVars = { user: users[user_id] };
    res.render("urls_new", templateVars);
  }
});

// edit url page
app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id;
  const shortURL = req.params.shortURL;
  
  if (!user_id) {
    return res.status(404).send("You are not logged in.");
  } else if (user_id && !urlDatabase[shortURL] === user_id) {
    return res.status(404).send("You do not have access to this url.");
  } else {
    const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL], user: users[user_id] };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const user_id = req.session.user_id;
  const userURLS = urlsForUser(user_id, urlDatabase)

  if (userURLS[shortURL] === undefined) {
    return res.status(404).send("URL does not exist.");
  } else {
    const longURL = urlDatabase[user_id][shortURL]
    res.redirect(longURL);
  }
});

app.get("/register", (req, res) => {
  const user_id = req.session.user_id;

  if (user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: users[user_id] };
    res.render("user-registration", templateVars);
  }
});

app.get("/login", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: users[user_id] };
    res.render("login", templateVars);
  }
});

// *************** POST Methods ***************

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const user_id = req.session.user_id;
  if (!user_id) {
    res.redirect("/login");
  } else if (!urlDatabase[user_id]) {
    urlDatabase[user_id] = {};
    urlDatabase[user_id][shortURL] = longURL;
  } else {
    urlDatabase[user_id][shortURL] = longURL;
  }
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.session.user_id;
  const shortURL = req.params.shortURL;
  
  if (!user_id) {
    return res.status(404).send("Please login or register.");
  } else if (user_id && urlsForUser(user_id, urlDatabase)[shortURL]) {
    delete urlDatabase[user_id][shortURL];
    res.redirect("/urls");
  } else {
    return res.status(404).send("You do not have access to this page.");
  }
});

app.post("/urls/:shortURL/", (req, res) => {
  const newLongURL = req.body.longURL;
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(404).send("You do not have access to this page.");
  } else {
  urlDatabasep[user_id][req.params.shortURL] = newLongURL;
  res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email
  const user_id = emailLookUp(email, users);
  const userData = users[user_id];
  
  if (!emailLookUp(email, users)) {
    return res.status(403).send("Email address not found.");
  } else if (user_id && !bcrypt.compareSync(password, userData.password)) {
    return res.status(403).send("Incorrect password.");
  } else {
    req.session.user_id = user_id;
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls");
});


app.post("/register", (req, res) => {
  const user_id = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  if (!email) {
    res.status(400).send("Please enter your email address.");
  } else if (!req.body.password) {
    res.status(400).send("Please enter your password.");
  } else if (emailLookUp(email)) {
    res.status(400).send("A profile with this email address already exists.");
  }
  users[user_id] = {
    user_id,
    email,
    password,
  };
  req.session.user_id = user_id;
  res.redirect("/urls");
});

// *** Other ***
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
