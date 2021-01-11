require("dotenv").config();
const Airtable = require("airtable");

// ENV VARIABLE
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
console.log(apiKey);
console.log(baseId);

// Variable
var listTournois = ['Sélectionner un tournois']

const base = new Airtable({ apiKey: apiKey }).base(baseId);

function viewBase() {
  base("Tournois")
    .select({
      view: "Main",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          listTournois.push(record.get("Nom"));
          console.log(listTournois)
        });
        fetchNextPage();
    },
    function done(err) {
        if (err) {
            console.error(err);
            return;
        }
    }
    );
    return listTournois
}

viewBase();
console.log(listTournois)
