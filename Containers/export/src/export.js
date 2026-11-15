const express = require("express");
const { stringify } = require("csv-stringify/sync");
const app = express();
const PORT = 5000;
const DATA_HANDLER_URL = process.env.DATA_HANDLER_URL;

app.use(express.json());

//Exports a booklist that was requested to the requested type (json or csv).
// It converts the booklist recived from the datahandler into the type.
app.get("/file/exportFile", async (req, res) => {
    try{
        const response = await fetch(`${DATA_HANDLER_URL}/DB/loadSingularBookList?q=${req.query.bookList}`);
        const result = await response.json();

        // converts booklist to csv type
        if(req.query.type == "csv"){
            const data = []
            if(result[0].books.length != 0){
                //gets the keys of the books to make the header.
                const header = Object.keys(result[0].books[0]);
                data.push(header);

                for(const book of result[0].books){
                    let row = [];

                    // takes the values of the individual book item
                    const values = Object.values(book);

                    // goes through all the values to see if theres a list, if there is a list, we join each item with 
                    // a semicolon as seperator.
                    for(const bookListValues of values){
                        let value = bookListValues;
                        if(Array.isArray(bookListValues)){
                            value = bookListValues.join(";");
                        }
                        row.push(value);
                    }
                    data.push(row);
                }
            }

            return res.send(stringify(data));
        }
        
        // Only takes the necessary booklist data and sends it as a json.
        const data = {
            name: result[0].name,
            booklist: result[0].books
        }

        return res.send(JSON.stringify(data));
    }catch(err){
        return res.json({ error: err.message });
    }
});

async function start(){
    try{
        app.listen(PORT)
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
};

start();
