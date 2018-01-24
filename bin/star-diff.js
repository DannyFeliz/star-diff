#!/usr/bin/env node

const app = require("commander");
const axios = require("axios");
const cliTable = require("cli-table2");
const colors = require("colors");
const log = console.log;
const moment = require("moment");
const packageJson = require("../package.json");

axios.defaults.baseURL = "https://api.github.com/search/repositories";
axios.defaults.params = { per_page: 1 };

app
  .version(packageJson.version)
  .description(packageJson.description)
  .usage("<repo1> <repo2>")
  .arguments("<repo1> <repo2>")
  .option("-s, --stats", "display request Github stats")
  .action((repo1, repo2) => {
    getRepoData(repo1, repo2).then(({ resultRepo1, resultRepo2 }) => {
      displayRepoStats(resultRepo1, resultRepo2);
    });
  })
  .parse(process.argv);

if (!app.args.length) app.help();

/**
 * why not ¯\_(ツ)_/¯
 */
function empyLine() {
  console.log("");
}


/**
 * TODO: DRY this to avoid duplications
 * @param {Object} repo1 
 * @param {Object} repo2 
 */
async function getRepoData(repo1, repo2) {
  empyLine();
  log(colors.blue(`Searching ${repo1}...`));
  let resultRepo1 = await axios({ params: { q: repo1 } }).then(data => {
    updateHeaderData(data.headers);
    log(colors.blue(`Found https://github.com/${data.data.items[0].full_name}`));
    return data.data.items[0];
  });
  empyLine();
  log(colors.green(`Searching ${repo2}...`));
  let resultRepo2 = await axios({ params: { q: repo2 } }).then(data => {
    updateHeaderData(data.headers);
    log(colors.green(`Found https://github.com/${data.data.items[0].full_name}`));
    empyLine();
    return data.data.items[0];
  });

  resultRepo1 = {
    name: resultRepo1.name,
    stars: resultRepo1.stargazers_count
  };
  resultRepo2 = {
    name: resultRepo2.name,
    stars: resultRepo2.stargazers_count
  };

  return { resultRepo1, resultRepo2 };
}


const headerData = {
  limit: 0,
  remaining: 0,
  resetTime: 0
};

/**
 * 
 * @param {Object} headers 
 */
function updateHeaderData(headers) {
  headerData.limit = headers["x-ratelimit-limit"];
  headerData.remaining = headers["x-ratelimit-remaining"];
  headerData.resetTime = headers["x-ratelimit-reset"];
}

/**
 * 
 * @param {Object} repo1 
 * @param {Object} repo2 
 */
function displayRepoStats(repo1, repo2) {
  const winner = repo1.stars > repo2.stars ? repo1.name : repo2.name;
  const winnerColor = repo1.stars > repo2.stars ? "blue" : "green";
  const difference = Math.abs(repo1.stars - repo2.stars).toLocaleString();

  const repoTable = new cliTable({
    head: ["PROJECT", "STARS"]
  });

  repoTable.push(
    [colors.blue(repo1.name), colors.blue(repo1.stars.toLocaleString())], 
    [colors.green(repo2.name), colors.green(repo2.stars.toLocaleString())], 
    [{
      colSpan: 2,
      content: colors[winnerColor](`${winner} wins with ${difference}`)
    }]
  );

  console.log(repoTable.toString());

  if (app.stats) {
    displayGithubStats();
  }
}

function displayGithubStats() {
  const originalResetDate = moment.unix(headerData.resetTime);
  const resetTime = {
    originalResetDate,
    agoTime: originalResetDate.fromNow(),
    formatedTime: originalResetDate.format("hh:mm:ss A")
  };
  const table = new cliTable({
    head: ["LIMIT", "REMAINING REQUESTS", "RESET TIME"]
  });

  table.push([
    colors.yellow(headerData.limit),
    colors.yellow(headerData.remaining),
    colors.yellow(`${resetTime.agoTime} (${resetTime.formatedTime})`),
  ]);

  console.log(table.toString());
}

