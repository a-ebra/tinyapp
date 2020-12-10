const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

// *************** parsers *************** 
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


const cookieParser = require("cookie-parser");
app.use(cookieParser());

// *************** helper functions *************** 
const {
  generateRandomString, 
  emailLookUp, 
  urlsForUser,
} = require("./helperFunctions")

//user object declaration
const users = { 
//   "userRandomID": {
//     id: "userRandomID", 
//     email: "user@example.com", 
//     password: "purple-monkey-dinosaur"
//   },
//  "user2RandomID": {
//     id: "user2RandomID", 
//     email: "user2@example.com", 
//     password: "dishwasher-funk"
//   }
};

const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
};

// ***************  GET Methods *************** 
app.get("/", (req, res) => {
  const user_id = req.cookies["user_id"]
  if (!user_id) {
    return res.redirect("/login")
  } else {
    return res.redirect("/urls")
  }
});

app.get("/urls", (req, res) => {
  const user_id = req.cookies["user_id"]
  const userURLs = urlsForUser(user_id)
  if (!user_id) {
    return res.status(404).send("You are not logged in.")
  } else {
    const templateVars = { urls: userURLs, user: users[user_id] };
    res.render("urls_index.ejs", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"]
  if (!user_id) {
    return res.redirect("/login")
  } else {
    const templateVars = { user: users[user_id] }
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const user_id = req.cookies["user_id"];
  const templateVars = { user: users[user_id] };
  res.render("user-registration", templateVars);
});

app.get("/login", (req, res) => {
  const user_id = req.cookies["user_id"];
  if (user_id) {
    res.redirect("urls");
  } else {
    res.render("login", { users: users[req.session.user_id] });
  }
});

// *************** POST Methods *************** 

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  const longURL = req.body.longURL
  // save shortURL-longURL key value pair to data base 
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

app.post("/urls/:shortURL/", (req, res) => {
  const newLongURL = req.body.longURL
  urlDatabase[req.params.shortURL] = newLongURL
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  const user_id = emailLookUp(email)
  const password = 
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/urls")
});


app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    res.status(400).send("Please enter your email address.")
  } else if (!password) {
    res.status(400).send("Please enter your password.")
  } else if (emailLookUp(email)) {
    res.status(400).send("A profile with this email address already exists.")
  }
  users[id] = {
    id, 
    email,
    password,
  }
  res.cookie("user_id", id);
  res.redirect("/urls");
});

// *** Other ***
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
