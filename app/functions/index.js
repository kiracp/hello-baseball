'use strict';

// Import the Dialogflow module and response creation dependencies from the
// Actions on Google client library.
const {
  dialogflow,
  Suggestions,
} = require('actions-on-google');

const fetch = require('node-fetch');
const functions = require('firebase-functions');

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
  const teamId = teamMap[MLB_Team];

  const testGame = testData[0];
  const result = getGameResult(testGame);
  const runsFor = testData['R'];
  const runsAgainst = testData['RA'];
  let runs1;
  let runs2;

  if (runsAgainst > runsFor) {
    runs1 = runsAgainst;
    runs2 = runsFor;
  } else {
    runs1 = runsFor;
    runs2 = runsAgainst;
  }

  conv.close(`On March 29, 2018, the Red Sox ${result} the Tampa Bay Rays ${runs1} to ${runs2}.`);
});

const getGameResult = (game) => {
  if (game.win_loss_result === 'L') {
    return 'lost to';
  } else {
    return 'defeated';
  }
};

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

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
