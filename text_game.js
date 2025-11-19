// text_game.py converted into JS
// (I hate chatgpt but I was not doing all this manually so if there's fuckups I'm blaming that)


const out = document.getElementById("output");
const input = document.getElementById("input");

function print(msg = "") {
    out.innerHTML += msg + "\n";
    out.scrollTop = out.scrollHeight;
}

function clearOutput() {
    out.innerHTML = "";
}

// Input handler
let currentHandler = null;
input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        let val = input.value.trim();
        input.value = "";
        if (currentHandler) currentHandler(val);
    }
});

function ask(cb) {
    currentHandler = cb;
}

//-----------------------------------------------------------
// GAME STATE
//-----------------------------------------------------------

let list_sus = [];
let inventory = {
    "key": false,
    "grey fabric": false,
    "claw marks": false,
    "witness statement": false,
    "drugs": false,
    "body": false,
    "bleach": false
};

let other_stuff = {
    car_here: true,
    barcon: true,
    clerk_talk: false,
    clerk_kill: false,
    car_name: false,
    dog_here: true,
    clerk_here: true,
    cleaner: false
};

let ending = "";
let pat = 0;
let introvert = 0;
let evidence = 0;

let bartender = false;
let car_dude = false;
let hotel_clerk = false;

// random killer assignment (1..3)
let x = Math.floor(Math.random() * 3) + 1;
if (x === 1) bartender = true;
if (x === 2) car_dude = true;
if (x === 3) hotel_clerk = true;

let killer = bartender ? "bartender" : car_dude ? "car dude" : "hotel clerk";

//-----------------------------------------------------------
// Utilities
//-----------------------------------------------------------

function dead(why) {
    print("\n" + why + " You got the " + ending + ".");
    ask(() => {}); // disable further input
}

function introvert_check() {
    introvert++;
    if (introvert > 7) {
        ending = "Socially Anxious Detective Ending";
        dead("You were too afraid to talk to any of the humans, you were unable to collect enough evidence. Your indecisiveness allowed the killer to get away.");
    }
}

function check_stuff(item) { return other_stuff[item]; }
function check_invent(item) { return inventory[item]; }

// helper to add suspect safely (mirrors Python behavior which appends even if duplicates)
function add_sus(s) {
    list_sus.push(s);
}

//-----------------------------------------------------------
// GAME SCENES (converted from functions)
//-----------------------------------------------------------

function main() {
    clearOutput();
    print("You are outside a hotel, you are here to investigate the death of a guest here.");
    print("You have a blank notebook, you can keep a list of suspects and evidence there.");
    print("If you find who the killer is, call the police and they'll make the arrest. Remember, you need enough evidence to successfully arrest someone.");
    outside();
}

function outside() {
    print("\nBehind you is the door to the lobby.");
    if (check_stuff('dog_here') === true) print("There is also a dog sitting outside the hotel (it clearly wants pats).");
    if (check_stuff('car_here') === true) print("In front of you in the parking lot is a car with someone in it.");
    print("Where do you want to go?");
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice.includes("car") || choice.includes("front") || choice.includes("parking")) {
            if (check_stuff('car_here') === true) {
                print("You go over to the car.");
                return car();
            } else {
                print("There is no car you can go to.");
                return outside();
            }
        } else if (choice.includes("hotel") || choice.includes("lobby") || choice.includes("back")) {
            if (list_sus.includes('dog') && check_stuff('dog_here') === true) {
                print("There is a sign saying 'NO DOGS ALLOWED' in bright bold letters. You decide to obey the rule and leave the dog outside.");
            }
            print("You head inside to the hotel.");
            return hotel_lobby();
        } else if (choice.includes("dog") || choice.includes("pat")) {
            print("You pat the dog. Cute.");
            pat += 1;
            return pats();
        } else {
            print("Sorry but that's not a place you can go.");
            return outside();
        }
    });
}

function pats() {
    if (pat === 5) {
        print("The dog likes you a lot, you have acquired dog.");
        add_sus('dog');
        return outside();
    }
    print("It wants more pats. Will you give more pats?");
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice === "yes" || choice.includes("pat")) {
            print("You pat the dog. Cute.");
            pat += 1;
            return pats();
        }
        if (choice === "no") {
            print("The dog looks sad, but stays there.");
            return outside();
        }
        print("That's not an action you can take.");
        return pats();
    });
}

function car() {
    if (check_stuff('car_name') === false) {
        print("The car seems to be old, at least from the 80's, it's pretty run down and not in the best shape.");
        print("As you walk closer, you notice someone sitting in the driver's seat, they might know something.");
        print("Do you leave or talk to them?");
        ask((choice) => {
            choice = (choice || "").toLowerCase();
            if (choice.includes("talk")) {
                print("You tap on their car window");
                return woods();
            }
            if (choice.includes("leave")) {
                introvert_check();
                print("You head back to the hotel entrance");
                return outside();
            }
            print("Sorry but that's not an action you can take.");
            return car();
        });
    } else {
        print("You walk up to him and he rolls down the window, 'I don't have anymore information to give to you, sorry.' You head back to the entrance.");
        return outside();
    }
}

function woods() {
    print("You tell him who you are and what you're doing, he seems eager to help and claims to know something that might help you solve your case.");
    print("Do you go with him?");
    ask((choice) => {
        choice = (choice || "").toLowerCase().trim();
        if (choice === "yes") {
            print("You get in his car and drive until you're on a secluded gravelled road surrounded by trees. He stops the car and gets out and you follow them.");
            if (car_dude === true) return woodsbad();
            if (car_dude === false) {
                print("'I come out here often, since I don't live far from here,' he explains, 'it was the other day, when I found this.' He walks over to one of the trees and grabs something.");
                print("It is a piece of grey fabric stained with blood, you take it as possible evidence.");
                print("'Car dude' added to suspect list.\n'Grey fabric' added to inventory.");
                add_sus('car dude');
                inventory['grey fabric'] = true;
                if (hotel_clerk === true) {
                    print("You both examine the area around you, there's an awful stench coming from the undergrowth.");
                    print("You see a hand sticking out of the dirt.");
                    print("'Body' added to evidence.");
                    inventory['body'] = true;
                    print("Both of you decide to go back to the hotel for you to investigate more.");
                    return outside();
                } else {
                    print("You thank him for his contribution and you both head back to the hotel so you can continue your investigation.");
                    other_stuff['car_name'] = true;
                    return outside();
                }
            }
        } else if (choice === "no") {
            introvert_check();
            print("You decline their offer and head back to the entrance; he doesn't seem offended and tell you he'll be there if you change your mind.");
            print("'car dude' added to suspect list.");
            add_sus("car dude");
            print("You head back to the hotel entrance");
            return outside();
        } else {
            print("Sorry but that's not an action you can take.");
            return woods();
        }
    });
}

function woodsbad() {
    add_sus('car dude');
    print("'You know you shouldn't be looking into things like this, stay out of things that you don't know anything about,' he turns around to look at you, it almost seems like he's growling.");
    print("It seems like he has unusually sharp nails (and a tail...?), before you realize what's happening, he transforms into a wolf-like creature.");
    print("He charges at you, do you defend yourself or flee?");
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice.includes("flee")) {
            print("You run away as fast as you can, he doesn't run after you, it appears he's injured. You make it back to the main road, you see the sign to the hotel and decide that's probably the best place to go.");
            other_stuff['car_here'] = false;
            return outside();
        } else if (choice.includes("defend") || choice.includes("fight")) {
            if (list_sus.includes('dog')) {
                print("Your loyal furry companion attacks the werewolf, you watch as he tries to fight back; unfortunetly the dog loses. Luckily because of the dog's sacrifice you manage to get away back to the hotel.");
                other_stuff['car_here'] = false;
                other_stuff['dog_here'] = false;
                // remove one 'dog' entry if exists
                let idx = list_sus.indexOf('dog');
                if (idx !== -1) list_sus.splice(idx, 1);
                return outside();
            } else {
                ending = 'Supernatural Ending';
                return dead("You tried to defend yourself, but before you could do anything he slashes you to pieces, you bleed out and die.");
            }
        } else {
            print("Sorry but that's not an action you can take.");
            return woodsbad();
        }
    });
}

function hotel_lobby() {
    print("\nThe lobby is fairly plain. To the left there's the front desk, to the right is a small bar, in front of you is a telephone.");
    print("Behind you is the door to outside.");
    if (check_invent('key') === true) print("Down the hall is the room.");
    print("Where do you go?");
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice.includes("hall") || choice.includes("room")) {
            if (check_invent('key') === false) {
                print("Sorry, but you don't have a room key yet.");
                return hotel_lobby();
            } else {
                return room();
            }
        } else if (choice.includes("right") || choice.includes("bar")) {
            return bar();
        } else if (choice.includes("left") || choice.includes("desk")) {
            if (check_stuff('clerk_here') === true) return front_desk();
            if (check_stuff('clerk_here') === false) {
                print("There is no one at the desk, perhaps another time.");
                return hotel_lobby();
            }
        } else if (choice.includes("front") || choice.includes("phone")) {
            return telephone();
        } else if (choice.includes("back") || choice.includes("outside")) {
            return outside();
        } else {
            print("sorry that's not a place you can go.");
            return hotel_lobby();
        }
    });
}

function telephone() {
    // count inventory trues as evidence
    evidence = 0;
    for (let k in inventory) {
        if (inventory[k] === true) evidence++;
    }
    if (list_sus.length === 0) {
        print("You have no suspects, go find some evidence!");
        return hotel_lobby();
    } else {
        // show unique suspects like Python's set(list_sus)
        const unique = Array.from(new Set(list_sus));
        print("the people you have suspect are " + unique.join(", "));
        print("You call the police, who do you arrest, if anyone?");
        ask((guilty) => {
            guilty = (guilty || "").toLowerCase().trim();
            if (!list_sus.includes(guilty)) {
                print("Sorry, but you don't know that person. You go back to the lobby.");
                return hotel_lobby();
            } else {
                if (guilty === 'dog') {
                    ending = 'The Best End';
                    return dead("Even though the killer got away, you made a friend along the way. You found dog. <3");
                } else if (guilty === killer) {
                    if (evidence >= 2) {
                        ending = 'Private-I Malik Ending';
                        return dead("The arrest was made, they were found guilty. Good job!");
                    }
                    if (evidence < 2) {
                        ending = 'Bad Ending (1/2)';
                        return dead("The arrest was made, but they were found not guilty for lack of evidence.");
                    }
                } else if (guilty !== killer) {
                    ending = 'Bad Ending (2/2)';
                    return dead("The arrest was made, but they were found not guilty, sorry but the killer got away.");
                }
            }
        });
    }
}

function bar() {
    print("\nIt's a small bar, with a small selection of local breweries and snacks. There are a few other customers, you sit down at the bar.");
    print("Behind you is the lobby.");
    if (check_stuff('barcon') === false) {
        print("One of the customers looks at you strangely, 'I thought you knew who the killer was? Go back and find some evidence.'");
        return hotel_lobby();
    }
    print("The bartender walks towards you and asks what you want. Do you order a drink, ask her for information, or leave?");
    if (bartender === true) {
        print("You notice that part of her grey jacket is ripped off.");
        print("'Bartender' added to list of suspects.");
        add_sus('bartender');
    }
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice.includes("order") || choice.includes("drink")) {
            print("'What drink do you want?' She asks.");
            ask((drink) => {
                drink = drink || "";
                print("She sets down your " + drink + " and you pay her for it.");
                if (bartender === false) return bargood();
                if (bartender === true) return barbad();
            });
        } else if (choice.includes("ask") || choice.includes("information") || choice.includes("talk")) {
            print("You tell her what you're here to do.");
            if (bartender === false) {
                print("She tells you that she doesn't know anything because she wasn't working that day. But suggests that one of her customers might, she gives you a drink on the house and wishes you luck.");
                return bargood();
            }
            if (bartender === true) {
                print("She shrugs, 'I just work down here, I don't know what goes on anywhere else in the hotel.' She gets a drink from the underneath the counter. 'I have to get back to work, but this one's on me,' She smiles and goes to another customer.");
                return barbad();
            }
        } else if (choice.includes("leave") || choice.includes("lobby")) {
            introvert_check();
            print("You head back to the lobby.");
            return hotel_lobby();
        } else {
            print("Sorry that's not an action you can take.");
            return bar();
        }
    });
}

function bargood() {
    print("\nWhile drinking, one of the other customers moves from the other end of the bar to sit on the stool next to you.");
    print("'Haven't seen you around here before,' he observes, 'What are you doing here stranger?'");
    print("Do you talk to them?");
    ask((choice) => {
        choice = (choice || "").toLowerCase().trim();
        if (choice === 'no') {
            introvert_check();
            print("'Sorry, but I'm just here for a drink,' you say. You continue drinking and he leaves.");
            print("After you finish your drink, you're about to head back to the lobby when you notice a piece of paper where he was sitting. He left you his contact info.");
            print("'Customer' added to list of suspects.");
            add_sus('customer');
            return hotel_lobby();
        }
        if (choice === 'yes') {
            print("You tell them what you're doing here, they listen carefully to what you are saying.");
            if (car_dude === true) {
                print("'Well the guy outside in that old Yugo has been there since she checked in, would've thought he would leave by now though...' He tells you.");
                print("'Car dude' added to list of suspects.");
                print("'Witness statement' added to evidence.");
                inventory['witness statement'] = true;
                add_sus('car dude');
            }
            if (hotel_clerk === true) {
                print("'I know the front desk clerk works almost everyday, but she said she was sick even though her car was in the parking lot,' he observes.");
                print("'Hotel clerk' added to list of suspects.");
                print("'Witness statement' added to evidence.");
                inventory['witness statement'] = true;
                add_sus('hotel clerk');
            }
            print("You thank him for telling you what he knows, you head back to the main lobby.");
            return hotel_lobby();
        }
        print("Sorry that's not an action you can take.");
        return bargood();
    });
}

function barbad() {
    print("\nAs you drink, you start to feel a bit dizzy and ask the bartender if you can sit down somewhere else, she tells you can rest in the back and she goes with you to make sure you're okay.");
    print("Once in the backroom, she sits you down on a crate.");
    print("She locks the door and goes back over to you, pulling out a knife. Do you fight back or flee?");
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice.includes("flee")) {
            ending = 'Bartender Ending';
            return dead("You try to run for the door but you can't get it unlocked, she stabs you and you die.");
        }
        if (choice.includes("fight") || choice.includes("defend")) {
            print("With all the strength you have left you charge at her, somehow you manage to knock her into one of the shelves, she is unconscious.");
            print("You decide to leave her in her current state. After a few minutes you manage to get the door open, you head back to the lobby.");
            other_stuff['barcon'] = false;
            return hotel_lobby();
        }
        print("Sorry but that's not an action you can take.");
        return barbad();
    });
}

function front_desk() {
    print("\nThe clerk greets you and asks if you want a room for the night, you introduce yourself, talking to her to see if she knows anything might be a good idea or getting the victim's room key.");
    if (hotel_clerk === true) {
        print("As you approach her, you notice she smells a bit like bleach, and her scarf is ripped.");
        print("'Hotel clerk' added to list of suspects.");
        add_sus('hotel clerk');
    }
    print("What do you do?");
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice.includes("key")) {
            if (check_invent('key') === false) {
                inventory['key'] = true;
                print("The clerk gives you the key for room 13 (how cliche), you can go to the room now. You return to the lobby.");
                return hotel_lobby();
            } else {
                print("You already have the key to the room.");
                return front_desk();
            }
        }
        if (choice.includes("talk") || choice.includes("ask")) {
            other_stuff['clerk_talk'] = true;
            print("You ask her if she knows anything about the murder.");
            if (hotel_clerk === true) {
                print("'I don't know much, but I can show you the room,' she says. You agree.");
                print("You thank her and follow her to the room.");
                return room();
            }
            if (hotel_clerk === false) {
                print("'Well I didn't clean the room or anything--with it being a crime scene and all...' She seems nervous, but maybe that's just nerves of being interrogated.");
                print("You thank her and she tells you she'll do what she can to help. You go back to the lobby.");
                print("'Hotel clerk' added to list of suspects.");
                add_sus('hotel clerk');
                return hotel_lobby();
            }
        }
        if (choice.includes("leave")) {
            introvert_check();
            print("You leave and go back to the lobby.");
            print("'Hotel clerk' added to list of suspects.");
            add_sus('hotel clerk');
            return hotel_lobby();
        }
        print("Sorry, that's not an action you can take.");
        return front_desk();
    });
}

function room() {
    print("\nIt's a standard hotel room, aside from the fact someone was murdered.");
    if (car_dude === true) {
        print("There are claw marks on the wall, it's as if this was an animal attack.");
        print("The body was found on the bed, her heart is missing, apparent signs of struggle--whatever it was, it caught her off guard.");
        inventory['claw marks'] = true;
        print("'Claw marks' added to evidence.");
    } else if (bartender === true) {
        print("Even though she was stabbed from behind, it looks like she didn't know her killer was in the room--or possibly she had no reason to be alarmed.");
        print("There are no signs of struggle, the body was found at the desk; next to her is a bottle of some sort of drink, you smell it and realize it was drugged.");
        inventory['drugs'] = true;
        print("'Drugs' added to evidence.");
    } else if (hotel_clerk === true) {
        print("The body was no where to be found, the room was eerily clean--not a speck of blood or anything; however the room did smell a lot like bleach.");
        print("Clearly the body was taken else where, the question is how they could've done it");
        inventory['bleach'] = true;
        print("'Bleach' added to evidence.");
        if (check_stuff('clerk_talk') === true) {
            return room_bad();
        }
    }
    print("Now that you've examined the room, would you like to go back to the lobby?");
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice === 'yes') {
            print("You go back to the lobby, to investigate more.");
            return hotel_lobby();
        } else if (choice === 'no') {
            print("You stay in the room.");
            return room();
        } else {
            print("Sorry, that's not an action you can take.");
            return room();
        }
    });
}

function room_bad() {
    print("\nThe hotel clerk turns to you, 'almost no trace of the murder, right?' she tells you, 'it was difficult planning it, that's for sure.'");
    print("'It doesn't matter if you run or try to fight me, I'll kill you either way.' She smiles at you.");
    print("Do you try to run or attempt to defend yourself?");
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        let escape = Math.floor(Math.random() * 2) + 1; // 1 or 2
        if (choice === 'run') {
            if (escape === 1) {
                ending = 'Clerk Ending (1/2)';
                return dead("You pointlessly try to run, but before you can run, she kills you and your body was never found.");
            }
            if (escape === 2) {
                other_stuff['clerk_here'] = false;
                print("You somehow manage to escape the room, locking the door behind you. You run back to the lobby.");
                return hotel_lobby();
            }
        }
        if (choice === 'defend') {
            ending = 'Clerk Ending (2/2)';
            print("You manage to push her off of you, she falls back hitting her head on the desk. When you approach her, you realize she doesn't have a pulse.");
            return dead("After a thorough investigation, you are found guilty of manslaughter, you get fired and suffer for the rest of your life.");
        }
        print("Sorry, that's not an action you can take.");
        return room_bad();
    });
}

//-----------------------------------------------------------
// Start game
//-----------------------------------------------------------

main();
