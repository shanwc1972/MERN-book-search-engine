import { gql } from '@apollo/client';

// Query to get a list of all books saved by users
export const GET_BOOKS = gql`
  query books {
    books {
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;

// Query to get a single user's information including saved books
export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// Query to get the logged-in user's information
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;