// Import Express.js
const fs = require("fs");
const express = require("express");
const path = require("path");
// Create an instance of the app using Express.js
const app = express();
// Set up a port for our application to run on
const PORT = process.env.PORT || 3001;
const notes = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Make public a static directory
app.use(express.static("public"));

//Create Note

function generateNote(body, ntArray) {
  const newNotes = body;
  console.log("generateNote()", newNotes);
  console.log("ntArray", ntArray);
  ntArray.push(newNotes);
  console.log("ntArray", ntArray);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(ntArray, null, 2)
  );
  return newNotes;
}

// Routes
// app.use("/", apiHtml);
app.get("/notes", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// app.use("/api", apiR);
//API routes should be created:
//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});
// POST /api/notes should receive a new note to save on the request body,
//add it to the db.json file, and then return the new note to the client.
//You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
// used UUidv4
app.post("/api/notes", (req, res) => {
  req.body.id = uuidv4();
  let result = generateNote(req.body, notes);
  res.json(result);
});

//bonus: DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
app.delete("/api/notes/:id", (req, res) => {
  console.log(req.params.id);
  // In order to delete a note, you'll need to read all notes from the db.json file
  //remove the one with the given id property, and then rewrite the notes array back to the db.json file.
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    console.log(data);

    if (err) throw err;
    //deleteing data and remove
    let delNote = JSON.parse(data).filter((note) => note.id !== req.params.id);
    console.log(delNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
    res.send(`Deleted ${req.params.id}`);
  });
});
app.get("*", (req, res) => {
  console.log(__dirname);
  //__dirname : It will give us the current directory from where the server is running.
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
