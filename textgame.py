
import random

list_sus = []
inventory = {'key':False, 'grey fabric':False, 'claw marks':False, 'witness statement':False, 'drugs':False, 'body':False}
other_stuff = {'car_here':True, 'barcon':True, 'clerk_talk':False, 'clerk_kill':False, 'car_name':False, 'dog_here':True, 'clerk_here':True, 'cleaner':False}

ending = []
pat = 0
introvert = 0
evidence = 0
bartender = False
car_dude = False
hotel_clerk = False

x = random.randint(1, 3)
if x == 1:
  bartender = True
if x == 2:
  car_dude = True
if x == 3:
  hotel_clerk = True

if bartender == True:
  killer = 'bartender'
if car_dude == True:
  killer = 'car dude'
if hotel_clerk == True:
  killer = 'hotel clerk'

def check_stuff(item):
  return other_stuff[item]

def check_invent(item):
  return inventory[item]

def introvert_check():
  global introvert
  introvert += 1
  if introvert > 7:
    global ending
    ending = 'Socially Anxious Detective Ending'
    dead("You were too afraid to talk to any of the humans, you were unable to collect enough evidence. Your indecisiveness allowed the killer to get away.")

def outside():
  print("Behind you is the door to the lobby.")
  if check_stuff('dog_here') == True:
    print("There is also a dog sitting outside the hotel (it clearly wants pats).")
  if check_stuff('car_here') == True:
    print("In front of you in the parking lot is a car with someone in it.")
  print("Where do you want to go?")
  choice = input("> ")
  choice = choice.lower()
  if "car" in choice or "front" in choice or "parking" in choice:
    if check_stuff('car_here') == True:
      print("You go over to the car.")
      car()
    elif check_stuff('car_here') == False:
      print("There is no car you can go to.")
      outside()
  elif "hotel" in choice or "lobby" in choice or "back" in choice:
    if 'dog' in list_sus and check_stuff('dog_here') == True:
      print("There is a sign saying 'NO DOGS ALLOWED' in bright bold letters. You decide to obey the rule and leave the dog outside.")
    print("You head inside to the hotel.")
    hotel_lobby()
  if "dog" in choice or "pat" in choice:
    print("You pat the dog. Cute.")
    global pat
    pat += 1
    pats()
  else:
    print("Sorry but that's not a place you can go.")
    outside()

def pats():
  global pat
  if pat == 5:
    print("The dog likes you a lot, you have acquired dog.")
    list_sus.append('dog')
    outside()
  print("It wants more pats. Will you give more pats?")
  choice = input("> ")
  if choice == "yes" or "pat" in choice:
    print("You pat the dog. Cute.")
    pat += 1
    pats()
  if choice == "no":
    print("The dog looks sad, but stays there.")
    outside()
  else:
    print("That's not an action you can take.")
    pats()

def car():
  if check_stuff('car_name') == False:
    print("The car seems to be old, at least from the 80's, it's pretty run down and not in the best shape.")
    print("As you walk closer, you notice someone sitting in the driver's seat, they might know something.")
    print("Do you leave or talk to them?")
    choice = input("> ")
    choice = choice.lower()
    if "talk" in choice:
      print("You tap on their car window")
      woods()
    if "leave" in choice:
      introvert_check()
      print("You head back to the hotel entrance")
      outside()
    else:
      print("Sorry but that's not an action you can take.")
      car()
  if check_stuff('car_name') == True:
    print("You walk up to him and he rolls down the window, 'I don't have anymore information to give to you, sorry.' You head back to the entrance.")
    outside()

def woods():
  print("You tell him who you are and what you're doing, he seems eager to help and claims to know something that might help you solve your case.")
  print("Do you go with him?")
  choice = input("> ")
  choice = choice.lower().strip()
  if choice == "yes":
    print("You get in his car and drive until you're on a secluded gravelled road surrounded by trees. He stops the car and gets out and you follow them.")
    if car_dude == True:
      woodsbad()
    if car_dude == False:
      print("'I come out here often, since I don't live far from here,' he explains, 'it was the other day, when I found this.' He walks over to one of the trees and grabs something.")
      print("It is a piece of grey fabric stained with blood, you take it as possible evidence.")
      print("'Car dude' added to suspect list.\n'Grey fabric' added to inventory.")
      list_sus.append('car dude')
      inventory['grey fabric'] = True
      if hotel_clerk == True:
        print("You both examine the area around you, there's an awful stench coming from the undergrowth.")
        print("You see a hand sticking out of the dirt.")
        print("'Body' added to evidence.")
        inventory['body'] = True
        print("Both of you decide to go back to the hotel for you to investigate more.")
        outside()
      else:
        print("You thank him for his contribution and you both head back to the hotel so you can continue your investigation.")
        other_stuff['car_name'] = True
        outside()
  elif choice == "no":
    introvert_check()
    print("You decline their offer and head back to the entrance; he doesn't seem offended and tell you he'll be there if you change your mind.")
    print("'car dude' added to suspect list.")
    list_sus.append("car dude")
    print("You head back to the hotel entrance")
    outside()
  else:
    print("Sorry but that's not an action you can take.")
    woods()

def woodsbad():
  list_sus.append('car dude')
  print("'You know you shouldn't be looking into things like this, stay out of things that you don't know anything about,' he turns around to look at you, it almost seems like he's growling.")
  print("It seems like he has unusually sharp nails (and a tail...?), before you realize what's happening, he transforms into a wolf-like creature.")
  print("He charges at you, do you defend yourself or flee?")
  choice = input("> ")
  choice = choice.lower()
  if "flee" in choice:
    print("You run away as fast as you can, he doesn't run after you, it appears he's injured. You make it back to the main road, you see the sign to the hotel and decide that's probably the best place to go.")
    other_stuff['car_here'] = False
    outside()
  elif "defend" in choice:
    global ending
    if 'dog' in list_sus:
      print("Your loyal furry companion attacks the werewolf, you watch as he tries to fight back; unfortunetly the dog loses. Luckily because of the dog's sacrifice you manage to get away back to the hotel.")
      other_stuff['car_here'] = False
      other_stuff['dog_here'] = False
      list_sus.remove('dog')
      outside()
    else:
      ending = 'Supernatural Ending'
      dead("You tried to defend yourself, but before you could do anything he slashes you to pieces, you bleed out and die.")
  else:
    print("Sorry but that's not an action you can take.")
    woodsbad()

def hotel_lobby():
  print("The lobby is fairly plain. To the left there's the front desk, to the right is a small bar, in front of you is a telephone.")
  print("Behind you is the door to outside.")
  if check_invent('key') == True:
    print("Down the hall is the room.")
  print("Where do you go?")
  choice = input("> ")
  choice = choice.lower()
  if "hall" in choice or "room" in choice:
    if check_invent('key') == False:
      print("Sorry, but you don't have a room key yet.")
      hotel_lobby()
    elif check_invent('key') == True:
      room()
  elif "right" in choice or "bar" in choice:
    bar()
  elif "left" in choice or "desk" in choice:
    if check_stuff('clerk_here') == True:
      front_desk()
    if check_stuff('clerk_here') == False:
      print("There is no one at the desk, perhaps another time.")
      hotel_lobby()
  elif "front" in choice or "phone" in choice:
    telephone()
  elif "back" in choice or "outside" in choice:
    outside()
  else:
    print("sorry that's not a place you can go.")
    hotel_lobby()

def telephone():
  for i in inventory.values():
    if i == True:
      global evidence
      evidence +=1
  if len(list_sus) == 0:
    print("You have no suspects, go find some evidence!")
    hotel_lobby()
  else:
    print("the people you have suspect are", ", ".join(list(set(list_sus))))
    print("You call the police, who do you arrest, if anyone?")
    guilty = input("> ")
    guilty = guilty.lower().strip()
    if guilty not in list_sus:
      print("Sorry, but you don't know that person. You go back to the lobby.")
      hotel_lobby()
    else:
      if guilty == 'dog':
        global ending
        ending = 'The Best End'
        dead("Even though the killer got away, you made a friend along the way. You found dog. <3")
      elif guilty == killer:
        if evidence >= 2:
          ending = 'Private-I Malik Ending'
          dead("The arrest was made, they were found guilty. Good job!")
        if evidence < 2:
          ending = 'Bad Ending (1/2)'
          dead("The arrest was made, but they were found not guilty for lack of evidence.")
      elif guilty != killer:
        ending = 'Bad Ending (2/2)'
        dead("The arrest was made, but they were found not guilty, sorry but the killer got away.")

def bar():
  print("It's a small bar, with a small selection of local breweries and snacks. There are a few other customers, you sit down at the bar.")
  print("Behind you is the lobby.")
  if check_stuff('barcon') == False:
    print("One of the customers looks at you strangely, 'I thought you knew who the killer was? Go back and find some evidence.'")
    hotel_lobby()
  if check_stuff('barcon') == True:
    print("The bartender walks towards you and asks what you want. Do you order a drink, ask her for information, or leave?")
    if bartender == True:
      print("You notice that part of her grey jacket is ripped off.")
      print("'Bartender' added to list of suspects.")
      list_sus.append('bartender')
    choice = input("> ")
    choice = choice.lower()
    if "order" in choice or "drink" in choice:
      print("'What drink do you want?' She asks.")
      drink = input("> ")
      print("She sets down your", drink, "and you pay her for it.")
      if bartender == False:
        bargood()
      if bartender == True:
        barbad()
    elif "ask" in choice or "information" in choice or "talk" in choice:
      print("You tell her what you're here to do.")
      if bartender == False:
        print("She tells you that she doesn't know anything because she wasn't working that day. But suggests that one of her customers might, she gives you a drink on the house and wishes you luck.")
        bargood()
      if bartender == True:
        print("She shrugs, 'I just work down here, I don't know what goes on anywhere else in the hotel.' She gets a drink from the underneath the counter. 'I have to get back to work, but this one's on me,' She smiles and goes to another customer.")
        barbad()
    elif "leave" in choice or "lobby" in choice:
      introvert_check()
      print("You head back to the lobby.")
      hotel_lobby()
    else:
      print("Sorry that's not an action you can take.")
      bar()

def bargood():
  print("While drinking, one of the other customers moves from the other end of the bar to sit on the stool next to you.")
  print("'Haven't seen you around here before,' he observes, 'What are you doing here stranger?'")
  print("Do you talk to them?")
  choice = input("> ")
  choice = choice.lower().strip()
  if choice == 'no':
    introvert_check()
    print("'Sorry, but I'm just here for a drink,' you say. You continue drinking and he leaves.")
    print("After you finish your drink, you're about to head back to the lobby when you notice a piece of paper where he was sitting. He left you his contact info.")
    print("'Customer' added to list of suspects.")
    list_sus.append('customer')
    hotel_lobby()
  if choice == 'yes':
    print("You tell them what you're doing here, they listen carefully to what  you are saying.")
    if car_dude == True:
       print("'Well the guy outside in that old Yugo has been there since she checked in, would've thought he would leave by now though...' He tells you.")
       print("'Car dude' added to list of suspects.")
       print("'Witness statement' added to evidence.")
       inventory['witness statement'] = True
       list_sus.append('car dude')
    if hotel_clerk == True:
      print("'I know the front desk clerk works almost everyday, but she said she was sick even though her car was in the parking lot,' he observes.")
      print("'Hotel clerk' added to list of suspects.")
      print("'Witness statement' added to evidence.")
      inventory['witness statement'] = True
      list_sus.append('hotel clerk')
  else:
    print("Sorry that's not an action you can take.")
    bargood()
  print("You thank him for telling you what he knows, you head back to the main lobby.")
  hotel_lobby()

def barbad():
  print("As you drink, you start to feel a bit dizzy and ask the bartender if you can sit down somewhere else, she tells you can rest in the back and she goes with you to make sure you're okay.")
  print("Once in the backroom, she sits you down on a crate.")
  print("She locks the door and goes back over to you, pulling out a knife. Do you fight back or flee?")
  choice = input("> ")
  choice = choice.lower()
  if "flee" in choice:
    global ending
    ending = 'Bartender Ending'
    dead("You try to run for the door but you can't get it unlocked, she stabs you and you die.")
  if "fight" in choice:
    print("With all the strength you have left you charge at her, somehow you manage to knock her into one of the shelves, she is unconscious.")
    print("You decide to leave her in her current state. After a few minutes you manage to get the door open, you head back to the lobby.")
    global barcon
    other_stuff['barcon'] = False
    hotel_lobby()
  else:
    print("Sorry but that's not an action you can take.")

def front_desk():
  print("The clerk greets you and asks if you want a room for the night, you introduce yourself, talking to her to see if she knows anything might be a good idea or getting the victim's room key.")
  if hotel_clerk == True:
      print("As you approach her, you notice she smells a bit like bleach, and her scarf is ripped.")
      print("'Hotel clerk' added to list of suspects.")
      list_sus.append('hotel clerk')
  print("What do you do?")
  choice = input("> ")
  choice = choice.lower()
  if "key" in choice:
    if check_invent('key') == False:
      inventory['key'] = True
      print("The clerk gives you the key for room 13 (how cliche), you can go to the room now. You return to the lobby.")
      hotel_lobby()
    elif check_invent('key') == True:
      print("You already have the key to the room.")
      front_desk()
  if "talk" in choice or "ask" in choice:
    other_stuff['clerk_talk'] = True
    print("You ask her if she knows anything about the murder.")
    if hotel_clerk == True:
      print("'I don't know much, but I can show you the room,' she says. You agree.")
      print("You thank her and follow her to the room.")
      room()
    if hotel_clerk == False:
      print("'Well I didn't clean the room or anything--with it being a crime scene and all...' She seems nervous, but maybe that's just nerves of being interrogated.")
      print("You thank her and she tells you she'll do what she can to help. You go back to the lobby.")
      print("'Hotel clerk' added to list of suspects.")
      list_sus.append('hotel clerk')
      hotel_lobby()
  if "leave" in choice:
    introvert_check()
    print("You leave and go back to the lobby.")
    print("'Hotel clerk' added to list of suspects.")
    list_sus.append('hotel clerk')
    hotel_lobby()
  else:
    print("Sorry, that's not an action you can take.")
    front_desk()

def room():
  print("It's a standard hotel room, aside from the fact someone was murdered.")
  if car_dude == True:
    print("There are claw marks on the wall, it's as if this was an animal attack.")
    print("The body was found on the bed, her heart is missing, apparent signs of struggle--whatever it was, it caught her off guard.")
    inventory['claw marks'] = True
    print("'Claw marks' added to evidence.")
  elif bartender == True:
    print("Even though she was stabbed from behind, it looks like she didn't know her killer was in the room--or possibly she had no reason to be alarmed.")
    print("There are no signs of struggle, the body was found at the desk; next to her is a bottle of some sort of drink, you smell it and realize it was drugged.")
    inventory['drugs'] = True
    print("'Drugs' added to evidence.")
  elif hotel_clerk == True:
    print("The body was no where to be found, the room was eerily clean--not a speck of blood or anything; however the room did smell a lot like bleach.")
    print("Clearly the body was taken else where, the question is how they could've done it")
    inventory['bleach'] = True
    print("'Bleach' added to evidence.")
    if check_stuff('clerk_talk') == True:
      room_bad()
  print("Now that you've examined the room, would you like to go back to the lobby?")
  choice = input("> ")
  choice = choice.lower()
  if choice == 'yes':
    print("You go back to the lobby, to investigate more.")
    hotel_lobby()
  elif choice == 'no':
    print("You stay in the room.")
    room()
  else:
    print("Sorry, that's not an action you can take.")
    room()

def room_bad():
  print("The hotel clerk turns to you, 'almost no trace of the murder, right?' she tells you, 'it was difficult planning it, that's for sure.'")
  print("'It doesn't matter if you run or try to fight me, I'll kill you either way.' She smiles at you.")
  print("Do you try to run or attempt to defend yourself?")
  choice = input("> ")
  choice = choice.lower()
  escape = random.randint(1,2)
  if choice == 'run':
    if escape == 1:
      global ending
      ending = 'Clerk Ending (1/2)'
      dead("You pointlessly try to run, but before you can run, she kills you and your body was never found.")
    if escape == 2:
      other_stuff['clerk_here'] = False
      print("You somehow manage to escape the room, locking the door behind you. You run back to the lobby.")
      hotel_lobby()
  if choice == 'defend':
    ending = 'Clerk Ending (2/2)'
    print("You manage to push her off of you, she falls back hitting her head on the desk. When you approach her, you realize she doesn't have a pulse.")
    dead("After a thorough investigation, you are found guilty of manslaughter, you get fired and suffer for the rest of your life.")
  else:
    print("Sorry, that's not an action you can take.")
    room_bad()

def dead(why):
  print(why, "You got the", ending + ".")
  exit()


def main():
  print("You are outside a hotel, you are here to investigate the death of a guest here.")
  print("You have a blank notebook, you can keep a list of suspects and evidence there.")
  print("If you find who the killer is, call the police and they'll make the arrest. Remember, you need enough evidence to successfully arrest someone.")
  outside()


main()