"use strict";

// Import the Dialogflow module and response creation dependencies from the
// Actions on Google client library.
const {
  dialogflow,
  Suggestions,
} = require('actions-on-google');

const fetch = require('node-fetch');
const functions = require('firebase-functions');
const helpers = require('./helpers.js');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

app.intent('favorite MLB team', (conv, {MLB_Team}) => {
  if (MLB_Team === 'New York Yankees') {
    const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
      conv.ask(`<speak>Terrible choice.<audio src="${audioSound}"></audio></speak>`);
      conv.ask('Rethink your life choices and try again.')
  } else if (MLB_Team === 'Boston Red Sox') {
    conv.ask('Excellent choice!');
  } else {
    conv.ask(`The ${MLB_Team} are okay, but have you considered being a Red Sox fan?`);
  }
  conv.ask(`Anything you'd like to know about the ${MLB_Team}?`);
  conv.ask(new Suggestions('Yes', 'No'));
});

app.intent('get score', (conv, { MLB_Team, date}) => {
  const gameDate = parseDate(date);

  testData.forEach((game) => {
    console.log('testData')
  })

});

const getUrl = (team, givenDate) => {
  const date = new Date(givenDate);
  const baseUrl = 'https://baseball-reference.com/teams/';
  const teamCode = teamMap[team];
  const year = date.getFullYear();

  return `${baseUrl}${teamCode}/${year}-schedule-scores.shtml`;
}

const parseDate = (dateString) => {
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

const testData = [
  {
    date_game: '2018-03-29',
    team_ID: 'BOS',
    homeORvis: '@',
    opp_ID: 'TBR',
    win_loss_result: 'L',
    R: 4,
    RA: 6,
  },
  {
    date_game: '2018-03-30',
    team_ID: 'BOS',
    homeORvis: '@',
    opp_ID: 'TBR',
    win_loss_result: 'W',
    R: 1,
    RA: 0,
  },
];

const teamMap = {
  'Boston Red Sox': 'BOS',
}


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

const helloWorld = (request, response) => {
  const team = helpers.findTeamKey("Boston Red Sox");
  const tbr = helpers.findTeamName("TBR");
  response.send(JSON.stringify({
      tbr,
      gameResult: helpers.findGameResultsForTeamDate(team, "2018-03-29")
  }));
};
exports.helloWorld = functions.https.onRequest(helloWorld);
