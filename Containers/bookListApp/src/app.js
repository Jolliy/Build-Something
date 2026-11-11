const express = require("express");
const path = require("path");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/UI", express.static(path.join(__dirname, "UI")));

app.get("/", async(req, res) => {
    res.sendFile(path.join(__dirname, "UI", "index.html"))
})

app.get("/searchBooks", async (req, res) => {
    try{
        // const result = await fetch(`${"url to dataHandler"}/apiFetch/searchBooks?q=${req.query.q}`);
        // const books = await result.json();
        res.json(data);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})

app.get("/bookList", async (req, res) => {
    try{
        //get all the books in the database
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

app.post("/saveBookToList", async (req, res) => {
    
    try{
    //save book to database
    }catch(err){
        res.status(500).json({error: err.message});
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