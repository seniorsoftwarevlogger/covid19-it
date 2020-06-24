const { google } = require("googleapis");
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

const fs = require("fs");
const path = require("path");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {function} callback The callback to call with the authorized client.
 */
async function main(callback) {
  // This method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
  // environment variables.
  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: SCOPES,
  });
  // const authClient = await auth.getClient();

  // // obtain the current project Id
  // const project = await auth.getProjectId();

  callback(auth);
}

function list(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1A__fabAMoJVFfZQl8yFpuUow7By2TKg4aAXa4306Dpg",
      range: "Form Responses 1!B2:I",
    },
    (err, res) => {
      if (err) return console.error("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        const data = rows.map(
          ([
            country,
            country2,
            companyProfile,
            companyType,
            position,
            position2,
            level,
            impact,
          ]) => {
            if (country === "Свой вариант") {
              country = country2;
            }

            return {
              country,
              companyProfile,
              companyType,
              position,
              position2,
              level,
              impact,
            };
          }
        );

        const csvStringifier = createCsvStringifier({
          header: [
            { id: "country", title: "Страна" },
            { id: "companyType", title: "Тип компании" },
            { id: "position", title: "Кем работаю" },
            { id: "level", title: "Должность" },
            { id: "impact", title: "Как отразился карантин" },
          ],
        });
        process.stdout.write(csvStringifier.getHeaderString());
        process.stdout.write(csvStringifier.stringifyRecords(data));
      } else {
        console.error("No data found.");
      }
    }
  );
}

main(list);
