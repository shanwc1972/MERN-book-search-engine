import { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { SEARCH_GOOGLE_BOOKS } from '../utils/queries'
import { SAVE_BOOK } from '../utils/mutations'
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';


const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // useQuery for searching books using GraphQL query
  const [searchBooks, { data: searchData, error: searchError }] = useLazyQuery(SEARCH_GOOGLE_BOOKS, {
    errorPolicy: 'all',
  });

  if (searchError) {
    console.error("Search error:", searchError);
  }

  // useMutation for saving a book
  const [saveBook] = useMutation(SAVE_BOOK);

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) return;
    
    try {
      await searchBooks({ variables: { query: searchInput } }); // Manually trigger the search when form is submitted
      setSearchInput('');
    } catch (err) {
      console.error("Error executing search:", err);
    }
  };

  // set searched books when search data is fetched
  useEffect(() => {
    if (searchData && searchData.searchBooks) {
      const bookData = searchData.searchBooks.map((book) => ({
        bookId: book.bookId,
        authors: book.authors || ['No author to display'],
        title: book.title,
        description: book.description,
        image: book.image,
      }));
      setSearchedBooks(bookData);
    } else {
      setSearchedBooks([]); // Clear searched books if no data is returned
    }
  }, [searchData]);
     
  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    if (!Auth.loggedIn()) {
      console.log("User not authenticated.");
      return false;
    }

    try {
      console.log(bookToSave);
      const { data } = await saveBook({
        variables: {
            input: {
              bookId: bookToSave.bookId,
              authors: bookToSave.authors,
              title: bookToSave.title,
              description: bookToSave.description,
              image: bookToSave.image,
              link: bookToSave.link || '',
            },
        },
      });

      if (data) {
        setSavedBookIds([...savedBookIds, bookToSave.bookId]);
        console.log("Book saved successfully.");
      }
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;