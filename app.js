require("dotenv").config();
const Airtable = require("airtable");

// ENV VARIABLE
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

// Variable
let listTournois = ["Sélectionner un tournois"];

const express = require("express");

// Création App Express

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Connect Airtable

const base = new Airtable({ apiKey: apiKey }).base(baseId);

// Logique

app.get("/allrecord", (req, res, next) => {
  let list = [];
  base(req.body.base)
    .select({
      view: "Main",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          list.push({'Name':record.get("Nom"), 'id':record.id});
        });
        fetchNextPage();
        res.status(200).json({ Retrieved: list });
      },
      function done(err) {
        if (err) {
          res.status(404).json(err);
        }
      }
    );
});

app.get("/onerecord", (req, res, next) => {
  base(req.body.base).find(req.body.id, function (err, record) {
    if (err) {
      res.status(404).json(err);
    }
    res.status(200).json({ Retrieved: record.fields });
  });
});

module.exports = app;
