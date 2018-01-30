#!/usr/bin/env node

const app = require("commander");
const axios = require("axios");
const cliTable = require("cli-table2");
const colors = require("colors");
const log = console.log;
const moment = require("moment");
const packageJson = require("../package.json");
const _ = require("lodash");

axios.defaults.baseURL = "https://api.github.com/search/repositories";
axios.defaults.params = { per_page: 1 };

app
  .version(packageJson.version)
  .description(packageJson.description)
  .usage("<repo1> <repo2>")
  .arguments("<repo1> <repo2>")
  .option("-s, --stats", "display request Github stats")
  .action((repo1, repo2) => {
    getRepoData(repo1, repo2).then(repos => {
      if (repos) {
        displayRepoStats(repos.resultRepo1, repos.resultRepo2);
      }
    });
  })
  .parse(process.argv);

if (!app.args.length) app.help();

/**
 * why not ¯\_(ツ)_/¯
 */
function emptyLine() {
  log("");
}


function repoNotFound(repo) {
  log(colors.red(`Sorry the repository ${repo} was not found`));
}


async function fetchRepoData(repo) {
  emptyLine();
  log(colors.blue(`Searching ${repo}...`));

  let resultRepo1 = await axios({ params: { q: repo } }).then(data => {
    if (!data.data.total_count) return;
    updateHeaderData(data.headers);
    log(colors.blue(`Found https://github.com/${data.data.items[0].full_name}`));
    return data.data.items[0];
  })

  emptyLine();

  return resultRepo1;
}

/**
 * TODO: DRY this to avoid duplications
 * @param {Object} repo1 
 * @param {Object} repo2 
 */
async function getRepoData(repo1, repo2) {

  let resultRepo1 = await fetchRepoData(repo1);
  if (!resultRepo1) return repoNotFound(repo1);

  resultRepo1 = {
    name: resultRepo1.name,
    stars: resultRepo1.stargazers_count
  };

  resultRepo2 = await fetchRepoData(repo2);
  if (!resultRepo2) return repoNotFound(repo2);

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

  const difference = Math.abs(repo1.stars - repo2.stars);
  let winnerMessage = "";
  if (!difference) {
    winnerMessage = "Both repositories have the same number of stars";
  } else {
    const winner = repo1.stars > repo2.stars ? repo1.name : repo2.name;
    winnerMessage = `${winner} wins with ${difference.toLocaleString()}`
  }

  let winnerColor = "";
  if (repo1.stars > repo2.stars) {
    winnerColor = "blue";
  } else if (repo1.stars < repo2.stars) {
    winnerColor = "green";
  } else {
    winnerColor = "yellow";
  }

  const repoTable = new cliTable({
    head: ["PROJECT", "STARS"]
  });

  repoTable.push(
    [colors.blue(repo1.name), colors.blue(repo1.stars.toLocaleString())], 
    [colors.green(repo2.name), colors.green(repo2.stars.toLocaleString())], 
    [{
      colSpan: 2,
      content: colors[winnerColor](winnerMessage)
    }]
  );

  log(repoTable.toString());

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

  log(table.toString());
}
