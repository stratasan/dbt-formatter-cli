import arg from "arg";
import fs from "fs";
import format from "dbt-formatter";

const defaultOptions = {};

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--sql": String,
      "--indent": Number,
      "--upper": Boolean,
      "--newline": Boolean,
      "--lower-words": Boolean,
      "--allow-camel-case": Boolean,
    },
    {
      argv: rawArgs.slice(2),
      permissive: true,
    }
  );

  return {
    sql: args["--sql"] || "default",
    indent: args["--indent"] || 2,
    upper: args["--upper"] || false,
    newline: args["--new-line"] || false,
    lowerWords: args["--lower-words"] || false,
    allowCamelCase: args["--allow-camel-case"] || true,
    filePaths: args["_"] || [],
  };
}

export function formatSql(args) {
  const parsedArgs = parseArgumentsIntoOptions(args);
  const { filePaths } = parsedArgs;
  const options = Object.keys(parsedArgs)
    .filter((key) => key !== "filePaths")
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: parsedArgs[key],
      };
    }, {});

  filePaths.forEach((filePath) => {
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      let formatted = format(data, options);
      if (formatted !== data) {
        console.log(`Formatting ${filePath}`);
        fs.writeFile(filePath, formatted, (err) => {
          if (err) {
            console.log(
              `Error writing formatted version of ${filePath}: ${err}`
            );
          }
        });
      }
    });
  });
}
