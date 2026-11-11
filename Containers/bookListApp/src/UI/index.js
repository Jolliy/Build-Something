const searchField = document.getElementById("bookSearch");
const searchButton = document.getElementById("bookSearchButton");

function formatBookValue(value, fallback = "Unknown") {
    if (Array.isArray(value)) {
        return value.length ? value.join(", ") : fallback;
    }
    return value ? value : fallback;
}

async function searchBooks(search){
    try{
        const res = await fetch(`/searchBooks?q=${search}`);
        const data = await res.json();
        const bookList = document.getElementById("bookList");
    
        for(item of data.book){
            const div = document.createElement('div');
            div.className = "bookItem";

            div.innerHTML = "";

            const title = document.createElement('h3');
            title.textContent = item.title || "Unknown title";
            div.appendChild(title);

            const author = document.createElement('p');
            author.textContent = `Author: ${formatBookValue(item.author_name, "Unknown author")}`;
            div.appendChild(author);

            const year = document.createElement('p');
            year.textContent = "Publishing year: " + item.first_publish_year || "Unknown year";
            div.appendChild(year);

            const language = document.createElement('p');
            language.textContent = `Language: ${formatBookValue(item.language, "Unknown language")}`;
            div.appendChild(language);

            const button = document.createElement('button');
            button.className = "saveButton";
            button.textContent = "save";

            // TODO: add an eventlistener
            div.appendChild(button);
            bookList.appendChild(div);
        }
    }
    catch(err){
        console.error("INDEX ERROR", err);
    }
}

searchButton.addEventListener("click", () => {
    searchBooks(searchField.value.trim());
});