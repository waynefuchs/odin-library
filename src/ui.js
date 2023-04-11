import Library from "./library";

/* UI */
/* This is spaghetti, and (now) I know it. */
var UI = (function () {
  const libraryContainerElement = document.querySelector("#library"); // A link to the container element that holds all books
  const addBookButton = document.querySelector("#add-book"); // The button to write the new book to the db
  const createBookButton = document.querySelector("#create-book-button"); // The "Create Book" button to open the modal
  const createBookModal = document.querySelector("#create-book-modal"); // The model that is opened
  const fadeScreen = document.querySelector("#fade-screen"); // A transition element to facilitate the fade in effect

  // const ui_PopulateLibrary = () => {
  //   ui_ClearLibrary();
  //   library.getAllBooks();
  // };

  const ui_isAddBookModalVisible = () => {
    return createBookModal.classList.contains("active");
  };

  const ui_ToggleReadStatusButtonClicked = (e) => {
    console.error("toggle read status button clicked :: broken");
    // libraryContainerElement.toggleReadStatus(this.dataset.id);
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

  const addBookButtonClicked = (e) => {
    if (!validateBookInput()) return;

    // Add the new book to the library
    Library.addBook({
      title: title.value,
      author: author.value,
      pages: pages.value,
      hasRead: read.checked,
    });

    // clear the modal for the next book
    title.value = "";
    author.value = "";
    pages.value = "";
    read.checked = false;

    // reset the ui
    // libraryContainerElement.reloadUI();
    addBookModalButtonClicked();
  };

  const addBookModalButtonClicked = () => {
    createBookModal.classList.toggle("active");
    fadeScreen.style.visibility = ui_isAddBookModalVisible()
      ? "visible"
      : "hidden";
  };

  const keyboardHandler = (e) => {
    if (e.key == "Escape" && ui_isAddBookModalVisible()) {
      addBookModalButtonClicked();
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Code after this point has been rewritten (APRIL 11 2023)

  const removeBook = (id) => {
    const book = document.getElementById(id);
    while (book.firstChild) book.removeChild(book.lastChild);
    book.remove();
  };

  // const clearLibraryDisplay = () => {
  //   while (libraryContainerElement.firstChild)
  //     libraryContainerElement.removeChild(libraryContainerElement.lastChild);
  // };

  //here

  const deleteBookClickEvent = (e) => Library.deleteBook(e.target.dataset.id);

  const uiDisplayBook = (book) => {
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
    elementDelete.addEventListener("click", deleteBookClickEvent);

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

    // Add the book to the library
    document.getElementById("library").append(div);
  };

  // Add click and keyboard listeners to UI
  const initializeEvents = () => {
    createBookButton.addEventListener("click", addBookModalButtonClicked);
    addBookButton.addEventListener("click", addBookButtonClicked);
    fadeScreen.addEventListener("click", addBookModalButtonClicked);
    document.addEventListener("keydown", keyboardHandler);
  };

  return { initializeEvents, uiDisplayBook, removeBook };
})(UI || {});
export default UI;
