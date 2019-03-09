const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');
const rp = require('request-promise');
const fs = require('fs');

const processUrl = require('./processUrl');

exports.findGameResultsForTeamYear = (team, year) => {
  

  return rp(`https://www.baseball-reference.com/teams/${team}/${year}-schedule-scores.shtml`)
      .then(processUrl({ team, year }))
      .catch(error => {console.error(error)})
}

