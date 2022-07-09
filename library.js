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
Library.prototype.deleteBook = function(id) {
    ui_ClearLibrary();
    this.listOfBooks = this.listOfBooks.filter(book => book.id != id);
    ui_PopulateLibrary();
}
Library.prototype.toggleReadStatus = function(id) {
    const matchingBooks = this.listOfBooks.filter(book => book.id == id);
    for(book of matchingBooks) {
        book.toggleReadStatus();
    }
}


/* Book Object */
let BOOKID = 0; // <-- ID system could be improved
function Book(title, author, pages, hasRead=false) {
    this.id = this.getNextID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
    this.htmlContainer = null;
}
Book.prototype.toString = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.hasRead ? "have read" : "not read yet"}.`;
}
Book.prototype.getNextID = function() {
    BOOKID++;
    return BOOKID;
}
Book.prototype.toggleReadStatus = function() {
    this.hasRead = !this.hasRead;
    this.htmlContainer.classList.remove('read');
    if(this.hasRead) {
        this.htmlContainer.classList.add('read');
        //visibility_FILL0_wght400_GRAD0_opsz24.svg
        //visibility_off_FILL0_wght400_GRAD0_opsz24.svg
        this.htmlContainer.querySelector('.read-button').src = "svg/visibility_off_FILL0_wght400_GRAD0_opsz24.svg";
    } else {
        this.htmlContainer.querySelector('.read-button').src = "svg/visibility_FILL0_wght400_GRAD0_opsz24.svg";
    }
}
Book.prototype.getCard = function() {
    // Containing div
    let div = document.createElement('div');
    div.classList.add('book-card');
    if(this.hasRead) div.classList.add('read');

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

    // Button Container
    let buttonContainer = document.createElement('div');

    // Delete Button
    let elementDelete = document.createElement('input');
    elementDelete.type = "image";
    elementDelete.src = "svg/delete_FILL0_wght400_GRAD0_opsz24.svg";
    elementDelete.classList.add('card-button');
    elementDelete.dataset.id = this.id;
    elementDelete.addEventListener('click', ui_DeleteBookButtonClicked);

    // Read Button
    let elementRead = document.createElement('input');
    elementRead.type = "image";
    if(this.hasRead) {
        elementRead.src = "svg/visibility_off_FILL0_wght400_GRAD0_opsz24.svg";
    } else {
        elementRead.src = "svg/visibility_FILL0_wght400_GRAD0_opsz24.svg";
    }
    elementRead.classList.add('card-button');
    elementRead.classList.add('read-button');
    elementRead.dataset.id = this.id;
    elementRead.addEventListener('click', ui_ToggleReadStatusButtonClicked);


    // Assemble the buttons
    buttonContainer.append(elementDelete);
    buttonContainer.append(elementRead);

    // Add all the elements
    div.append(elementTitle);
    div.append(elementAuthor);
    div.append(elementPages);
    div.append(buttonContainer);

    // return
    this.htmlContainer = div;
    return this.htmlContainer;
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
    library.deleteBook(this.dataset.id);
}
const ui_ToggleReadStatusButtonClicked = function(e) {
    library.toggleReadStatus(this.dataset.id);
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