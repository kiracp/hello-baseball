"use strict";

// Import the Dialogflow module and response creation dependencies from the
// Actions on Google client library.
const {
  dialogflow,
  BasicCard,
  Image,
  Suggestions,
} = require('actions-on-google');

const moment = require('moment');
const functions = require('firebase-functions');
const helpers = require('./helpers.js');
const scraper = require('./scraper.js');

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

  console.log("Getting Score", MLB_Team, date);
  return helpers.findGameResultsForTeamDate(teamId, gameDate).then(gameData => {
    console.log("Results for score", MLB_Team, date);
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

    // Create a basic card
    if (conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
      const team_logo_url = helpers.findTeamLogoUrl(MLB_Team);
      conv.ask(new BasicCard({
        title: `${MLB_Team}: ${runsFor} - ${opposingTeam}: ${runsAgainst}`,
        //text: `On ${readableDate}, the ${MLB_Team} ${result} the ${opposingTeam}
          //      ${runsHigher} to ${runsLower}.`,
        subtitle: `Match of ${readableDate}`,
        image: new Image({
          url: team_logo_url,
          alt: 'Hello Baseball',
        }),
        display: 'CROPPED',
      }));
    }

    conv.ask('Would you like to hear about another game?');
    conv.ask(new Suggestions('Yes', 'No'));
    return gameData;
  }).catch(() => {
    conv.ask("The internet blew up. I'm sorry");
    return "The internet blew up. I'm sorry";
  });
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

const helloWorld = (request, response) => {
  const team = helpers.findTeamKey("Boston Red Sox");
  const gameDate = "2018-03-29";
  const tbr = helpers.findTeamName("TBR");

  helpers.findGameResultsForTeamDate(team, gameDate).then(gameData => {
      console.log("G", gameData);
      return response.send(JSON.stringify(gameData));
  }).catch(err => err);
};
exports.helloWorld = functions.https.onRequest(helloWorld);
