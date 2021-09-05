const bcrypt = require('bcryptjs');

// Create an email lookup helper function to keep the code DRY
const findUserByEmail = function(userEmail, objDatabase) {
  for (const user in objDatabase) {
    if (objDatabase[user].email === userEmail) {
      return (objDatabase[user]);
    }
  }
};


// Create a function to return the URLs where the userID is equal to the id of the currently logged-in user
const urlsForUser = function(userID, urlDatabase) {
  console.log(urlDatabase);
  const userURL = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      userURL[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURL;
};


// Implement function to generate random string for short URLs
// Declare all characters
const generateRandomString = function() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLen = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charLen));
  }
  return result;
};


// Create a password lookup helper function to keep the code DRY
const checkPassword = (user, password) => {
  if (bcrypt.compareSync(password, user.password)) {
    return true;
  } else {
    return false;
  }
};


module.exports = {findUserByEmail, urlsForUser, generateRandomString, checkPassword};