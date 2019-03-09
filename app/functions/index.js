"use strict";

// Import the Dialogflow module and response creation dependencies from the
// Actions on Google client library.
const {
  dialogflow,
  Suggestions,
} = require('actions-on-google');

const moment = require('moment');
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
  const gameDate = moment(date).format('YYYY-MM-DD');
  const teamId = helpers.findTeamKey(MLB_Team);
  const gameData = helpers.findGameResultsForTeamDate(teamId, gameDate);
  const opposingTeam = helpers.findTeamName(gameData['opp_ID']);

  const readableDate = moment(date).parseDate('MMMM Do YYYY');

  const runsFor = gameData['R'];
  const runsAgainst = gameData['RA'];
  let runs1;
  let runs2;

  if (runsAgainst > runsFor) {
    runs1 = runsAgainst;
    runs2 = runsFor;
  } else {
    runs1 = runsFor;
    runs2 = runsAgainst;
  }


  conv.close(`On ${readableDate}, the ${MLB_Team} ${result} the ${opposingTeam} ${runsFor} to ${runsAgainst}.`);
});

const getGameResult = (game) => {
  if (game.win_loss_result === 'L') {
    return 'lost to';
  } else {
    return 'defeated';
  }
};

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
