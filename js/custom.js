// UI Events which are adding, removing and displaying a book
// We created the following ui class to handle the above events


// Store class 

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    static addBook(book) {
        let books = Store.getBooks();
        books.push(book);
        // setting the storage back with the new item...
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        let books = JSON.parse(localStorage.getItem('books'));
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
class UI {
    static displayBooks() {

        const books = Store.getBooks();
        books.forEach(book => UI.addBook(book));
    }
    static addBook(book) {
        const bookList = document.querySelector('.book-list');
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><i class="fa fa-trash-o"></i></td>
        `
        bookList.appendChild(tableRow);
    }
    static showAlert(message, type) {
        const myAlert = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `
        document.getElementById('book-form').insertAdjacentHTML('beforebegin', myAlert);
        setTimeout(() => {
            const alert = document.getElementsByClassName("alert")[0];
            alert.remove();
        }, 3000)
    }

    static removeBook(el) {
        el.parentElement.parentElement.remove();
    }
    static clearFields() {
        document.getElementsByName("title")[0].value = "";
        document.getElementsByName("author")[0].value = "";
        document.getElementsByName("isbn")[0].value = "";
    }
}

// Book Class will handle creating book instances

class Book {
    constructor(title, author, isbn) {
        this.title = title,
            this.author = author,
            this.isbn = isbn
    }
}

// load Event 
document.addEventListener('DOMContentLoaded', UI.displayBooks())
document.getElementById("book-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // let's grab the value of the form
    const title = document.getElementsByName('title')[0].value
    const author = document.getElementsByName('author')[0].value
    const isbn = document.getElementsByName('isbn')[0].value

    const book = new Book(title, author, isbn);
    UI.addBook(book);
    Store.addBook(book);
    UI.showAlert("new Book added successfully!", 'success');
    UI.clearFields();
})

// we will procede by propagation to delete grab the book to delete

document.querySelector('.book-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-trash-o')) {
        UI.removeBook(e.target);
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        UI.showAlert("Book deleted successfully!", 'danger');
    }
})


// 