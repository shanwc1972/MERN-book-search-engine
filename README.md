# MERN-book-search-engine

## Description
This is a Books Search application employing the Google Books API. The application has been developed using the MongoDB, Express, React and Node (MERN) stack. The application itself is a port of an existing application that used the REST API to a new application employing GraphQL.

## Table of contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  
## Installation
No installation is required as this is a deployed application via React.  
  
## Usage
The application / page can be accessed at: https://mern-book-search-engine-0l7r.onrender.com

The following image shows the application's appearance and functionality:

![Screenshot 2024-10-28 at 4 19 47 pm](https://github.com/user-attachments/assets/768cf792-e021-4c4c-8e97-664cef179940)


The application has a menu along the top allowing you to search for books, and to Login/Signup.

By default the Search or Books page is displayed. By entering something into the query box, for example James Bond, you will get a display of ten books matching your query.

Beyond simply querying for books, you can save books too. To do that, however, requires you to login or sign up.

By clicking on login/signup you are then presented with a login / signup dialog. If you have an existing email and or password for the application, you can proceed to enter those into the fields onto the login form. If you do not, then you will have to sign up. By selecting sign-up, you have to enter an username, email and password. If any one of the three fields are blank, you will not be able to click on the submit button. If all three fields are correctly filled in, you can press submit and you will be logged in.

On logging on, you will be taken back to the Search for books page. You can enter a query and then proceed to get a listing of ten books that match your query (like before), but this time there will be an option, below each result, to Save this book! Clicking on this will change the prompt to 'This book has been already saved!'. If you then click on See your Books on the top navigation menu, you will get a listing of any books that you have saved. You may notice that each Saved Book also has a delete button beneath each of your Saved Books. Clicking on this removes the book from your Saved books.

### GraphQL
As this application employs a GraphQL API, use of a GraphQL API developer tool, like the Apolloserver Studio Sandox, allows one to employ any of the queries or mutations exposed by the application. These include:

Queries:  
`me: User`  - to query the logged on user  
`searchbooks(query): [Book]`  - to query for an array of books from the Google API  
`user(username): User`  - to query a user for a given username  
`users: [User]!`  - to query all users  

Mutations:  
`createUser(username,email, password): Auth`  - creates a new user given a username, email and password  
`login(email, password): Auth` - logs in a user given an email and password  
`removeBook(bookID): User`  - removes a book with a given id (provided you are logged on)  
`saveBook(bookInput): User`  - allows you to save a book against the currently logged in user  
 

## Contributing
Code that permits the application to function via GraphQL queries and mutations have been refactored and assembled by Warren Shan, employing starter code from a project called Solid Brocolli by Xandromus.
  
## License
None
