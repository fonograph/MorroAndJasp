"use strict";
define(function(){

    return {
        environment: 'development',
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
                'wondering',
                'uke'
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
            "18 sandwiches lost in local bakery fire",
            "Connection between dreams and dairy revealed",
            "Is the metric system really worth it?",
            "Chocolate sure to be enjoyed by all this Easter",
            "Science discovers cure for bordom, called work",
            "Local band realizes that their music sucks",
            "Drinking 8 glasses of water proven to make people pee more",
            "Stock market crashes, again",
            "Burger prices skyrocket across the world",
            "The colour green considered too political for local nursery school",
            "On campaign, pants gets dropped from scheduled debate",
            "Millionaire gives fortune away after having really great tacos",
            "New monument dedicated to people stuck in friend zone",
            "List of people who pick their nose and eat it leaked online",
            "Local basketball team wins regional hockey tournement",
            "Courts rule that company cannot copyright phrase 'Fo Sho'",
            "World's oldest person tells today's youth to stop their bitchin'",
            "Missing link discovered by grad student trying to impress teacher",
            "Candy makers strike in hopes of sweeter deal",
            "Redheads given same rights as all other human beings. ",
            "Space discovered to be much smellier than expected",
            "Man marries mannequin in case of mistaken identity",
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
            minimumDistance: 5,
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
                {text: 'I hired a babysitter for THIS?', sound:'i-hired-a-babysitter.ogg'},
                {text: "What's the point of this?", sound:'what-is-the-point.ogg'},
                {text: 'Is this supposed to make sense?', sound:'is-this-supposed.ogg'},
                {text: 'This stinks!', sound:'this-stinks.ogg'},
                {text: 'This sucks!', sound:'this-sucks.ogg'},
                {text: 'Booooooo!', sound:'boo.ogg'},
                {text: 'Booooooo!', sound:'boo2.ogg'},
                {text: 'Booooooo!', sound:'boo3.ogg'},
                {text: 'Booooooo!', sound:'boo4.ogg'},
                {text: 'How is THIS better than Netflix?', sound:'how-is-this-better.ogg'},
                {text: 'Get off the stage!', sound:'get-off-the.ogg'},
                {text: "I'm going home!", sound:'im-going-home.ogg'},
                {text: "Let's get out of here!", sound:'lets-get-outta.ogg'},
                {text: 'Not funny!', sound:'not-funny.ogg'},
                {text: 'This is why people hate clowns!', sound:'this-is-why.ogg'},
                {text: 'Where is this going?', sound:'where-is-this-going.ogg'},
                {text: 'Where is this going?', sound:'where-is-this-going2.ogg'},
                {text: 'Why? Why?!', sound:'why-why.ogg'},
                {text: 'Why would you make that choice?!', sound:'why-would-you.ogg'},
                {text: 'Worst. Play. Ever.', sound:'worst-play-ever.ogg'},
                {text: 'You ruined my birthday!', sound:'you-ruined.ogg'},
                {text: '<Grumbling>', sound:'grumbling.ogg'},
                {text: '<Grumbling>', sound:'grumbling2.ogg'},
                {text: '<A single cough>', sound:'cough.ogg'}
            ],
            positive: [
                {text: 'Bravo!', sound:'bravo4.ogg'},
                {text: 'Bravo!', sound:'bravo5.ogg'},
                {text: 'Brava!', sound:'brava.ogg'},
                {text: 'Brilliant!', sound:'brilliant.ogg'},
                {text: 'Tour de force!', sound:'tour-de-force.ogg'},
                {text: 'Amazing!', sound:'amazing.ogg'},
                {text: 'Incredible!', sound:'incredible.ogg'},
                {text: 'Hooray!', sound:'hooray2.ogg'},
                {text: "I've always said I liked clowns!", sound:'ive-always-said.ogg'},
                {text: 'Jasp for mayor!', sound:'jasp-for-mayor.ogg'},
                {text: 'Give them the Tony!', sound:'give-them-the-tony.ogg'},
                {text: "Marry me!", sound:'marry-me.ogg'},
                {text: 'This is amazing!', sound:'this-is-amazing.ogg'},
                {text: 'This is the best!', sound:'this-is-the-best.ogg'},
                {text: "The future of clowning is here!", sound:'the-future.ogg'},
                {text: 'This show is so good!', sound:'this-show-is.ogg'},
                {text: 'What a show!', sound:'what-a-show.ogg'},
                {text: 'Woooo Morro!', sound:'woo-morro.ogg'},
                {text: 'Yes! Yes!', sound:'yes-yes.ogg'},
                {text: 'Yes! Yes!', sound:'yes-yes2.ogg'},
                {text: '<Single laugh>', sound:'single-laugh.ogg'},
                {text: '<Single laugh>', sound:'single-laugh2.ogg'},
                {text: '<Applause>', sound:'applause.ogg'},
                {text: '<Applause>', sound:'applause2.ogg'},
                {text: '<Applause>', sound:'applause3.ogg'},
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
                music: "sad"
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
                music: "unrest"
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
            "save the ending": {
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
                music: ""
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
                threshold: 3,
                id: 'video1',
                name: 'Anything Could Happen',
                instructions: "Return to the title screen and select Videos!",
                video: 'anything.mp4'
            },
            {
                threshold: 5,
                id: 'act2',
                name: 'Act 2',
                instructions: "Now there will be more options to take the story in more directions, including a possible second act!",
            },
            {
                threshold: 7,
                id: 'video2',
                name: 'Negative Reinforcement',
                instructions: "Return to the title screen and select Videos!",
                video: 'negative.mp4'
            },
            {
                threshold: 9,
                id: 'staringContest',
                name: 'Staring Contest',
                instructions: "Try playing again, and select 'Staring Contest' in the setup screen!",
                beat: 'staring contest'
            },
            {
                threshold: 11,
                id: 'video3',
                name: 'Morro Unlock...',
                instructions: "Return to the title screen and select Videos!",
                video: 'morro.mp4'
            },
            {
                threshold: 13,
                id: 'video4',
                name: 'Rock On!',
                instructions: "Return to the title screen and select Videos!",
                video: 'yourock.mp4'
            },
            {
                threshold: 15,
                id: 'morroTakesOver',
                name: 'The Morro Show',
                instructions: "Try playing again, and select 'The Morro Show' in the setup screen!",
                beat: 'morro takes over'
            },
            {
                threshold: 17,
                id: 'video5',
                name: 'What Else?',
                instructions: "Return to the title screen and select Videos!",
                video: 'whatelse.mp4'
            },
            {
                threshold: 19,
                id: 'video6',
                name: 'Cookbook',
                instructions: "Return to the title screen and select Videos!",
                video: 'cookbook.mp4'
            },
            {
                threshold: 21,
                id: 'jaspTakesOver',
                name: 'The Jasp Show',
                instructions: "Try playing again, and select 'The Jasp Show' in the setup screen!",
                beat: 'jasp takes over'
            },
            {
                threshold: 23,
                id: 'video7',
                name: 'You Did It!',
                instructions: "Return to the title screen and select Videos!",
                video: 'youdidit.mp4'
            },
            {
                threshold: 25,
                id: 'theEnd',
                name: 'The End?',
                instructions: "Try playing again, and select 'The End?' in the setup screen!",
                beat: 'celebration ending'
            },
            {
                threshold: 50,
                id: 'video8',
                name: 'Our Hero!!!',
                instructions: "Return to the title screen and select Videos!",
                video: 'ourhero.mp4'
            },
        ],
        endingsList: [
            "AUDIENCE BURNS DOWN THEATRE IN CLOWN-RELATED RIOT",
            "DRUNK CLOWNS PASS OUT ON STAGE",
            "THE MOST SILENT DEATH SCENE EVER SEEN ON STAGE",
            "TWO CLOWNS DIE IN THEATRE SHOW... VERY CONVINCING",
            "CLOWN DIES IN EPIC BATTLE ON STAGE",
            "CLOWNS FAIL TO TAKE INTO ACCOUNT THE TIMING OF THEIR MENSTRUAL CYCLES",
            "CLOWNS CRAFT SCULPTURES OUT OF SHIT",
            "CLOWNS SUBJECT AUDIENCE TO SIX HOUR SOB FEST",
            "CHANDELIER DISASTER LEAVES THEATRE IN RUINS",
            "JASP WINS MEANINGLESS, IMPROMPTU STARING CONTEST",
            "CLOWN SETS WORLD RECORD FOR NOT BLINKING",
            "POOR YORICK AIN'T GOT NOTHING ON THESE CLOWNS",
            "LOCAL CLOWNS PUT THE 'HAM' IN HAMLET",
            "CLOWN BLEEDS ALL OVER STAGE",
            "PLAY ENDS IN DISCUSSION ON GENDER EQUALITY IN SHAKESPEARE",
            "DRUNK CLOWNS REINVIGORATE SHAKESPEARE",
            "DRUNK SHAKESPEARE AT ITS WORST",
            "LAZY CLOWNS SLEEP THROUGH HALF OF THEIR OWN PLAY",
            "TERRIBLE SHOW ENDS INSTANTLY",
            "STRANGE SHOW ENDS ABRUPTLY",
            "CLOWN WALKS OUT LEAVING HER SISTER ALONE FOREVER",
            "CLOWNS STORM OUT OF THEATRE FIGHTING OVER WHO CAN LEAVE FASTER",
            "SIBLINGS TANK SHOW BECAUSE THEY CAN'T COMMUNICATE",
            "CLOWN WITH NO CLIMBING TRAINING FALLS AND IRONICALLY BREAKS FUNNY BONE",
            "CURTAIN NEVER CLOSES",
            "SURPRISE BLOODY ENDING",
            "CLOWN SHOW DERAILED BY COSTUME MALFUNCTION",
            "MAIN MESSAGE IN CLOWN SHOW ABOUT TEETH?",
            "CLOWN SHOW ENDS IN EPIC BAKE-OFF",
            "SHOW CANCELLED DUE TO SPRAINED ANKLES",
            "CLOWNS GET SICK ON EXPIRED COUGH SYRUP",
            "DESPERATE CLOWNS PULL FIRE ALARM DURING INTERMISSION",
            "CLOWN KILLS SISTER",
            "CLOWNS DIE ON STAGE IN ODE TO TARANTINO",
            "DON'T WORRY THEY ARE NOT REALLY DEAD",
            "LONGEST STAGE DEATH EVER",
            "CLOWNS 'ACCIDENTALLY' SET OFF EXPLOSIVES IN THEATRE",
            "CLOWNS PRETEND TO RIDE HORSES FOR AN HOUR",
            "SHOOT 'EM UP STYLE REVENGE PLOT DEVELOPS IN PLAY",
            "CLOWNS COME UP SHORT ATTEMPTING ODE TO TARANTINO",
            "CLOWNS SET HISTORIC THEATRE ON FIRE",
            "CLOWN SISTERS DISCOVER BODY OF JIMMY HOFFA BELOW HISTORIC THEATRE",
            "CLOWNS FOREGO PLAYING TRAGIC HEROINES",
            "LOCAL THEATRE CLOSES DUE TO MOULD CONTAMINATION",
            "LOCAL CLOWN DUO SUED FOR COPYRIGHT INFRINGEMENT",
            "CLOWNS FAIL TO GO GO GO VERY FAR",
            "CLOWN PAIR ABANDON PLAY MID RUN TO START OTHER PLAY",
            "LONG AND WINDING TUTORIAL GOES NOWHERE",
            "4 STARS FOR BRILLIANT TUTORIAL PERFORMANCE",
            "CLOWNS INVITE PLAYERS TO DO THEIR PART",
            "RAMPAGING APATOSAURUSES INTERRUPT TUTORIAL",
            "CLOWN LEAVES LIVE STAGE SHOW TO FOLLOW POTENTIAL OPPORTUNITY OF LOVE",
            "'WORST PLAY EVER' ENDS WITH AUDIENCE STORMING OUT",
            "TWO CLOWNS QUIT THE THEATRE",
            "CLOWNS FALL ASLEEP LIVE ON STAGE",
            "CLOWNS INDICTED FOR INSURANCE FRAUD",
            "COMPLICATED REVENGE PLOT ENDS IN TEARS",
            "MISSING CELEBRITY CLOWN DUO SPOTTED IN NEBRASKA MALL",
            "CLOWNS BURN DOWN LOCAL THEATRE",
            "LOCAL LIONS ATTEMPT TO DEVOUR LOCAL CLOWNS",
            "WRESTLING DISEASE SWEEPS NATION",
            "IT WAS ALL A DREAM",
            "CLOWNS STAGE ON-STAGE PROTEST",
            "NO ONE CARES ABOUT CLOWNS",
            "THE DAY MORRO THOUGHT SHE HAD POWER",
            "CLOWNS SOAR IN A MAGICAL THEATRICAL EVENT",
            "SOME THINGS ARE JUST NOT MEANT FOR THE STAGE. ZERO STAR SHOW ENDS IN CLOWN LITERALLY FALLING OFF THE STAGE",
            "CRASH LANDING AS TWO CLOWNS FALL OFF THE STAGE WHILE TRYING TO FLY",
            "THEATRE OR AVANTE-GARDE NEW ART FORM?",
            "MISHMASH CLOWN SHOW CLOSES ON ITS OPENING NIGHT",
            "CLOWNS MELT UNDER PRESSURE",
            "CLOWNS DROWN TOGETHER ON A BOX",
            "WTF?! A SORT OF THEATRE PIECE GOES AWRY WITH NONSENSICAL TANGENTS AND EMPTY PLOT PROMISES",
            "AND THEY LIVED HAPPILY EVER AFTER IN THE SPARKLE FAIRY PEGA-CORN KINGDOM UNIVERSE",
            "CLOWN SISTERS RISE TO FAME AND POWER",
            "GAS LEAK IN THEATRE LEADS TO 'INTERESTING' SHOW",
            "YOU JUST KISSED A CLOWN",
            "TWO CLOWNS END EPIC ROMANCE WITH GREATEST STAGE KISS OF ALL TIMES",
            "JASP STILL DOESN'T FIND WHAT SHE'S LOOKING FOR",
            "CLOWNS CHASED OUT OF THEATRE BY ANGRY AUDIENCE",
            "MORRO & JASP ANNOUNCE SOLO CAREERS",
            "CLOWNS DRIVEN APART BY CALLOUS PLAYERS",
            "CLOWN SPACE PROGRAM FAILS MISERABLY",
            "MORRO & ASSOCIATES FOIL INTERNATIONAL BOWTIE THIEFS",
            "STUPID CLOWN SHOES PROVE INCREDIBLY POPULAR",
            "MORRO AND JASP JOINTLY NAMED 'MISS TEEN SASKATCHEWAN'",
            "CLOWNS DEVELOP CURE FOR HEPATITIS Q",
            "CLOWNS MATERIALIZE FULL ORCHESTRA OUT OF THIN AIR AND CONJURE MOST MAGICAL ENDING OF ALL TIME",
            "SHOW ENDS IN BIGGEST CHORUS LINE OF ALL TIME",
            "A NEW ERA USHERED IN BY EPIC CLOWN SHOW",
            "THEATRE OVERRUN BY WILD DOGS",
            "REAL SNOW FALLS IN THEATRE",
            "DEFEATIST ENDING TO A BAD PLAY",
            "CLOWNS END UP IN HOLE AND CAN'T PERFORM PLAY",
            "CLOWN TRAGEDY ENDS TRAGICALLY SHORT",
            "CLOWNS TAKE ON FILM NOIR",
            "CLOWNS ARE ANYTHING BUT LORDS OF THE DANCE",
            "CLOWN DANCE PARTY 100% FUN!",
            "SICK PLOT TWIST RUINS PLAY",
            "CLOWNS HOSPITALIZED FOR FOOD POISONING, POOR JUDGEMENT",
            "RUDE AUDIENCE MEMBER RUINS SHOW",
            "YOUR PHONE HAS BEEN FLUSHED DOWN THE TOILET. :(",
            "SECRET AGENT CLOWNS SAVE WORLD YET AGAIN",
            "SHOW CANCELLED SUDDENLY VIA MYSTERIOUS PHONE CALL",
            "A TRAGIC END TO A TRAGIC PLAY",
            "FREAK ACCIDENT SENDS ONE CLOWN TO HOSPITAL",
            "EVERYONE LOVES A SING ALONG",
            "MORRO RIPS IT UP WITH THE UKE SOLO OF THE CENTURY",
            "CLOWNS SABOTAGED",
            "CLOWN SISTERS KILL EACH OTHER IN STAGE DUEL",
            "CLOWN DUO SIGNED BY HIP HOP RECORD LABEL",
            "MORRO AND JASP RUIN RAP FOREVER",
            "STAR TREK PARODY FAILS TO LAUNCH",
            "CLOWN STAR WARS LEAVES EVERYONE BORED",
            "CLOWNS LOST IN SPACE",
            "CLOWN COMEDY NOT VERY FUNNY",
            "CLOWNS THROW PIES... AND NEW SHOW",
            "CLOWNS REINVENT CLASSIC VAUDEVILLE ROUTINE"
        ]
    };

});