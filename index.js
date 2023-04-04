const express = require("express");
const app = express();

app.use(express.json());

let notes = [
  {
    id: 1,
    content: "Go to grocery store",
    important: true,
  },
  {
    id: 2,
    content: "Send a message to Ahn",
    important: false,
  },
  {
    id: 3,
    content: "Walk the dogo",
    important: true,
  },
];
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.post("/api/notes", (request, response) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

  const note = request.body;
  note.id = maxId + 1;

  notes = notes.concat(note);

  response.json(note);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).send("Bad Request").end();
  }
});

app.put("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const noteToUpdate = notes.find((note) => note.id === id);

  if (!noteToUpdate) {
    response.status(404).send("Note not found").end();
    return;
  }

  const updatedNote = request.body;
  notes = notes.map((note) => (note.id === id ? updatedNote : note));

  response.json(updatedNote);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
