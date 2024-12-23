const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]!
    bookCount: Int
  }

  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  input SaveBookInput {
    bookId: String!
    authors: [String]
    title: String!
    description: String!
    image: String
    link: String
  }

  type Query {
    users: [User]!
    user(username: String!): User
    me: User
    searchBooks(query: String!): [Book]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    removeBook(bookId: String!): User
    saveBook(input: SaveBookInput!): User
  }

  type Auth {
    token: String
    user: User
  }
`;

module.exports = typeDefs;
