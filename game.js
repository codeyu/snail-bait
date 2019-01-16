var SnailBait =  function () {
   this.canvas = document.getElementById('game-canvas'),
   this.context = this.canvas.getContext('2d'),

   // HTML elements........................................................
   
   this.fpsElement = document.getElementById('fps'),
   this.toast = document.getElementById('toast'),

   // Score.............................................................

   this.scoreElement = document.getElementById('score');
   this.score = 0;

   // Running slowly warning............................................

   this.FPS_SLOW_CHECK_INTERVAL = 4000; // Only check every 4 seconds
   this.DEFAULT_RUNNING_SLOWLY_THRESHOLD = 40; // fps
   this.MAX_RUNNING_SLOWLY_THRESHOLD = 60; // fps

   this.runningSlowlyElement = 
   document.getElementById('running-slowly');

   this.slowlyOkayElement = 
   document.getElementById('slowly-okay');

   this.slowlyDontShowElement = 
   document.getElementById('slowly-dont-show');

   this.slowlyWarningElement = 
   document.getElementById('slowly-warning');

   this.runningSlowlyThreshold = this.DEFAULT_RUNNING_SLOWLY_THRESHOLD;

   // Slow fps detection and warning....................................

   this.lastSlowWarningTime = 0;
   this.showSlowWarning = false;
   
   this.speedSamples = [60,60,60,60,60,60,60,60,60,60];
   this.speedSamplesIndex = 0;

   this.NUM_SPEED_SAMPLES = this.speedSamples.length;

   // Credits...........................................................

   this.creditsElement = document.getElementById('credits');
   this.newGameLink = document.getElementById('new-game-link');

   // Tweet score..........................................................

   this.tweetElement = document.getElementById('tweet');

   this.TWEET_PREAMBLE = 'https://twitter.com/intent/tweet?text=I scored ';
   this.TWEET_PROLOGUE = ' playing this HTML5 Canvas platformer: ' +
   'http://bit.ly/NDV761 &hashtags=html5';

   // Lives.............................................................

   this.livesElement   = document.getElementById('lives');
   this.lifeIconLeft   = document.getElementById('life-icon-left');
   this.lifeIconMiddle = document.getElementById('life-icon-middle');
   this.lifeIconRight  = document.getElementById('life-icon-right');

   this.MAX_NUMBER_OF_LIVES = 3;
   this.lives = this.MAX_NUMBER_OF_LIVES;

   // Constants............................................................

   this.LEFT = 1,
   this.RIGHT = 2,

   /* Collectively, these constants control Snail Bait's time */

   this.BACKGROUND_VELOCITY = 35,    // pixels/second
   this.RUN_ANIMATION_RATE = 35,     // frames/second
   this.RUNNER_JUMP_DURATION = 1000, // milliseconds
   this.BUTTON_PACE_VELOCITY = 80,   // pixels/second
   this.SNAIL_PACE_VELOCITY = 50,    // pixels/second
   this.SNAIL_BOMB_VELOCITY = 550,

   this.RUBY_SPARKLE_DURATION = 200,     // milliseconds
   this.RUBY_SPARKLE_INTERVAL = 500,     // milliseconds
   this.SAPPHIRE_SPARKLE_DURATION = 100, // milliseconds
   this.SAPPHIRE_SPARKLE_INTERVAL = 300, // milliseconds
   this.SAPPHIRE_BOUNCE_RISE_DURATION = 80, // milliseconds

   this.GRAVITY_FORCE = 9.81,
   this.PIXELS_PER_METER = this.canvas.width / 10; // 10 meters, randomly selected width

   this.PAUSED_CHECK_INTERVAL = 200,
   this.DEFAULT_TOAST_TIME = 3000, // 3 seconds

   this.EXPLOSION_CELLS_HEIGHT = 62,
   this.EXPLOSION_DURATION = 1500,

   this.NUM_TRACKS = 3,

   this.PLATFORM_HEIGHT = 8,  
   this.PLATFORM_STROKE_WIDTH = 2,
   this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',

   // Platform scrolling offset is PLATFORM_VELOCITY_MULTIPLIER *
   // backgroundOffset. The platforms move PLATFORM_VELOCITY_MULTIPLIER
   // times as fast as the background.

   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35,
   
   // Sounds............................................................

   this.COIN_VOLUME = 1.0,
   this.SOUNDTRACK_VOLUME = 0.12,
   this.JUMP_WHISTLE_VOLUME = 0.05,
   this.PLOP_VOLUME = 0.20,
   this.THUD_VOLUME = 0.20,
   this.FALLING_WHISTLE_VOLUME = 0.10,
   this.EXPLOSION_VOLUME = 0.25,
   this.CHIMES_VOLUME = 1.0,

   // Sprite sheet cells................................................

   this.RUNNER_CELLS_WIDTH = 40, // pixels
   this.RUNNER_CELLS_HEIGHT = 52, // pixels

   this.RUNNER_HEIGHT = 43,
   this.RUNNER_JUMP_HEIGHT = 120,

   this.RUN_ANIMATION_INITIAL_RATE = 0,

   this.BAT_CELLS_HEIGHT = 34, // No constant for bat cell width, which varies

   this.BEE_CELLS_HEIGHT = 50,
   this.BEE_CELLS_WIDTH  = 50,

   this.BUTTON_CELLS_HEIGHT  = 20,
   this.BUTTON_CELLS_WIDTH   = 31,

   this.COIN_CELLS_HEIGHT = 30,
   this.COIN_CELLS_WIDTH  = 30,

   this.RUBY_CELLS_HEIGHT = 30,
   this.RUBY_CELLS_WIDTH = 35,

   this.SAPPHIRE_CELLS_HEIGHT = 30,
   this.SAPPHIRE_CELLS_WIDTH  = 35,

   this.SNAIL_BOMB_CELLS_HEIGHT = 20,
   this.SNAIL_BOMB_CELLS_WIDTH  = 20,

   this.SNAIL_CELLS_HEIGHT = 34,
   this.SNAIL_CELLS_WIDTH  = 64,

   this.INITIAL_BACKGROUND_VELOCITY = 0,
   this.INITIAL_BACKGROUND_OFFSET = 0,
   this.INITIAL_RUNNER_LEFT = 50,
   this.INITIAL_RUNNER_TRACK = 1,
   this.INITIAL_RUNNER_VELOCITY = 0,

   // Paused............................................................
   
   this.paused = false,
   this.pauseStartTime = 0,
   this.totalTimePaused = 0,

   this.windowHasFocus = true,

   // Track baselines...................................................

   this.TRACK_1_BASELINE = 323,
   this.TRACK_2_BASELINE = 223,
   this.TRACK_3_BASELINE = 123,

   // Fps indicator.....................................................
   
   this.fpsToast = document.getElementById('fps'),

   // Images............................................................
   
   this.background  = new Image(),
   this.spritesheet = new Image(),

   // Sounds............................................................

   this.soundCheckbox = document.getElementById('sound-checkbox');
   this.musicCheckbox = document.getElementById('music-checkbox');

   this.soundOn = this.soundCheckbox.checked;
   this.musicOn = this.musicCheckbox.checked;

   this.audioTracks = [ // 8 tracks is more than enough
   new Audio(), new Audio(), new Audio(), new Audio(), 
   new Audio(), new Audio(), new Audio(), new Audio()
   ],

   this.soundtrack = document.getElementById('soundtrack'),
   this.chimesSound = document.getElementById('chimes-sound'),
   this.plopSound = document.getElementById('plop-sound'),
   this.explosionSound = document.getElementById('explosion-sound'),
   this.fallingWhistleSound = document.getElementById('whistle-down-sound'),
   this.coinSound = document.getElementById('coin-sound'),
   this.jumpWhistleSound = document.getElementById('jump-sound'),
   this.thudSound = document.getElementById('thud-sound'),

   // Time..............................................................
   
   this.lastAnimationFrameTime = 0,
   this.lastFpsUpdateTime = 0,
   this.fps = 60,

   // Translation offsets...............................................
   
   this.backgroundOffset = this.INITIAL_BACKGROUND_OFFSET,
   this.spriteOffset = this.INITIAL_BACKGROUND_OFFSET,

   // Velocities........................................................

   this.bgVelocity = this.INITIAL_BACKGROUND_VELOCITY,
   this.platformVelocity,

      // Sprite sheet cells................................................

   this.BACKGROUND_WIDTH = 1102;
   this.BACKGROUND_HEIGHT = 400;

   this.RUNNER_CELLS_WIDTH = 50; // pixels
   this.RUNNER_CELLS_HEIGHT = 54;

   this.BAT_CELLS_HEIGHT = 34; // Bat cell width varies; not constant 

   this.BEE_CELLS_HEIGHT = 50;
   this.BEE_CELLS_WIDTH  = 50;

   this.BUTTON_CELLS_HEIGHT  = 20;
   this.BUTTON_CELLS_WIDTH   = 31;

   this.COIN_CELLS_HEIGHT = 30;
   this.COIN_CELLS_WIDTH  = 30;
   
   this.EXPLOSION_CELLS_HEIGHT = 62;

   this.RUBY_CELLS_HEIGHT = 30;
   this.RUBY_CELLS_WIDTH = 35;

   this.SAPPHIRE_CELLS_HEIGHT = 30;
   this.SAPPHIRE_CELLS_WIDTH  = 35;

   this.SNAIL_BOMB_CELLS_HEIGHT = 20;
   this.SNAIL_BOMB_CELLS_WIDTH  = 20;

   this.SNAIL_CELLS_HEIGHT = 34;
   this.SNAIL_CELLS_WIDTH  = 64;

   this.batCells = [
      { left: 3,   top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 41,  top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
      { left: 93,  top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 132, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
   ];

   this.batRedEyeCells = [
      { left: 185, top: 0, 
        width: 36, height: this.BAT_CELLS_HEIGHT },

      { left: 222, top: 0, 
        width: 46, height: this.BAT_CELLS_HEIGHT },

      { left: 273, top: 0, 
        width: 36, height: this.BAT_CELLS_HEIGHT },

      { left: 313, top: 0, 
        width: 46, height: this.BAT_CELLS_HEIGHT },
   ];
   
   this.beeCells = [
      { left: 5,   top: 234, width: this.BEE_CELLS_WIDTH,
                            height: this.BEE_CELLS_HEIGHT },

      { left: 75,  top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT },

      { left: 145, top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT }
   ];
   
   this.blueCoinCells = [
      { left: 5, top: 540, width: this.COIN_CELLS_WIDTH, 
                           height: this.COIN_CELLS_HEIGHT },

      { left: 5 + this.COIN_CELLS_WIDTH, top: 540,
        width: this.COIN_CELLS_WIDTH, 
        height: this.COIN_CELLS_HEIGHT }
   ];

   this.explosionCells = [
      { left: 3,   top: 48, 
        width: 52, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 63,  top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 146, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 233, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 308, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 392, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 473, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT }
   ];
   // Sprite sheet cells................................................

   this.blueButtonCells = [
      { left: 10,   top: 192, width: this.BUTTON_CELLS_WIDTH,
                            height: this.BUTTON_CELLS_HEIGHT },

      { left: 53,  top: 192, width: this.BUTTON_CELLS_WIDTH, 
                            height: this.BUTTON_CELLS_HEIGHT }
   ];

   this.goldCoinCells = [
      { left: 65, top: 540, width: this.COIN_CELLS_WIDTH, 
                            height: this.COIN_CELLS_HEIGHT },
      { left: 96, top: 540, width: this.COIN_CELLS_WIDTH, 
                            height: this.COIN_CELLS_HEIGHT },
      { left: 128, top: 540, width: this.COIN_CELLS_WIDTH, 
                             height: this.COIN_CELLS_HEIGHT },
   ];

   this.goldButtonCells = [
      { left: 90,   top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT },

      { left: 132,  top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT }
   ];

   this.rubyCells = [
      { left: 185,   top: 138, width: this.SAPPHIRE_CELLS_WIDTH,
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 220,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 258,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 294, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 331, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT }
   ];

   this.runnerCellsRight = [
      { left: 414, top: 385, 
        width: 47, height: this.RUNNER_CELLS_HEIGHT },

      { left: 362, top: 385, 
         width: 44, height: this.RUNNER_CELLS_HEIGHT },

      { left: 314, top: 385, 
         width: 39, height: this.RUNNER_CELLS_HEIGHT },

      { left: 265, top: 385, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 205, top: 385, 
         width: 49, height: this.RUNNER_CELLS_HEIGHT },

      { left: 150, top: 385, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 96,  top: 385, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 45,  top: 385, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT },

      { left: 0,   top: 385, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT }
   ],

   this.runnerCellsLeft = [
      { left: 0,   top: 305, 
         width: 47, height: this.RUNNER_CELLS_HEIGHT },

      { left: 55,  top: 305, 
         width: 44, height: this.RUNNER_CELLS_HEIGHT },

      { left: 107, top: 305, 
         width: 39, height: this.RUNNER_CELLS_HEIGHT },

      { left: 152, top: 305, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 208, top: 305, 
         width: 49, height: this.RUNNER_CELLS_HEIGHT },

      { left: 265, top: 305, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 320, top: 305, 
         width: 42, height: this.RUNNER_CELLS_HEIGHT },

      { left: 380, top: 305, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT },

      { left: 425, top: 305, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT },
   ],

   this.sapphireCells = [
      { left: 3,   top: 138, width: this.RUBY_CELLS_WIDTH,
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 39,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 76,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 112, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 148, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT }
   ];

   this.snailBombCells = [
      { left: 40, top: 512, width: 30, height: 20 },
      { left: 2, top: 512, width: 30, height: 20 }
   ];

   this.snailCells = [
      { left: 142, top: 466, width: this.SNAIL_CELLS_WIDTH,
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 75,  top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 2,   top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },
   ]; 

   // Sprite data.......................................................

   this.batData = [
      { left: 100,  
         top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT },

      { left: 610,  
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },

      { left: 1150, 
         top: this.TRACK_2_BASELINE - 3*this.BAT_CELLS_HEIGHT },

      { left: 1720, 
         top: this.TRACK_2_BASELINE - 2*this.BAT_CELLS_HEIGHT },

      { left: 1960, 
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT }, 

      { left: 2200, 
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },

      { left: 2380, 
         top: this.TRACK_3_BASELINE - 2*this.BAT_CELLS_HEIGHT },
   ];
   
   this.beeData = [
      { left: 200,  top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 340,  top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 550,  top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 750,  
         top: this.TRACK_1_BASELINE - 1.5*this.BEE_CELLS_HEIGHT },

      { left: 944,  
         top: this.TRACK_2_BASELINE - 1.25*this.BEE_CELLS_HEIGHT },

      { left: 1550, top: 155 },
      { left: 2225, top: 135 },
      { left: 2295, top: 275 },
      { left: 2450, top: 275 },
   ];
   
   this.buttonData = [
      { platformIndex: 7 },
      { platformIndex: 12 },
   ];

   this.coinData = [
      { left: 270,  
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 489,  
         top: this.TRACK_3_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 620,  
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 833,  
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1050, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1450, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1670, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1870, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1930, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 2200, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 2320, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 2360, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
   ];   

   // Platforms.........................................................

   this.platformData = [
      // Screen 1.......................................................
      {
         left:      10,
         width:     210,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200, 200, 60)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      {  left:      240,
         width:     110,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(110,150,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      400,
         width:     125,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      623,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(255,255,0)',
         opacity:   0.8,
         track:     1,
         pulsate:   false,
      },

      // Screen 2.......................................................
               
      {  left:      810,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1025,
         width:     150,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1200,
         width:     105,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      1400,
         width:     180,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 3.......................................................
               
      {  left:      1625,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'cornflowerblue',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1800,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2000,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,80)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      2100,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },


      // Screen 4.......................................................

      {  left:      2269,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
         pulsate:   true
      },

      {  left:      2500,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     2,
         pulsate:   true
      },

      {  left:      2800,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'cornflowerblue',
         opacity:   1.0,
         track:     3,
         pulsate:   true
      },

      {  left:      2900,
         width:     300,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     1,
         pulsate:   true
      },
   ];

   this.rubyData = [
      { left: 160,  
         top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 880,  
         top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 1100, 
         top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT }, 

      { left: 1475, 
         top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 2400, 
         top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
   ];

   this.sapphireData = [
      { left: 680,  
         top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 1700, 
         top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 2056, 
         top: this.TRACK_2_BASELINE - 3*this.SAPPHIRE_CELLS_HEIGHT/2 },
   ];

   this.smokingHoleData = [
      { left: 248,  top: this.TRACK_2_BASELINE - 22 },
      { left: 688,  top: this.TRACK_3_BASELINE + 5 },
      { left: 1352,  top: this.TRACK_2_BASELINE - 18 },
   ];
   
   this.snailData = [
      { platformIndex: 13 },
   ];
   // Sprites...........................................................

   this.bats         = [],
   this.bees         = [], 
   this.buttons      = [],
   this.coins        = [],
   this.platforms    = [],
   this.rubies       = [],
   this.sapphires    = [],
   this.snails       = [],
   
   // Sprite artists...................................................

   this.runnerArtist = new SpriteSheetArtist(this.spritesheet,
      this.runnerCellsRight),

   this.platformArtist = {
      draw: function (sprite, context) {
         var top;
         
         context.save();

         top = snailBait.calculatePlatformTop(sprite.track);

         context.lineWidth = snailBait.PLATFORM_STROKE_WIDTH;
         context.strokeStyle = snailBait.PLATFORM_STROKE_STYLE;
         context.fillStyle = sprite.fillStyle;

         context.strokeRect(sprite.left, top, sprite.width, sprite.height);
         context.fillRect  (sprite.left, top, sprite.width, sprite.height);

         context.restore();
      }
   },

   // Sprite behaviors........................................................

   // Runner's run behavior...................................................

   this.runBehavior = {
      // Every runAnimationRate milliseconds, this behavior advances the
      // runner's artist to the next frame of the spritesheet, provided the
      // runner is not jumping or falling.
      //
      // This behavior is similar to the more general CycleBehavior behavior in
      // js/behaviors. The difference is that this behavior does not advance
      // the sprite's artist if the sprite is jumping, falling, or the
      // runner's runAnimationRate is 0.

      lastAdvanceTime: 0,
      
      execute: function(sprite, time, fps) {
         if (sprite.runAnimationRate === 0) {
            return;
         }
         
         if (this.lastAdvanceTime === 0) {  // skip first time
            this.lastAdvanceTime = time;
         }
         else if (time - this.lastAdvanceTime > 1000 / sprite.runAnimationRate) {
            sprite.artist.advance();
            this.lastAdvanceTime = time;
         }
      }
   },

   // Runner's jump behavior..................................................

   this.jumpBehavior = {
      pause: function (sprite) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.pause();
         }
         else if (!sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.pause();
         }
      },

      unpause: function (sprite) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.unpause();
         }
         else if (sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.unpause();
         }
      },

      jumpIsOver: function (sprite) {
         return ! sprite.ascendAnimationTimer.isRunning() &&
         ! sprite.descendAnimationTimer.isRunning();
      },

      // Ascent...............................................................

      isAscending: function (sprite) {
         return sprite.ascendAnimationTimer.isRunning();
      },
      
      ascend: function (sprite) {
         var elapsed = sprite.ascendAnimationTimer.getElapsedTime(),
         deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;
         sprite.top = sprite.verticalLaunchPosition - deltaH;
      },

      isDoneAscending: function (sprite) {
         return sprite.ascendAnimationTimer.getElapsedTime() > sprite.JUMP_DURATION/2;
      },
      
      finishAscent: function (sprite) {
         sprite.jumpApex = sprite.top;
         sprite.ascendAnimationTimer.stop();
         sprite.descendAnimationTimer.start();
      },
      
      // Descents.............................................................

      isDescending: function (sprite) {
         return sprite.descendAnimationTimer.isRunning();
      },

      descend: function (sprite, verticalVelocity, fps) {
         var elapsed = sprite.descendAnimationTimer.getElapsedTime(),
         deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;

         sprite.top = sprite.jumpApex + deltaH;
      },
      
      isDoneDescending: function (sprite) {
         return sprite.descendAnimationTimer.getElapsedTime() > sprite.JUMP_DURATION/2;
      },

      finishDescent: function (sprite) {
         sprite.stopJumping();

         if (snailBait.isOverPlatform(sprite) !== -1) {
            sprite.top = sprite.verticalLaunchPosition;
         }
         else {
            sprite.fall(snailBait.GRAVITY_FORCE *
               (sprite.descendAnimationTimer.getElapsedTime()/1000) *
               snailBait.PIXELS_PER_METER);
         }
      },
      
      // Execute..............................................................

      execute: function(sprite, time, fps) {
         if ( ! sprite.jumping || sprite.exploding) {
            return;
         }

         if (this.jumpIsOver(sprite)) {
            sprite.jumping = false;
            return;
         }

         if (this.isAscending(sprite)) {
            if ( ! this.isDoneAscending(sprite)) { this.ascend(sprite); }
            else                                 { this.finishAscent(sprite); }
         }
         else if (this.isDescending(sprite)) {
            if ( ! this.isDoneDescending(sprite)) { this.descend(sprite); }
            else                                  { this.finishDescent(sprite); }
         }
      } 
   },

   // Runner's fall behavior..................................................

   this.fallBehavior = {
      isOutOfPlay: function (sprite) {
         return sprite.top > snailBait.TRACK_1_BASELINE;
      },

      willFallBelowCurrentTrack: function (sprite, deltaY) {
         return sprite.top + sprite.height + deltaY >
         snailBait.calculatePlatformTop(sprite.track);
      },

      fallOnPlatform: function (sprite) {
         sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
         sprite.stopFalling();
         snailBait.playSound(snailBait.thudSound);
      },

      setSpriteVelocity: function (sprite) {
         var fallingElapsedTime;

         sprite.velocityY = sprite.initialVelocityY + snailBait.GRAVITY_FORCE *
         (sprite.fallAnimationTimer.getElapsedTime()/1000) *
         snailBait.PIXELS_PER_METER;
      },

      calculateVerticalDrop: function (sprite, fps) {
         return sprite.velocityY / fps;
      },

      isPlatformUnderneath: function (sprite) {
         return snailBait.isOverPlatform(sprite) !== -1;
      },
      
      execute: function (sprite, time, fps) {
         var deltaY;

         if (sprite.jumping) {
            return;
         }

         if (this.isOutOfPlay(sprite) || sprite.exploding) {
            if (sprite.falling) {
               sprite.stopFalling();
            }
            return;
         }
         
         if (!sprite.falling) {
            if (!sprite.exploding && !this.isPlatformUnderneath(sprite)) {
               sprite.fall();
            }
            return;
         }

         this.setSpriteVelocity(sprite);
         deltaY = this.calculateVerticalDrop(sprite, fps);

         if (!this.willFallBelowCurrentTrack(sprite, deltaY)) {
            sprite.top += deltaY;
         }
         else { // will fall below current track

            if (this.isPlatformUnderneath(sprite)) {
               this.fallOnPlatform(sprite);
               sprite.stopFalling();
            }
            else {
               sprite.track--;

               sprite.top += deltaY;

               if (sprite.track === 0) {
                  snailBait.playSound(snailBait.fallingWhistleSound);
                  snailBait.loseLife();
                  sprite.stopFalling();
                  snailBait.reset();
                  snailBait.fadeAndRestoreCanvas();
               }
            }
         }
      }
   },

   // Runner's collide behavior...............................................

   this.collideBehavior = {
      execute: function (sprite, time, fps, context) {
         var otherSprite;

         for (var i=0; i < snailBait.sprites.length; ++i) { 
            otherSprite = snailBait.sprites[i];

            if (this.isCandidateForCollision(sprite, otherSprite)) {
               if (this.didCollide(sprite, otherSprite, context)) { 
                  this.processCollision(sprite, otherSprite);
               }
            }
         }
      },

      isCandidateForCollision: function (sprite, otherSprite) {
         return sprite !== otherSprite &&
         sprite.visible && otherSprite.visible &&
         !sprite.exploding && !otherSprite.exploding &&
         otherSprite.left - otherSprite.offset < sprite.left + sprite.width;
      }, 

      didSnailBombCollideWithRunner: function (left, top, right, bottom,
       snailBomb, context) {
         // Determine if the center of the snail bomb lies within
         // the runner's bounding box  

         context.beginPath();
         context.rect(left, top, right - left, bottom - top);

         return context.isPointInPath(
          snailBomb.left - snailBomb.offset + snailBomb.width/2,
          snailBomb.top + snailBomb.height/2);
      },

      didRunnerCollideWithOtherSprite: function (left, top, right, bottom,
        centerX, centerY,
        otherSprite, context) {
         // Determine if either of the runner's four corners or its
         // center lie within the other sprite's bounding box. 

         context.beginPath();
         context.rect(otherSprite.left - otherSprite.offset, otherSprite.top,
           otherSprite.width, otherSprite.height);
         
         return context.isPointInPath(left,    top)     ||
         context.isPointInPath(right,   top)     ||

         context.isPointInPath(centerX, centerY) ||

         context.isPointInPath(left,    bottom)  ||
         context.isPointInPath(right,   bottom);
      },

      didCollide: function (sprite, otherSprite, context) {
         var MARGIN_TOP = 15,
         MARGIN_LEFT = 15,
         MARGIN_RIGHT = 15,
         MARGIN_BOTTOM = 10,
         left = sprite.left + sprite.offset + MARGIN_LEFT,
         right = sprite.left + sprite.offset + sprite.width - MARGIN_RIGHT,
         top = sprite.top + MARGIN_TOP,
         bottom = sprite.top + sprite.height - MARGIN_BOTTOM,
         centerX = left + sprite.width/2,
         centerY = sprite.top + sprite.height/2;

         if (otherSprite.type === 'snail bomb') {
            return this.didSnailBombCollideWithRunner(left, top, right, bottom,
               otherSprite, context);
         }
         else {
            return this.didRunnerCollideWithOtherSprite(left, top, right, bottom,
             centerX, centerY,
             otherSprite, context);
         }
      },

      adjustScore: function (otherSprite) {
         if (otherSprite.value) {
            snailBait.score += otherSprite.value;
            snailBait.score = snailBait.score < 0 ? 0 : snailBait.score;
            snailBait.scoreElement.innerHTML = snailBait.score;
         }
      }, 

      detonateButton: function (otherSprite) {
         otherSprite.detonating = true; // trigger
      },

      processCollision: function (sprite, otherSprite) {
         if (otherSprite.value) { 
            this.adjustScore(otherSprite);
         }

         if ('button' === otherSprite.type && (sprite.falling || sprite.jumping)) {
            this.detonateButton(otherSprite);
         }

         if ('coin'  === otherSprite.type    ||
           'sapphire' === otherSprite.type ||
           'ruby' === otherSprite.type     || 
           'snail bomb' === otherSprite.type) {
            otherSprite.visible = false;

            if ('coin' === otherSprite.type) {
             snailBait.playSound(snailBait.coinSound);
            }

            if ('sapphire' === otherSprite.type || 'ruby' === otherSprite.type) {
             snailBait.playSound(snailBait.chimesSound);
            }
         }

         if ('bat' === otherSprite.type   ||
         'bee' === otherSprite.type   ||
         'snail' === otherSprite.type || 
         'snail bomb' === otherSprite.type) {
            snailBait.explode(sprite);
            snailBait.shake();

            setTimeout( function () {
             snailBait.loseLife();
             snailBait.reset();
             snailBait.fadeAndRestoreCanvas();
            }, snailBait.EXPLOSION_DURATION);
         }

         if (sprite.jumping && 'platform' === otherSprite.type) {
          this.processPlatformCollisionDuringJump(sprite, otherSprite);
         }
      },

      processPlatformCollisionDuringJump: function (sprite, platform) {
         var isDescending = sprite.descendAnimationTimer.isRunning();

         sprite.stopJumping();

         if (isDescending) {
            sprite.track = platform.track; 
            sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
         }
         else { // Collided with platform while ascending
            snailBait.playSound(snailBait.plopSound);
            sprite.fall(); 
         }
      },
   };

   // General pace behavior...................................................

   this.paceBehavior = {
      execute: function (sprite, time, fps) {
         var sRight = sprite.left + sprite.width,
         pRight = sprite.platform.left + sprite.platform.width,
         pixelsToMove = sprite.velocityX / fps;

         if (sprite.direction === undefined) {
            sprite.direction = snailBait.RIGHT;
         }

         if (sprite.velocityX === 0) {
            if (sprite.type === 'snail') {
               sprite.velocityX = snailBait.SNAIL_PACE_VELOCITY;
            }
            else {
               sprite.velocityX = snailBait.BUTTON_PACE_VELOCITY;
            }
         }

         if (sRight > pRight && sprite.direction === snailBait.RIGHT) {
            sprite.direction = snailBait.LEFT;
         }
         else if (sprite.left < sprite.platform.left &&
            sprite.direction === snailBait.LEFT) {
            sprite.direction = snailBait.RIGHT;
         }

         if (sprite.direction === snailBait.RIGHT) {
          sprite.left += pixelsToMove;
         }
         else {
          sprite.left -= pixelsToMove;
         }
      }
   };

   // Snail shoot behavior....................................................

   this.snailShootBehavior = { // sprite is the snail
      execute: function (sprite, time, fps) {
         var bomb = sprite.bomb;

         if (!snailBait.spriteInView(sprite)) {
            return;
         }

         if (! bomb.visible && sprite.artist.cellIndex === 2) {
            bomb.left = sprite.left;
            bomb.visible = true;
         }
      }
   };

   this.snailBombMoveBehavior = {
      execute: function(sprite, time, fps) {  // sprite is the bomb
         if (sprite.visible && snailBait.spriteInView(sprite)) {
            sprite.left -= snailBait.SNAIL_BOMB_VELOCITY / fps;
         }

         if (!snailBait.spriteInView(sprite)) {
            sprite.visible = false;
         }
      }
   };

   // Detonate buttons..................................................

   this.buttonDetonateBehavior = {
      execute: function(sprite, now, fps, lastAnimationFrameTime) {
         var BUTTON_REBOUND_DELAY = 1000;

         if ( ! sprite.detonating) { // trigger
            return;
         }

         sprite.artist.cellIndex = 1; // flatten the button

         snailBait.explode(snailBait.bees[5]);

         setTimeout( function () {
            sprite.artist.cellIndex = 0; // rebound
            sprite.detonating = false; // reset trigger
         }, BUTTON_REBOUND_DELAY);
      }
   };

   // Sprites...........................................................

   this.runner = new Sprite('runner',           // type
                            this.runnerArtist,  // artist
                            [ this.runBehavior, // behaviors
                            this.jumpBehavior,
                            this.fallBehavior,
                            this.collideBehavior
                            ]); 

   this.runner.width = this.RUNNER_CELLS_WIDTH;
   this.runner.height = this.RUNNER_CELLS_HEIGHT;

   // All sprites.......................................................
   // 
   // (addSpritesToSpriteArray() adds sprites from the preceding sprite
   // arrays to the sprites array)

this.sprites = [ this.runner ];  

this.explosionAnimator = new SpriteAnimator(
      this.explosionCells,          // Animation cells
      this.EXPLOSION_DURATION,      // Duration of the explosion

      function (sprite, animator) { // Callback after animation
         sprite.exploding = false; 

         if (sprite.jumping) {
            sprite.stopJumping();
         }
         else if (sprite.falling) {
            sprite.stopFalling();
         }

         sprite.visible = true;

         if (sprite === snailBait.runner) {
            sprite.track = 1;
            sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
            sprite.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
         }
         sprite.artist.cellIndex = 0;
      });
};

// SnailBait's prototype --------------------------------------------------

SnailBait.prototype = {
   // Drawing..............................................................

   draw: function (now) {
      this.setPlatformVelocity();
      this.setTranslationOffsets();

      this.drawBackground();

      this.updateSprites(now);
      this.drawSprites();
   },

   setPlatformVelocity: function () {
      this.platformVelocity = this.bgVelocity * this.PLATFORM_VELOCITY_MULTIPLIER; 
   },

   setTranslationOffsets: function () {
      this.setBackgroundTranslationOffset();
      this.setSpriteTranslationOffsets();
   },
   
   setSpriteTranslationOffsets: function () {
      var i, sprite;

      this.spriteOffset += this.platformVelocity / this.fps; // In step with platforms

      for (i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if ('runner' !== sprite.type) {
            sprite.offset = this.spriteOffset; 
         }
      }
   },

   setBackgroundTranslationOffset: function () {
      var offset = this.backgroundOffset + this.bgVelocity/this.fps;

      if (offset > 0 && offset < this.background.width) {
         this.backgroundOffset = offset;
      }
      else {
         this.backgroundOffset = 0;
      }
   },
   
   drawBackground: function () {
      this.context.save();

      this.context.globalAlpha = 1.0;
      this.context.translate(-this.backgroundOffset, 0);

      // Initially onscreen:
      this.context.drawImage(this.background, 0, 0,
         this.background.width, this.background.height);

      // Initially offscreen:
      this.context.drawImage(this.background, this.background.width, 0,
         this.background.width+1, this.background.height);

      this.context.restore();
   },

   // Frame rate monitoring.............................................

   checkFps: function (now) {
      var averageSpeed;

      this.updateSpeedSamples(snailBait.fps);

      averageSpeed = this.calculateAverageSpeed();

      if (averageSpeed < this.runningSlowlyThreshold) {
         this.revealRunningSlowlyWarning(now, averageSpeed);
      }
   },

   updateSpeedSamples: function (fps) {
      this.speedSamples[this.speedSamplesIndex] = fps;

      if (this.speedSamplesIndex !== this.NUM_SPEED_SAMPLES-1) {
         this.speedSamplesIndex++;
      }
      else {
         this.speedSamplesIndex = 0;
      }
   },

   calculateAverageSpeed: function () {
      var i,
      total = 0;

      for (i=0; i < this.NUM_SPEED_SAMPLES; i++) {
         total += this.speedSamples[i];
      }

      return total/this.NUM_SPEED_SAMPLES;
   },
   
   revealRunningSlowlyWarning: function (now, averageSpeed) {
      this.slowlyWarningElement.innerHTML =
      "Snail Bait is running at <font color='red'>"   +
      averageSpeed.toFixed(0) + "</font>"             +
      " frames/second (fps), but it needs more than " +
      this.runningSlowlyThreshold                     +
      " fps for the game to work correctly."

      this.runningSlowlyElement.style.display = 'block';

      setTimeout( function () {
         snailBait.runningSlowlyElement.style.opacity = 1.0;
      }, this.SHORT_DELAY);

      this.lastSlowWarningTime = now;
   },  

   hideRunningSlowlyWarning: function () {
      snailBait.runningSlowlyElement.style.display = 'none'; 
      snailBait.runningSlowlyElement.style.opacity = 0;
   },

   calculateFps: function (now) {
      var fps = 1000 / (now - this.lastAnimationFrameTime);
      this.lastAnimationFrameTime = now;
      return fps; 
   },
   
   calculatePlatformTop: function (track) {
      var top;
   
      if      (track === 1) { top = this.TRACK_1_BASELINE; }
      else if (track === 2) { top = this.TRACK_2_BASELINE; }
      else if (track === 3) { top = this.TRACK_3_BASELINE; }

      return top;
   },

   turnLeft: function () {
      this.bgVelocity = -this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runnerArtist.cells = this.runnerCellsLeft;
      this.runner.direction = this.LEFT;
   },

   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runnerArtist.cells = this.runnerCellsRight;
      this.runner.direction = this.RIGHT;
   },         
  
   updateScoreElement: function () {
      this.scoreElement.innerHTML = this.score;
   },         

   updateLivesElement: function () {
      if (this.lives === 3) {
         this.lifeIconLeft.style.opacity   = 1.0;
         this.lifeIconMiddle.style.opacity = 1.0;
         this.lifeIconRight.style.opacity  = 1.0;
      }
      else if (this.lives === 2) {
         this.lifeIconLeft.style.opacity   = 1.0;
         this.lifeIconMiddle.style.opacity = 1.0;
         this.lifeIconRight.style.opacity  = 0;
      }
      else if (this.lives === 1) {
         this.lifeIconLeft.style.opacity   = 1.0;
         this.lifeIconMiddle.style.opacity = 0;
         this.lifeIconRight.style.opacity  = 0;
      }
      else if (this.lives === 0) {
         this.lifeIconLeft.style.opacity   = 0;
         this.lifeIconMiddle.style.opacity = 0;
         this.lifeIconRight.style.opacity  = 0;
      }
   }, 

   // Sprites..............................................................

   equipRunner: function () {
      // Animation rate, track, direction, velocity,
      // position, and artist cells........................................
      
      this.runner.runAnimationRate = this.RUN_ANIMATION_INITIAL_RATE,
   
      this.runner.track = this.INITIAL_RUNNER_TRACK;
      this.runner.direction = this.LEFT;
      this.runner.velocityX = this.INITIAL_RUNNER_VELOCITY;
      this.runner.left = this.INITIAL_RUNNER_LEFT;
      this.runner.top = this.calculatePlatformTop(this.runner.track) -
                        this.RUNNER_CELLS_HEIGHT;

      this.runner.artist.cells = this.runnerCellsRight;
      this.runner.offset = 0;

      this.equipRunnerForJumping();
      this.equipRunnerForFalling();
   },

   equipRunnerForFalling: function () {
      this.runner.falling = false;
      this.runner.fallAnimationTimer = new AnimationTimer();

      this.runner.fall = function (initialVelocity) {
         this.velocityY = initialVelocity || 0;
         this.initialVelocityY = initialVelocity || 0;
         this.fallAnimationTimer.start();
         this.falling = true;
      }

      this.runner.stopFalling = function () {
         this.falling = false;
         this.velocityY = 0;
         this.fallAnimationTimer.stop();
      }
   },
   
   equipRunnerForJumping: function () {
      this.runner.JUMP_DURATION = this.RUNNER_JUMP_DURATION; // milliseconds
      this.runner.JUMP_HEIGHT = this.RUNNER_JUMP_HEIGHT;

      this.runner.jumping = false;

      this.runner.ascendAnimationTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseOutTransducer(1.1));

      this.runner.descendAnimationTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseInTransducer(1.1));

      this.runner.stopJumping = function () {
         this.jumping = false;
         this.ascendAnimationTimer.stop();
         this.descendAnimationTimer.stop();
         this.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
      };
      
      this.runner.jump = function () {
         if (this.jumping) // 'this' is the runner
            return;

         this.runAnimationRate = 0;
         this.jumping = true;
         this.verticalLaunchPosition = this.top;
         this.ascendAnimationTimer.start();

         snailBait.playSound(snailBait.jumpWhistleSound);
      };
   },
   
   createPlatformSprites: function () {
      var sprite, pd;  // Sprite, Platform data
   
      for (var i=0; i < this.platformData.length; ++i) {
         pd = this.platformData[i];
         sprite  = new Sprite('platform', this.platformArtist);

         sprite.left      = pd.left;
         sprite.width     = pd.width;
         sprite.height    = pd.height;
         sprite.fillStyle = pd.fillStyle;
         sprite.opacity   = pd.opacity;
         sprite.track     = pd.track;
         sprite.button    = pd.button;
         sprite.pulsate   = pd.pulsate;

         sprite.top = this.calculatePlatformTop(pd.track);
   
         if (sprite.pulsate) {
            sprite.behaviors = [ new PulseBehavior(1000, 0.5) ];
         }

         this.platforms.push(sprite);
      }
   },

   shake: function () {
      var SHAKE_INTERVAL = 90, // milliseconds
          v = snailBait.BACKGROUND_VELOCITY,
          ov = snailBait.bgVelocity; // ov means original velocity
   
      this.bgVelocity = -this.BACKGROUND_VELOCITY;

      setTimeout( function (e) {
       snailBait.bgVelocity = v;
       setTimeout( function (e) {
          snailBait.bgVelocity = -v;
          setTimeout( function (e) {
             snailBait.bgVelocity = v;
             setTimeout( function (e) {
                snailBait.bgVelocity = -v;
                setTimeout( function (e) {
                   snailBait.bgVelocity = v;
                   setTimeout( function (e) {
                      snailBait.bgVelocity = -v;
                      setTimeout( function (e) {
                         snailBait.bgVelocity = v;
                         setTimeout( function (e) {
                            snailBait.bgVelocity = -v;
                            setTimeout( function (e) {
                               snailBait.bgVelocity = v;
                               setTimeout( function (e) {
                                  snailBait.bgVelocity = -v;
                                  setTimeout( function (e) {
                                     snailBait.bgVelocity = v;
                                     setTimeout( function (e) {
                                        snailBait.bgVelocity = ov;
                                     }, SHAKE_INTERVAL);
                                  }, SHAKE_INTERVAL);
                               }, SHAKE_INTERVAL);
                            }, SHAKE_INTERVAL);
                         }, SHAKE_INTERVAL);
                      }, SHAKE_INTERVAL);
                   }, SHAKE_INTERVAL);
                }, SHAKE_INTERVAL);
             }, SHAKE_INTERVAL);
          }, SHAKE_INTERVAL);
       }, SHAKE_INTERVAL);
     }, SHAKE_INTERVAL);
   },

   explode: function (sprite, silent) {
      if (sprite.exploding) {
         return;
      }

      if (sprite.jumping) {
         sprite.stopJumping();
      }

      if (sprite.runAnimationRate === 0) {
         sprite.runAnimationRate = this.RUN_ANIMATION_RATE;
      }
               
      sprite.exploding = true;

      if (!silent) {
         this.playSound(this.explosionSound);
      }

      this.explosionAnimator.start(sprite, true);  // true means sprite reappears
   },

   blowupBees: function () {
      var i,
          numBees = snailBait.bees.length;

      for (i=0; i < numBees; ++i) {
         bee = snailBait.bees[i];
         if (bee.visible) {
            snailBait.explode(bee, true); // true means silent
         }
      }
   },

   blowupBats: function () {
      var i,
          numBats = snailBait.bats.length;

      for (i=0; i < numBats; ++i) {
         bat = snailBait.bats[i];
         if (bat.visible) {
            snailBait.explode(bat, true); // true means silent
         }
      }
   },

   // Animation............................................................

   animate: function (now) { 
      if (snailBait.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(snailBait.animate);
         }, snailBait.PAUSED_CHECK_INTERVAL);
      }
      else {
         snailBait.fps = snailBait.calculateFps(now); 

         if (snailBait.windowHasFocus && !snailBait.paused &&
             snailBait.showSlowWarning &&
             now - snailBait.lastSlowWarningTime > 
             snailBait.FPS_SLOW_CHECK_INTERVAL) {
            snailBait.checkFps(now); 
         }

         snailBait.draw(now);
         requestNextAnimationFrame(snailBait.animate);
      }
   },

   togglePausedStateOfAllBehaviors: function () {
      var behavior;
   
      for (var i=0; i < this.sprites.length; ++i) { 
         sprite = this.sprites[i];

         for (var j=0; j < sprite.behaviors.length; ++j) { 
            behavior = sprite.behaviors[j];

            if (this.paused) {
               if (behavior.pause) {
                  behavior.pause(sprite);
               }
            }
            else {
               if (behavior.unpause) {
                  behavior.unpause(sprite);
               }
            }
         }
      }
   },

   togglePaused: function () {
      var now = +new Date();

      this.paused = !this.paused;
      this.togglePausedStateOfAllBehaviors();
   
      if (this.paused) {
         this.pauseStartTime = now;
      }
      else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }

      if (this.paused && this.musicOn) {
         this.soundtrack.pause();
      }
      else if (!this.paused && this.musicOn) {
         this.soundtrack.play();
      }
   },

   // Playing sounds.......................................................

   soundIsPlaying: function (sound) {
      return !sound.ended && sound.currentTime > 0;
   },

   playSound: function (sound) {
      var track, index;

      if (this.soundOn) {
         if (!this.soundIsPlaying(sound)) {
            sound.play();
         }
         else {
            for (i=0; index < this.audioTracks.length; ++index) {
               track = this.audioTracks[index];
            
               if (!this.soundIsPlaying(track)) {
                  track.src = sound.currentSrc;
                  track.load();
                  track.volume = sound.volume;
                  track.play();

                  break;
               }
            }
         }              
      }
   },

   initializeSounds: function () {
      this.soundtrack.volume          = this.SOUNDTRACK_VOLUME;
      this.jumpWhistleSound.volume    = this.JUMP_WHISTLE_VOLUME;
      this.thudSound.volume           = this.THUD_VOLUME;
      this.fallingWhistleSound.volume = this.FALLING_WHISTLE_VOLUME;
      this.chimesSound.volume         = this.CHIMES_VOLUME;
      this.explosionSound.volume      = this.EXPLOSION_VOLUME;
      this.coinSound.volume           = this.COIN_VOLUME;
   },


   // ------------------------- INITIALIZATION ----------------------------

   start: function () {
      this.createSprites();
      this.initializeImages();
      this.initializeSounds();
      this.equipRunner();
      this.revealToast('Good Luck!');

      document.getElementById('instructions').style.opacity =
         snailBait.INSTRUCTIONS_OPACITY;

      this.showSlowWarning = true;
   },
   
   initializeImages: function () {
      var self = this;

      this.background.src = 'images/background_level_one_dark_red.png';
      this.spritesheet.src = 'images/spritesheet.png';
   
      this.background.onload = function (e) {
         self.startGame();
      };
   },

   startGame: function () {
      if (this.musicOn) {
         this.soundtrack.play();
      }
      requestNextAnimationFrame(this.animate);
   },

   restartGame: function () {
      this.hideCredits();

      this.lives = this.MAX_NUMBER_OF_LIVES;
      this.updateLivesElement();

      this.score = 0;
      this.updateScoreElement();
   },

   fadeAndRestoreCanvas: function () {
      snailBait.canvas.style.opacity = 0.2;

      setTimeout( function () {
         snailBait.canvas.style.opacity = 1.0;
      }, 2500);
   },

   resetRunner: function () {
      snailBait.runner.exploding = false; 
      snailBait.runner.visible = false;
      snailBait.runner.opacity = snailBait.OPAQUE;
      snailBait.runner.artist.cells = snailBait.runnerCellsRight;

      if (snailBait.runner.jumping) { snailBait.runner.stopJumping(); }
      if (snailBait.runner.falling) { snailBait.runner.stopFalling(); }
   },

   reset: function () {
      var CANVAS_TRANSITION_DURATION = 2000,
          CONTINUE_RUNNING_DURATION = 1000;

      this.resetRunner();

      setTimeout( function () {
         snailBait.backgroundOffset = 
            snailBait.INITIAL_BACKGROUND_OFFSET;

         snailBait.spriteOffset = snailBait.INITIAL_BACKGROUND_OFFSET;
         snailBait.bgVelocity = snailBait.INITIAL_BACKGROUND_VELOCITY;

         snailBait.runner.track = 3;
         snailBait.runner.top = snailBait.calculatePlatformTop(snailBait.runner.track) - 
                                snailBait.runner.height;

         for (var i=0; i < snailBait.sprites.length; ++i) { 
            snailBait.sprites[i].visible = true;
         }

         setTimeout( function () {
            snailBait.runner.runAnimationRate = 0; // stop running
         }, CONTINUE_RUNNING_DURATION);
      }, CANVAS_TRANSITION_DURATION);
   },

   loseLife: function () {
      this.lives--;
      this.updateLivesElement();

      if (this.lives === 1) {
         snailBait.revealToast('Last chance!');
      }

      if (this.lives === 0) {
         this.gameOver();
      }
   },
         
   gameOver: function () {
      snailBait.revealCredits();
   },

   revealLivesIcons: function () {
      var LIVES_ICON_REVEAL_DELAY = 2000;

      setTimeout( function (e) {
         snailBait.lifeIconLeft.style.opacity = snailBait.OPAQUE;
         snailBait.lifeIconRight.style.opacity = snailBait.OPAQUE;
         snailBait.lifeIconMiddle.style.opacity = snailBait.OPAQUE;
      }, LIVES_ICON_REVEAL_DELAY);
   },

   revealCredits: function () {
      this.creditsElement.style.display = 'block';
      this.revealLivesIcons();
      this.tweetElement.href = this.TWEET_PREAMBLE + this.score + this.TWEET_PROLOGUE;

      setTimeout( function () {
         snailBait.creditsElement.style.opacity = 1.0;
      }, snailBait.SHORT_DELAY);
   },

   hideCredits: function () {
      var CREDITS_REVEAL_DELAY = 2000;
      this.creditsElement.style.opacity = this.TRANSPARENT;

      setTimeout( function (e) {
         snailBait.creditsElement.style.display = 'none';
      }, this.CREDITS_REVEAL_DELAY);
   },         

   positionSprites: function (sprites, spriteData) {
      var sprite;

      for (var i = 0; i < sprites.length; ++i) {
         sprite = sprites[i];

         if (spriteData[i].platformIndex) { 
            this.putSpriteOnPlatform(sprite,
               this.platforms[spriteData[i].platformIndex]);
         }
         else {
            sprite.top  = spriteData[i].top;
            sprite.left = spriteData[i].left;
         }
      }
   },

   armSnails: function () {
      var snail,
          snailBombArtist = new SpriteSheetArtist(this.spritesheet, this.snailBombCells);

      for (var i=0; i < this.snails.length; ++i) {
         snail = this.snails[i];
         snail.bomb = new Sprite('snail bomb',
                                  snailBombArtist,
                                  [ this.snailBombMoveBehavior ]);

         snail.bomb.width  = snailBait.SNAIL_BOMB_CELLS_WIDTH;
         snail.bomb.height = snailBait.SNAIL_BOMB_CELLS_HEIGHT;

         snail.bomb.top = snail.top + snail.bomb.height/2;
         snail.bomb.left = snail.left + snail.bomb.width/2;
         snail.bomb.visible = false;

         snail.bomb.snail = snail;  // Snail bombs maintain a reference to their snail

         this.sprites.push(snail.bomb);
      }
   },
   
   addSpritesToSpriteArray: function () {
      for (var i=0; i < this.platforms.length; ++i) {
         this.sprites.push(this.platforms[i]);
      }

      for (var i=0; i < this.bats.length; ++i) {
         this.sprites.push(this.bats[i]);
      }

      for (var i=0; i < this.bees.length; ++i) {
         this.sprites.push(this.bees[i]);
      }

      for (var i=0; i < this.buttons.length; ++i) {
         this.sprites.push(this.buttons[i]);
      }

      for (var i=0; i < this.coins.length; ++i) {
         this.sprites.push(this.coins[i]);
      }

      for (var i=0; i < this.rubies.length; ++i) {
         this.sprites.push(this.rubies[i]);
      }

      for (var i=0; i < this.sapphires.length; ++i) {
         this.sprites.push(this.sapphires[i]);
      }

     for (var i=0; i < this.snails.length; ++i) {
         this.sprites.push(this.snails[i]);
      }
   },

   createBatSprites: function () {
      var bat,
          batArtist = new SpriteSheetArtist(this.spritesheet, this.batCells),
    redEyeBatArtist = new SpriteSheetArtist(this.spritesheet, this.batRedEyeCells);

      for (var i = 0; i < this.batData.length; ++i) {
         if (i % 2 === 0) bat = new Sprite('bat', batArtist, [ new CycleBehavior(100)]);
         else             bat = new Sprite('bat', redEyeBatArtist, [ new CycleBehavior(100)]);

         bat.width = this.batCells[1].width;
         bat.height = this.BAT_CELLS_HEIGHT;

         this.bats.push(bat);
      }
   },

   createBeeSprites: function () {
      var bee,
          beeArtist;

      for (var i = 0; i < this.beeData.length; ++i) {
         bee = new Sprite('bee',
                          new SpriteSheetArtist(this.spritesheet, this.beeCells),
                          [ new CycleBehavior(100) ]);

         bee.width = this.BEE_CELLS_WIDTH;
         bee.height = this.BEE_CELLS_HEIGHT;

         this.bees.push(bee);
      }
   },

   createButtonSprites: function () {
      var button,
          buttonArtist = new SpriteSheetArtist(this.spritesheet,
                                               this.blueButtonCells),
      goldButtonArtist = new SpriteSheetArtist(this.spritesheet,
                                               this.goldButtonCells);

      for (var i = 0; i < this.buttonData.length; ++i) {
         if (i === this.buttonData.length - 1) {
            button = new Sprite('button',
                                 goldButtonArtist,
                                 [ this.paceBehavior ]);
         }
         else {
            button = new Sprite('button',
                                 buttonArtist, 
                                 [ this.paceBehavior,
                                   this.buttonDetonateBehavior ]);
         }

         button.width = this.BUTTON_CELLS_WIDTH;
         button.height = this.BUTTON_CELLS_HEIGHT;

         this.buttons.push(button);
      }
   },
   
   createCoinSprites: function () {
      var blueCoinArtist = new SpriteSheetArtist(this.spritesheet,
                                                 this.blueCoinCells),

          goldCoinArtist = new SpriteSheetArtist(this.spritesheet,
                                                 this.goldCoinCells),
          coin;
   
      for (var i = 0; i < this.coinData.length; ++i) {
         if (i % 2 === 0) {
            coin = new Sprite('coin', goldCoinArtist,
                              [ new CycleBehavior(500) ]);
         }
         else {
            coin = new Sprite('coin', blueCoinArtist,
                              [ new CycleBehavior(500) ]);
         }
         
         coin.width = this.COIN_CELLS_WIDTH;
         coin.height = this.COIN_CELLS_HEIGHT;
         coin.value = 50;

         coin.behaviors.push(
            new BounceBehavior(80 * i * 10,
                               50 * i * 10,
                               60 + Math.random() * 40));

         this.coins.push(coin);
      }
   },
   
   createSapphireSprites: function () {
      var sapphire,
          sapphireArtist = new SpriteSheetArtist(this.spritesheet, this.sapphireCells);
   
      for (var i = 0; i < this.sapphireData.length; ++i) {
         sapphire = new Sprite('sapphire', sapphireArtist,
                               [ new CycleBehavior(this.SAPPHIRE_SPARKLE_DURATION,
                                           this.SAPPHIRE_SPARKLE_INTERVAL),

                                 new BounceBehavior(1000, 1000, 120)
                               ]);

         sapphire.width = this.SAPPHIRE_CELLS_WIDTH;
         sapphire.height = this.SAPPHIRE_CELLS_HEIGHT;
         sapphire.value = 150;

         this.sapphires.push(sapphire);
      }
   },
   
   createRubySprites: function () {
      var ruby,
          rubyArtist = new SpriteSheetArtist(this.spritesheet, this.rubyCells);
   
      for (var i = 0; i < this.rubyData.length; ++i) {
         ruby = new Sprite('ruby', rubyArtist, [ new CycleBehavior(this.RUBY_SPARKLE_DURATION,
                                                           this.RUBY_SPARKLE_INTERVAL),

                                 new BounceBehavior(800, 600, 120)
                               ]);
         ruby.width = this.RUBY_CELLS_WIDTH;
         ruby.height = this.RUBY_CELLS_HEIGHT;
         ruby.value = 100;

         this.rubies.push(ruby);
      }
   },
   
   createSnailSprites: function () {
      var snail,
          snailArtist = new SpriteSheetArtist(this.spritesheet, this.snailCells);
   
      for (var i = 0; i < this.snailData.length; ++i) {
         snail = new Sprite('snail',
                            snailArtist,
                            [ this.paceBehavior,
                              this.snailShootBehavior,
                              new CycleBehavior(300, 1500)
                            ]);

         snail.width  = this.SNAIL_CELLS_WIDTH;
         snail.height = this.SNAIL_CELLS_HEIGHT;

         this.snails.push(snail);
      }
   },
   
   updateSprites: function (now) {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.visible && this.spriteInView(sprite)) {
            sprite.update(now, this.fps, this.context);
         }
      }
   },
   
   drawSprites: function() {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.visible && this.spriteInView(sprite)) {
            this.context.translate(-sprite.offset, 0);

            sprite.draw(this.context);

            this.context.translate(sprite.offset, 0);
         }
      }
   },
   
   spriteInView: function(sprite) {
      return sprite === this.runner || // runner is always visible
         (sprite.left + sprite.width > this.spriteOffset &&
          sprite.left < this.spriteOffset + this.canvas.width);   
   },

   isOverPlatform: function (sprite, track) {
      var p,
          index = -1,
          center = sprite.left + sprite.offset + sprite.width/2;

      if (track === undefined) { 
         track = sprite.track; // Look on sprite track only
      }

      for (var i=0; i < snailBait.platforms.length; ++i) {
         p = snailBait.platforms[i];

         if (track === p.track) {
            if (center > p.left - p.offset && center < (p.left - p.offset + p.width)) {
               index = i;
               break;
            }
         }
      }
      return index;
   },
   
   putSpriteOnPlatform: function(sprite, platformSprite) {
      sprite.top  = platformSprite.top - sprite.height;
      sprite.left = platformSprite.left;
      sprite.platform = platformSprite;
   },
   
   createSprites: function() {  
      this.createPlatformSprites(); // Platforms must be created first
      
      this.createBatSprites();
      this.createBeeSprites();
      this.createButtonSprites();
      this.createCoinSprites();
      this.createRubySprites();
      this.createSapphireSprites();
      this.createSnailSprites();

      this.initializeSprites();

      this.addSpritesToSpriteArray();
   },
   
   initializeSprites: function() {  
      for (var i=0; i < snailBait.sprites.length; ++i) { 
         snailBait.sprites[i].offset = 0;
      }

      this.positionSprites(this.bats,       this.batData);
      this.positionSprites(this.bees,       this.beeData);
      this.positionSprites(this.buttons,    this.buttonData);
      this.positionSprites(this.coins,      this.coinData);
      this.positionSprites(this.rubies,     this.rubyData);
      this.positionSprites(this.sapphires,  this.sapphireData);
      this.positionSprites(this.snails,     this.snailData);

      this.armSnails();
   },

   // Toast................................................................

   revealToast: function (text, howLong) {
      howLong = howLong || this.DEFAULT_TOAST_TIME;

      toast.style.display = 'block';
      toast.innerHTML = text;

      setTimeout( function (e) {
         if (snailBait.windowHasFocus) {
            toast.style.opacity = 1.0; // After toast is displayed
         }
      }, 50);

      setTimeout( function (e) {
         if (snailBait.windowHasFocus) {
            toast.style.opacity = 0; // Starts CSS3 transition
         }

         setTimeout( function (e) { 
            if (snailBait.windowHasFocus) {
               toast.style.display = 'none'; 
            }
         }, 480);
      }, howLong);
   },
};
   
// Event processrs.......................................................
   
window.onkeydown = function (e) {
   var key = e.keyCode;

   if (snailBait.runner.exploding) {
      return;
   }

   if (key === 80 || (snailBait.paused && key !== 80)) {  // 'p'
      snailBait.togglePaused();
   }
   
   if (key === 68 || key === 37) { // 'd' or left arrow
      snailBait.turnLeft();
   }
   else if (key === 75 || key === 39) { // 'k' or right arrow
      snailBait.turnRight();
   }
   else if (key === 74) { // 'j'
      if (!snailBait.runner.jumping && !snailBait.runner.falling) {
         snailBait.runner.jump();
      }
   }
};

window.onblur = function (e) {  // pause if unpaused
   snailBait.windowHasFocus = false;
   
   if (!snailBait.paused) {
      snailBait.togglePaused();
   }
};

window.onfocus = function (e) {  // unpause if paused
   var originalFont = snailBait.toast.style.fontSize;

   snailBait.windowHasFocus = true;

   if (snailBait.paused) {
      snailBait.toast.style.font = '128px fantasy';

      snailBait.revealToast('3', 500); // Display 3 for one half second

      setTimeout(function (e) {
         snailBait.revealToast('2', 500); // Display 2 for one half second

         setTimeout(function (e) {
            snailBait.revealToast('1', 500); // Display 1 for one half second

            setTimeout(function (e) {
               if ( snailBait.windowHasFocus) {
                  snailBait.togglePaused();
               }

               setTimeout(function (e) { // Wait for '1' to disappear
                  snailBait.toast.style.fontSize = originalFont;
               }, 2000);
            }, 1000);
         }, 1000);
      }, 1000);
   }
};

// Launch game.........................................................

var snailBait = new SnailBait();
snailBait.start();

// Sound and music controls............................................

snailBait.soundCheckbox.onchange = function (e) {
   snailBait.soundOn = snailBait.soundCheckbox.checked;
};

snailBait.musicCheckbox.onchange = function (e) {
   snailBait.musicOn = snailBait.musicCheckbox.checked;

   if (snailBait.musicOn) {
      snailBait.soundtrack.play();
   }
   else {
      snailBait.soundtrack.pause();
   }
};

// SnailBait event handlers............................................

snailBait.newGameLink.onclick = function (e) {
   snailBait.restartGame();
};

snailBait.slowlyDontShowElement.onclick = function (e) {
   snailBait.hideRunningSlowlyWarning();
   snailBait.showSlowWarning = false;
};

snailBait.slowlyOkayElement.onclick = function (e) {
   snailBait.hideRunningSlowlyWarning();
   snailBait.speedSamples = [60,60,60,60,60,60,60,60,60,60]; // reset
};