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
Library.prototype.deleteBook = function(title) {
    ui_ClearLibrary();
    this.listOfBooks = this.listOfBooks.filter(book => book.title !== title);
    ui_PopulateLibrary();
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
    elementPages.classList.add('page-count');
    elementPages.textContent = `${this.pages} pages`;

    // Button
    let elementDelete = document.createElement('input');
    elementDelete.type = "image";
    elementDelete.src = "svg/delete_FILL0_wght400_GRAD0_opsz24.svg";
    elementDelete.classList.add('delete');
    elementDelete.dataset.title = this.title;
    elementDelete.addEventListener('click', ui_DeleteBookButtonClicked);

    // Add all the elements and return
    div.append(elementTitle);
    div.append(elementAuthor);
    div.append(elementPages);
    div.append(elementDelete);
    return div;
}



/* UI */
const ui = {
    addBookButton: document.querySelector('#add-book'),
    addBookModal: document.querySelector('#new-book-modal'),
    fadeScreen: document.querySelector('#fade-screen'),
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
function ui_isAddBookModalVisible() {
    return ui.addBookModal.classList.contains('active');
}
const ui_DeleteBookButtonClicked = function(e) {
    library.deleteBook(this.dataset.title);
}
const ui_AddButtonClicked = function() {
    ui.addBookModal.classList.toggle('active');
    ui.fadeScreen.style.visibility = ui_isAddBookModalVisible()
            ? 'visible'
            : 'hidden';
}
const ui_KeyboardHandler = function(e) {
    if(e.key == "Escape" && ui_isAddBookModalVisible()) {
        ui_AddButtonClicked();
    }
}
function ui_init_events() {
    ui.addBookButton.addEventListener('click', ui_AddButtonClicked);
    ui.fadeScreen.addEventListener('click', ui_AddButtonClicked);
    document.addEventListener('keydown', ui_KeyboardHandler);
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
        "Louis Sachar", 222, false));
    library.addBook(new Book(
        "Watership Down", 
        "Richard Adams", 543, true));
    ui_PopulateLibrary();
}