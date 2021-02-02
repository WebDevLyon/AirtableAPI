require("dotenv").config();
const Airtable = require("airtable");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// ENV VARIABLE
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

// Variable
let listTournois = ["Sélectionner un tournois"];
// User test pour auth
const users = [{ id: "1", username: "nijlak", password: "123" }];
const SECRET = "TOKEN";

const express = require("express");

// Création App Express

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

// Connect Airtable

const base = new Airtable({ apiKey: apiKey }).base(baseId);

// Middleware
/* Récupération du header bearer */
const extractBearerToken = (headerValue) => {
  if (typeof headerValue !== "string") {
    return false;
  }

  const matches = headerValue.match(/(bearer)\s+(\S+)/i);
  return matches && matches[2];
};

/* Vérification du token */
const checkTokenMiddleware = (req, res, next) => {
  // Récupération du token
  const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization);

  // Présence d'un token
  if (!token) {
    return res.status(401).json({ message: "Error. Need a token" });
  }

  // Véracité du token
  jwt.verify(token, SECRET, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: "Error. Bad token" });
    } else {
      return next();
    }
  });
};

// Logique

app.get("/allrecord", (req, res, next) => {
  let list = [];
  base(req.query.base)
    .select({
      view: "Main",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          list.push({
            name: record.get("Nom"),
            id: record.id,
            start: record.get("Date_debut"),
            end: record.get("Date_Fin"),
            Envoi_1:record.get("Envoi_1"),
            Envoi_1_Fait:record.get("Envoi_1_Fait"),
            Envoi_2:record.get("Envoi_2"),
            Envoi_2_Fait:record.get("Envoi_2_Fait"),
            Envoi_3:record.get("Envoi_3"),
            Envoi_3_Fait:record.get("Envoi_3_Fait"),
            order:record.get("Ordre du chèque"),
            linkBadiste:record.get("Lien_Badiste"),
            adresse:record.get('Adresse')
          });
          console.log(list);
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
  base(req.query.base).find(req.query.id, function (err, record) {
    if (err) {
      res.status(404).json(err);
    }
    res.status(200).json({ Retrieved: record.fields });
  });
});

/* Formulaire de connexion */
app.post("/login", (req, res) => {
  // Pas d'information à traiter
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({
        message: "Error. Please enter the correct username and password",
      });
  }

  // Checking
  const user = users.find(
    (u) => u.username === req.body.username && u.password === req.body.password
  );

  // Pas bon
  if (!user) {
    return res.status(400).json({ message: "Error. Wrong login or password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    SECRET,
    { expiresIn: "24 hours" }
  );

  return res.json({ token: token });
});

app.get("/me", checkTokenMiddleware, (req, res) => {
  // Récupération du token
  const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization);
  // Décodage du token
  const decoded = jwt.verify(token, SECRET, { complete: false });

  return res.json({ user: decoded });
});

app.post("/register", (req, res) => {
  // Aucune information à traiter
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Error. Please enter username and password" });
  }

  // Checking
  const userExisting = users.find((u) => u.username === req.body.username);

  // Pas bon
  if (userExisting) {
    return res
      .status(400)
      .json({ message: `Error. User ${req.body.username} already existing` });
  }

  // Données du nouvel utilisateur
  const id = users[users.length - 1].id + 1;
  const newUser = {
    id: id,
    username: req.body.username,
    password: req.body.password,
  };

  // Insertion dans le tableau des utilisateurs
  users.push(newUser);

  return res.status(201).json({ message: `User ${id} created` });
});

//Modif tournois
  // !Déterminer l'entrée pour la req : type, contenu...
  // *Boucle pour incrémenter un tableau de modif
app.put("/tournoi",(req,res)=>{
  base('Tournois').update(
    [
  {
    id: req.body.id,
    fields: {Nom : 'test',
    A_saisir: ['Fait']}
  }
    ], 
    function(err, records) {
      if (err) {
        res.json(err);
      return;
      }
      records.forEach(function(record) {
       res.json({result:record.get('Nom')});
      });
    });
})

app.listen(process.env.PORT || 3000, () =>
  console.log("Server started on port " + process.env.PORT + "...")
);
