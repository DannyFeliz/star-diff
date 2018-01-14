const axios =  require("axios");
const moment = require("moment");
const chalk = require("chalk");
const fs = require("fs");
const log = console.log;

let headerData = {
    limit: 0,
    remaining: 0,
    resetTime: 0
}

function updateHeaderData(headers) {
    headerData.limit = headers["x-ratelimit-limit"];
    headerData.remaining = headers["x-ratelimit-remaining"];
    headerData.resetTime = headers["x-ratelimit-reset"];
}

function displayHeaderData() {
    const originalResetDate = moment.unix(headerData.resetTime);
    const resetTime = {
        originalResetDate,
        agoTime: originalResetDate.fromNow(),
        formatedTime: originalResetDate.format("hh:mm:ss A")
    }
    log(chalk.magenta(`HEADER INFORMATION`));
    log(chalk.redBright(`LIMIT \t REMAINIG \t RESET TIME`));
    log(chalk.yellowBright(`${headerData.limit} \t ${headerData.remaining} \t\t ${resetTime.agoTime} (${resetTime.formatedTime})`));
    log(chalk.whiteBright(`\t`));
}

async function getRepoData() {
    let react = await axios.get(`https://api.github.com/repos/facebook/react`).then(data => {
        updateHeaderData(data.headers);
        return data.data;
    });
    let vue = await axios.get(`https://api.github.com/repos/vuejs/vue`).then(data => {
        updateHeaderData(data.headers);
        return data.data;
    });

    displayHeaderData();
    react = { name: react.name, stars: react.stargazers_count};
    vue = { name: vue.name, stars: vue.stargazers_count};

    return { react, vue }
}

getRepoData().then(({ react, vue }) => {
    generateOutput({ react, vue });
});

function generateOutput({ react, vue }) {
    const winner = react.stars > vue.stars ? 'React' : 'Vue';
    const winnerColor = react.stars > vue.stars ? "blue" : "green";
    const difference = Math.abs(react.stars - vue.stars).toLocaleString();
    log(chalk.white(`PROJECT \t STARS `));
    log(chalk.white(`=======================`));
    log(chalk.blue(`${react.name} \t\t ${react.stars.toLocaleString()}`));
    log(chalk.green(`${vue.name} \t\t ${vue.stars.toLocaleString()}`));
    log(chalk.white(`-----------------------`));
    log(chalk[winnerColor](`${winner} wins with\t${difference}`));
}