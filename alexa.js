var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

const LambdaMockContext = require('aws-lambda-mock-context');
const Alexa = require('alexa-sdk');

function alexaRoute() {
  var alexa = new express.Router();
  alexa.use(cors());
  alexa.use(bodyParser());
  
  alexa.post('/', function (request, response) {
    
    var lambdaCtx = LambdaMockContext();
    
    const handlers = {
      'SearchDuckDuckGoIntent': function () {
        this.emit(':tell', 'Searching for your query...');
      },
      'AMAZON.HelpIntent': function () {
        this.emit(':tell', 'How can I help you?');
      },
      'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Cheers!');
      },
      'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Cheers!');
      },
      'SessionEndedRequest': function () {
        this.emit(':tell', 'Good Bye!');
      },
      'Unhandled': function () {
        this.emit(':tell', 'What\'s up?');
      },
    };
    
    var alexa = Alexa.handler(request.body, lambdaCtx);
    alexa.registerHandlers(handlers);
    alexa.execute();
    
    lambdaCtx.Promise
    .then(resp => { return response.status(200).json(resp); })
    .catch(err => { console.log(err); })
    
  });
  
  return alexa;
}

module.exports = alexaRoute;
