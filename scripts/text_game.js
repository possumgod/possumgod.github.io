//-----------------------------------------------------------
// GAME STATE
//-----------------------------------------------------------

// random killer assignment
let x = Math.floor(Math.random() * 3);
const bartenderK = (x === 0) ? true : false;
const driverK = (x === 1) ? true : false;
const clerkK = (x === 2) ? true : false;

let suspects = new Array();
let evidence = {
    fabric: false,
    clawMarks: false,
    witnessStatement: false,
    drugs: false,
    body: false,
    bleach: false
};

let storyChecks = {
    carHere: true,
    barcon: true,
    clerkTalk: false,
    clerkKill: false,
    carName: false,
    dogHere: true,
    clerkHere: true,
    haveKey: false,
    clerkRun: false,
    hadDrink: false
};


let ending = "";
let pat = 0;
let introvert = 0;
let evidenceCnt = 0;
let killer = bartenderK ? "bartender" : driverK ? "driver" : "hotel clerk";


//-----------------------------------------------------------
// I/O SETUP
//-----------------------------------------------------------

const out = document.getElementById("output");
const input = document.getElementById("input");

const textTypes = {
    "story": "rgb(247, 242, 255)",
    "input": "rgb(207, 228, 215)",
    "dead": "rgb(209, 131, 142)",
    "evidence": "rgb(124, 206, 154)",
    "suspect": "rgb(164, 140, 195)",
    "action": "rgb(253, 235, 207)"
};

// msgArray = [[text, type], ...]
function print(msgArray) {
    for (let i = 0; i < msgArray.length; i++) {
        let span = document.createElement("span");
        span.textContent = msgArray[i][0];
        span.style.color = textTypes[msgArray[i][1]];
        out.appendChild(span);
    }

    out.appendChild(document.createElement("br"));
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
        
        if (val !== "") {
            print(new Array(["> " + val, "input"])); 
            
            input.value = "";
            if (currentHandler) { currentHandler(val) };
        }
    }
});

function ask(cb) {
    currentHandler = cb;
}

function sceneChoiceEval(sceneData, sceneText, currentScene) {
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        for (let key in sceneData.choices) { 
            if (choice.includes(key)) {
                let nextScene = sceneData.choices[key];
                if (typeof nextScene === "function") {
                    nextScene = nextScene();
                }
                return runScene(nextScene);
            }
        }
        print([["Sorry but that's not a place you can go.", "story"]]);
        return sceneChoiceEval(sceneData, sceneText, currentScene);
    });
}

function sceneDataEval(sceneData, currText, currentScene) {
    let sceneText = currText;
    for (let key in sceneData.checks) {
        if (sceneData.checks[key][0]) {
            sceneText.push(...sceneData.checks[key][1]);
        }
        else {
            sceneText.push(...sceneData.checks[key][2]);
        }
    }
    return sceneText;
}

function runScene(sceneKey) {
    const sceneData = scenes[sceneKey];
    const sceneText = [...sceneData.text];
    print(sceneDataEval(sceneData, sceneText, sceneKey));
    sceneChoiceEval(sceneData, sceneText, sceneKey);
}

//-----------------------------------------------------------
// GAME SCENE DATA
//-----------------------------------------------------------

const scenes = {
    intro: {
        text: [
            ["You are outside of a motel, you are here to investigate the death of a guest who was staying here. You have a blank notebook to keep a list of ", "story"],
            ["suspects ", "suspect"],
            ["and ", "story"],
            ["evidence", "evidence"],
            [". In order to make a successful arrest, you must ", "story"],
            ["call in ", "action"],
            ["with at least two pieces of evidence. Good luck.", "story"]
        ]
    },
    outside: {
        text: [
            ["Behind you is the door to the ", "story"],
            ["lobby. ", "action"]
        ],
        choices: {
            "car": "car",
            "parking": "car",
            "lobby": "lobby",
            "door": "lobby",
            "dog": "pats"
        },
        checks: {
            carHere: [storyChecks["carHere"], 
                [
                    ["You notice a ", "story"],
                    ["car in the parking lot, ", "action"],
                    ["a dark silhouette in the driver's seat. ", "story"]
                ],
                []
            ],
            dogHere: [storyChecks["dogHere"], 
                [
                    ["There is a ", "story"],
                    ["dog ", "action"],
                    ["sitting until the awning of the motel, it wags its tail excitedly when you make eye contact. ", "story"],
                ],
                []
            ],
            extra: [true,
                [
                    ["Where would you like to go? ", "story"]
                ]
            ]
        }
    },
    pats: {
        text: [],
        choices: {
            "yes": "pats",
            "no": "outside"
        },
        checks: {
            noPrevPats: [pat === 0,
                [
                    ["You walk over to the dog, it looks up at you happily. ", "story"],
                    ["Do you pet the dog? ", "action"]
                ],
                []
            ],
            prevPats: [pat > 0 && pat < 5,
                [
                    ["It looks up at you expectedly, it wants more pats. ", "story"],
                    ["Will you give more pats? ", "action"]
                ],
                []
            ],
            manyPats: [pat >= 5,
                [
                    ["The dog likes you a lot! You have acquired dog. ", "story"],
                    ["Do you continue to pet your new companion? ", "action"]
                ],
                []
            ],
            
        }
    },
    car: {
        text: [],
        choices: {
            "ask": "woods",
            "leave": "outside"
        },
        checks: {
            carName: [checkStory('carName'),
                [
                    ["You walk up to him and he rolls down the window, ''I don't have anymore information to give to you, sorry.'' You head back to the entrance.", "story"]
                ],
                [
                    ["You walk toward the car, you can tell it's old -- maybe from the 80s -- and you knock on the window. The shadow inside shuffles, and the window rolls down an inch. 'Can I help you?' Do you ", "story"],
                    ["ask him for information ", "action"],
                    ["or ", "story"],
                    ["leave?", "action"]
                ]
            ]
        }
    },
    woods: {
        text: [
            ["You walk over to the car and lightly tap on the window, ", "story"],
            ["the driver ", "suspect"],
            ["seems startled, he cracks his window down an inch. ", "story"],
            ["You flash your badge, explaining you're here to investigate a recent murder. He claims to have information that would help your case. ", "story"],
            ["He opens the passenger door, you get in. He turns out of the motel parking lot until you're on a secluded gravel road. The setting sun barely reaches through all the trees. ", "story"],
            ["You both get out of the car, he walks away from you; you're almost startled when he starts to speak,", "story"]
        ],
        choices: {
            "flee": "car",
            "defend": "pats",
            "walk": "outside",
            "ride": "outside"
        },
        checks: {
            driver: [driverK,
                [
                    ["''you know,'' he pauses. ''You really shouldn't be looking into things like this. Don't take it personally, but we have to protect ourselves out here.'' ", "story"],
                    ["He turns around to look at you, if you didn't know any better you'd think he was growling. Before you can even consider asking him to elaborate, he collapses to the ground. ", "story"],
                    ["Writhing on the ground, his body seems to be contorting against his will. Thick fur sprouts from his back, and his joints pop into a larger frame. After a minute, he stands up and looks at you, and you're not so sure he's...human anymore. ", "story"],
                    ["Now a wolf-like creature, it's only a second before he charges at you. Do you ", "story"],
                    ["defend yourself ", "action"],
                    ["or ", "story"],
                    ["flee? ", "action"]
                ],
                [
                    ["''I drive by here often. You see, I live close by.'' He explains, ''the other day, when I was driving home from work, I noticed this.'' ", "story"],
                    ["He walks over to a tree by the edge of the pavement and at first, you don't notice it, but there's a ", "story"],
                    ["a piece of gray fabric. ", "evidence"],
                    ["Upon closer examination, it's stained with blood. ", "story"]
                ]
            ],
            clerk: [clerkK,
                [
                    ["Before you properly bag the evidence, you're hit with a sudden stench. You've smelled plenty of roadkill, but this is far worse. ", "story"],
                    ["You make your way into the woods neighboring the road before tripping on a hand sticking out of the undergrowth, around it was a ring of fresh dirt. ", "story"],
                    ["Clearly, you just discovered ", "story"],
                    ["the body. ", "evidence"],
                    ["After a short examination, you both decide it would be best to return to the motel to continue your investigation. Do you ", "story"],
                    ["ride back ", "action"],
                    ["with him or ", "story"],
                    ["walk?", "action"]
                ],
                []
            ],
            bartender: [bartenderK,
                [
                    ["After a short examination, you both decide it would be best to return to the motel to continue your investigation. Do you ", "story"],
                    ["ride back ", "action"],
                    ["with him or ", "story"],
                    ["walk?", "action"]
                ],
                []
            ]
            
        }
    },
    lobby: {
        text: [
            ["The lobby is fairly plain, trapped in an older era. To your left is the ", "story"],
            ["front desk ", "action"],
            ["and there's a ", "story"],
            ["small bar ", "action"],
            ["to your right. By the ", "story"],
            ["door outside ", "action"],
            ["there's a ", "story"],
            ["public telephone. ", "action"]
        ],
        choices: {
            "room": "room",
            "bar": "bar",
            "desk": "desk",
            "outside": "outside",
            "door": "outside",
            "phone": "telephone"
        },
        checks: {
            key: [checkStory('haveKey'),
                [
                    ["In front of you is the hallway to the victim's ", "story"],
                    ["room. ", "action"]
                ],
                []
            ],
            extra: [true,
                [
                ["Where would you like to go? ", "story"]
                ]
            ]
        }
    },
    desk: {
        text: [
            ["You walk up to a wooden reception-type desk, stains litter the wood. ", "story"],
            ["The clerk ", "suspect"],
            ["is busying herself with paperwork and key returns, she greets you warmly while bustling about. ", "story"],
            ["She asks if you'd like to book a room for the night. ", "story"],
            ["You introduce yourself, pulling a photo of the victim out of your case file, and her demeanor changes. ", "story"],
            ["Moving up to the desk in front of you, she stills with a worried expression rests on her face. ''Why, that's just horrible. I remember servicing them, yes, single room -- room 13.'' ", "story"],
            ["She pulls the ", "story"], 
            ["key ", "action"],
            ["off the wall. Somewhere in the back of your mind you note the irony of such a thing. ", "story"]
        ],
        choices: {
            "key": "lobby", // add a check here that gets changed in same step EVAL BEFORE CHANGE
            "ask": () => (clerkK) ? "room" : "outside",
            "leave": "lobby"
        },
        checks: {
            clerk: [clerkK,
                [
                    ["However, your thoughts are interupted as the smell of ", "story"],
                    ["bleach ", "evidence"],
                    ["hits your senses like a truck. "],
                    ["You notice her monochrome clothes are pristine, ironed and pleated -- except for ", "story"],
                    ["a portion of her scarf, which is ripped. ", "evidence"]
                ],
                []
            ],
            extra: [true,
                [
                    ["''Well,'' she continues, ''if you want to ", "story"],
                    ["ask ", "action"],
                    ["me anything, I'm only a shout away.'' ", "story"],
                    ["What would you like to do? ", "story"]
                ],
                []
            ]
        }
    },
    bar: {
        text: [
            ["The bar is connected through a side building to the rest of the motel, you can tell this portion is where the majority of the revenue comes in. ", "story"],
            ["The abundance of beer logo signs and sporatic decor with little cohesion speaks to the small-town dive-bar atmosphere. ", "story"],
        ],
        choices: {
            "drink": "drink",
            "ask": () => (bartenderK) ? "drink" : "witness"
        },
        checks: {
            barFight: [!checkStory('barcon'),
                [
                    ["One of the customers gives you a weird look. ''I thought you knew who the killer was? Go and find some evidence.'' ", "story"],
                    ["Weird guy. ", "story"]
                    // go to lobby
                ],
                [
                    ["After a minute, you flag the bartender's attention and she makes her way over, expecting to take your order. ", "story"]
                ]
            ],
            bartender: [bartenderK && checkStory('barcon'),
                [
                    ["While her appearance is a bit rough, a ", "story"],
                    ["new rip off her grey jacket ", "evidence"],
                    ["grabs your attention. ", "story"]
                ],
                []
            ],
            extra: [true,
                [
                    ["You tell her your purpose here, she goes to take a shot as if to calm her nerves. It might be helpful to ", "story"],
                    ["ask ", "action"],
                    ["her what she knows, but she looks rattled enough that ", "story"],
                    ["ordering a drink ", "action"],
                    ["might be easier. ", "story"]
                ]
            ]
        }
    },
    drink: {
        text: [],
        choices: {
            "run": "deadB",
            "fight": "lobby", // add condition for barfight
            "approach": "witness",
            "keep": "lobby" // another one waaaaa
        },
        checks: {
            ordered: [checkStory('hadDrink'),
                [
                    ["''I'm sorry, but I don't know anything, I wasn't on shift then.'' She explains. As an apology, she offers you a drink on the house, but you tip her for the cost anyway. ", "story"]
                ],
                []
            ],
            bartender: [bartenderK,
                [
                    ["Although you drink it slower than usual -- trying to get your money's worth -- you start to feel unusually dizzy after a few minutes. ", "story"],
                    ["Concerned, the bartender asks if you want to sit somewhere private. You agree, but something feels off. ", "story"],
                    ["She leads you to the backroom, your blurry vision making it hard to tell where exactly you're going. Through your blurry vision, you happen to notice she locked in the door in a jittery state. ", "story"],
                    ["Before you ask her what she's doing that for, she pulls a hunting knife out of her back pocket. ''I'm sorry, it wasn't supposed to get this out of hand,'' she tells you. ", "story"],
                    ["''I promise, I didn't realize it was bought for someone else.'' ", "story"],
                    ["She keeps talking to you, but in your impaired and pacicked state, all you can think of is whether you should ", "story"],
                    ["run ", "action"],
                    ["or ", "story"],
                    ["fight.", "action"]
                ],
                [
                    ["Luckily, you don't have to wait long. Shortly after starting on your drink, another customer comes and joins you at the counter. Do you ", "story"],
                    ["approach him ", "action"],
                    ["or ", "story"],
                    ["keep to yourself? ", "action"]
                ]
            ]
        }
    },
    witness: {
        text: [
            [""]
        ]
    },
    room: {
        text: [
            ["You make your way down the hallway until you make it to room 13. Even without the details, ", "story"],
            ["you'd still be able to tell something happened here, as the door was sealed off with a seemingly unnecessary amount of police tape. ", "story"]
        ],
        choice: {
            "yes": "lobby",
            "no": "room",
            "run": "deadC",
            "defend": "deadC"
        },
        checks: {
            key: [checkStory('haveKey'),
                [
                    ["After a minute of struggling with the angle of the key, you manage to get the door unlocked. ", "story"],
                    ["You cross under the tape and step inside; it's a standard hotel room, aside from the fact someone was murdered. ", "story"]
                ],
                [
                    ["You stop in front of the door, and sure enough, it's locked. There must be an easier way to get inside than trying to bust the door down. Perhaps the room key? ", "story"]
                ]
            ],
            driver: [checkStory('haveKey') && driverK, 
                [
                    ["Upon further investigation, you notice the wallpaper you assumed was patterned was actually littered by ", "story"],
                    ["claw marks. ", "evidence"],
                    ["You check the case files, the officers on call reported the victim ", "story"],
                    ["body ", "evidence"]
                    ["was found on the bed, heart missing. ", "story"],
                    ["The autopsy and forensic team also confirmed signs of a struggle. Whatever it was, it easily overpowered them. ", "story"]
                ],
                []
            ],
            bartender: [checkStory('haveKey') && bartenderK,
                [
                    ["The case file states the victim was stabbed from behind, suggesting the killer's caught them off guard, or they had no reason to be alarmed. ", "story"],
                    ["The autopsy team confirmed there were no signs of struggle, as there were no additional wounds, ", "story"],
                    ["the body ", "evidence"],
                    ["was found at the desk, along with a laptop and a drink. ", "story"],
                    ["Further analysis at forensics confirms that the drink had traces of ", "story"],
                    ["Pentobarbital, a sedative ", "evidence"],
                    ["that she had no prescription record of. ", "story"]
                ],
                []
            ],
            clerk: [checkStory('haveKey') && clerkK,
                [
                    ["Although the whole body was yet to be found, the victim's left hand and a copy of the room key was mailed to the police station and they were presumed dead after an initial investigation. ", "story"],
                    ["When the police initially searched the scene, no concrete evidence could be found, the room was eerily clean; the only note in the file is ", "story"],
                    ["'a distinct smell of bleach'. ", "evidence"]
                    ["Clearly, the body was taken elsewhere, but the question is how the killer could've done it without being noticed. ", "story"]
                ],
                []
            ],
            clerkTalk: [checkStory('clerkTalk'),
                [
                    ["The clerk turns to you, ''almost no trace, right?'' Something about her tone sets you on edge. ''People make such a big deal out of forensic evidence, but it's remarkably simple to cover your tracks, really.'' ", "story"],
                    ["She smiles at you, ''it doesn't matter if you run or try to fight me, I'll end your life either way.'' Do you attempt to ", "story"],
                    ["run ", "action"],
                    ["or ", "story"],
                    ["defend yourself? ", "action"]
                ],
                []
            ]
        }
    },
    deadC: {
        text: [],
        choices: {},
        checks: {
            run: [checkStory('clerkRun'),
                [
                    ["You make an attempt to dash for the door, but just as your hand grabs the handle, you feel a metallic thunk on the back of your head and you feel your life slip away. ", "story"],
                    ["You made a good attempt, perhaps next time you'll have a better run. ", "story"]
                ],
                [
                    ["As she grabs at you, you manage to push her off of you. She falls back, hitting her head on the corner of the desk. Blood begins to pool on the carpet. ", "story"],
                    ["When you approach her, you realize she doesn't have a pulse. After a thorough investigation, you are found guilty of manslaughter and get sent to prison. ", "story"]
                ]
            ]
        }
    },
    deadB: {

    }
}

// todo: cookie to track ending progress
//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

function dead(why) {
    print(new Array([why + " You got the " + ending + ".", "dead"]));
    ask(() => {});
}

function introvertCheck() {
    introvert++;
    if (introvert > 7) {
        ending = "Socially Anxious Detective Ending";
        dead("You were too afraid to talk to any of the humans, you were unable to collect enough evidence. Your indecisiveness allowed the killer to get away.");
    }
}

function checkStory(item) { return storyChecks[item]; }
function checkInvent(item) { return evidence[item]; }

function addSuspect(s) {
    suspects.push(s);
}

function main() {
    clearOutput();
    print(scenes.intro.text);
    runScene("outside");
}

function telephone() {
    // count evidence trues as evidence
    evidence = 0;
    for (let k in evidence) {
        if (evidence[k] === true) evidence++;
    }
    if (suspects.length === 0) {
        print("You have no suspects, go find some evidence!");
        return lobby();
    } else {
        // show unique suspects like Python's set(suspects)
        const unique = Array.from(new Set(suspects));
        print("the people you have suspect are " + unique.join(", "));
        print("You call the police, who do you arrest, if anyone?");
        ask((guilty) => {
            guilty = (guilty || "").toLowerCase().trim();
            if (!suspects.includes(guilty)) {
                print("Sorry, but you don't know that person. You go back to the lobby.");
                return lobby();
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
    if (checkStory('barcon') === false) {
        print("One of the customers looks at you strangely, 'I thought you knew who the killer was? Go back and find some evidence.'");
        return lobby();
    }
    print("The bartender walks towards you and asks what you want. Do you order a drink, ask her for information, or leave?");
    if (bartender === true) {
        print("You notice that part of her grey jacket is ripped off.");
        print("'Bartender' added to list of suspects.");
        addSuspect('bartender');
    }
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice.includes("order") || choice.includes("drink")) {
            print("'What drink do you want?' She asks.");
            ask((drink) => {
                drink = drink || "";
                print("She sets down your " + drink + " and you pay her for it.");
                if (bartender === false) return barGood();
                if (bartender === true) return barBad();
            });
        } else if (choice.includes("ask") || choice.includes("information") || choice.includes("talk")) {
            print("You tell her what you're here to do.");
            if (bartender === false) {
                print("She tells you that she doesn't know anything because she wasn't working that day. But suggests that one of her customers might, she gives you a drink on the house and wishes you luck.");
                return barGood();
            }
            if (bartender === true) {
                print("She shrugs, 'I just work down here, I don't know what goes on anywhere else in the hotel.' She gets a drink from the underneath the counter. 'I have to get back to work, but this one's on me,' She smiles and goes to another customer.");
                return barBad();
            }
        } else if (choice.includes("leave") || choice.includes("lobby")) {
            introvertCheck();
            print("You head back to the lobby.");
            return lobby();
        } else {
            print("Sorry that's not an action you can take.");
            return bar();
        }
    });
}

function barGood() {
    print("\nWhile drinking, one of the other customers moves from the other end of the bar to sit on the stool next to you.");
    print("'Haven't seen you around here before,' he observes, 'What are you doing here stranger?'");
    print("Do you talk to them?");
    ask((choice) => {
        choice = (choice || "").toLowerCase().trim();
        if (choice === 'no') {
            introvertCheck();
            print("'Sorry, but I'm just here for a drink,' you say. You continue drinking and he leaves.");
            print("After you finish your drink, you're about to head back to the lobby when you notice a piece of paper where he was sitting. He left you his contact info.");
            print("'Customer' added to list of suspects.");
            addSuspect('customer');
            return lobby();
        }
        if (choice === 'yes') {
            print("You tell them what you're doing here, they listen carefully to what you are saying.");
            if (driver === true) {
                print("'Well the guy outside in that old Yugo has been there since she checked in, would've thought he would leave by now though...' He tells you.");
                print("'driver' added to list of suspects.");
                print("'Witness statement' added to evidence.");
                evidence['witness statement'] = true;
                addSuspect('driver');
            }
            if (clerk === true) {
                print("'I know the front desk clerk works almost everyday, but she said she was sick even though her car was in the parking lot,' he observes.");
                print("'Hotel clerk' added to list of suspects.");
                print("'Witness statement' added to evidence.");
                evidence['witness statement'] = true;
                addSuspect('hotel clerk');
            }
            print("You thank him for telling you what he knows, you head back to the main lobby.");
            return lobby();
        }
        print("Sorry that's not an action you can take.");
        return barGood();
    });
}

function barBad() {
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
            storyChecks['barcon'] = false;
            return lobby();
        }
        print("Sorry but that's not an action you can take.");
        return barBad();
    });
}

function frontDesk() {
    print("\nThe clerk greets you and asks if you want a room for the night, you introduce yourself, talking to her to see if she knows anything might be a good idea or getting the victim's room key.");
    if (clerk === true) {
        print("As you approach her, you notice she smells a bit like bleach, and her scarf is ripped.");
        print("'Hotel clerk' added to list of suspects.");
        addSuspect('hotel clerk');
    }
    print("What do you do?");
    ask((choice) => {
        choice = (choice || "").toLowerCase();
        if (choice.includes("key")) {
            if (checkInvent('key') === false) {
                evidence['key'] = true;
                print("The clerk gives you the key for room 13 (how cliche), you can go to the room now. You return to the lobby.");
                return lobby();
            } else {
                print("You already have the key to the room.");
                return frontDesk();
            }
        }
        if (choice.includes("talk") || choice.includes("ask")) {
            storyChecks['clerkTalk'] = true;
            print("You ask her if she knows anything about the murder.");
            if (clerk === true) {
                print("'I don't know much, but I can show you the room,' she says. You agree.");
                print("You thank her and follow her to the room.");
                return room();
            }
            if (clerk === false) {
                print("'Well I didn't clean the room or anything--with it being a crime scene and all...' She seems nervous, but maybe that's just nerves of being interrogated.");
                print("You thank her and she tells you she'll do what she can to help. You go back to the lobby.");
                print("'Hotel clerk' added to list of suspects.");
                addSuspect('hotel clerk');
                return lobby();
            }
        }
        if (choice.includes("leave")) {
            introvertCheck();
            print("You leave and go back to the lobby.");
            print("'Hotel clerk' added to list of suspects.");
            addSuspect('hotel clerk');
            return lobby();
        }
        print("Sorry, that's not an action you can take.");
        return frontDesk();
    });
}

//-----------------------------------------------------------
// Start game
//-----------------------------------------------------------

main();
