let library = new Library();


/* Library Object */
function Library() {
    this.listOfBooks = []
}
Library.prototype.addBook = function(book) {
    this.listOfBooks.push(book);
}
Library.prototype.getAllBooks = function() {
    return this.listOfBooks;
}


/* Book Object */
function Book(title, author, pages, hasRead=false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
}
Book.prototype.toString = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.hasRead ? "have read" : "not read yet"}.`;
}
Book.prototype.getCard = function() {
    // Containing div
    let div = document.createElement('div');
    div.classList.add('card');
    div.classList.add(this.hasRead ? 'read' : 'not-read');

    // Title
    let elementTitle = document.createElement('h2');
    elementTitle.textContent = this.title;

    // Author
    let elementAuthor = document.createElement('p');
    elementAuthor.textContent = this.author;

    // Pages
    let elementPages = document.createElement('p');
    elementPages.textContent = this.pages;

    // Add all the elements and return
    div.append(elementTitle);
    div.append(elementAuthor);
    div.append(elementPages);
    return div;
}



/* UI */
const ui = {
    addBookButton: document.querySelector('#add-book'),
    addBookModal: document.querySelector('#new-book-modal'),
    library: document.querySelector('#library'),
}
function ui_ClearLibrary() {
    while (ui.library.firstChild) {
        ui.library.removeChild(ui.library.lastChild);
    }
}
function ui_PopulateLibrary() {
    ui_ClearLibrary();
    for(book of library.getAllBooks()) {
        ui.library.append(book.getCard());
    }
}
const ui_AddButtonClicked = function() {
    ui.addBookModal.classList.toggle('active');
}
function ui_init_events() {
    ui.addBookButton.addEventListener('click', ui_AddButtonClicked);
} ui_init_events();


initialize();
function initialize() {
    library.addBook(new Book(
        "Lord of the Rings", 
        "J.R.R. Tolkien", 295, true));
    library.addBook(new Book(
        "The Giver", 
        "Lois Lowry", 277, true));
    library.addBook(new Book(
        "The Hobbit", 
        "J.R.R. Tolkien", 435, true));
    library.addBook(new Book(
        "Holes", 
        "Louis Sachar", 222, true));
    library.addBook(new Book(
        "Watership Down", 
        "Richard Adams", 543, true));
    ui_PopulateLibrary();
}