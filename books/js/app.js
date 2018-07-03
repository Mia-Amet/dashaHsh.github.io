// Elements
const bookTable = document.querySelector('.bookTable');

// ID generator
function getID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Class Book
class Book {
    constructor(title, author, id) {
        this.title = title;
        this.author = author;
        this.id = id;
    }
}

// Class UI
class UI {
    addBookToList(book) {
        // Get tBody
        const tBody = bookTable.querySelector('tbody');
        // Create markup
        const tr = `
            <tr>
                <td class="title">${book.title}</td>
                <td>${book.author}</td>
                <td class="id">${book.id}</td>
                <td width="10">
                    <a class="btn-flat"><i class="material-icons custom__delete">delete</i></a>
                </td>
            </tr>
        `;

        // Insert book
        tBody.insertAdjacentHTML("afterbegin", tr);
    }

    removeBookFromList(tr) {
        const tBody = bookTable.querySelector('tbody');
        tBody.removeChild(tr);
    }

    showAlert(message, type) {
        // Create markup
        const alert = `
            <div class="card alert ${type === 'error' ? 'red accent-1' : 'teal lighten-2'}">
                <div class="card-content white-text">
                    <span class="card-title">${type === 'error' ? 'Error' : 'Success'}</span>
                    <p>${message}</p>
                </div>
            </div>
        `;

        // Get container
        const container = document.querySelector('.alert__container');
        // Get btn
        const btn = document.querySelector('form button');
        let deleteBtns = bookTable.querySelectorAll('a');
        // Disable btn
        btn.disabled = true;
        deleteBtns.forEach(link => link.classList.add('disabled'));

        // Insert alert
        container.insertAdjacentHTML("afterbegin", alert);

        setTimeout(function () {
            document.querySelector('.alert').remove();
            btn.disabled = false;
            deleteBtns.forEach(link => link.classList.remove('disabled'));
        }, 3000);
    }
}

// Class Local Storage
class Store {
    getBooks() {
        let books;

        if (!localStorage.getItem('books')) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    addBook(book) {
        // Get from local storage
        const books = this.getBooks();
        // Add new book
        books.push(book);
        // Save to local storage
        localStorage.setItem('books', JSON.stringify(books));
    }

    removeBook(id) {
        // Get from local storage
        let books = this.getBooks();
        // Remove book with ID
        books = books.filter(book => book.id !== id);
        // Save to local storage
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event DOMContentLoaded
document.addEventListener('DOMContentLoaded', function (e) {
    const store = new Store(),
          ui = new UI(),
          books = store.getBooks();

    books.forEach(book => ui.addBookToList(book));
});

// Events change
document.forms['addBookForm'].addEventListener('change', function (e) {
    const id = document.forms['addBookForm'].elements['book_id'];
    if (!id.value) {
        id.value = getID();
        id.closest('.input-field').lastElementChild.classList.add('active');
    }
});

// Event submit
document.forms['addBookForm'].addEventListener('submit', function (e) {
    // Get form values
    const title = this.elements['book_title'].value,
          author = this.elements['book_author'].value,
          id = this.elements['book_id'].value;

    // Create book
    const book = new Book(title, author, id);
    // Create UI
    const ui = new UI();
    // Get store
    const store = new Store();

    // Validate
    if (!title || !author || !id) {
        // Show error
        ui.showAlert('Please fill in all the fields', 'error');
    } else {
        // Add book to UI
        ui.addBookToList(book);
        // Show success message
        ui.showAlert(`Book "${title}" was added`, 'success');
        // Add book to local storage
        store.addBook(book);
    }

    // Clear form values
    this.elements['book_title'].value = '';
    this.elements['book_author'].value = '';
    this.elements['book_id'].value = '';

    // Get labels to default state
    let labels = document.forms['addBookForm'].querySelectorAll('.active');
    labels.forEach(label => label.classList.remove('active'));

    e.preventDefault();
});

// Event click
bookTable.addEventListener('click', function (e) {
    const store = new Store(),
          ui = new UI();

    const tr = e.target.closest('tr'),
          id = tr.querySelector('.id').textContent,
          title = tr.querySelector('.title').textContent;

    if (e.target.classList.contains('custom__delete')) {

        let confirmDelete = confirm(`Delete book "${title}"?`);

        if (confirmDelete) {
            // Delete book from UI
            ui.removeBookFromList(tr);
            // Show success message
            ui.showAlert(`Book "${title}" was deleted`, 'success');
            // Delete book from local storage
            store.removeBook(id);
        }
    }
});








