const _ = require("lodash");

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

const findGameResultsForTeamDate = (team, date) => {
  const teamData = require(`./data/teams/${team}.json`);
  const year = _.split(date, "-")[0];
  const allGames = teamData[year];

  const gameData = _.find(allGames, { date_game: date });

  return gameData;
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
    pitcher: `won by ${winning_pitcher}, the ${winningTeam}`,
  };
};
exports.gameFacts = gameFacts;

const dictionaryMap = key => {
  const mapFile = {
    W: ["beat", "won"],
    L: ["lost to"]
  };
}
exports.dictionaryMap = dictionaryMap;
