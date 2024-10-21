var onoff = require('onoff'); //#A

var Gpio = onoff.Gpio;

// Initialize LEDs on different GPIO pins
var red_lgt1 = new Gpio(17, 'out'),
  red_lgt2 = new Gpio(27, 'out'),
  green_lgt1 = new Gpio(18, 'out'),
green_lgt2 = new Gpio(23, 'out');

// Toggle light every 2 seconds
var interval = setInterval(function () { //#C
  var value = (red_lgt1.readSync() + 1) % 2; //#D
  red_lgt1.write(value, function () {
    if (value === 1) {
      console.log("Pedestrians can't Cross");
    }
    else{console.log("Safe to cross");}
  });

  var opp = value === 1 ? 0 : 1;
  green_lgt1.writeSync(opp)
  green_lgt2.writeSync(value)
  red_lgt2.writeSync(opp)

}, 3500);

process.on('SIGINT', function () { //#F
  clearInterval(interval);
  red_lgt1.writeSync(0); //#G
  red_lgt2.writeSync(0);
  green_lgt1.writeSync(0);
  green_lgt2.writeSync(0);

  red_lgt1.unexport();
  red_lgt2.unexport();
  green_lgt1.unexport();
  green_lgt4.unexport();

  console.log('Bye, bye!');
  process.exit();
});


