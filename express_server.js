const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const {findUserByEmail, urlsForUser, generateRandomString, checkPassword} = require('./helpers');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const PORT = 8080;
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};

// Create a users object to store and access the users in the app
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "a@a.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "b@b.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  let templateVars = { urls:urlsForUser(userID, urlDatabase), user };
  
  if (templateVars.user) {
    res.render("urls_index", templateVars);
  } else {
    res.status(403).send("You need to login or register to access this page!");
  }
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(403).send("You need to login or register to access this page!");
  }
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("urls_new", templateVars);
});

// Log the POST request body to the console
app.post('/urls/new', (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.redirect('/login');
  }

  const longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const shortURL = req.params.shortURL;
  const urlObj = urlDatabase[shortURL];
  if (!user || user.id !== urlObj.userID) {
    return res.status(401).send("You need to login or register to access this page!");
  }
  const longURL = urlObj.longURL;
  const templateVars = { shortURL, longURL, user };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  // Send 404 status code if a client requests a non-existent shortURL
  if (longURL === undefined) {
    res.status(404);
    res.send('This URL is invalid!');
  } else {
    res.redirect(longURL);
  }
});

// Delete a URL from the database and redirect the client back to the urls_index page ("/urls")
app.post('/urls/:shortURL/delete', (req, res) => {
  const userID = req.session.user_id;
  const userUrls = urlsForUser(userID, urlDatabase);
  if (Object.keys(userUrls).includes(req.params.shortURL)) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.status(401).send('You are not authorized!');
  }
});

// Edit a URL from the database
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {longURL, userID: req.session.user_id};
  const userID = req.session.user_id;
  const userUrls = urlsForUser(userID, urlDatabase);
  if (Object.keys(userUrls).includes(shortURL)) {
    res.redirect('/urls');
  } else {
    res.status(401).send('You are not authorized!');
  }
});

// Create a GET /login endpoint that responds with the login form template
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('urls_login', templateVars);
});

// Add an endpoint to handle a POST to /login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email, users);
  if (!user) {
    res.status(403).send("Invalid username or password!");
  } else if (!checkPassword(user, password)) {
    res.status(403).send("Invalid username or password!");
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

// Implement the /logout endpoint to clear the user_id cookie
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

// Create a route for registration page
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('urls_register', templateVars);
});

// Create an endpoint that handles the registration form data
// Handle registration errors
app.post('/register', (req, res) => {
  const newUserEm = req.body.email;
  const newUserPw = req.body.password;
  const hashedPassword = bcrypt.hashSync(newUserPw, 10);
  if (!newUserEm || !newUserPw) {
    return res.status(400).send('Please enter a valid email address and password! ⛔');
  } else if (findUserByEmail(newUserEm, users)) {
    return res.status(400).send('This email address is already in use!');
  }

  const newUserID = generateRandomString();
  users[newUserID] = {
    id: newUserID,
    email: newUserEm,
    password: hashedPassword
  };
 
  req.session.user_id = newUserID;
  res.redirect('/urls');
});

// Set port to listen (via Express)
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});