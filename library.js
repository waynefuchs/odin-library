/* ID System */
class IDSystem {
    bookId = 0;
    getNextID = () => this.bookId++;
}

/* Library Object */
class Library {
    listOfBooks = []
    idSystem = new IDSystem();

    addBook(book) {
        this.listOfBooks.push(book);
    }
    getAllBooks() {
        return this.listOfBooks;
    }
    deleteBook(id) {
        this.listOfBooks = this.listOfBooks.filter(book => book.id != id);
        this.reloadUI();
    }
    toggleReadStatus(id) {
        const matchingBooks = this.listOfBooks.filter(book => book.id == id);
        for(book of matchingBooks) {
            book.toggleReadStatus();
        }
    }
    reloadUI() {
        ui_ClearLibrary();
        ui_PopulateLibrary();
    }
}

/* Book Object */
let BOOKID = 0; // <-- ID system could be improved
class Book {
    id = 0;
    title = "";
    author = "";
    pages = 0;
    hasRead = false;
    htmlContainer = null;

    constructor(id, title, author, pages, hasRead=false) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.hasRead = hasRead;
    }
    toString() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.hasRead ? "have read" : "not read yet"}.`;
    }
    getNextID() {
        BOOKID++;
        return BOOKID;
    }
    toggleReadStatus() {
        this.hasRead = !this.hasRead;
        this.htmlContainer.classList.remove('read');
        if(this.hasRead) {
            this.htmlContainer.classList.add('read');
            this.htmlContainer.querySelector('.read-button').src = "svg/visibility_off_FILL0_wght400_GRAD0_opsz24.svg";
        } else {
            this.htmlContainer.querySelector('.read-button').src = "svg/visibility_FILL0_wght400_GRAD0_opsz24.svg";
        }
    }

    // I know this isn't a good way to do this
    // But I don't think separating each step out into it's own method is much better
    // This is the kind of thing react solves(?)
    getCard() {
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
}




/* UI */
/* This is spaghetti, and (now) I know it. */
idSystem = new IDSystem();
const ui = {
    addBookButton: document.querySelector('#add-book'),
    addBookModalButton: document.querySelector('#add-book-modal'),
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
const validateElement = (element) => {
    if(element.validity.valueMissing) {
        element.setCustomValidity('Field must not be empty!');
        element.reportValidity();
    } else {
        element.setCustomValidity('');
        return true;
    }
    return false;
}
const validateBookInput = () => {
    return [title, author, pages].every(element => validateElement(element));
};
const ui_AddBookButtonClicked = function(e) {
    if(!validateBookInput()) return;
    // create a book
    book = new Book(idSystem.getNextID(), title.value, author.value, pages.value, read.checked);
    // add it to the library
    library.addBook(book);
    // clear the modal for the next book
    title.value = "";
    author.value = "";
    pages.value = "";
    read.checked = false;
    // reset the ui
    library.reloadUI();
    ui_AddBookModalButtonClicked();
}
const ui_AddBookModalButtonClicked = function() {
    ui.addBookModal.classList.toggle('active');
    ui.fadeScreen.style.visibility = ui_isAddBookModalVisible()
            ? 'visible'
            : 'hidden';
}
const ui_KeyboardHandler = function(e) {
    if(e.key == "Escape" && ui_isAddBookModalVisible()) {
        ui_AddBookModalButtonClicked();
    }
}
function ui_init_events() {
    ui.addBookButton.addEventListener('click', ui_AddBookButtonClicked);
    ui.addBookModalButton.addEventListener('click', ui_AddBookModalButtonClicked);
    ui.fadeScreen.addEventListener('click', ui_AddBookModalButtonClicked);
    document.addEventListener('keydown', ui_KeyboardHandler);
} ui_init_events();


function initialize() {
    library.addBook(new Book(
        idSystem.getNextID(),
        "Lord of the Rings", 
        "J.R.R. Tolkien", 295, true));
    library.addBook(new Book(
        idSystem.getNextID(),
        "The Giver", 
        "Lois Lowry", 277, true));
    library.addBook(new Book(
        idSystem.getNextID(),
        "The Hobbit", 
        "J.R.R. Tolkien", 435, true));
    library.addBook(new Book(
        idSystem.getNextID(),
        "Holes", 
        "Louis Sachar", 222, false));
    library.addBook(new Book(
        idSystem.getNextID(),
        "Watership Down", 
        "Richard Adams", 543, true));
    ui_PopulateLibrary();
}


let library = new Library();
initialize();
