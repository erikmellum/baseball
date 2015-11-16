/**
 * @author Erik Mellum
 * @created 11/15/15
 * @modified 11/15/15
 * @version 1.0
 * @sources: retrosheet.org
 * @description: baseball.js is a node script that will read in a text file
 * called baseball1.txt formatted according to the guidelines set by
 * retrosheet.org. It will use this data to simulate and tally baseball game
 * winners according to the rules included in the Emerald Genius Questions.
 */
var fs = require('fs')
var teams = {}
var team_names = [];//holds a set of team names, used to access teams object
var Team = function(name, league){
  this.name = name;
  this.league = league;
  this.wins = 0;
  this.losses = 0;
  this.ties = 0;
}
/**
 * playGame is a function that takes a game with the format:
 * {
 *   visiting_team_name: 'NAME',
 *   visiting_team_league: 'LEAGUE',
 *   visiting_team_score: '010101110',
 *   home_team_name: 'NAME',
 *   home_team_league: 'LEAGUE',
 *   home_team_score: '010101110'
 * }
 * Logic is applied to tally up the innings each team won, and select a winner
 * loser, or tie if needbe, and increment the appropriate properties on the
 * team object.
 * @param game the game object containing the necessary properties.
 *
 */
var playGame = function(game){
  //check if the visiting team is in our teams object
  if(team_names.indexOf(game.visiting_team_name) == -1) {
    team_names.push(game.visiting_team_name);//add the key
    //add the team to our teams object
    teams[game.visiting_team_name] = new Team(game.visiting_team_name, game.visiting_team_league)
  }
  //check if the home team is in our teams object
  if(team_names.indexOf(game.home_team_name) == -1) {
    team_names.push(game.home_team_name);//add the key
    //add the team to our teams object
    teams[game.home_team_name] = new Team(game.home_team_name, game.home_team_league)
  }
  var j = 0;//index into our home team score (per inning)
  var k = 0;//index into our visiting team score (per inning)
  var visiting_team_innings = 0;//count of innings won by visiting team
  var home_team_innings = 0;//count of innings won by home team
  while(typeof(game.visiting_team_score[j]) !== 'undefined'){
    var a = game.visiting_team_score;//shorter variable name
    var b = game.home_team_score;//shorter variable name
    var htr = 0; //home team runs (one inning)
    var vtr = 0; //visiting team runs (one inning)
    var str1 = '';//holds a score like (10) for the visiting team
    var str2 = '';//holds a score like (10) for the home team
    if(b[j] == 'x') htr = 0; //if the home team didn't bat, give them 0 runs
    if(a[k] == '('){ //special type of score with more than 1 digit
      k++;
      while(a[k] !== ')'){ //loop until we reach the other fencepost
        str1 += a[k]; //build up our number as a string
        k++;
      }
      vtr = parseInt(str1);//turn the string into a real number
    }
    else{
      vtr = a[k];//otherwise it was a single digit
    }
    if(b[j] == '('){//special type of score with more than 1 digit
      j++;
      while(b[j] !== ')'){//loop until we reach the other fencepost
        str2 =+ b[j];//build up our number as a string
        j++;
      }
      htr = parseInt(str2)//turn the string into a real number
    }
    else{
      htr = b[j];//otherwise it was a single digit
    }
    //whoever had more runs wins the inning
    if(vtr > htr) visiting_team_innings++;
    else if(vtr < htr) home_team_innings++;
    else //do nothing, tied inning
    ;
    j++;
    k++;
  }
  //check to see who won more innings, tally wins, ties, and losses
  if(visiting_team_innings > home_team_innings) {
    teams[game.visiting_team_name].wins++;
    teams[game.home_team_name].losses++;
  }
  else if(visiting_team_innings < home_team_innings) {
    teams[game.visiting_team_name].losses++;
    teams[game.home_team_name].wins++;
  }
  else{
    teams[game.visiting_team_name].ties++;
    teams[game.home_team_name].ties++;
  }
}
/**
 * processData is a function responsible for iterating through a text file of
 * baseball scores, and creating game objects for each record in the text file.
 * comma counts are used to identify certain fields. Each created game will then
 * be "played". Basically this means the now cleanly formatted data is parsed to
 * determine a winner, loser, or tie if need be.
 * @param data, a string containing the data file to be processed.
 */
var processData = function(data){
  var i = 0;
  while(data[i] !== '' && typeof(data[i]) !== 'undefined'){
    var commaCount=0;
    var game = {
      visiting_team_name: '',
      visiting_team_league: '',
      visiting_team_score: '',
      home_team_name: '',
      home_team_league: '',
      home_team_score: ''
    }
    while(data[i] !== '\n'){
      if(commaCount == 3){
        //read in visiting team name
        while(data[i] !== ','){
          game.visiting_team_name += data[i];
          i++;
        }
        i++;
        commaCount++;
        //read in visiting league name
        while(data[i] !== ','){
          game.visiting_team_league += data[i];
          i++;
        }
      }
      else if(commaCount == 6){
        //read in home team name
        while(data[i] !== ','){
          game.home_team_name += data[i];
          i++;
        }
        i++;
        commaCount++;
        //read in visiting league name
        while(data[i] !== ','){
          game.home_team_league += data[i];
          i++;
        }
      }
      else if(commaCount == 19){
        //read in visiting team name
        while(data[i] !== ','){
          game.visiting_team_score += data[i];
          i++;
        }
        i++;
        commaCount++;
        //read in visiting league name
        while(data[i] !== ','){
          game.home_team_score += data[i];
          i++;
        }
      }
      if(data[i] == ',') commaCount++;
      i++;
    }
    game.visiting_team_name=game.visiting_team_name.replace(/"/g,'');
    game.visiting_team_league=game.visiting_team_league.replace(/"/g,'');
    game.visiting_team_score=game.visiting_team_score.replace(/"/g,'');
    game.home_team_name=game.home_team_name.replace(/"/g,'');
    game.home_team_league=game.home_team_league.replace(/"/g,'');
    game.home_team_score=game.home_team_score.replace(/"/g,'');
    playGame(game)
    i++;
  }
}
var data = fs.readFileSync('./baseball1.txt', 'utf8')
processData(data);
console.log(teams)
