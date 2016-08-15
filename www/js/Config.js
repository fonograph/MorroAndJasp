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
                music: "renaissance"
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
                music: "spooky"
            },
            romance: {
                music: "love"
            },
            quest: {
                music: "adventure-1"
            },
            musical: {
                music: ""
            },
            western: {
                music: "western-1"
            },
            tragedy: {
                music: "epic"
            },
            horror: {
                music: "spooky"
            },
            "vaudevillian comedy": {
                music: "goofy"
            },
            "detective story": {
                music: "adventure-3"
            },
            astronauts: {
                music: "epic"
            },
            singalong: {
                music: "ukelele"
            },
            "dance party": {
                music: "dance"
            },
            "you never do it my way": {
                music: ""
            },
            "fell asleep": {
                music: "lullaby"
            },
            rap: {
                music: "beat"
            },
            "audience unrest": {
                music: "unrest"
            },
            "jasp shuts down morro": {
                music: ""
            },
            "morro shuts down jasp": {
                music: ""
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
                music: "adventure-1"
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
        }
    };

});