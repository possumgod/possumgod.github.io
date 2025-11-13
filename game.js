// Converted to JS using some online converter, will change as time goes


let list_sus = [];
let inventory = {
    'key': false,
    'grey fabric': false,
    'claw marks': false,
    'witness statement': false,
    'drugs': false,
    'body': false,
    'bleach': false
};
let other_stuff = {
    'car_here': true,
    'barcon': true,
    'clerk_talk': false,
    'clerk_kill': false,
    'car_name': false,
    'dog_here': true,
    'clerk_here': true,
    'cleaner': false
};

let ending = "";
let pat = 0;
let introvert = 0;
let evidence = 0;
let bartender = false;
let car_dude = false;
let hotel_clerk = false;

// Randomly pick killer
const x = Math.floor(Math.random() * 3) + 1;
if (x === 1) bartender = true;
if (x === 2) car_dude = true;
if (x === 3) hotel_clerk = true;

let killer = bartender ? 'bartender' : car_dude ? 'car dude' : 'hotel clerk';

// ---------- Helpers ----------
function safePrompt(msg) {
    const res = prompt(msg);
    return (res === null) ? "" : res;
}

function check_stuff(item) {
    return !!other_stuff[item];
}

function check_invent(item) {
    return !!inventory[item];
}

function introvert_check() {
    introvert += 1;
    if (introvert > 7) {
    ending = 'Socially Anxious Detective Ending';
    dead("You were too afraid to talk to any of the humans, you were unable to collect enough evidence. Your indecisiveness allowed the killer to get away.");
    }
}

function dead(why) {
    alert(`${why} You got the ${ending}.`);
    // stop execution by throwing an exception (caught nowhere)
    throw new Error("Game Over");
}

// ---------- Game functions ----------
function outside() {
    alert("Behind you is the door to the lobby.");
    if (check_stuff('dog_here')) {
    alert("There is also a dog sitting outside the hotel (it clearly wants pats).");
    }
    if (check_stuff('car_here')) {
    alert("In front of you in the parking lot is a car with someone in it.");
    }
    const choiceRaw = safePrompt("Where do you want to go?");
    const choice = choiceRaw.toLowerCase();

    if (choice.includes("car") || choice.includes("front") || choice.includes("parking")) {
    if (check_stuff('car_here')) {
        alert("You go over to the car.");
        car();
        return;
    } else {
        alert("There is no car you can go to.");
        outside();
        return;
    }
    } else if (choice.includes("hotel") || choice.includes("lobby") || choice.includes("back")) {
    if (list_sus.includes('dog') && check_stuff('dog_here')) {
        alert("There is a sign saying 'NO DOGS ALLOWED' in bright bold letters. You decide to obey the rule and leave the dog outside.");
    }
    alert("You head inside to the hotel.");
    hotel_lobby();
    return;
    } else if (choice.includes("dog") || choice.includes("pat")) {
    alert("You pat the dog. Cute.");
    pat += 1;
    pats();
    return;
    } else {
    alert("Sorry but that's not a place you can go.");
    outside();
    return;
    }
}

function pats() {
    if (pat === 5) {
    alert("The dog likes you a lot, you have acquired dog.");
    if (!list_sus.includes('dog')) list_sus.push('dog');
    outside();
    return;
    }
    const choiceRaw = safePrompt("It wants more pats. Will you give more pats?");
    const choice = choiceRaw.toLowerCase();
    if (choice === "yes" || choice.includes("pat")) {
    alert("You pat the dog. Cute.");
    pat += 1;
    pats();
    return;
    } else if (choice === "no") {
    alert("The dog looks sad, but stays there.");
    outside();
    return;
    } else {
    alert("That's not an action you can take.");
    pats();
    return;
    }
}

function car() {
    if (!check_stuff('car_name')) {
    alert("The car seems to be old, at least from the 80's, it's pretty run down and not in the best shape.");
    alert("As you walk closer, you notice someone sitting in the driver's seat, they might know something.");
    const choiceRaw = safePrompt("Do you leave or talk to them?");
    const choice = choiceRaw.toLowerCase();
    if (choice.includes("talk")) {
        alert("You tap on their car window");
        woods();
        return;
    } else if (choice.includes("leave")) {
        introvert_check();
        alert("You head back to the hotel entrance");
        outside();
        return;
    } else {
        alert("Sorry but that's not an action you can take.");
        car();
        return;
    }
    } else {
    alert("You walk up to him and he rolls down the window, 'I don't have anymore information to give to you, sorry.' You head back to the entrance.");
    outside();
    return;
    }
}

function woods() {
    alert("You tell him who you are and what you're doing, he seems eager to help and claims to know something that might help you solve your case.");
    const choiceRaw = safePrompt("Do you go with him?");
    const choice = choiceRaw.toLowerCase().trim();
    if (choice === "yes") {
    alert("You get in his car and drive until you're on a secluded gravelled road surrounded by trees. He stops the car and gets out and you follow them.");
    if (car_dude) {
        woodsbad();
        return;
    } else {
        alert("'I come out here often, since I don't live far from here,' he explains, 'it was the other day, when I found this.' He walks over to one of the trees and grabs something.");
        alert("It is a piece of grey fabric stained with blood, you take it as possible evidence.");
        alert("'Car dude' added to suspect list.\n'Grey fabric' added to inventory.");
        if (!list_sus.includes('car dude')) list_sus.push('car dude');
        inventory['grey fabric'] = true;
        if (hotel_clerk) {
        alert("You both examine the area around you, there's an awful stench coming from the undergrowth.");
        alert("You see a hand sticking out of the dirt.");
        alert("'Body' added to evidence.");
        inventory['body'] = true;
        alert("Both of you decide to go back to the hotel for you to investigate more.");
        outside();
        return;
        } else {
        alert("You thank him for his contribution and you both head back to the hotel so you can continue your investigation.");
        other_stuff['car_name'] = true;
        outside();
        return;
        }
    }
    } else if (choice === "no") {
    introvert_check();
    alert("You decline their offer and head back to the entrance; he doesn't seem offended and tell you he'll be there if you change your mind.");
    alert("'car dude' added to suspect list.");
    if (!list_sus.includes('car dude')) list_sus.push('car dude');
    alert("You head back to the hotel entrance");
    outside();
    return;
    } else {
    alert("Sorry but that's not an action you can take.");
    woods();
    return;
    }
}

function woodsbad() {
    if (!list_sus.includes('car dude')) list_sus.push('car dude');
    alert("'You know you shouldn't be looking into things like this, stay out of things that you don't know anything about,' he turns around to look at you, it almost seems like he's growling.");
    alert("It seems like he has unusually sharp nails (and a tail...?), before you realize what's happening, he transforms into a wolf-like creature.");
    alert("He charges at you, do you defend yourself or flee?");
    const choiceRaw = safePrompt("");
    const choice = choiceRaw.toLowerCase();
    if (choice.includes("flee")) {
    alert("You run away as fast as you can, he doesn't run after you, it appears he's injured. You make it back to the main road, you see the sign to the hotel and decide that's probably the best place to go.");
    other_stuff['car_here'] = false;
    outside();
    return;
    } else if (choice.includes("defend")) {
    if (list_sus.includes('dog')) {
        alert("Your loyal furry companion attacks the werewolf, you watch as he tries to fight back; unfortunetly the dog loses. Luckily because of the dog's sacrifice you manage to get away back to the hotel.");
        other_stuff['car_here'] = false;
        other_stuff['dog_here'] = false;
        list_sus = list_sus.filter(s => s !== 'dog');
        outside();
        return;
    } else {
        ending = 'Supernatural Ending';
        dead("You tried to defend yourself, but before you could do anything he slashes you to pieces, you bleed out and die.");
        return;
    }
    } else {
    alert("Sorry but that's not an action you can take.");
    woodsbad();
    return;
    }
}

function hotel_lobby() {
    alert("The lobby is fairly plain. To the left there's the front desk, to the right is a small bar, in front of you is a telephone.");
    alert("Behind you is the door to outside.");
    if (check_invent('key')) {
    alert("Down the hall is the room.");
    }
    const choiceRaw = safePrompt("Where do you go?");
    const choice = choiceRaw.toLowerCase();
    if (choice.includes("hall") || choice.includes("room")) {
    if (!check_invent('key')) {
        alert("Sorry, but you don't have a room key yet.");
        hotel_lobby();
        return;
    } else {
        room();
        return;
    }
    } else if (choice.includes("right") || choice.includes("bar")) {
    bar();
    return;
    } else if (choice.includes("left") || choice.includes("desk")) {
    if (check_stuff('clerk_here')) {
        front_desk();
        return;
    } else {
        alert("There is no one at the desk, perhaps another time.");
        hotel_lobby();
        return;
    }
    } else if (choice.includes("front") || choice.includes("phone")) {
    telephone();
    return;
    } else if (choice.includes("back") || choice.includes("outside")) {
    outside();
    return;
    } else {
    alert("sorry that's not a place you can go.");
    hotel_lobby();
    return;
    }
}

function telephone() {
    // compute evidence fresh
    evidence = Object.values(inventory).filter(v => v === true).length;
    if (list_sus.length === 0) {
    alert("You have no suspects, go find some evidence!");
    hotel_lobby();
    return;
    } else {
    const uniques = [...new Set(list_sus)];
    alert("the people you have suspect are " + uniques.join(", "));
    const guiltyRaw = safePrompt("You call the police, who do you arrest, if anyone?");
    const guilty = guiltyRaw.toLowerCase().trim();
    if (!list_sus.includes(guilty)) {
        alert("Sorry, but you don't know that person. You go back to the lobby.");
        hotel_lobby();
        return;
    } else {
        if (guilty === 'dog') {
        ending = 'The Best End';
        dead("Even though the killer got away, you made a friend along the way. You found dog. <3");
        return;
        } else if (guilty === killer) {
        if (evidence >= 2) {
            ending = 'Private-I Malik Ending';
            dead("The arrest was made, they were found guilty. Good job!");
            return;
        } else {
            ending = 'Bad Ending (1/2)';
            dead("The arrest was made, but they were found not guilty for lack of evidence.");
            return;
        }
        } else if (guilty !== killer) {
        ending = 'Bad Ending (2/2)';
        dead("The arrest was made, but they were found not guilty, sorry but the killer got away.");
        return;
        }
    }
    }
}

function bar() {
    alert("It's a small bar, with a small selection of local breweries and snacks. There are a few other customers, you sit down at the bar.");
    alert("Behind you is the lobby.");
    if (!check_stuff('barcon')) {
    alert("One of the customers looks at you strangely, 'I thought you knew who the killer was? Go back and find some evidence.'");
    hotel_lobby();
    return;
    }
    if (check_stuff('barcon')) {
    alert("The bartender walks towards you and asks what you want. Do you order a drink, ask her for information, or leave?");
    if (bartender) {
        alert("You notice that part of her grey jacket is ripped off.");
        if (!list_sus.includes('bartender')) list_sus.push('bartender');
    }
    const choiceRaw = safePrompt("");
    const choice = choiceRaw.toLowerCase();
    if (choice.includes("order") || choice.includes("drink")) {
        alert("'What drink do you want?' She asks.");
        const drink = safePrompt("");
        alert(`She sets down your ${drink} and you pay her for it.`);
        if (!bartender) {
        bargood();
        return;
        } else {
        barbad();
        return;
        }
    } else if (choice.includes("ask") || choice.includes("information") || choice.includes("talk")) {
        alert("You tell her what you're here to do.");
        if (!bartender) {
        alert("She tells you that she doesn't know anything because she wasn't working that day. But suggests that one of her customers might, she gives you a drink on the house and wishes you luck.");
        bargood();
        return;
        } else {
        alert("She shrugs, 'I just work down here, I don't know what goes on anywhere else in the hotel.' She gets a drink from the underneath the counter. 'I have to get back to work, but this one's on me,' She smiles and goes to another customer.");
        barbad();
        return;
        }
    } else if (choice.includes("leave") || choice.includes("lobby")) {
        introvert_check();
        alert("You head back to the lobby.");
        hotel_lobby();
        return;
    } else {
        alert("Sorry that's not an action you can take.");
        bar();
        return;
    }
    }
}

function bargood() {
    alert("While drinking, one of the other customers moves from the other end of the bar to sit on the stool next to you.");
    alert("'Haven't seen you around here before,' he observes, 'What are you doing here stranger?'");
    const choiceRaw = safePrompt("Do you talk to them?");
    const choice = choiceRaw.toLowerCase().trim();
    if (choice === 'no') {
    introvert_check();
    alert("'Sorry, but I'm just here for a drink,' you say. You continue drinking and he leaves.");
    alert("After you finish your drink, you're about to head back to the lobby when you notice a piece of paper where he was sitting. He left you his contact info.");
    if (!list_sus.includes('customer')) list_sus.push('customer');
    hotel_lobby();
    return;
    } else if (choice === 'yes') {
    alert("You tell them what you're doing here, they listen carefully to what you are saying.");
    if (car_dude) {
        alert("'Well the guy outside in that old Yugo has been there since she checked in, would've thought he would leave by now though...' He tells you.");
        alert("'Car dude' added to list of suspects.");
        alert("'Witness statement' added to evidence.");
        inventory['witness statement'] = true;
        if (!list_sus.includes('car dude')) list_sus.push('car dude');
    }
    if (hotel_clerk) {
        alert("'I know the front desk clerk works almost everyday, but she said she was sick even though her car was in the parking lot,' he observes.");
        alert("'Hotel clerk' added to list of suspects.");
        alert("'Witness statement' added to evidence.");
        inventory['witness statement'] = true;
        if (!list_sus.includes('hotel clerk')) list_sus.push('hotel clerk');
    }
    alert("You thank him for telling you what he knows, you head back to the main lobby.");
    hotel_lobby();
    return;
    } else {
    alert("Sorry that's not an action you can take.");
    bargood();
    return;
    }
}

function barbad() {
    alert("As you drink, you start to feel a bit dizzy and ask the bartender if you can sit down somewhere else, she tells you can rest in the back and she goes with you to make sure you're okay.");
    alert("Once in the backroom, she sits you down on a crate.");
    alert("She locks the door and goes back over to you, pulling out a knife. Do you fight back or flee?");
    const choiceRaw = safePrompt("");
    const choice = choiceRaw.toLowerCase();
    if (choice.includes("flee")) {
    ending = 'Bartender Ending';
    dead("You try to run for the door but you can't get it unlocked, she stabs you and you die.");
    return;
    } else if (choice.includes("fight")) {
    alert("With all the strength you have left you charge at her, somehow you manage to knock her into one of the shelves, she is unconscious.");
    alert("You decide to leave her in her current state. After a few minutes you manage to get the door open, you head back to the lobby.");
    other_stuff['barcon'] = false;
    hotel_lobby();
    return;
    } else {
    alert("Sorry but that's not an action you can take.");
    return;
    }
}

function front_desk() {
    alert("The clerk greets you and asks if you want a room for the night, you introduce yourself, talking to her to see if she knows anything might be a good idea or getting the victim's room key.");
    if (hotel_clerk) {
    alert("As you approach her, you notice she smells a bit like bleach, and her scarf is ripped.");
    alert("'Hotel clerk' added to list of suspects.");
    if (!list_sus.includes('hotel clerk')) list_sus.push('hotel clerk');
    }
    const choiceRaw = safePrompt("What do you do?");
    const choice = choiceRaw.toLowerCase();
    if (choice.includes("key")) {
    if (!check_invent('key')) {
        inventory['key'] = true;
        alert("The clerk gives you the key for room 13 (how cliche), you can go to the room now. You return to the lobby.");
        hotel_lobby();
        return;
    } else {
        alert("You already have the key to the room.");
        front_desk();
        return;
    }
    } else if (choice.includes("talk") || choice.includes("ask")) {
    other_stuff['clerk_talk'] = true;
    alert("You ask her if she knows anything about the murder.");
    if (hotel_clerk) {
        alert("'I don't know much, but I can show you the room,' she says. You agree.");
        alert("You thank her and follow her to the room.");
        room();
        return;
    } else {
        alert("'Well I didn't clean the room or anything--with it being a crime scene and all...' She seems nervous, but maybe that's just nerves of being interrogated.");
        alert("You thank her and she tells you she'll do what she can to help. You go back to the lobby.");
        alert("'Hotel clerk' added to list of suspects.");
        if (!list_sus.includes('hotel clerk')) list_sus.push('hotel clerk');
        hotel_lobby();
        return;
    }
    } else if (choice.includes("leave")) {
    introvert_check();
    alert("You leave and go back to the lobby.");
    alert("'Hotel clerk' added to list of suspects.");
    if (!list_sus.includes('hotel clerk')) list_sus.push('hotel clerk');
    hotel_lobby();
    return;
    } else {
    alert("Sorry, that's not an action you can take.");
    front_desk();
    return;
    }
}

function room() {
    alert("It's a standard hotel room, aside from the fact someone was murdered.");
    if (car_dude) {
    alert("There are claw marks on the wall, it's as if this was an animal attack.");
    alert("The body was found on the bed, her heart is missing, apparent signs of struggle--whatever it was, it caught her off guard.");
    inventory['claw marks'] = true;
    alert("'Claw marks' added to evidence.");
    } else if (bartender) {
    alert("Even though she was stabbed from behind, it looks like she didn't know her killer was in the room--or possibly she had no reason to be alarmed.");
    alert("There are no signs of struggle, the body was found at the desk; next to her is a bottle of some sort of drink, you smell it and realize it was drugged.");
    inventory['drugs'] = true;
    alert("'Drugs' added to evidence.");
    } else if (hotel_clerk) {
    alert("The body was no where to be found, the room was eerily clean--not a speck of blood or anything; however the room did smell a lot like bleach.");
    alert("Clearly the body was taken else where, the question is how they could've done it");
    inventory['bleach'] = true;
    alert("'Bleach' added to evidence.");
    if (check_stuff('clerk_talk')) {
        room_bad();
        return;
    }
    }

    const choiceRaw = safePrompt("Now that you've examined the room, would you like to go back to the lobby? (yes/no)");
    const choice = choiceRaw.toLowerCase();
    if (choice === 'yes') {
    alert("You go back to the lobby, to investigate more.");
    hotel_lobby();
    return;
    } else if (choice === 'no') {
    alert("You stay in the room.");
    room();
    return;
    } else {
    alert("Sorry, that's not an action you can take.");
    room();
    return;
    }
}

function room_bad() {
    alert("The hotel clerk turns to you, 'almost no trace of the murder, right?' she tells you, 'it was difficult planning it, that's for sure.'");
    alert("'It doesn't matter if you run or try to fight me, I'll kill you either way.' She smiles at you.");
    alert("Do you try to run or attempt to defend yourself?");
    const choiceRaw = safePrompt("");
    const choice = choiceRaw.toLowerCase();
    const escape = Math.floor(Math.random() * 2) + 1;
    if (choice === 'run') {
    if (escape === 1) {
        ending = 'Clerk Ending (1/2)';
        dead("You pointlessly try to run, but before you can run, she kills you and your body was never found.");
        return;
    } else {
        other_stuff['clerk_here'] = false;
        alert("You somehow manage to escape the room, locking the door behind you. You run back to the lobby.");
        hotel_lobby();
        return;
    }
    } else if (choice === 'defend') {
    ending = 'Clerk Ending (2/2)';
    alert("You manage to push her off of you, she falls back hitting her head on the desk. When you approach her, you realize she doesn't have a pulse.");
    dead("After a thorough investigation, you are found guilty of manslaughter, you get fired and suffer for the rest of your life.");
    return;
    } else {
    alert("Sorry, that's not an action you can take.");
    room_bad();
    return;
    }
}

// ---------- Game start ----------
function startGame() {
    try {
    alert("You are outside a hotel, you are here to investigate the death of a guest here.");
    alert("You have a blank notebook, you can keep a list of suspects and evidence there.");
    alert("If you find who the killer is, call the police and they'll make the arrest. Remember, you need enough evidence to successfully arrest someone.");
    outside();
    } catch (e) {
    // Game over - do nothing else
    console.log("Game ended:", e && e.message);
    }
}

// Wire start button
document.getElementById('startBtn').addEventListener('click', startGame);