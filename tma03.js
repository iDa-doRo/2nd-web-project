/* Diary Demonstration */

// Execute in strict mode to prevent some common mistakes
"use strict";

/**
 * Make diary data item
 * @param type Type of item to create, either "text" or "image"
 * @param data Item data, either text or data URL
 * @returns JSON string to store in local storage
 */
function makeDiaryItem(type, data) {
    var itemObject = { type: type, data: data };
    return JSON.stringify(itemObject);
}

/**
 * Add a section to the page containing the given element
 * @param itemKey Key of item in local storage
 * @param childElement HTML element to place inside the section
 */
function addSection(itemKey, childElement) {
    // Create a section element to contain the new entry
    var sectionElement = document.createElement("section");

    // Give the section a class to allow styling
    sectionElement.classList.add("entry");

    // Add the element to the section
    sectionElement.appendChild(childElement);

    // Create a button to delete the entry
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&times;";
    deleteButton.setAttribute("aria-label", "Delete entry");

    // Create an event listener to delete the entry
    function deleteEntry() {
        // A new version of this function is created every time addSection is called,
        // so it can access all the variables available in this call to addSection
        console.log("deleteEntry called with variables in scope:", {
            itemKey,
            childElement,
            sectionElement,
            deleteButton,
        });

        // Remove the section from the page
        sectionElement.parentNode.removeChild(sectionElement);

        
        // Remove the item from local storage by key
        localStorage.removeItem(itemKey);
    }

    // Connect the event listener to the button 'click' event
    deleteButton.addEventListener("click", deleteEntry);

    // Add the delete button to the section
    sectionElement.appendChild(deleteButton);

    // Get a reference to the element containing the diary entries
    var diaryElement = document.querySelector("main");

    // Get a reference to the first button section (Add entry/photo) in the diary element
    var buttonElement = diaryElement.querySelector("section.button");

    // Add the section to the page after existing entries,
    // but before the buttons
    diaryElement.insertBefore(sectionElement, buttonElement);
}

/**
 * Add a text entry to the page
 * @param itemKey Key of item in local storage
 * @param initialText Initial text of diary entry
 * @param isNewEntry true if this is a new entry to start typing into
 */
function addTextEntry(itemKey, initialText, isNewEntry) {
    // Create a textarea element to edit the entry
    var textElement = document.createElement("textarea");
    textElement.rows = 5;
    textElement.placeholder = "(new entry)";

    // Set the textarea's value to the given text (if any)
    textElement.value = initialText;

    // Add a section to the page containing the textarea
    addSection(itemKey, textElement);

    // If this is a new entry (added by the user clicking a button)
    // move the focus to the textarea to encourage typing
    if (isNewEntry) {
        textElement.focus();
    }

    // Create an event listener to save the entry when it changes
    // (i.e. when the user types into the textarea)
    function saveEntry() {
        // A new version of this function is created every time addTextEntry is called,
        // so it can access all the variables available in this call to addTextEntry
        console.log("saveEntry called with variables in scope:", {
            itemKey,
            initialText,
            isNewEntry,
            textElement,
        });

       
        // Save the text entry:
        // ...get the textarea element's current value
        var textItem, textData;
        textData = textElement.value;
        // ...make a text item using the value
        textItem = makeDiaryItem("text", textData);
        // ...store the item in local storage using the given key
        localStorage.setItem(itemKey, textItem);
    }
    
    // Connect the saveEntry event listener to the textarea element 'change' event
    addEventListener("change", saveEntry);
}

/**
 * Add an image entry to the page
 * @param itemKey Key of item in local storage
 * @param dataUrl Data URL of image data
 */
function addImageEntry(itemKey, dataUrl) {
    // Create a image element
    var imgElement = new Image();
    imgElement.alt = "Photo entry";

    // Load the image
    imgElement.src = dataUrl;
    // Add a section to the page containing the image
    addSection(itemKey, imgElement);
}

/**
 * Function to handle Add text button 'click' event
 */
function addEntryClick() {
    // Add an empty text entry, using the current timestamp to make a key
    var itemKey = "diary" + Date.now();
    var initialText = "";
    var isNewEntry = true;
    addTextEntry(itemKey, initialText, isNewEntry);
}

/**
 * Function to handle Add photo button 'click' event
 */
function addPhotoClick() {
    // Trigger the 'click' event of the hidden file input element
    // (as demonstrated in Block 3 Part 4)
    var inputElement = document.querySelector("#image input");
    inputElement.click();
}

/**
 * Function to handle file input 'change' event
 * @param changeEvent file input 'change' event data
 */
function processFile(changeEvent) {
    console.log("processFile called with arguments:", {
        changeEvent,
    });

    // Create a function to add an image entry using a data URL
    function addImage(dataUrl) {
        console.log("addImage called with arguments:", {
            dataUrl,
        });

	        // Add a new image entry, using the current timestamp to make a key
	        var itemKey = "diary" + Date.now();
	        addImageEntry(itemKey, dataUrl);
	
	       
	        // Make an image item using the given url
	        var imageItem;
	        imageItem = makeDiaryItem("image", dataUrl);
	        console.log ("imageItem value " + imageItem);
	        // Store the item in local storage using the given key
	        localStorage.setItem(itemKey, imageItem);
	        }
	        
	        // Add a 'dummy' image entry
    		/*addImage(window.DUMMY_DATA_URL);*/
	        
           
		    // Complete this function to read a file when it is selected:
	       	var inputElement = event.target;
			var file = inputElement.files[0];
	        var reader = new FileReader();
		    // ...then call addImage using the data URL you obtain	        
	        reader.addEventListener("load", file);
			reader.onloadend = () => {
      		addImage(reader.result);
    		};
			reader.readAsDataURL(file);		
	

			// Clear the file selection (allows selecting the same file again)
    		changeEvent.target.value = "";
		}

/**
 * Show the diary items in local storage as diary entries on the page
 */
function showEntries() {
    console.log("Adding items from local storage to the page");

    // Build a sorted list of keys for diary items
    var diaryKeys = [];

    // Loop through each key in storage by index
    for (var index = 0; index < localStorage.length; index++) {
        var key = localStorage.key(index);

        // If the key begins with "diary", assume it is for a diary entry
        // There may be other data in local storage, so we will ignore that
        if (key.slice(0, 5) == "diary") {
            // Append this key to the list of known diary keys
            diaryKeys.push(key);
        }
    }

    // Although browser developer tools show items in key order,
    // their actual order is browser-dependent, so sort the keys,
    // so that our diary entries are shown in the right order!
    diaryKeys.sort();

    // Loop through each diary item in storage by key
    for (var index = 0; index < diaryKeys.length; index++) {
        var key = diaryKeys[index];

        // Assume the item is a JSON string and decode it
        var item = JSON.parse(localStorage.getItem(key));

        if (item.type == "text") {
            // Assume the data attribute is text
            addTextEntry(key, item.data, false);
        } else if (item.type == "image") {
            // Assume the data attribute is an image URL
            addImageEntry(key, item.data);
        } else {
            // This should never happen - show an error and give up
            console.error("Unexpected item: " + item);
        }
    }
}

/**
 * Function to connect event listeners and start the application
 */
function initialize() {
    // A rough check for local storage support
    if (!window.localStorage) {
        // This check is not 100% reliable, but is sufficient for our demo, see e.g.
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Testing_for_availability

        // This could be more elegant too, but is sufficient for our demo
        document.querySelector("main").outerHTML =
            "<h1>Error: localStorage not supported!</h1>";

        // Stop the demo
        return;
    }

    // Connect the Add entry and Add photo button 'click' events
    var addEntryButton = document.querySelector("#text button");
    var addPhotoButton = document.querySelector("#image button");
    addEntryButton.addEventListener("click", addEntryClick);
    addPhotoButton.addEventListener("click", addPhotoClick);

    // Connect the input file 'change' event listener
    // (note this may not trigger if you repeatedly select the same file)
    var inputElement = document.querySelector("#image input");
    inputElement.addEventListener("change", processFile);

	/* Removed demonstration code here. */
	
    // Update the page to reflect stored items
    showEntries();
}

// Connect event listeners and start the application when the page loads
window.addEventListener("load", initialize);
