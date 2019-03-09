# ”Hello Baseball”

<p align="center">
  <img src="logos/hello-baseball_3x2.png"/>
</p>

## A voice assistant for baseball fans

Get instant information about your favorite MLB team.
Ask our voice assistant for the result of your team and get advanced information about the match.
_Visual results provided for a phone screen / smart display console_

## Try Asking
* What was the score for the Boston Red Sox on May 1st, 2018?
* Royals final score November 1st 2015
* Tell me more about that game

## Built with
* Data from https://www.baseball-reference.com/ -  Supports all teams, all seasons
* Cheerio web scraper
* Dialogflow and Google Actions console for voice agent support (Google Home)
* Google Firebase for hosting

## Issues we encountered
* Planning to do a single scrape of Baseball-reference (generating hundreds of requests), ended up getting blocked from the site
  * *RESULT:* Make a single promise - will load up the page for the specified team and year, and extract data 
* Difficult debug process - separate developer deploys were required in order to test

## Team members
* Aaron
* Fabio
* François
* Kira
* Veronica
