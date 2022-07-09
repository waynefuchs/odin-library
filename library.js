function Library(selector) {
    this.element = document.querySelector(selector);
    if(this.element === null) console.error(`Failed to select library element: '${selector}'`);
    this.library = []
}
Library.prototype.addBook = function(book) {
    this.library.push(book);
}
Library.prototype.clearUI = function() {
    while (this.element.firstChild) {
        this.element.removeChild(this.element.lastChild);
    }
}
Library.prototype.populateUI = function() {
    this.clearUI();
    for(book of this.library) {
        this.element.append(book.getCard());
    }
}


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

let library = new Library('#library');
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
library.populateUI();