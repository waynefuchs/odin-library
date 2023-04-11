import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsudD9YpAMxtA4EUcZdRs8NWM6bMmbz4Q",
  authDomain: "odin-library-a64e9.firebaseapp.com",
  projectId: "odin-library-a64e9",
  storageBucket: "odin-library-a64e9.appspot.com",
  messagingSenderId: "924809027618",
  appId: "1:924809027618:web:fc968e54c50c3e283c2a7b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/* ID System */
class IDSystem {
  bookId = 0;
  getNextID = () => this.bookId++;
}

/* Library Object */
class Library {
  listOfBooks = [];

  // Saves a new message to Cloud Firestore.
  async addBook(book) {
    // Add a new message entry to the Firebase database.
    try {
      await addDoc(collection(getFirestore(), "library"), book);
    } catch (error) {
      console.error("Error adding book to Firebase Database", error);
    }
  }
  // addBook(book) {
  //   this.listOfBooks.push(book);
  // }
  // getAllBooks() {
  //   return this.listOfBooks;
  // }

  // Loads chat messages history and listens for upcoming ones.
  getAllBooks() {
    // Create the query
    const recentMessagesQuery = query(
      collection(getFirestore(), "library"),
      orderBy("title", "desc")
    );

    // Start listening to the query.
    onSnapshot(recentMessagesQuery, function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === "removed") {
          uiRemoveBook(change.doc.id);
        } else {
          var message = change.doc.data();
          const book = {
            id: change.doc.id,
            author: message.author,
            hasRead: message.hasRead,
            pages: message.pages,
            title: message.title,
          };
          uiDisplayBook(book);
        }
      });
    });
  }

  deleteBook(id) {
    this.listOfBooks = this.listOfBooks.filter((book) => book.id != id);
    this.reloadUI();
  }
  toggleReadStatus(id) {
    const matchingBooks = this.listOfBooks.filter((book) => book.id == id);
    for (book of matchingBooks) {
      book.toggleReadStatus();
    }
  }
  reloadUI() {
    ui_ClearLibrary();
    ui_PopulateLibrary();
  }
}

// /* Book Object */
// let BOOKID = 0; // <-- ID system could be improved
// class Book {
//   id = 0;
//   title = "";
//   author = "";
//   pages = 0;
//   hasRead = false;
//   htmlContainer = null;

//   constructor(id, title, author, pages, hasRead = false) {
//     this.id = id;
//     this.title = title;
//     this.author = author;
//     this.pages = pages;
//     this.hasRead = hasRead;
//   }
//   toString() {
//     return `${this.title} by ${this.author}, ${this.pages} pages, ${
//       this.hasRead ? "have read" : "not read yet"
//     }.`;
//   }
//   getNextID() {
//     BOOKID++;
//     return BOOKID;
//   }
//   toggleReadStatus() {
//     this.hasRead = !this.hasRead;
//     this.htmlContainer.classList.remove("read");
//     if (this.hasRead) {
//       this.htmlContainer.classList.add("read");
//       this.htmlContainer.querySelector(".read-button").src =
//         "svg/visibility_off_FILL0_wght400_GRAD0_opsz24.svg";
//     } else {
//       this.htmlContainer.querySelector(".read-button").src =
//         "svg/visibility_FILL0_wght400_GRAD0_opsz24.svg";
//     }
//   }

/* UI */
/* This is spaghetti, and (now) I know it. */
const idSystem = new IDSystem();
const ui = {
  addBookButton: document.querySelector("#add-book"),
  addBookModalButton: document.querySelector("#add-book-modal"),
  addBookModal: document.querySelector("#new-book-modal"),
  fadeScreen: document.querySelector("#fade-screen"),
  library: document.querySelector("#library"),
};
function uiRemoveBook(id) {
  console.warn(
    "I am not currently doing anything, especially not removing the book."
  );
}

function ui_ClearLibrary() {
  while (ui.library.firstChild) {
    ui.library.removeChild(ui.library.lastChild);
  }
}
function ui_PopulateLibrary() {
  ui_ClearLibrary();
  library.getAllBooks();
}
function ui_isAddBookModalVisible() {
  return ui.addBookModal.classList.contains("active");
}
const ui_DeleteBookButtonClicked = function (e) {
  library.deleteBook(this.dataset.id);
};
const ui_ToggleReadStatusButtonClicked = function (e) {
  library.toggleReadStatus(this.dataset.id);
};
const validateElement = (element) => {
  if (element.validity.valueMissing) {
    element.setCustomValidity("Field must not be empty!");
    element.reportValidity();
  } else {
    element.setCustomValidity("");
    return true;
  }
  return false;
};
const validateBookInput = () => {
  return [title, author, pages].every((element) => validateElement(element));
};
const uiAddBookButtonClicked = function (e) {
  if (!validateBookInput()) return;
  // create a book
  const book = {
    title: title.value,
    author: author.value,
    pages: pages.value,
    hasRead: read.checked,
  };
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
};
const ui_AddBookModalButtonClicked = function () {
  ui.addBookModal.classList.toggle("active");
  ui.fadeScreen.style.visibility = ui_isAddBookModalVisible()
    ? "visible"
    : "hidden";
};
const ui_KeyboardHandler = function (e) {
  if (e.key == "Escape" && ui_isAddBookModalVisible()) {
    ui_AddBookModalButtonClicked();
  }
};
function ui_init_events() {
  ui.addBookButton.addEventListener("click", uiAddBookButtonClicked);
  ui.addBookModalButton.addEventListener("click", ui_AddBookModalButtonClicked);
  ui.fadeScreen.addEventListener("click", ui_AddBookModalButtonClicked);
  document.addEventListener("keydown", ui_KeyboardHandler);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Code after this point has been rewritten (APRIL 11 2023)

function uiDisplayBook(book) {
  // Containing div
  let div = document.createElement("div");
  div.id = book.id;
  div.classList.add("book-card");
  if (book.hasRead) div.classList.add("read");

  // Title
  let elementTitle = document.createElement("h2");
  elementTitle.textContent = book.title;

  // Author
  let elementAuthor = document.createElement("p");
  elementAuthor.textContent = book.author;

  // Pages
  let elementPages = document.createElement("p");
  elementPages.classList.add("page-count");
  elementPages.textContent = `${book.pages} pages`;

  // Button Container
  let buttonContainer = document.createElement("div");

  // Delete Button
  let elementDelete = document.createElement("input");
  elementDelete.type = "image";
  elementDelete.src = "svg/delete_FILL0_wght400_GRAD0_opsz24.svg";
  elementDelete.classList.add("card-button");
  elementDelete.dataset.id = book.id;
  elementDelete.addEventListener("click", ui_DeleteBookButtonClicked);

  // Read Button
  let elementRead = document.createElement("input");
  elementRead.type = "image";
  elementRead.src = book.hasRead
    ? "svg/visibility_off_FILL0_wght400_GRAD0_opsz24.svg"
    : "svg/visibility_FILL0_wght400_GRAD0_opsz24.svg";
  elementRead.classList.add("card-button");
  elementRead.classList.add("read-button");
  elementRead.dataset.id = book.id;
  elementRead.addEventListener("click", ui_ToggleReadStatusButtonClicked);

  // Assemble the buttons
  buttonContainer.append(elementDelete);
  buttonContainer.append(elementRead);

  // Add all the elements
  div.append(elementTitle);
  div.append(elementAuthor);
  div.append(elementPages);
  div.append(buttonContainer);

  // Add this div to the page
  document.getElementById("library").append(div);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Run the program
ui_init_events();
const library = new Library();
library.getAllBooks();
