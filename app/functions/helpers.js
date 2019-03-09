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

exports.parseDate = (dateString) => {
  const gameDate = new Date(dateString);
  const year = gameDate.getFullYear();
  let month = Number(gameDate.getMonth());
  month++;
  if (month < 10) {
    month = `0${month}`;
  } else {
    month = month.toString();
  }

  let date = Number(gameDate.getDate());
  if (date < 10) {
    date = `0${date}`;
  } else {
    date = date.toString();
  }

  const retVal = `${year}-${month}-${date}`;
  return retVal;
}
