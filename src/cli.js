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
      "--forbid-camel-case": Boolean,
      "--check-only": Boolean,
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
    newline: args["--newline"] || false,
    lowerWords: args["--lower-words"] || false,
    allowCamelCase: !args["--forbid-camel-case"] || false,
    check: args["--check-only"] || false,
    filePaths: args["_"] || [],
  };
}

export function formatSql(args) {
  const parsedArgs = parseArgumentsIntoOptions(args);
  const { filePaths } = parsedArgs;
  const { check } = parsedArgs;
  const options = Object.keys(parsedArgs)
    .filter(function (key) {
      return key !== "filePaths" && key !== "check";
    })
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: parsedArgs[key],
      };
    }, {});

  filePaths.forEach((filePath) => {
    const data = fs.readFileSync(filePath, "utf8");
    let formatted = format(data, options);
    if (formatted !== data) {
      if (!check) {
        console.log(`Formatting ${filePath}`);
        fs.writeFileSync(filePath, formatted);
      } else {
        console.error(`${filePath} needs to be reformatted`);
        process.exitCode = 1;
      }
    }
  });
}
