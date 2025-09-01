const http = require('http');
const url = require('url');


var args = process.argv.slice(2);

const PORT = args[0] ?? 8000

// ANSI Colours
const BLACK = "\u001b[30m";
const RED = "\u001b[31m";
const GREEN = "\u001b[32m";
const YELLOW = "\u001b[33m";
const BLUE = "\u001b[34m";
const PURPLE = "\u001b[35m";
const CYAN = "\u001b[36m";
const WHITE = "\u001b[37m";

const RESET = "\u001b[0m";
const BEER_COLOR = "%"

const beer_art = 
`│${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
│${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
│${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
│${BEER_COLOR}▒▒▒▒▒##:##▒▒▒▒▒${RESET}│
│${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
│${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
╰╮${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}╭╯
 │${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
 │${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
 │${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
 │${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
 │${BEER_COLOR}▒▒▒▒▒▒▒▒▒▒▒▒▒${RESET}│
 ╰─────────────╯`
 

 http.createServer((req, res) => {
    
    console.log('Got Request');

    //Set Up Response
    res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
    //Get Configs
    var params = url.parse(req.url, true).query;
  
    var tz = params.tz ?? 'Australia/Sydney';
    var colour = params.colour ?? 'yellow';

    let replace_colour = '';

    switch (colour) {
      case 'yellow':
        replace_colour = YELLOW;  
        break;
      case 'red':
        replace_colour = RED; 
        break;
      case 'blue':
        replace_colour = BLUE;
        break;
      case 'purple':
        replace_colour = PURPLE;
        break;
      case 'green':
        replace_colour = GREEN;
        break;
      case 'cyan':
        replace_colour = CYAN;
        break;
      case 'black':
        replace_colour = BLACK;
        break;
      case 'white':
        replace_colour = WHITE;
        break;
      default:
        replace_colour = YELLOW;
    }

    //Get the current time
    const time_now = new Date();
    const tz_time = new Date(time_now.toLocaleString('en-US', { timeZone: tz }));
    const hours_now = tz_time.getHours();

    const beer_art_edit = beer_art.replaceAll(BEER_COLOR, replace_colour);
    const beer_art_with_time = beer_art_edit.replace('##:##', tz_time.toTimeString().substring(0, 5));


    //TODO: make this based on a param 
    let hours_until_beer = Math.max(16 - hours_now, 0);
    

    if(hours_until_beer >= 12){
        res.end(beer_art_with_time.replaceAll('▒', ' '));
        return;
    }

    const beer_parts = beer_art_with_time.split("\n");
    
    let beer_builder = '\n'
    if(!hours_until_beer) beer_builder += "🎉BEER O'CLOCK🎉\n";
    beer_builder += beer_parts.slice(0, hours_until_beer).join('\n').replaceAll('▒', ' ');
    beer_builder += '\n';
    beer_builder += beer_parts.slice(hours_until_beer, hours_until_beer+1).join('\n').replaceAll('▒', '~');
    beer_builder += '\n';
    let beer_string = beer_builder + beer_parts.slice(hours_until_beer+1).join('\n')


    res.end(beer_string);    
}).listen(PORT);

console.log(`Listening on ${PORT} 🍻`)
