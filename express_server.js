const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");

//to generate random string 
const generateRandomString = require('./randomString')
const emailLookUp = require('./emailLookUp')

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//user object declaration
const users = { 
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
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index.ejs", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  const longURL = req.body.longURL
  // save shortURL-longURL key value pair to data base 
  urlDatabase[shortURL] = longURL
  // redirect user to shortURL
  res.redirect(`/urls/${shortURL}`);
});

//redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  //redirect to longURL
  res.redirect(longURL);
});

//delete urls from database
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  //redirect
  res.redirect("/urls")
});

//edit URLs
app.post("/urls/:shortURL/", (req, res) => {
  //var for new URL 
  const newLongURL = req.body.longURL
  //assign new values
  urlDatabase[req.params.shortURL] = newLongURL
  //redirect
  res.redirect("/urls")
});

//login functionality w/cookies
app.post("/urls/login", (req, res) => {
  //set username to value of body (login form)
  const username = req.body.username
  res.cookie("username", username)
  //once cookie is acquired redirect
  res.redirect("/urls")
});

//logout functionality 
app.post("/urls/logout", (req, res) => {
  //clearcookies
  res.clearCookie("username")
  //once cookie is cleared redirect
  res.redirect("/urls")
});

//register new user
app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = { user: users[userID] };
  res.render("user-registration", templateVars);
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

