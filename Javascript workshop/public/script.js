document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const deleteButton = document.getElementById('delete-button');
    const loadBookButton = document.getElementById('load-book-button');
    const bookTable = document.getElementById('book-table');

    // Fetch and display books when the page loads
    fetchBooks();

    // Handle form submission to add or update a book
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookId = document.getElementById('update-id').value;
        const newBook = {
            title: bookForm.title.value,
            author: bookForm.author.value,
            genre: bookForm.genre.value,
            price: parseFloat(bookForm.price.value),
            inStock: bookForm.inStock.checked
        };
        if (bookId) {
            await updateBook(bookId, newBook);
        } else {
            await addBook(newBook);
        }
        fetchBooks(); // Refresh the table
    });

    // Handle delete button click
    deleteButton.addEventListener('click', async () => {
        const bookId = document.getElementById('delete-id').value;
        if (bookId) {
            await deleteBook(bookId);
            fetchBooks(); // Refresh the table
        }
    });

    // Handle load book button click to fill the form for updating
    loadBookButton.addEventListener('click', async () => {
        const bookId = document.getElementById('update-id').value;
        if (bookId) {
            await loadBook(bookId);
        }
    });

    // Fetch books from the JSON server
    async function fetchBooks() {
        const response = await fetch('http://localhost:3000/books');
        const data = await response.json();
        bookTable.innerHTML = ''; // Clear the table
        data.forEach(book => {
            appendBookToTable(book);
        });
    }

    // Add a book to the JSON server
    async function addBook(book) {
        const response = await fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        const newBook = await response.json();
        appendBookToTable(newBook);
        bookForm.reset();
        document.getElementById('update-id').value = '';
    }

    // Load a book from the JSON server to update
    async function loadBook(id) {
        const response = await fetch(`http://localhost:3000/books/${id}`);
        const book = await response.json();
        bookForm.title.value = book.title;
        bookForm.author.value = book.author;
        bookForm.genre.value = book.genre;
        bookForm.price.value = book.price;
        bookForm.inStock.checked = book.inStock;
    }

    // Update a book on the JSON server
    async function updateBook(id, book) {
        const response = await fetch(`http://localhost:3000/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        const updatedBook = await response.json();
        // Update the book in the table
        const row = document.getElementById(`book-${id}`);
        row.innerHTML = `
            <td>${updatedBook.id}</td>
            <td>${updatedBook.title}</td>
            <td>${updatedBook.author}</td>
            <td>${updatedBook.genre}</td>
            <td>${updatedBook.price}</td>
            <td>${updatedBook.inStock ? 'Yes' : 'No'}</td>
            <td class="actions">
                <button onclick="editBook(${updatedBook.id})">Edit</button>
                <button onclick="deleteBook(${updatedBook.id})">Delete</button>
            </td>
        `;
        bookForm.reset();
        document.getElementById('update-id').value = '';
    }

    // Delete a book from the JSON server
    async function deleteBook(id) {
        await fetch(`http://localhost:3000/books/${id}`, {
            method: 'DELETE'
        });
        document.getElementById(`book-${id}`).remove();
    }

    // Append a book to the HTML table
    function appendBookToTable(book) {
        const row = document.createElement('tr');
        row.id = `book-${book.id}`;
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.price}</td>
            <td>${book.inStock ? 'Yes' : 'No'}</td>
            <td class="actions">
                <button onclick="editBook(${book.id})">Edit</button>
                <button onclick="deleteBook(${book.id})">Delete</button>
            </td>
        `;
        bookTable.appendChild(row);
    }

    // Function to edit a book
    window.editBook = function(id) {
        loadBook(id);
        document.getElementById('update-id').value = id;
    }

    // Function to delete a book
    window.deleteBook = async function(id) {
        await fetch(`http://localhost:3000/books/${id}`, {
            method: 'DELETE'
        });
        document.getElementById(`book-${id}`).remove();
    }
});
