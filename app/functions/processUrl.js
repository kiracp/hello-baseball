const $ = require('cheerio');
const _ = require('lodash');

const processUrl = ({ team, year }) => (html) => {
  const rawData = $('.stats_table tr:not(.thead)', html);
  const games = [];
  _.times(rawData.length, i => {
    const rowData = $('td', rawData[i]);
    const gameData = {};
    _.times(rowData.length, j => {
      if (j === 0) { // date_game
        gameData.date_game = $(rowData[0]).attr('csk');
      } else {
        gameData[$(rowData[j]).data('stat')] = $($(rowData[j]).contents()[0]).text();
      }
    });
    games.push(gameData);
  });

  return { team, year, games };
};

module.exports = processUrl;