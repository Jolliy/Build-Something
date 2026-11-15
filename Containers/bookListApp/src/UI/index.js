//Frontend scripts

// Creates the book items from the data / books (either from the search or the booklist).
function initBookItem(element, data, endpoint, buttonAction, color){

    // element refers to the list which the book items will be displayed at. 
    const listElement = document.getElementById(element);
    listElement.innerHTML = "";

    for(const book of data){

        const bookItem = document.createElement("div");
        bookItem.className = "bookItem";
        bookItem.innerHTML = "";

        const title = document.createElement("h3");
        title.textContent = book.title || "Unknown title";
        bookItem.appendChild(title);

        const author = document.createElement("p");
        author.textContent = "Author: " + book.author_name || "Unknown author";
        bookItem.appendChild(author);

        const year = document.createElement("p");
        year.textContent = "Publishing year: " + book.first_publish_year || "Unknown year";
        bookItem.appendChild(year);

        const language = document.createElement("p");
        language.textContent = "Language: " + book.language ||  "Unknown language";
        bookItem.appendChild(language);

        const button = document.createElement("button");
        button.className = "button";
        button.textContent = buttonAction;
        button.style.backgroundColor = color;

        // Creates an eventlistner on the button, (it either add or delete a book item to a booklist)
        button.addEventListener("click", async () =>{
            try{
                const bookList = document.getElementById("bookListSelector").value;
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            bookList: bookList,
                            key: book.key
                        }
                    )
                });

                const result = await response.json();
                if(!result.error){
                    loadSingularBookList(bookList);
                }else{
                    console.log("Error: ", result.error);
                }

            }catch(err){
                console.error(err);
            }
        });

        bookItem.appendChild(button);
        listElement.appendChild(bookItem);
    }
};

// Sends a request to the backend(app.js) with the search then creates the book items onto the searchlist in the frontend.
async function searchBooks(search){
    try{
        const res = await fetch(`/searchBooks?q=${search}`);
        const data = await res.json();
        if(!data.error){
            initBookItem("bookSearchList", data.docs, `/saveBookToList`, "save", "lightgreen")
        }
        else{
            document.getElementById("bookSearchList").innerHTML = "";
            console.log("Error: ", data.error);
        }
    }
    catch(err){
        console.error(err);
    }
}

//Loads the available booklists in the selector.
async function loadBookLists(){
    try{
        const response = await fetch(`/bookList`);
        const result = await response.json();

        if(!result.error){
            const selector = document.getElementById("bookListSelector");

            if (result.length != 0){
                selector.innerHTML = "";

                for(const booklist of result){
                    const newBookListItem = document.createElement("option");
                    newBookListItem.value = booklist.name;
                    newBookListItem.textContent = booklist.name;
                    selector.appendChild(newBookListItem);
                }
            }else{
                selector.innerHTML = ""
                const newBookListItem = document.createElement("option");
                newBookListItem.value = "null";
                newBookListItem.textContent = "No booklists";
                selector.appendChild(newBookListItem);
            }
        }
        else{
            console.log(result.error);
        }
    }catch(err){
        console.error(err)
    }
}

// Loads the books from the currently selected booklist.
async function loadSingularBookList(){
    try{
        const currentBookList = document.getElementById("bookListSelector").value;
        const response = await fetch(`/bookSingularList?q=${currentBookList}`);
        const result = await response.json();

        if(!result.error){
            initBookItem("bookList", result[0].books, `/deleteBookFromList`, "delete", "lightcoral");
        }
        else{
            console.log(result.error);
        }

    }catch(err){
        console.log(err);
    }
};

// Deletes the currently selected booklist.
async function deleteBookList(){
      try{
        const currentBookList = document.getElementById("bookListSelector").value;
        const response = await fetch("/deleteBookList", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({name: currentBookList})
        });
        const result = await response.json();

        if(result.error){
            console.log("Error: ", result.error);
        }

        await loadBookLists();
        const selector = document.getElementById("bookListSelector");
        if(selector.value != "null"){
            await loadSingularBookList();
        }else{
            const listElement = document.getElementById("bookList");
            listElement.textContent = "No book Lists added";
        }
    }
    catch(err){
        console.error(err);
    }
}

//Adds a new booklist with the requested name
async function addBookList(name){
    try{
        const response = await fetch("/addBookList", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({name: name, books: []})
        });
        const result = await response.json();

        if(result.error){
            console.log("Error: ", result.error);
        }
    }
    catch(err){
        console.error(err);
    }
}

// exports the currently selected booklist into the requested type(json or csv),
async function exportBookList(type){
    try{
        const bookList = document.getElementById("bookListSelector").value;
        if(bookList == "null"){
            console.log("Error: No list to export");
            return;
        }

        const response = await fetch(`/exportBookList?type=${type}&bookList=${bookList}`)
        
        // Converts the response to a file
        const file = await response.blob();
        closeOverlay("exportOverlay");

        // downloads the file
        const url = URL.createObjectURL(file);
        const temp = document.createElement("a");
        temp.href = url;
        temp.download = `${bookList}.${type}`;
        document.body.appendChild(temp);
        temp.click();
        temp.remove();
        URL.revokeObjectURL(url);

    }
    catch(err){
        console.log(err);
    }

}

function openOverlay(Overlayid){
    document.getElementById(Overlayid).style.display = "flex";
}

function closeOverlay(Overlayid){
    document.getElementById(Overlayid).style.display = "none";
}

const searchField = document.getElementById("bookSearch");
const searchButton = document.getElementById("bookSearchButton");
searchButton.addEventListener("click", async () => {
    try{
        await searchBooks(searchField.value.trim());
    }catch(err){
        console.error(err);
    }
});

const nameField = document.getElementById("nameField");
const addButtonAddOverlay = document.getElementById("addButtonAddOverlay");
addButtonAddOverlay.addEventListener("click", async () => {
    try{
        await addBookList(nameField.value);
        closeOverlay("addOverlay");
        await loadBookLists();
    }catch(err){
        console.error(err);
    }
});

const selector = document.getElementById("bookListSelector");
selector.addEventListener("change", async () => {
    try{
        await loadSingularBookList(selector.value);
    }catch(err){
        console.error(err);
    }
    
})

window.addEventListener("load", async () => {
    try{
        const selector = document.getElementById("bookListSelector");
        await loadBookLists();
        if(selector.value != "null"){
            await loadSingularBookList();
        }
        else{
            const listElement = document.getElementById("bookList");
            listElement.textContent = "No book Lists added";
        }
    }catch(err){
        console.error(err);
    }
});
