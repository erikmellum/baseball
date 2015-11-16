var fs = require('fs')
var teams = {

}
var team_names = [];
var Team = function(name, league){
  this.name = name;
  this.league = league;
  this.wins = 0;
  this.losses = 0;
  this.ties = 0;
}
var playGame = function(game){
  console.log("ASF")
  //check if the visiting team is in our teams object
  if(team_names.indexOf(game.visiting_team_name) == -1) {
    team_names.push(game.visiting_team_name);
    teams[game.visiting_team_name] = new Team(game.visiting_team_name, game.visiting_team_league)
  }
  //check if the home team is in our teams object
  if(team_names.indexOf(game.home_team_name) == -1) {
    team_names.push(game.home_team_name);
    teams[game.home_team_name] = new Team(game.home_team_name, game.home_team_league)
  }
  var j = 0;
  var k = 0;
  var visiting_team_innings = 0;
  var home_team_innings = 0;
  while(typeof(game.visiting_team_score[j]) !== 'undefined'){
    var a = game.visiting_team_score;
    var b = game.home_team_score;
    var htr = 0; //home team runs (one inning)
    var vtr = 0; //visiting team runs (one inning)
    var str1 = '';
    var str2 = '';
    if(b[j] == 'x') htr = 0; //if the home team didn't bat, give them 0 runs
    if(a[k] == '('){
      console.log("Parsing[k]: ", a[k])
      k++;
      while(a[k] !== ')'){
        str1 += a[k];
        k++;
      }
      vtr = parseInt(str1);
    }
    else{
      vtr = a[k];
    }
    if(b[j] == '('){
      console.log("Parsing[j]: ", b[j])
      j++;
      while(b[j] !== ')'){
        str2 =+ b[j];
        j++;
      }
      htr = parseInt(str2)
    }
    else{
      htr = b[j];
    }
    console.log("VTR: " + vtr)
    console.log("HTR: " + htr)
    if(vtr > htr) visiting_team_innings++;
    else if(vtr < htr) home_team_innings++;
    else //do nothing, tied inning
    ;
    j++;
    k++;
  }
  console.log("HTI: " + home_team_innings);
  console.log("VTI: " + visiting_team_innings);
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
    console.log("TESTEE")
    while(data[i] !== '\n'){
      if(commaCount == 3){
        //read in visiting team name
        while(data[i] !== ','){
          game.visiting_team_name += data[i];
          console.log("VTN: ", data[i])
          i++;
        }
        i++;
        commaCount++;
        //read in visiting league name
        while(data[i] !== ','){
          game.visiting_team_league += data[i];
          console.log("VTL: ", data[i])
          i++;
        }
      }
      else if(commaCount == 6){
        //read in home team name
        while(data[i] !== ','){
          game.home_team_name += data[i];
          console.log("HTN: ", data[i])
          i++;
        }
        i++;
        commaCount++;
        //read in visiting league name
        while(data[i] !== ','){
          game.home_team_league += data[i];
          console.log("HTL: ", data[i])
          i++;
        }
      }
      else if(commaCount == 19){
        //read in visiting team name
        while(data[i] !== ','){
          game.visiting_team_score += data[i];
          console.log("VTS: ", data[i])
          i++;
        }
        i++;
        commaCount++;
        //read in visiting league name
        while(data[i] !== ','){
          game.home_team_score += data[i];
          console.log("HTS: ", data[i])
          i++;
        }
        console.log("VTSC: ", game.visiting_team_score.replace(/"/g,''))
        console.log("VTNC: ", game.visiting_team_name.replace(/"/g,''))
        console.log("VTLC: ", game.visiting_team_league.replace(/"/g,''))
        console.log("HTSC: ", game.home_team_score.replace(/"/g,''))
        console.log("HTNC: ", game.home_team_name.replace(/"/g,''))
        console.log("HTLC: ", game.home_team_league.replace(/"/g,''))
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
