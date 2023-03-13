let suits =["H", "C", "S", "D"];

let values =["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q",  "K", "A"];

let concealedCard="";

let houseCard="";

let playerCard1="";

let playerCard2="";

let cardDeck = [];

let houseSum = 0;

let actualHouseSum = 0;

let playerSum = 0;

let actualPlayerSum = 0;

let result = "";


//building the deck - I used "https://blog.greenroots.info/5-ways-to-merge-arrays-in-javascript-and-their-differences" and some experience from doing challenges on coderbyte to help me with this task.

function buildDeck(values, suits) {

	for(i = 0; i<values.length; i++) {

		for(j = 0; j<suits.length; j++) {

		  cardDeck.push(values[i]+suits[j]);

		}

	}

  return cardDeck;

}

buildDeck(values, suits);

//shuffling the deck using Fisher-Yates algorithm, I did not manage to write my own version of a truly random shuffle. "https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj".

function shuffle(cardDeck) {

  for (let i = cardDeck.length - 1; i > 0; i--) {

    let j = Math.floor(Math.random() * (i + 1));
    let temp = cardDeck[i];
    cardDeck[i] = cardDeck[j];
    cardDeck[j] = temp;

  }

  return cardDeck;

}


let shuffledDeck = shuffle(cardDeck);

//convert card into a number 

function convertCardToNum(arr) {

  let res = 0;

  let checkDigit = arr.toString().split("");

    if(checkDigit[0] + checkDigit[1] === "10") {

      return res += 10;

    }

    if(isNaN(checkDigit[0])) {

      if(checkDigit[0] === "A") {

        return res += 11;

    }

    else if (checkDigit[0] === "J" || checkDigit[0] === "Q" || checkDigit[0] === "K" )

      return res +=10;

    }

  return res += parseInt(checkDigit[0]);

}

//Check how many Aces were dealt to subtract later: 

let playerAceCount = 0
let houseAceCount = 0

function checkIfAce(card) {

  if(card[0] === "A") {

    return 1;
  }

  else {

    return 0;
  }

}

//dealing the cards to the house and the player

function dealCards() {

//house

  concealedCard = shuffledDeck.pop();
  houseAceCount += checkIfAce(concealedCard);
  houseCard = shuffledDeck.pop();   
  $('#shownCard').attr("src", "./Playing Cards/" + houseCard.toString() + ".png");    
  houseAceCount += checkIfAce(houseCard);   
  houseSum += convertCardToNum(concealedCard) + convertCardToNum(houseCard)
  actualHouseSum = aceRule(houseSum, houseAceCount);
  
   
 

//player

  playerCard1 = shuffledDeck.pop();
  $('#playerCard1').attr("src", "./Playing Cards/" + playerCard1.toString() + ".png");
  playerAceCount += checkIfAce(playerCard1);  
  playerCard2 = shuffledDeck.pop();
  $('#playerCard2').attr("src", "./Playing Cards/" + playerCard2.toString() + ".png");
  playerAceCount += checkIfAce(playerCard2);  
  playerSum += convertCardToNum(playerCard1) + convertCardToNum(playerCard2);
  actualPlayerSum = aceRule(playerSum, playerAceCount);  
  $("#playerScore").append(actualPlayerSum);


  if(actualPlayerSum === 21) {

    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");

    if(actualHouseSum !== 21) {

    $("#stay").prop("disabled", true);
    $("#hitme").prop("disabled", true);
    $("#houseScore").html(houseSum);
    return $("#result").html("BlackJack, You Win!");

    }

    else if (actualHouseSum === 21) {

    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");
    $("#houseScore").html(houseSum);
    return $("#result").html("It's A Push!");

    }

  }

}

dealCards();


//Hit or Stay?

$("#hitme").click(function() {

  let nextCard = shuffledDeck.pop();
  playerAceCount += checkIfAce(nextCard);  
  playerSum += convertCardToNum(nextCard);  
  let nextCard_img = $("<img>");
  nextCard_img.attr("src", "./Playing Cards/" + nextCard.toString() + ".png");
  nextCard_img.appendTo("#playerCardsImages");
  actualPlayerSum = aceRule(playerSum, playerAceCount);
  afterDeal();       
  return $("#playerScore").html(actualPlayerSum); 
});


$("#stay").click(function() {

    $("#stay").prop("disabled", true);
    $("#hitme").prop("disabled", true);
    actualHouseSum = aceRule(houseSum, houseAceCount);    
    houseCards();    
    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");
    getResult(aceRule(houseSum, houseAceCount), aceRule(playerSum, playerAceCount));
    return $("#houseScore").html(actualHouseSum);

});

$("#again").click(function () {

    return window.location.reload();

});


// The official rules say that the dealer has to count every Ace as 11 if it brings the total to 17 but not over 21 .. I really wish I had looked this up before trying to implement the Ace Rule for the House for several hours.

// This meant I was trying to code for a situation where the House was over 17 but not over 21 and had an Ace and was losing to the Player. Thankfully this situation is not in the rules so you are not seeing my attempts here.
  
// So now when the house has an Ace but does not bust because of it and has a score of over 17 the program goes to getResult.

function houseCards() {

    if(actualHouseSum > 17) {

      return;

    }

    else if(houseSum >= 17 && houseSum <= 21) {

      return;     

    }

    else if(actualHouseSum < 17) {

      let houseNextCard = shuffledDeck.pop();
      houseAceCount += checkIfAce(houseNextCard);    
      houseSum += convertCardToNum(houseNextCard);
      actualHouseSum = aceRule(houseSum, houseAceCount);    
      let houseNextCard_img = $("<img>");
      houseNextCard_img.attr("src", "./Playing Cards/" + houseNextCard.toString() + ".png");
      houseNextCard_img.appendTo("#houseCardsImages");       
      $("#houseScore").html(actualHouseSum);
      return houseCards();

    }    

}


//Determining a Winner:


function getResult(x, y) {

  if (x === 21 && y < 21) {

    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");
    $("#houseScore").html(actualHouseSum);
    $("#stay").prop("disabled", true);
    $("#hitme").prop("disabled", true);
    return $("#result").html("It's A Bust!");
  }  

  else if (x < 21 && y === 21) {

    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");
    $("#houseScore").html(actualHouseSum);
    $("#stay").prop("disabled", true);
    $("#hitme").prop("disabled", true);
    return $("#result").html("You Win!");
  }

  else if (x > y && x <= 21) {
    
    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");
    $("#houseScore").html(actualHouseSum);
    $("#stay").prop("disabled", true);
    $("#hitme").prop("disabled", true);
    return $("#result").html("It's A Bust!");
  }

  else if (x < y && y <= 21) {

    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");
    $("#houseScore").html(actualHouseSum);
    $("#stay").prop("disabled", true);
    $("#hitme").prop("disabled", true);
    return $("#result").html("You Win!");
  }

  else if (x === y) {

    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");
    $("#houseScore").html(actualHouseSum);
    $("#stay").prop("disabled", true);
    $("#hitme").prop("disabled", true);
    return $("#result").html("It's A Push!");
  }

  else if (y > 21) {

    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");
    $("#houseScore").html(actualHouseSum);
    $("#stay").prop("disabled", true);
    $("#hitme").prop("disabled", true);
    return $("#result").html("It's A Bust!");
  }

  else if (x > 21) {

    $('#hiddenCard').attr("src", "./Playing Cards/" + concealedCard.toString() + ".png");
    $("#houseScore").html(actualHouseSum);
    $("#stay").prop("disabled", true);
    $("#hitme").prop("disabled", true);
    return $("#result").html("You Win!");
  }

  else {

    return $("#result").html("I have not accounted for this scenario!");
  }

}

// After many days of trying out different solutions I FINALLY managed to write a while loop using the aceCount (b) of each player, with that information I can adjust the sums before giving it to the getResult function - WOHOO!

// This took SO long and now it looks so simple...

function aceRule(a, b) {

  while(a > 21 && b > 0) {

    a -= 10;
    b --;

  } 

  return a;

}


function afterDeal() {
  if(aceRule(playerSum, playerAceCount) < 21){
    return;
  }
  else if(aceRule(playerSum, playerAceCount) === 21){
    return getResult(aceRule(houseSum, houseAceCount), aceRule(playerSum, playerAceCount));
  }
  else if (aceRule(playerSum, playerAceCount) > 21) {
    return getResult(aceRule(houseSum, houseAceCount), aceRule(playerSum, playerAceCount));
  }
}











