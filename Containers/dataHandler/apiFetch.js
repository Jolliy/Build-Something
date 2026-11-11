const express = require("express");
const app = express();
const PORT = 3000;

app.get("/apiFetch/searchBooks", async (req,res) => {
    try{
        const result = await fetch(`https://openlibrary.org/search.json?q=${req.query.q}&limit=20&fields=title,author_name,first_publish_year,subject,language`);
        let data = await result.json();

        // save to cache for easier acces during saving.

        res.json(data);
    }
    catch(err){
        res.status(502).json({error: err.message});
    }
});

async function start(){
    try{
        // TODO: connect to db and define tables

        app.listen(PORT)
    }
    catch(err){
        console.error(err.message);
        console.error(err.cause);
        process.exit(1);
    }
};

start();