import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
let appData;
try {
    appData = JSON.parse(fs.readFileSync("app.json", "utf-8"));
}
catch (err) {
    console.error("Error reading app.json:", err);
    process.exit(1); // Exit with an error code if there's a problem reading the data
}
async function displayQuestion(question) {
    const choices = question.options.concat("Exit Quiz"); // Add "Exit Quiz" option
    return inquirer.prompt([
        {
            type: "list",
            name: "answer",
            message: question.question,
            choices,
        },
    ]);
}
async function startQuiz() {
    console.log(chalk.yellow.bold("Let's start the quiz!"));
    let score = 0;
    let incorrectAnswers = [];
    for (const quiz of appData) {
        const answer = await displayQuestion(quiz);
        if (answer.answer === "Exit Quiz") {
            console.log(chalk.yellow("Exiting quiz..."));
            break; // Exit the loop if user chooses "Exit Quiz"
        }
        if (answer.answer === quiz.correctAnswer) {
            console.log(chalk.green("Correct answer!"));
            score++;
        }
        else {
            console.log(chalk.red("Wrong answer!"));
            incorrectAnswers.push(`${quiz.question} ${chalk.red(incorrectAnswers)} Correct answer is ${chalk.green(quiz.correctAnswer)}`);
        }
    }
    console.log(`Quiz ended! Your score: ${score}/${appData.length}`);
    if (incorrectAnswers.length > 0) {
        console.log(chalk.red.bold(" your Incorrect Answers"));
        incorrectAnswers.forEach((incorecanswer) => {
            console.log(incorecanswer);
        });
    }
    else {
        console.log(chalk.green.bold("congratulations you got the all correct answers your score is", score));
    }
}
startQuiz();
