'use strict';

// Import the Dialogflow module and response creation dependencies from the
// Actions on Google client library.
const {
  dialogflow,
} = require('actions-on-google');

const fetch = require('node-fetch');
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

app.intent('favorite MLB team', (conv, {MLB_Team}) => {
  if (MLB_Team === 'New York Yankees') {
    const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
      conv.ask(`<speak>Terrible choice.<audio src="${audioSound}"></audio></speak>`);
      conv.close('Rethink your life choices and try again.')
  } else if (MLB_Team === 'Boston Red Sox') {
    conv.close('Excellent choice!');
  } else {
    conv.close(`The ${MLB_Team} are okay, but have you considered being a Red Sox fan?`);
  }
});

app.intent('get score', (conv, { MLB_Team, date}) => {
  const url = getUrl(MLB_Team, date);
  fetch(url)
    .then(res => res.json())
    .then(json => console.log(json))
    .then(conv.close('Something went right! Yankees suck!'))
    .catch(conv.close('Something went wrong. Yankees suck though!'))
});

const getUrl = (team, givenDate) => {
  const date = new Date(givenDate);
  const baseUrl = 'https://baseball-reference.com/teams/';
  const teamCode = teamMap[team];
  const year = date.getFullYear();

  return `${baseUrl}${teamCode}/${year}-schedule-scores.shtml`;
}

const teamMap = {
  'Boston Red Sox': 'BOS',
}

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
