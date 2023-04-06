const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

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

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
