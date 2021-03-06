const _ = require("lodash");
const scraper = require("./scraper.js");

const findTeamName = teamKey => {
  const teamData = require("./data/id_to_name.json");
  return teamData[teamKey][0];
};
exports.findTeamName = findTeamName;

const findTeamKey = teamName => {
  const teamData = require("./data/name_to_id.json");
  return teamData[teamName][0];
};
exports.findTeamKey = findTeamKey;

const findTeamLogoUrl = teamKey => {
  const teamData = require("./data/id_to_logo.json");
  return teamData[teamKey][0];
};
exports.findTeamLogoUrl = findTeamLogoUrl;

const findGameResultsForTeamDate = (team, date) => {
  const year = _.split(date, "-")[0];

  return scraper.findGameResultsForTeamYear(team, year).then(allGames => {
    console.log(allGames, allGames.games);
    return _.find(allGames.games, { date_game: date });
  });
};
exports.findGameResultsForTeamDate = findGameResultsForTeamDate;

const gameFacts = gameData => {
  const {
    winning_pitcher,
    win_loss_result,
    losing_pitcher,
    extra_innings,
    win_loss_streak,
    team_ID,
    opp_ID,
    attendance,
    time_of_game
  } = gameData;

  const hasWinStreak = win_loss_streak.includes("+");
  const winningTeam =
    win_loss_result === "W" ? findTeamName(team_ID) : findTeamName(opp_ID);
  const losingTeam =
    win_loss_result !== "W" ? findTeamName(team_ID) : findTeamName(opp_ID);

  return {
    opponent: ` vs ${findTeamName(opp_ID)}`,
    time: `the game started at ${time_of_game}`,
    attendance: `${attendance} folks attended`,
    streak: `with a ${hasWinStreak ? "winning" : "losing"} streak of ${
      win_loss_streak.length
    }`,
    pitcher: `won by ${winning_pitcher}, of the ${winningTeam}`
  };
};
exports.gameFacts = gameFacts;

const dictionaryMap = key => {
  const mapFile = {
    W: ["beat", "defeated", "vanquished",],
    L: ["lost to", "fell to", "were defeated by"]
  };
  return _.sample(mapFile[key]);
};
exports.dictionaryMap = dictionaryMap;
