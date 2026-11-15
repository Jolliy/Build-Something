const express = require("express");
const {MongoClient} = require("mongodb")
const app = express();
const PORT = 3000;
const client = new MongoClient(process.env.BOOKLIST_DATABASE);
let db;

app.use(express.json());

// Sends a requsts to the open library api with the search it recieved.
// Then it sends the result back.
app.get("/apiFetch/searchBooks", async (req,res) => {
    try{
        const response = await fetch(`https://openlibrary.org/search.json?q=${req.query.q}&fields=key,title,author_name,first_publish_year,language`);
        const result = await response.json();

        // Deletes item in the current cache collection
        await db.collection("bookCache").deleteMany({}); 
    
        if(result.docs == undefined || result.docs.length == 0){
            return res.json({ error: "No books found" });
        }

        //Adds the new response to the cashe. 
        await db.collection("bookCache").insertMany(result.docs);
    
        return res.json(result)
    }catch(err){
        return res.json({error: err.message});
    }
});

// Saves a book to the desired booklist in the db. 
app.post("/DB/saveToBookList", async (req, res) => {
    try{
        let bookPresentInList = false;
        const bookList = await db.collection("bookLists").findOne({name: req.body.bookList});

        // checks if the book is already in the booklist
        if(bookList.books.length != 0){
             for(const book of bookList.books){
                if(book.key == req.body.key){
                    bookPresentInList = true;
                }
            }
        }

        if(bookPresentInList){
            return res.json({ error: "Book already present in booklist" });
        }

        // finds the book in the cache and deletes the _id, then it adds it to the requested booklist
        const book = await db.collection("bookCache").findOne({key: req.body.key});
        delete book._id;
        const response  = await db.collection("bookLists").updateOne(
            { name: bookList.name},
            { $push: {books: book}}
        );

        return res.json(response);
    }catch(err){
        return res.json({error: err.message});
    }
});


// Deletes a book from the desired booklist in the db. 
app.post("/DB/deleteBookFromBookList", async (req, res) =>{
    try{
        const bookList = await db.collection("bookLists").findOne({name: req.body.bookList});
        const response  = await db.collection("bookLists").updateOne(
            { name: bookList.name},
            { $pull: {books: {key: req.body.key}}}
        );

        return res.json(response);
    }catch(err){
        return res.json({ error: err.message });
    }
});


// Retreives all booklists in the database 
app.get("/DB/loadBookList", async (req, res) => {
    try{
        const bookList= await db.collection("bookLists").find().toArray();
        return res.json(bookList);

    }catch(err){
        return res.json({ error: err.message });
    }
})

// Retreives a single booklist in the database 
app.get("/DB/loadSingularBookList", async (req, res) => {
    try{
        const bookList= await db.collection("bookLists").find({name: req.query.q}).toArray();
        return res.json(bookList);

    }catch(err){
        return res.json({ error: err.message });
    }
})

// Adds a booklist with the requested name to the database 
app.post("/DB/addBookList", async (req, res) => {
    try{
        // checks if a booklist with the same name, already exists
        const bookList = await db.collection("bookLists").findOne({name: req.body.name});
        if(bookList){
            return res.json({ error: `The is aleardy a booklist with the name: ${req.body.name}` });
        }
        
        const response = await db.collection("bookLists").insertOne(req.body);
        return res.json(response);
    }
    catch(err){
        return res.json({error: err.message});
    }

});

// deletes a booklist with the requested name from the database 
app.post("/DB/deleteBookList", async (req, res) => {
    try{
        const response = await db.collection("bookLists").deleteMany(req.body);
        return res.json(response);
    }
    catch(err){
        return res.json({error: err.message});
    }
});


// connects to the database / creates or pulls up the database and collections necessary
async function start(){
    try{
        await client.connect();
        db = client.db("booklist");
        await db.collection("bookLists");
        await db.collection("bookCache");
        app.listen(PORT)
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
};

start();
