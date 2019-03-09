const _ = require('lodash');

exports.findGameResultsForTeamDate = (team, date) => {
  const teamData = require(`./data/teams/${team}.json`);
  const year = _.split(date, "-")[0];
  const allGames = teamData[year];

  const gameData = _.find(allGames, { "date_game": date });

  return gameData;
}

exports.findTeamKey = (teamName) => {
  const teamData = require('./data/name_to_id.json');
  return _.lowerCase(teamData[teamName][0]);
}
