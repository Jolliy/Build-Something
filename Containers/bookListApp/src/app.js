const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/UI", express.static(path.join(__dirname, "UI")));
app.get("/", async(req, res) => {
    res.sendFile(path.join(__dirname, "UI", "index.html"))
})

app.get("/endpoint", async (req, res) => {
    try{

        res.json();
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});


async function start(){
    try{
        app.listen(PORT)
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
};

start();