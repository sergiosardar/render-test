import express from "express";
import morgan from "morgan";

const app = express();
app.use(express.json());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

const PORT = process.env.PORT || 3000;

let PEOPLE = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons/:id?", (req, res) => {
  if (req.params?.id) {
    const matchingPerson = PEOPLE.find(
      (person) => person.id === Number(req.params.id)
    );
    if (matchingPerson) {
      res.send(matchingPerson);
    } else {
      res.status(404);
      res.send();
    }
    return;
  }

  res.send(PEOPLE);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  PEOPLE = PEOPLE.filter((person) => person.id !== id);
  res.end();
});

app.post("/api/persons", (req, res) => {
  const person = req.body;
  if (!person) {
    res.status(400);
    res.send({ error: "person details must be provided" });
    return;
  }

  if (!person.name) {
    res.status(400);
    res.send({ error: "name must be set" });
    return;
  }

  if (!person.number) {
    res.status(400);
    res.send({ error: "number must be set" });
    return;
  }

  if (
    PEOPLE.includes(
      (entry) =>
        entry.name.toLowerCase().trim() === person.name.toLowerCase().trim()
    )
  ) {
    res.status(400);
    res.send({ error: "name must be unique" });
    return;
  }

  const newEntry = {
    ...person,
    id: Math.floor(Math.random() * 1_000_000_000),
  };

  PEOPLE.push(newEntry);
  res.send(newEntry);
});

app.get("/info", (_, res) => {
  res.send(
    `<p>Phonebook has info for ${
      PEOPLE.length
    } people</p><p>${new Date().toString()}</p>`
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
