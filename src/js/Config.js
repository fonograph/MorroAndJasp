"use strict";
define(function(){

    return {
        emotions: {
            'jasp': [
                'angry',
                'annoyed',
                'bossy',
                'clapping',
                'delighted',
                'disgusted',
                'dreaming',
                'explaining',
                'herewegoagain',
                'judgmental',
                'lightbulb',
                'neutral',
                'performative',
                'pleased',
                'sad',
                'sobbing',
                'surprised',
                'thinking',
                'tragic',
                'unamused',
                'unhappy',
                'unsure',
                'why_me'
            ],
            'morro': [
                'angry',
                'annoyed',
                'content',
                'delighted',
                'happy',
                'irritated',
                'lightbulb',
                'mischevious',
                'neutral',
                'performative',
                'pleading',
                'queenoftheworld',
                'sad',
                'sharing_idea',
                'silly',
                'stupid',
                'surprised',
                'tired',
                'unsure',
                'whatever',
                'wondering'
            ]
        },
        emotionSounds: {
            'j': {
                'angry': 'hit',
                'annoyed': 'shake',
                'bossy': 'knock',
                'clapping': 'ding',
                'delighted': 'boing',
                'disgusted': 'hit',
                'dreaming': 'ding',
                'explaining': 'knock',
                'herewegoagain': 'whoosh',
                'judgmental': 'shake',
                'lightbulb': 'ding',
                'neutral': 'tweet',
                'performative': 'cymbal',
                'pleased': 'tweet',
                'sad': 'downbing',
                'sobbing': 'downbing',
                'surprised': 'whoosh',
                'thinking': 'knock',
                'tragic': 'cymbal',
                'unamused': 'shake',
                'unhappy': 'knock',
                'unsure': 'whoosh',
                'why_me': 'cymbalshort'
            },
            'm': {
                'angry': 'hit',
                'annoyed': 'hit',
                'content': 'knock',
                'delighted': 'cymbalshort',
                'happy': 'boing',
                'irritated': 'shake',
                'lightbulb': 'ding',
                'mischevious': 'whoosh',
                'neutral': 'knock',
                'performative': 'cymbal',
                'pleading': 'downbing',
                'queenoftheworld': 'cymbal',
                'sad': 'downbing',
                'sharing_idea': 'ding',
                'silly': 'horn',
                'stupid': 'horn',
                'surprised': 'ding',
                'tired': 'whoosh',
                'unsure': 'tweet',
                'whatever': 'shake',
                'wondering': 'tweet'
            }
        },
        numbers: [
            'quality',
            'conflict',
            'meta'
        ],
        startingBeats: {
            act1: 'start',
            int: 'intermission opening',
            act2: 'act 2 opening'
        },
        effects: [
            'flash',
            'shake'
        ],
        unrelatedHeadlines: [
            "5 Terrible Things Grandmothers Don't Like To Think About",
            "Jay-Z launches new skin cream line",
            "18 sandwiches lost in local bakery fire. ",
            "Connection between dreams and dairy revealed.",
            "Is the metric system really worth it?",
            "Chocolate sure to be enjoyed by all this Easter",
            "Science discovers cure for bordom, called work",
            "Local band realizes that their music sucks. ",
            "Drinking 8 glasses of water proven to make people pee more. ",
            "Stock market crashes, again. ",
            "Burger prices skyrocket across the world. ",
            "The colour green considered too political for local nursery school. ",
            "On campaign, pants gets dropped from scheduled debate",
            "Millionaire gives fortune away after having really great tacos.",
            "New monument dedicated to people stuck in friend zone. ",
            "List of people who pick their nose and eat it leaked online. ",
            "Local basketball team wins regional hockey tournement. ",
            "Courts rule that company cannot copyright phrase 'Fo Sho'",
            "World's oldest person tells today's youth to stop their bitchin'",
            "Missing link discovered by grad student trying to impress teacher. ",
            "Candy makers strike in hopes of sweeter deal. ",
            "Redheads given same rights as all other human beings. ",
            "Space discovered to be much smellier than expected. ",
            "Man marries mannequin in case of mistaken identity. ",
            "Underground bunker found to hold octopus colony",
            "Quiet, introverted people found less likely to enjoy parties",
            "'Cheeseburgers are delicious' - Study",
            "Newspaper industry continues to die slowly",
            "President Kanye declares war against the moon",
            "There's a picture of an actual UFO on page 3, no kidding",
            "Newspaper writer runs amok with absurd headlines",
            "Everyone is dying slowly, but everything is fine",
            "Local woman finds childbirth more painful than expected",
            "Did you see that bird? That bird looks so weird",
            "Japan admits to stealing world's supply of sticky notes",
            "Will anyone actually read this headline? Probably not",
            "'Kooky Tanuki' craze sweeps the nation",
            "Entire nation oversleeps on the same morning"
        ],
        audienceLines: {
            qualityThreshold: 2,
            beats: [
                'start',
                'reenactment',
                'this is not a play',
                'lost in the woods',
                'romance',
                'quest',
                'musical',
                'western',
                'tragedy',
                'horror',
                'vaudevillian comedy',
                'detective story',
                'astronauts',
                'singalong',
                'protest',
                'rap',
                'pandering to the audience',
                'romance part 2',
                'shakespeare',
                'big blow out',
                'morro takes over',
                'jasp takes over',
                'spaghetti western',
                'performance art'
            ],
            negative: [
                'I hired a babysitter for this?',
                'This is why people hate clowns!',
                'What\'s the point of this?',
                'Is this supposed to make sense?',
                'This stinks!',
                'Booooooo!',
                'This is terrible!',
                'How is THIS better than Netflix?'
            ],
            positive: [
                'Bravo!',
                'Brilliant!',
                'Tour de force!',
                'Amazing!',
                '<Applause>',
                '<Applause>',
                '<Applause>',
                '<Applause>'
            ]
        },
        endings: {
            transitions: [
                "instant",
                "boo",
                "applause",
                "crickets",
                "gasps",
                "scream",
                "awww",
                "laughter",
                "cough",
                "bravo",
                "grumbling"
            ],
            sounds: [
                "fanfare",
                "wahwah",
                "crickets",
                "telegram",
                "city",
                "honk",
                "quacks",
                "dogs",
                "fairy",
                "sirens",
                "violins"
            ]
        },
        beats: {
            start: {
                music: ""
            },
            reenactment: {
                music: "renaissance",
                continues: true
            },
            avoidance: {
                music: ""
            },
            "pick a genre": {
                music: ""
            },
            "this is not a play": {
                music: "goofy"
            },
            "lost in the woods": {
                music: "spooky",
                continues: true
            },
            romance: {
                music: "love",
                continues: true
            },
            quest: {
                music: "adventure-1",
                continues: true
            },
            musical: {
                music: ""
            },
            western: {
                music: "western-1",
                continues: true
            },
            tragedy: {
                music: "epic"
            },
            horror: {
                music: "spooky",
                continues: true
            },
            "vaudevillian comedy": {
                music: "goofy"
            },
            "detective story": {
                music: "adventure-3",
                continues: true
            },
            astronauts: {
                music: "epic"
            },
            singalong: {
                music: ""
            },
            "dance party": {
                music: ""
            },
            "you never do it my way": {
                music: "",
                continues: true
            },
            "fell asleep": {
                music: "lullaby"
            },
            rap: {
                music: ""
            },
            "audience unrest": {
                music: "unrest",
                continues: true
            },
            "morro shuts down jasp": {
                music: "",
                continues: true
            },
            protest: {
                music: "goofy"
            },
            offensive: {
                music: ""
            },
            "break a leg": {
                music: "goofy"
            },
            "chandelier falls": {
                music: ""
            },
            "intermission opening": {
                music: "unrest-muffled"
            },
            "tv executive": {
                music: "unrest-muffled"
            },
            celebration: {
                music: "unrest-muffled"
            },
            food: {
                music: "unrest-muffled"
            },
            drink: {
                music: "unrest-muffled"
            },
            "act 2 planning": {
                music: "unrest-muffled"
            },
            breakdown: {
                music: "unrest-muffled"
            },
            "blame game": {
                music: "unrest-muffled"
            },
            "end of intermission": {
                music: "unrest-muffled"
            },
            "they escape": {
                music: "unrest-muffled"
            },
            "outside disaster": {
                music: "unrest-muffled"
            },
            "intermission fight": {
                music: "unrest-muffled"
            },
            "we quit": {
                music: "unrest-muffled"
            },
            "act 2 opening": {
                music: "unrest-muffled"
            },
            "pandering to audience": {
                music: "unrest"
            },
            "audience phone rings": {
                music: ""
            },
            sick: {
                music: "unrest"
            },
            drunk: {
                music: "goofy"
            },
            "romance part 2": {
                music: "love"
            },
            "brave/warrior death": {
                music: "epic"
            },
            "last goodbye": {
                music: "sad"
            },
            shakespeare: {
                music: "renaissance"
            },
            "thelma and louise": {
                music: ""
            },
            "save the end": {
                music: ""
            },
            "super happy ending": {
                music: "happy"
            },
            "big blow out": {
                music: ""
            },
            reconciliation: {
                music: "love"
            },
            "morro takes over": {
                music: "goofy"
            },
            "jasp takes over": {
                music: "goofy"
            },
            "audience revolt": {
                music: "unrest"
            },
            "where were we?": {
                music: ""
            },
            help: {
                music: ""
            },
            blackout: {
                music: ""
            },
            "celebration ending": {
                music: "happy"
            },
            therapy: {
                music: "unrest"
            },
            "staring contest": {
                music: "clock"
            },
            "spaghetti western": {
                music: "western-2"
            },
            "walk out": {
                music: "unrest"
            },
            "performance art": {
                music: "goofy"
            },
            "morro's sneezing attack": {
                music: ""
            }
        },
        unlocks: [
            {
                threshold: 5,
                id: 'act2',
                name: 'Act 2',
                instructions: "Now there will be more options to take the story in more directions, including a possible second act!",
            },
            {
                threshold: 5,
                id: 'staringContest',
                name: 'Staring Contest',
                instructions: "Now there will be more options to take the story in more directions, including a possible second act!",
                beat: 'staring contest'
            }
        ],
        endingsList: [
            "LAZY CLOWNS SLEEP THROUGH HALF OF THEIR OWN PLAY",
            "TERRIBLE CLOWN REALITY SHOW WATCHED BY EVERYONE",
            "CRITICS LOVE 'MITZI AND JESSICA'",
            "'MORRO & JASP': A PORTRAIT OF FAILURE",
            "Clowns fall asleep live on stage. ",
            "The most silent death scene ever seen on stage. ",
            "Two clowns die in theatre show... it was very convincing. ",
            "Clown dies in epic battle on stage.",
            "Clowns fail to take into account the timing of their menstrual cycles. ",
            "Clowns craft sculptures out of shit. ",
            "Clowns subject audience to six hour sob fest.",
            "Star Trek parody fails to launch",
            "Clown Star Wars leaves everyone bored",
            "Clowns lost in space. ",
            "Clowns stage protest",
            "That was real nice of you!",
            "Clown 'concert' ends in confusion",
            "Local Clowns put the 'Ham' in Hamlet",
            "Play ends in discussion on gender equality in Shakespeare",
            "It didn't make any sense.",
            "Empty promises.",
            "Drunk clowns reinvigorate Shakespeare",
            "Drunk Shakespeare at its worst",
            "Clowns quit on account of rude audience members. ",
            "Your phone has been flushed down the toilet. :(",
            "Clowns figure out how to take over the world with a single cell phone, redefining the term 'Smart Phone' and creating a clown utopia.",
            "Two clowns end epic romance with greatest stage kiss of all times. ",
            "Two clowns quit the theatre. ",
            "Best self-affirmation since Jessica",
            "Local Clown Duo Sued for Copyright Infringement",
            "Clowns fail to GO GO GO very far.",
            "Clown pair abandon play mid run to start other play",
            "Clown sisters kill each other in stage duel.",
            "Clown tragedy ends tragically short",
            "Clown comedy not very funny. ",
            "Clowns throw pies...and new show.",
            "Jasp still doesn't find what she's looking for",
            "Clown sisters break up",
            "Clowns driven apart by callous players.",
            "Clowns set historic theatre on fire",
            "Clown sisters discover body of Jimmy Hoffa below historic theatre",
            "Two clowns celebrate life! Wahoo! ",
            "Clowns debate as curtain closes on play of debatable quality ",
            "Clowns soar in a magical theatrical event",
            "Some things are just not meant for the stage. Zero star show ends in clown literally falling off the stage. ",
            "Crash landing as two clowns fall off the stage while trying to fly. ",
            "Theatre or avante-garde new art form?",
            "Mishmash clown show closes on its opening night ",
            "Clowns melt under pressure",
            "Clowns drown together on a box ",
            "WTF?! A sort of theatre piece goes awry with nonsensical tangents and empty plot promises ",
            "CLOWN SPACE PROGRAM FAILS MISERABLY",
            "MORRO & ASSOCIATES FOIL INTERNATIONAL BOWTIE THIEFS",
            "STUPID SHOES ARE INCREDIBLY POPULAR",
            "MORRO AND JASP JOINTLY NAMED 'MISS TEEN SASKATCHEWAN'",
            "CLOWNS DEVELOP CURE FOR HEPATITIS Q",
            "CLOWNS INDICTED FOR INSURANCE FRAUD",
            "COMPLICATED REVENGE PLOT ENDS IN TEARS",
            "MISSING CELEBRITY CLOWN DUO SPOTTED IN NEBRASKA MALL",
            "CLOWNS BURN DOWN LOCAL THEATRE",
            "LOCAL LIONS ATTEMPT TO DEVOUR LOCAL CLOWNS",
            "WRESTLING DISEASE SWEEPS NATION",
            "IT WAS ALL A DREAM",
            "Clown show cancelled halfway through.",
            "Unhilarious clowns humiliated hilariously",
            "Clowns reinvigorate art of mime",
            "Freak accident sends one clown to hospital.",
            "CLOWNS HOSPITALIZED FOR FOOD POISONING, POOR JUDGEMENT",
            "DRUNK CLOWNS PASS OUT ON STAGE",
            "Clowns take dramatic leap to their doom",
            "And they lived happily ever after in the sparkle fairy pega-corn kingdom universe",
            "Clown sisters rise to fame and power",
            "Clowns storm out of theatre fighting over who can leave faster. ",
            "Audience burns down theatre in clown-related riot",
            "'Worst play ever' ends with audience storming out",
            "Chandelier disaster leaves theatre in ruins",
            "Strange ending for a strange show.",
            "Clown sisters divorce",
            "Strange show ends abruptly ",
            "Clowns materialize full orchestra out of thin air and conjure most magical ending of all time ",
            "Show ends in biggest chorus line of all time",
            "A new era ushered in by epic clown show",
            "Theatre overrun by wild dogs. ",
            "Five stars for the most beautifully simple ending ever achieved. ",
            "Real snow falls in theatre.",
            "Defeatist ending to a bad play",
            "Clowns are anything but Lords of the Dance",
            "Clown kills sister. ",
            "Clowns die on stage in ode to Tarantino ",
            "Don't worry they are not really dead. ",
            "Longest stage death ever. ",
            "Clowns vs town ",
            "Clowns 'accidentally' set off explosives in theatre ",
            "Clowns pretend to ride horses for an hour ",
            "shoot 'em up style revenge plot develops in play ",
            "Clowns come up short attempting ode to Tarantino ",
            "Clown walks out leaving her sister alone forever. "
        ]
    };

});