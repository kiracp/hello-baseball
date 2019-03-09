const _ = require('lodash');
const rp = require('request-promise');
const Promise = require('bluebird');
const fs = require('fs');

const processUrl = require('./processUrl');

const startYear = 1903;
const endYear = 2018;
const urls = [];
const team = 'BOS';

_.times(endYear - startYear + 1, idx => {
  const year = startYear + idx;
  urls.push(`https://www.baseball-reference.com/teams/${team}/${year}-schedule-scores.shtml`);
});

Promise.map(urls, url => {
  const [k, team, year] = url.match(/teams\/([A-Z]{3})\/([0-9]{4})/g)[0].split('/');
  return rp(url)
    .then(processUrl({ team, year }))
    .catch(error => {console.error(error)})
}).then(results => {
  const allData = {};
  _.each(results, ({year, team, games}) => {
    allData[year] = games;
  });

  fs.writeFile(`${__dirname}/data/${team}.js`, JSON.stringify(allData), function(err) {
    if(err) {
      return console.log(err);
    }

    console.log(`${team} file saved`);
  });
});
