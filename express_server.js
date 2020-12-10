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

// GET /

// if user is logged in:
// (Minor) redirect to /urls
// if user is not logged in:
// (Minor) redirect to /login

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

// GET /urls

// if user is logged in:
// returns HTML with:
// the site header (see Display Requirements above)
// a list (or table) of URLs the user has created, each list item containing:
// a short URL
// the short URL's matching long URL
// an edit button which makes a GET request to /urls/:id
// a delete button which makes a POST request to /urls/:id/delete
// (Stretch) the date the short URL was created
// (Stretch) the number of times the short URL was visited
// (Stretch) the number number of unique visits for the short URL
// (Minor) a link to "Create a New Short Link" which makes a GET request to /urls/new
// if user is not logged in:
// returns HTML with a relevant error message

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index.ejs", templateVars);
});

//GET route to render erls_new.ejs
// if user is logged in:
// returns HTML with:
// the site header (see Display Requirements above)
// a form which contains:
// a text input field for the original (long) URL
// a submit button which makes a POST request to /urls
// if user is not logged in:
// redirects to the /login page

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// POST /urls

// if user is logged in:
// generates a short URL, saves it, and associates it with the user
// redirects to /urls/:id, where :id matches the ID of the newly saved URL
// if user is not logged in:
// (Minor) returns HTML with a relevant error message

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
  res.redirect("/urls")
});


