import inquirer from "inquirer";

export default async function (message = "Do you wish to continue?") {
  return inquirer
    .prompt([
      {
        type: "confirm",
        name: "continue",
        message,
      },
    ])
    .then((answers) => {
      if (!answers.continue) {
        process.exit(0);
      }
    });
}
