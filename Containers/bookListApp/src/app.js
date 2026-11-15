const express = require("express");
const path = require("path");
const app = express();
const PORT = 8080;
const DATA_HANDLER_URL = process.env.DATA_HANDLER_URL;
const EXPORT_URL = process.env.EXPORT_URL;

app.use(express.json());
app.use("/UI", express.static(path.join(__dirname, "UI")));

app.get("/", async(req, res) => {
    return res.sendFile(path.join(__dirname, "UI", "index.html"))
})

// Sends a request to datahandler microservice to search for books with the search received from the frontend
// Then sends the results back.
app.get("/searchBooks", async (req, res) => {
    try{
        const response = await fetch(`${DATA_HANDLER_URL}/apiFetch/searchBooks?q=${req.query.q}`);
        const result = await response.json();
        
        return res.json(result);
    }
    catch(err){
        return res.json({error: err.message});
    }
})

// Sends a request to datahandler microservice to load the available booklists
// Then sends the results back.
app.get("/bookList", async (req, res) => {
    try{
        const response = await fetch(`${DATA_HANDLER_URL}/DB/loadBookList`);
        const result = await response.json();

        return res.json(result);

    }catch(err){
        return res.json({error: err.message});
    }
});

// Sends a request to datahandler microservice to load a specific booklist with all the books.
// Then sends the results back.
app.get("/bookSingularList", async (req, res) => {
    try{
        const response = await fetch(`${DATA_HANDLER_URL}/DB/loadSingularBookList?q=${req.query.q}`);
        const result = await response.json();

        return res.json(result);

    }catch(err){
        return res.json({error: err.message});
    }
});

// Sends a request to datahandler microservice to delete a specific book from a specific booklist.
// Then sends the results back.
app.post("/deleteBookFromList", async (req, res) => {
    try{
        const response = await fetch(`${DATA_HANDLER_URL}/DB/deleteBookFromBookList`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.json()
        return res.json(result)

    }catch(err){

    }
});

// Sends a request to datahandler microservice to add a book to a specific booklist.
// Then sends the results back.
app.post("/saveBookToList", async (req, res) => {
    try{
        const response = await fetch(`${DATA_HANDLER_URL}/DB/saveToBookList`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.json()
        return res.json(result)

    }catch(err){
        return res.json({error: err.message});
    }
});

// Sends a request to datahandler microservice to add a booklist with a specific name.
// Then sends the results back.
app.post("/addBookList", async (req,res) => {
    try{
        const response = await fetch(`${DATA_HANDLER_URL}/DB/addBookList`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.json()
        return res.json(result)

    }catch(err){
        return res.json({error: err.message});
    }
});

// Sends a request to datahandler microservice to delete a specific booklist.
// Then sends the results back.
app.post("/deleteBookList", async (req, res) =>{
    try{
        const response = await fetch(`${DATA_HANDLER_URL}/DB/deleteBookList`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.json()
        return res.json(result)

    }catch(err){
        return res.json({error: err.message});
    }
});

// Sends a request to export microservice to export a specific booklist to a specific type(json or csv).
// Then sends the results back.
app.get("/exportBookList", async (req, res) => {
    try{
        const response = await fetch(`${EXPORT_URL}/file/exportFile?type=${req.query.type}&bookList=${req.query.bookList}`);
        let result;

        if(req.query.type == "csv"){
            result = await response.text();
            return res.send(result);
        }

        result = await response.json();
        return res.send(result)

    }catch(err){
        return res.json({ error: err.message });
    }
});

async function start(){
    try{
        app.listen(PORT)
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
};

start();
