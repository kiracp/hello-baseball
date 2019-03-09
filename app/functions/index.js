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
  const readableDate = moment(date).format('MMMM Do YYYY');
  const result = helpers.dictionaryMap(gameData['win_loss_result']);

  const runsFor = gameData['R'];
  const runsAgainst = gameData['RA'];
  let runsHigher;
  let runsLower;

  if (runsAgainst > runsFor) {
    runsHigher = runsAgainst;
    runsLower = runsFor;
  } else {
    runsHigher = runsFor;
    runsLower = runsAgainst;
  }

  conv.ask(`On ${readableDate}, the ${MLB_Team} ${result} the ${opposingTeam} ${runsHigher} to ${runsLower}.`);
  conv.ask('Would you like to hear about another game?');
  conv.ask(new Suggestions('Yes', 'No'));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

const helloWorld = (request, response) => {
  const team = helpers.findTeamKey("Boston Red Sox");
  const tbr = helpers.findTeamName("TBR");
  response.send(JSON.stringify({
      tbr,
      gameResult: helpers.findGameResultsForTeamDate(team, "2018-03-29")
  }));
};
// exports.helloWorld = functions.https.onRequest(helloWorld);
