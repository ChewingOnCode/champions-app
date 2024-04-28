// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  push,
  ref,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

const appSettings = {
  databaseURL: "https://watc-app-d9682-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDb = ref(database, "endorsements");

// Get the input element and add button
const inputEl = document.getElementById("endorse-message");
const addBtn = document.getElementById("endorse-button");

// Get the list of endorsements
const endorsementsEl = document.getElementById("endorsements");

// Add an endorsement to the list when the add button is clicked
addBtn.addEventListener("click", function () {
  // Get the value of the input element
  let inputValue = inputEl.value;
  // Clear the input field
  clearInputFieldEl();
  // Add the endorsement to the list in Firebase
  push(endorsementsInDb, inputValue);
  // Log the endorsement to the console
  // console.log(inputValue);
});

// Listen for changes to the endorsements in the database
onValue(endorsementsInDb, function (snapshot) {
  // Check if the data exists in the database
  if (snapshot.exists()) {
    // Get an array of objects from the snapshot
    let itemsArray = Object.entries(snapshot.val());

    // Clear the endorsements element
    clearEndorsementsEl();

    // Loop through each object in the array and append it to the endorsements element
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemId = currentItem[0];
      let currentItemValue = currentItem[1];
      appendItemToEndorsementsEl(currentItemValue);
    }
  } else {
    // Set the HTML content of the endorsements element if there are no endorsements
    endorsementsEl.innerHTML = `<p>No endorsements yet</p>`;
  }
});

// Clear the input field when the add button is clicked
function clearInputFieldEl() {
  // Clear the input element
  inputEl.value = "";
}

// Append an item to the endorsements element
function appendItemToEndorsementsEl(item) {
  // Create a new paragraph element
  let newEl = document.createElement("p");
  newEl.tabIndex = 0;
  newEl.textContent = item;

  // Add an event listener to the paragraph element that deletes the item from the database when it is clicked
  newEl.addEventListener("click", function () {
    let exactLocationInDb = ref(database, `endorsements/${item}`);
    remove(exactLocationInDb);
  });

  // Append the paragraph element to the endorsements element
  endorsementsEl.append(newEl);
}

// Clear the endorsements element
function clearEndorsementsEl() {
  endorsementsEl.innerHTML = "";
}
