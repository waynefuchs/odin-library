import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "./firebase";
import UI from "./ui";

var Library = (function () {
  const deleteBook = async (id) => {
    console.warn(`deleteBook(${id})`);
    try {
      await deleteDoc(doc(getFirestore(), "library", id));
    } catch {
      console.error("Error deleting book from Firestore Database", error);
    }
    // this.listOfBooks = this.listOfBooks.filter((book) => book.id != id);
    // this.reloadUI();
  };

  const toggleReadStatus = (id) => {
    console.warn(`toggleReadStatus(${id})`);
    // const matchingBooks = this.listOfBooks.filter((book) => book.id == id);
    // for (book of matchingBooks) {
    //   book.toggleReadStatus();
    // }
  };

  const reloadUI = () => {
    console.warn("reloadUI()");
    // ui_ClearLibrary();
    // ui_PopulateLibrary();
  };

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  // Code after this point has been rewritten (APRIL 11 2023)

  // Saves a new message to Cloud Firestore.
  const addBook = async (book) => {
    // Add a new message entry to the Firebase database.
    try {
      await addDoc(collection(getFirestore(), "library"), book);
    } catch (error) {
      console.error("Error adding book to Firebase Database", error);
    }
  };

  // Loads chat messages history and listens for upcoming ones.
  const getAllBooks = () => {
    // Create the query
    const recentMessagesQuery = query(
      collection(getFirestore(), "library"),
      orderBy("title", "desc")
    );

    // Start listening to the query.
    onSnapshot(recentMessagesQuery, function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === "removed") {
          UI.removeBook(change.doc.id);
        } else {
          var message = change.doc.data();
          const book = {
            id: change.doc.id,
            author: message.author,
            hasRead: message.hasRead,
            pages: message.pages,
            title: message.title,
          };
          console.dir(UI);
          UI.uiDisplayBook(book);
        }
      });
    });
  };

  return { getAllBooks, deleteBook, addBook };
})(Library || {});
export default Library;
