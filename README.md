# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). 


## Final Product


!["Screenshot of urls page"](https://github.com/esra-saatci/tinyapp/blob/master/docs/urls-page.png?raw=true)
!["Screenshot of register page"](https://github.com/esra-saatci/tinyapp/blob/master/docs/register-page.png?raw=true)
!["Screenshot of new url page"](https://github.com/esra-saatci/tinyapp/blob/master/docs/new-url-page.png?raw=true)


## Dependencies


- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started


1) Install all dependencies (using the `npm install` command).
2) Run the development web server using the `node express_server.js` command.
3) Go to `localhost:8080` on your browser, enjoy!


## How To Use TinyApp


#### Register/Login

Users must be logged in to create new links, view and edit them.

Just click Register on right top, put in your email and password, and you're good to go!


#### Create New Links

Either click Create a New Short Link in My URLs page, or Create New URL on navigation bar.

Then simply enter the long URL you want to shorten.


#### Edit or Delete Short Links

In My URLs, you can delete any link you want.

You can also click Edit, and then enter a new long URL to update your link. It will be the same short URL, but redirect to an updated long URL.


#### Use Your Short Link

The path to use any short link is /u/:shortLink. This will redirect you to the long URL.

You can also reach this by clicking edit on a link, and using the link corresponding to the short URL.
