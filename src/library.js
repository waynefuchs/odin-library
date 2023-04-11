// Import firebase stuff
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// Import local modules
import { app } from "./firebase";
import UI from "./ui";

// Library module
var Library = (function () {
  // Delete a book from the database by ID
  const deleteBook = async (id) => {
    try {
      await deleteDoc(doc(getFirestore(), "library", id));
    } catch {
      console.error("Error deleting book from Firestore Database", error);
    }
  };

  // Toggle "hasRead" status on each individual book
  const toggleHasRead = async (id) => {
    const bookRef = doc(getFirestore(), "library", id);
    const bookSnap = await getDoc(bookRef);
    const bookObj = bookSnap.data();
    setDoc(bookRef, { hasRead: !bookObj.hasRead }, { merge: true });
  };

  // Write a new book to the database
  const addBook = async (book) => {
    // Add a new message entry to the Firebase database.
    try {
      await addDoc(collection(getFirestore(), "library"), book);
    } catch (error) {
      console.error("Error adding book to Firebase Database", error);
    }
  };

  // This function handles updating the list of books
  const getAllBooks = () => {
    // Create the query
    const recentMessagesQuery = query(
      collection(getFirestore(), "library"),
      orderBy("title")
    );

    // Subscribe to queries
    onSnapshot(recentMessagesQuery, function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        const message = change.doc.data();
        const bookObject = {
          id: change.doc.id,
          author: message.author,
          hasRead: message.hasRead,
          pages: message.pages,
          title: message.title,
        };

        switch (change.type) {
          case "removed":
            UI.removeBook(change.doc.id);
            break;
          case "modified":
            UI.replaceBook(change.doc.id, bookObject);
            break;
          case "added":
            UI.displayBook(bookObject);
            break;
          default:
            console.warn(`Unhandled Change Type: ${change.type}`);
        }
      });
    });
  };

  // public functions
  return { getAllBooks, deleteBook, addBook, toggleHasRead };
})(Library || {});
export default Library;
