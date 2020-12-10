const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

//to generate random string 
const generateRandomString = require('./randomString')

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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
