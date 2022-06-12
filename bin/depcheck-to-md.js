#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const input = process.argv.length > 2 ? process.argv[2] : null;
if (input == null) {
  console.log("No input file specified");
  process.exit(1);
}

const rootPrefix = path.dirname(path.resolve(input));
const results = JSON.parse(fs.readFileSync(input));

let unused = results["dependencies"];
let unusedDev = results["devDependencies"];
let missing = [];
Object.keys(results["missing"]).forEach(function (key) {
  const value = results["missing"][key];
  value.forEach(function (file) {
    missing.push(key + ": " + file.replace(rootPrefix + "/", ""));
  });
});

let output = "status";
if (process.argv.length > 3) {
  output = process.argv[3];
}

if (output === "text") {
  outputText();
} else if (output === "summary") {
  outputSummary();
} else {
  if (missing.length > 0) {
    console.log(
      "Missing dependencies detected, so returning a non-zero exit code"
    );
    process.exit(1);
  }
}

function outputText() {
  if (unused.length > 0) {
    console.log("### Unused Dependencies");
    console.log(" ");
    unused.forEach(function (dependency) {
      console.log("- " + dependency);
    });
    console.log(" ");
  }

  if (unusedDev.length > 0) {
    console.log("### Unused Dev Dependencies");
    console.log(" ");
    unusedDev.forEach(function (dependency) {
      console.log("- " + dependency);
    });
    console.log(" ");
  }

  if (missing.length > 0) {
    console.log("### Missing Dependencies");
    console.log(" ");
    missing.forEach(function (dependency) {
      console.log("- " + dependency);
    });
    console.log(" ");
  }
}

function outputSummary() {
  console.log("### Depcheck Summary:");
  console.log(" ");
  console.log(
    "- :warning: " + unused.length.toString() + " Unused Dependencies"
  );
  console.log(
    "- :warning: " + unusedDev.length.toString() + " Unused Dev Dependencies"
  );
  console.log(
    "- :rotating_light: " + missing.length.toString() + " Missing Dependencies"
  );
}
