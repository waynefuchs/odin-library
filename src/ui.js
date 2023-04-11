import Library from "./library";

var UI = (function () {
  const libraryContainerElement = document.querySelector("#library"); // A link to the container element that holds all books
  const addBookButton = document.querySelector("#add-book"); // The button to write the new book to the db
  const createBookButton = document.querySelector("#create-book-button"); // The "Create Book" button to open the modal
  const createBookModal = document.querySelector("#create-book-modal"); // The model that is opened
  const fadeScreen = document.querySelector("#fade-screen"); // A transition element to facilitate the fade in effect

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

    // close the modal
    addBookModalClickEvent();
  };

  const removeBook = (id) => {
    const book = document.getElementById(id);
    while (book.firstChild) book.removeChild(book.lastChild);
    book.remove();
  };

  // const clearLibraryDisplay = () => {
  //   while (libraryContainerElement.firstChild)
  //     libraryContainerElement.removeChild(libraryContainerElement.lastChild);
  // };

  // Click Event Handling
  const deleteBookClickEvent = (e) => Library.deleteBook(e.target.dataset.id);
  const hasReadClickEvent = (e) => Library.toggleHasRead(e.target.dataset.id);
  const addBookModalClickEvent = () => {
    createBookModal.classList.toggle("active");
    fadeScreen.style.visibility = isAddBookModalVisible()
      ? "visible"
      : "hidden";
  };

  // Keyboard Event Handling
  const keyboardHandler = (e) => {
    if (e.key == "Escape" && isAddBookModalVisible()) {
      addBookModalClickEvent();
    }
  };

  // Attach click and keyboard listeners to their respective HTML elements
  const initializeEvents = () => {
    createBookButton.addEventListener("click", addBookModalClickEvent);
    addBookButton.addEventListener("click", addBookButtonClicked);
    fadeScreen.addEventListener("click", addBookModalClickEvent);
    document.addEventListener("keydown", keyboardHandler);
  };

  // Check if modal is visible
  const isAddBookModalVisible = () => {
    return createBookModal.classList.contains("active");
  };

  // Return true if ui "hasRead" is set
  const hasRead = (id) =>
    document.getElementById(id).classList.contains("read") ? true : false;

  const replaceBook = (id, book) => {
    const oldBook = document.getElementById(id);
    const newBook = createBook(book);
    oldBook.after(newBook);
    while (oldBook.firstChild) oldBook.removeChild(oldBook.lastChild);
    oldBook.remove();
  };

  // Generate book card HTML
  const createBook = (book) => {
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
    elementRead.addEventListener("click", hasReadClickEvent);

    // Assemble the buttons
    buttonContainer.append(elementDelete);
    buttonContainer.append(elementRead);

    // Add all the elements
    div.append(elementTitle);
    div.append(elementAuthor);
    div.append(elementPages);
    div.append(buttonContainer);

    // return the result
    return div;
  };

  const displayBook = (book) => {
    const div = createBook(book);
    document.getElementById("library").append(div);
  };

  // Public access
  return { initializeEvents, displayBook, removeBook, replaceBook };
})(UI || {});
export default UI;
