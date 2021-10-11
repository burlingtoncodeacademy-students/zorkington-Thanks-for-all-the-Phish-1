const { Console } = require("console");
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

//-----------------------------------------------class declarations----------------------------------------//

class Player {
  constructor(inventory, status) {
    this.inventory = inventory || [];
    this.status = status || [];
  }
}

class Item {
  constructor(name, description, action, takeable) {
    this.name = name;
    this.description = description || [];
    this.action = action || [];
    this.takeable = takeable || false;
  }

  //these take and use functions are not used n the my program, though i do push a key into playerOnes inventory without it
  //I haven't finished the code that will add the key requirement to the state machine/valid transitions
  //to go to my last set of rooms, which are, also not finished.
  take() {
    if (this.takeable) {
      inventory.push(this.name);
      return `You picked up ${this.name}`;
    } else {
      return "You can't take that!";
    }
  }
  //use function
  use() {
    if (this.name === "desk" && inventory.includes("smallkey")) {
      return "You can open the drawer, inside is a large key";
    } else {
      return this.action;
    }
  }
}

class Character {
  constructor(name, description, action) {
    this.name = name;
    this.description = description;
    this.action = action;
  }
  async iOForStrangeMan(inputArray) {
    //I put this chunk of code into the class character, it is used in the first room.
    let thisMessage = `The strange man grins wider and hands you a bag. 
      You look inside and see a pile of gross wriggling little green things.
      They're glowing and smell funny. You ask him what they are and he says,
      "One thousand long slimy crocodile tongues! Boiled in the skull of a dead witch
      for 20 days and 20 nights, add the fingers of a young monkey, the gizzard of a 
      pig, the beak of a parrot, and three spoonfuls of sugar. Stew for a week and let 
      the moon do the rest. If you eat them strange and wonderful things will happen!"`;

    if (inputArray.includes("greet")) {
      console.log(thisMessage);
    } else if (inputArray.includes("hello")) {
      console.log(thisMessage);
    } else if (inputArray.includes("yes")) {
      console.log(thisMessage);
    } else {
      let thisMessageEnds = `The strange man vanishes before your eyes. You go on living 
    your life until the day you die, miserable.`;
      console.log(thisMessageEnds);
      let answer = await ask("Would you like to try again?\n>_");
      if (answer.toLowerCase().trim() === "yes") {
        start();
      } else {
        process.exit();
      }
    }
  }
  //didn't make use of this and assigned targets procedurally instead
  targetMakerCharacter(array) {
    if (array.includes(this.name.toString())) {
      target = this.name.toString();
      return target;
    }
  }
}
class Room {
  constructor(name, description, input, character) {
    this.name = name;
    this.description = description || [];
    this.input = input || [];
    this.character = character || [];
  }
  //didn't make use of this and assigned targets procedurally instead
  targetMakerRoom(array) {
    if (array.includes(this.name)) {
      target = "home";
      return target;
    } else if (array.includes("house")) {
      target = "house";
      return target;
    }
  }
}

//-----------------------------------------------------instances created on classes------------------------------------------//

let playerOne = new Player([], "miserable");
let strangeMan = new Character(
  "strange man",
  "He is eccentric looking and smiling."
);

let firstRoom = new Room(
  "Home",
  "It's worn down, you don't care what people think of it."
);

let peachRoom = new Room(
  "Peach Room",
  `YOU'RE INSIDE OF A PEACH... you look nervously about for giant bugs.
  There's a key on a pedestal in front of you. Behind the key there are two doors.
  One door is red, and one is blue.
  There is a little tag with some writing on the key. You could read it...`,
  undefined,
  undefined
);

let hallway = new Room(
  "Hallway",
  `You are in a long hallway and It's very dark. There are scary glowing eyes watching you
  from all directions. You want to leave very badly. There is a door at the end of the hall.
  Will you go through the door?`,
  undefined,
  undefined
);

let blaineTheMono = new Room(
  `blaine the mono`,
  `this will be a much bertter description once I get arround tooooo it blah de da de blah de
  blahdgfakdfaiosdfjsdfsad`,
  undefined,
  undefined
);

let peach = new Item(
  "peach",
  "The peach is as big as your house!\nThere's a hole inviting you in, do you enter?",
  undefined,
  false
);

let key = new Item(
  "key",
  `The little tag on the key reads, "I will open only one of these doors for you. 
  The red door leads to infinite wealth, and the blue door leads to happiness, 
  and the road will be challenging"`,
  undefined,
  true
);

//----------------------------------------------------------state machine for room transitions---------------------------------//

let states = {
  Home: { canChangeTo: ["peach room"] },
  "peach room": { canChangeTo: ["hallway", "blaine the mono"] },
  hallway: { canChangeTo: ["Lonely Library", "peach room"] },
  "blaine the mono": { canChangeTo: ["Sunny Library"] },
};


//----------------------------------------------------------------lookup Table------------------------------------------------------//

let lookupTable = {
  strangeMan: strangeMan,
  home: firstRoom,
  house: firstRoom,
  peach: peach,
  "peach room": peachRoom,
  "blaine the mono": blaineTheMono,
  hallway: hallway,
  key: key,
  "Player One": playerOne,
};

//---------------------------------------------------------functions used in program---------------------------------------------------//

function moveLocation(newLocation) {
  let validTransitions = states[currentLocation].canChangeTo;
  if (validTransitions.includes(newLocation)) {
    currentLocation = newLocation;
    console.log(currentLocation);
  } else {
    console.log("That's not a valid transition...");
  }
}

function inputHandler(words) {
  let inputArray = words.toLowerCase().trim().split(" ");
  return inputArray;
}


//initializing first room 
let currentLocation = firstRoom.name;


//program runs
start();

async function start() {
  console.log(currentLocation);
  const welcomeMessage = `You are miserable and you lead a miserable existence.
  You have little to offer the world and you see little that it offers you. 
  Circumstances are always dire, and no one would reasonably spend time with you because 
  you must unload your unhappiness on everyone you know. 
  One day you see an intruder in your yard and you go outside to confront him.
  He is eccentric looking and smiling. He greets you by name though you have never seen him before. 
  Do you greet him? 
  >_`;
  let answer = await ask(welcomeMessage);
  if (answer === "yes") {
    let target = "strangeMan";
    lookupTable[target].iOForStrangeMan(inputHandler(answer));
    //^^ioforstrange man output is written on line 56
  } else {
    thisMessageEnds = `The strange man vanishes before your eyes. You go on living 
        your life until the day you die, miserable. What a wasted opportunity.`;
    console.log(thisMessageEnds);
    let answer = await ask("Would you like to try again?\n>_");
    if (answer.toLowerCase().trim() === "yes" || "y") {
    //----------------------------------------^are these doing what I want them to do?  
      start();
    } else {
      process.exit();
    }
  }
  answer = await ask("Do you eat them?\n>_");
  if (
    inputHandler(answer).includes("yes") ||
    inputHandler(answer).includes("eat")
    //----------------------------------^i think they may not be...
  ) {
    target = "peach";
    console.log(
      `Your vision goes blurry for a moment until
       you notice a peach hanging off the branch of a tree that's been dead for years. 
       The peach begins to grow.`
    );
    //this is successfully pulling the peach description via the lookup table
    console.log(lookupTable[target].description);
  } else {
    thisMessageEnds = `The strange man vanishes before your eyes. You go on living 
    your life until the day you die, miserable. What a wasted opportunity.`;
    console.log(thisMessageEnds);
    let answer = await ask("Would you like to try again?\n>_");
    if (answer.toLowerCase().trim() === "yes" || "y") {
      start();
    } else {
      process.exit();
    }
  }
  answer = await ask(">_");
  if (answer === "yes") {
    console.log(currentLocation);
    moveLocation("peach room");
  } else {
    console.log(`You just aren't curious enough to care. You don't even keep
    the miraculous peach around. Instead you have someone take it away to the fair. 
    Maybe someone there will appreciate it.`);
    let answer = await ask("Would you like to try again?\n>_");
    if (
      answer.toLowerCase().trim() === "yes" ||
      answer.toLowerCase().trim() === "y"
    ) {
      start();
    } else {
      process.exit();
    }
  }

  //this loop got me feeling trapped because it locks one into needing to say 'read'
  //I struggled trying to determine how much a loop would encompass in the first story for the project
  while (!inputHandler(answer).includes("read")) {
    console.log(peachRoom.description);
    answer = await ask(`>_`);
    if (inputHandler(answer).includes("read")) {
      target = "key";
      console.log(lookupTable[target].description);
    } else {
      console.log(`This does not compute...`);
    }
  }
  answer = await ask("Will you take the key?\n>_");

  if (
    inputHandler(answer).includes("take") ||
    inputHandler(answer).includes("yes")
  ) {
    playerOne.inventory.push("key");
    console.log("Now you have the key");
  }
  answer = await ask(
    `Will you use the key on the blue door or the red door?\n>_`
  );
  moveLocation("hallway");
  console.log(hallway.name);
  console.log(hallway.description);

  if (inputHandler(answer).includes("red")) {
    //--------------------------------------------------------------------------Hallway!-----------------------------------------------------------------------------//
    target = "hallway";
    moveLocation("hallway");
    console.log(hallway.name);
    console.log(hallway.description);
    //-----------------------------------------------------------------------Blaine the Mono-------------------------------------------------------------------------//
  } else if (inputHandler(answer).includes("blue")) {
    target = "blaine the mono";
    moveLocation("blaine the mono");
    console.log(blaineTheMono.description);
  }
}


