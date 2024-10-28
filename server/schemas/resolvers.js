//Setup our imports
//const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const fetch = require('node-fetch');

const resolvers = {
  Query: {
    //Get all users
    users: async () => {
      return User.find({});
    },
    
    //Get the details of the logged-in user
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password') //Exclude the version key
          .populate('savedBooks'); // Populate the savedBooks field (if necessary)

        return userData;
      }

      //throw new AuthenticationError('You need to be logged in!');
    },

    // Get a single user by their username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password') //Exclude both the version key and the password 
        .populate('savedBooks'); // Populate the savedBooks field (if necessary)
    },

    // Search for books using Google Books API
    searchBooks: async (_, { query }) => {
      const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
      const API_KEY = "AIzaSyDoRX9NDwF7bYBR9S1M2sIfG8xW6UN3aCg";
      const response = await fetch(`${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`);
      const data = await response.json();

      return data.items.map((book) => ({
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        description: book.volumeInfo.description || '',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));
    },
  },

  Mutation: {
    // Create a new user and return auth token
    createUser: async (parent, { username, email, password }) => {
      console.log(`createUser called with parameters ${username}, ${email} and ${password}`); //For the benefit of our diagnostic logging
      try {
        // Create the user in the database
        const user = await User.create({ username, email, password });

        // Generate a token for the new user
        const token = signToken(user);

        // Return the token and user data as expected by the client
        return { token, user };
      } catch (err) {
        console.error("Error in createUser resolver:", err);
        //throw new AuthenticationError("Error creating user");
      }
    },

    // Login user and return auth token
    login: async (parent, { email, password }) => {
      console.log(`login called with parameter ${email} and ${password}`); //For the benefit of our diagnostic logging
      const user = await User.findOne({ email });

      if (!user) {
        //throw new AuthenticationError('Incorrect email or username');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        //throw new AuthenticationError('Incorrect email or password');
      }

      const token = signToken(user);
      return { token, user };
    },

    // Save a new book to the user's savedBooks array (if authenticated)
    saveBook: async (parent, { input }, context) => {
      console.log(`saveBook called with paramater ${input}`); //For the benefit of our diagnostic logging
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } }, // Using addToSet to avoid duplicate entries
          { new: true, runValidators: true }
        ).populate('savedBooks');

        return updatedUser;
      }

      //throw new AuthenticationError('You need to be logged in!');
    },

    // Delete a book from the user's savedBooks array (if authenticated)
    removeBook: async (parent, { bookId }, context) => {
      console.log(`removeBook called with parameter ${bookId}`); //For the benefit of our diagnostic logging
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } }, // Pull the book with the matching bookId
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }

      //throw new AuthenticationError('You need to be logged in!');
    },

  },
};

module.exports = resolvers;
