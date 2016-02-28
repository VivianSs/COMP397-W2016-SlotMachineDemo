// MENU SCENE
module scenes {
    export class SlotMachine extends objects.Scene {
        //PRIVATE INSTANCE VARIABLES ++++++++++++
       
        private _backgroundImage: createjs.Bitmap;
        private _bet1Button: objects.Button;
        private _bet10Button: objects.Button;
        private _bet100Button: objects.Button;
        private _spinButton: objects.Button;
        private _resetButton: objects.Button;
        private _quitButton: objects.Button;

        private _reels: createjs.Bitmap[];

        private _jackpotText: objects.Label;
        private _creditsText: objects.Label;
        private _betText: objects.Label;
        private _resultText: objects.Label;


        private playerMoney: number;
        private winnings: number;
        private jackpot: number;
        private playerBet: number;

        private _grapes = 0;
        private _bananas = 0;
        private _oranges = 0;
        private _cherries = 0;
        private _bars = 0;
        private _bells = 0;
        private _sevens = 0;
        private _blanks = 0;

     
        
        // GAME VARIABLES

       
        
        // CONSTRUCTOR ++++++++++++++++++++++
        constructor() {
            super();
        }
        
        // PUBLIC METHODS +++++++++++++++++++++
        
        // Start Method
        public start(): void { 
            // reset the game 
            this._resetAll();
               
            // add background image to the scene
            this._backgroundImage = new createjs.Bitmap(assets.getResult("SlotMachine"));
            this.addChild(this._backgroundImage);
            
            //add reset button to the scene
            this._resetButton = new objects.Button("ResetButton", 180, 157, false);
            this.addChild(this._resetButton);
            this._resetButton.on("click", this._resetButtonClick, this);
            
            //add quit button
            this._quitButton = new objects.Button("QuitButton", 430, 158, false);
            this.addChild(this._quitButton);
            this._quitButton.on("click", this._quitButtonClick, this);
           
            
            // add Bet1Button to the scene
            this._bet1Button = new objects.Button("Bet1Button", 168, 382, false);
            this.addChild(this._bet1Button);
            this._bet1Button.on("click", this._bet1ButtonClick, this); 
            
            // add Bet10Button to the scene
            this._bet10Button = new objects.Button("Bet10Button", 240, 382, false);
            this.addChild(this._bet10Button);
            this._bet10Button.on("click", this._bet10ButtonClick, this); 
            
            // add Bet100Button to the scene
            this._bet100Button = new objects.Button("Bet100Button", 312, 382, false);
            this.addChild(this._bet100Button);
            this._bet100Button.on("click", this._bet100ButtonClick, this); 
            
            // add SpinButton to the scene
            this._spinButton = new objects.Button("SpinButton", 402, 382, false);
            this.addChild(this._spinButton);
            this._spinButton.on("click", this._spinButtonClick, this);
            
            //add JackPot text to the scene
            this._jackpotText = new objects.Label(
                this.jackpot.toString(),
                "14px Consolas",
                "#ff0000",
                356, 106, false);
            this._jackpotText.textAlign = "right";
            this.addChild(this._jackpotText);
            
            //add Credits text to the scene
            this._creditsText = new objects.Label(
                this.playerMoney.toString(),
                "14px Consolas",
                "#ff0000",
                261, 325, false);
            this._creditsText.textAlign = "right";
            this.addChild(this._creditsText);
                
            //add Bet text to the scene
            this._betText = new objects.Label(
                this.playerBet.toString(),
                "14px Consolas",
                "#ff0000",
                356, 325, false);
            this._betText.textAlign = "right";
            this.addChild(this._betText);
                
            //add Result text to the scene
            this._resultText = new objects.Label(
                this.winnings.toString(),
                "14px Consolas",
                "#ff0000",
                452, 325, false);
            this._resultText.textAlign = "right";
            this.addChild(this._resultText);
              
                 
            // initialize array of bitmaps
            this._initializeBitmapArray();
           
            // setup Background 
            this._setupBackground(assets.getResult("BlackBackground"));
            
            //FadeIn
            this._fadeIn(500);
            
            // add this scene to the global stage container
            stage.addChild(this);
        }

        // SLOT_MACHINE Scene updates here
        public update(): void {

        }
        
        //PRIVATE METHODS
        /* Utility function to check if a value falls within a range of bounds */
        private _checkRange(value: number, lowerBounds: number, upperBounds: number): number {
            return (value >= lowerBounds && value <= upperBounds) ? value : -1;
        }

        private _resetAll() {
            this.playerMoney = 1000;
            this.winnings = 0;
            this.jackpot = 5000;
            this.playerBet = 0;
        }
        
        /* When this function is called it determines the betLine results.
        e.g. Bar - Orange - Banana */
        private _spinReels(): string[] {
            var betLine = [" ", " ", " "];
            var outCome = [0, 0, 0];

            for (var spin = 0; spin < 3; spin++) {
                outCome[spin] = Math.floor((Math.random() * 65) + 1);
                switch (outCome[spin]) {
                    case this._checkRange(outCome[spin], 1, 27):  // 41.5% probability
                        betLine[spin] = "Blank";
                        this._blanks++;
                        break;
                    case this._checkRange(outCome[spin], 28, 37): // 15.4% probability
                        betLine[spin] = "Grapes";
                        this._grapes++;
                        break;
                    case this._checkRange(outCome[spin], 38, 46): // 13.8% probability
                        betLine[spin] = "Banana";
                        this._bananas++;
                        break;
                    case this._checkRange(outCome[spin], 47, 54): // 12.3% probability
                        betLine[spin] = "Orange";
                        this._oranges++;
                        break;
                    case this._checkRange(outCome[spin], 55, 59): //  7.7% probability
                        betLine[spin] = "Cherry";
                        this._cherries++;
                        break;
                    case this._checkRange(outCome[spin], 60, 62): //  4.6% probability
                        betLine[spin] = "Bar";
                        this._bars++;
                        break;
                    case this._checkRange(outCome[spin], 63, 64): //  3.1% probability
                        betLine[spin] = "Bell";
                        this._bells++;
                        break;
                    case this._checkRange(outCome[spin], 65, 65): //  1.5% probability
                        betLine[spin] = "Seven";
                        this._sevens++;
                        break;
                }
            }
            return betLine;
        }
        
        
        /* Check to see if the player won the jackpot */
        private _checkJackPot(): void {
            /* compare two random values */
            var jackPotTry = Math.floor(Math.random() * 51 + 1);
            var jackPotWin = Math.floor(Math.random() * 51 + 1);
            if (jackPotTry == jackPotWin) {
                alert("You Won the $" + this.jackpot + " Jackpot!!");
                this.playerMoney += this.jackpot;
                this.jackpot = 1000;
                this._jackpotText.text = this.jackpot.toString();
            }
        }
        
        /* This function calculates the player's winnings, if any */
        private _determineWinnings(): void {
            if (this._blanks == 0) {
                if (this._grapes == 3) {
                    this.winnings = this.playerBet * 10;
                }
                else if (this._bananas == 3) {
                    this.winnings = this.playerBet * 20;
                }
                else if (this._oranges == 3) {
                    this.winnings = this.playerBet * 30;
                }
                else if (this._cherries == 3) {
                    this.winnings = this.playerBet * 40;
                }
                else if (this._bars == 3) {
                    this.winnings = this.playerBet * 50;
                }
                else if (this._bells == 3) {
                    this.winnings = this.playerBet * 75;
                }
                else if (this._sevens == 3) {
                    this.winnings = this.playerBet * 100;
                }
                else if (this._grapes == 2) {
                    this.winnings = this.playerBet * 2;
                }
                else if (this._bananas == 2) {
                    this.winnings = this.playerBet * 2;
                }
                else if (this._oranges == 2) {
                    this.winnings = this.playerBet * 3;
                }
                else if (this._cherries == 2) {
                    this.winnings = this.playerBet * 4;
                }
                else if (this._bars == 2) {
                    this.winnings = this.playerBet * 5;
                }
                else if (this._bells == 2) {
                    this.winnings = this.playerBet * 10;
                }
                else if (this._sevens == 2) {
                    this.winnings = this.playerBet * 20;
                }
                else if (this._sevens == 1) {
                    this.winnings = this.playerBet * 5;
                }
                else {
                    this.winnings = this.playerBet * 1;
                }
                console.log("Win!");
            }
            else {
                console.log("Loss!");
                this.winnings = 0;
            }
            this._resultText.text = this.winnings.toString();
            this.playerMoney += this.winnings;
            this._creditsText.text = this.playerMoney.toString();
            this._resetFruitTally();
        }

        private _resetFruitTally(): void {
            this._grapes = 0;
            this._bananas = 0;
            this._oranges = 0;
            this._cherries = 0;
            this._bars = 0;
            this._bells = 0;
            this._sevens = 0;
            this._blanks = 0;
        }

        private _initializeBitmapArray(): void {
            this._reels = new Array<createjs.Bitmap>();
            for (var reel: number = 0; reel < 3; reel++) {
                this._reels[reel] = new createjs.Bitmap(assets.getResult("Blank"));
                this._reels[reel].x = 216 + (reel * 84);
                this._reels[reel].y = 220;
                this.addChild(this._reels[reel]);
                console.log("reel" + reel + " " + this._reels[reel]);
            }



        }

        private _placeBet(playerBet: number) {
            //ensure player's bet is less or equal than player's money
            if (playerBet <= this.playerMoney) {
                this.playerBet += playerBet;
                this.playerMoney -= playerBet;
                this._creditsText.text = this.playerMoney.toString();
                this._betText.text = this.playerBet.toString();
            }
            else {
                this._fadeOut(500, () => {
                    scene = config.Scene.GAME_OVER;
                    changeScene();
                })
            }
        }
        
        //EVENT HANDLERS ++++++++++++++++++++
       
        
        private _bet1ButtonClick(event: createjs.MouseEvent): void {
            console.log("Bet 1 Credit");
            this._placeBet(1);
        }

        private _bet10ButtonClick(event: createjs.MouseEvent): void {
            console.log("Bet 10 Credit");
            this._placeBet(10);
        }

        private _bet100ButtonClick(event: createjs.MouseEvent): void {
            console.log("Bet 100 Credit");
            this._placeBet(100);
        }

        private _resetButtonClick(event: createjs.MouseEvent): void {

            this._resetAll();
            this._creditsText.text = this.playerMoney.toString();
            this._betText.text = this.playerBet.toString();
            this._resultText.text = this.winnings.toString();
            this._jackpotText.text = this.jackpot.toString();

        }

        private _quitButtonClick(event: createjs.MouseEvent): void {
            var response = confirm("Are you sure you want to Power OFF the game ?");
            if (response == true) {
                this._fadeOut(500, () => {
                    scene = config.Scene.MENU;
                    changeScene();
                })
            }
        }

        private _spinButtonClick(event: createjs.MouseEvent): void {
            // ensure player has enough money
            if (this.playerBet > 0) {
                var bitmap: string[] = this._spinReels();

                for (var reel: number = 0; reel < 3; reel++) {
                    this._reels[reel].image = assets.getResult(bitmap[reel]);
                }
                this._checkJackPot();
                this._determineWinnings();
                this._resetFruitTally();

                console.log(bitmap[0] + " - " + bitmap[1] + " - " + bitmap[2]);
            }
            else {
                alert("You don't specify a bet amount");
            }
            //reset player's bet to the zero
            this.playerBet = 0;
            this._betText.text = this.playerBet.toString();
        }

    }
}