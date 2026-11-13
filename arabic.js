/* Patternwork Arabic Foundations — authored Modern Standard Arabic content.
   English teaches the pattern; Arabic examples carry the meaning. */
(function(){
'use strict';
const Q=(prompt,options,correct,explanation,tip)=>({prompt,options,correct,explanation,tip});
const O=(prompt,options,correct,explanation)=>({prompt,options,correct,explanation});

const course={
  id:'arabic-foundations', title:'Arabic from sound to meaning', short:'Arabic Foundations', tag:'ARABIC · LEVEL 1', number:'A1', symbol:'ع', duration:'8 pattern lessons', featured:true,
  description:'Begin with the writing system, then connect sound, meaning and sentence structure through Modern Standard Arabic.',
  objective:'Read unfamiliar forms more carefully, understand foundational sentence patterns, and produce small meaningful contrasts.',
  tone:'blue', resources:[],
  skills:[
    {
      id:'letter-families', title:'One shape, different dots', label:'Lesson 01', kicker:'See the family before naming the letter.',
      pattern:'Arabic letters often belong to shape families. The shared body gives a visual family; the number and position of dots identify the letter.',
      pair:['بَ — one dot below','تَ — two dots above'],
      delta:'The base shape and short vowel stay the same. Only the dots move and multiply, changing ب to ت and changing the consonant sound.',
      anatomy:['Read from right to left.','Notice the shared bowl-shaped body.','Count the dots and locate them above or below.','Name the consonant only after checking the dots.'],
      sketch:'ب  one dot below\nت  two dots above\nث  three dots above\n\nSame shape family; dots carry the contrast.',
      trap:'Do not guess from the base shape alone. ب, ت and ث are different letters even though their bodies are related.',
      transfer:'When two letters look similar, hold the body constant and inspect only the dots.',
      questions:[
        Q('Which letter has one dot below the shared shape?',['ب','ت','ث','ن'],0,'ب is identified by its single dot below the body.','Ignore the vowel mark and inspect the consonant dots.'),
        Q('Which letter has two dots above the shared shape?',['ث','ب','ت','ي'],2,'ت has two dots above the shared ب–ت–ث body.','Count dots before naming the letter.'),
        Q('Which letter has three dots above?',['ت','ث','ب','ن'],1,'ث has three dots above the same basic body.','Keep the body fixed and compare dot number.'),
        Q('The word بَيْت begins with which letter?',['ت','ي','ب','ث'],2,'بَيْت begins on the right with ب, the letter with one dot below.','Arabic begins at the right edge.')
      ]
    },
    {
      id:'short-vowels', title:'The mark changes the vowel', label:'Lesson 02', kicker:'Keep the consonant; move the voice.',
      pattern:'A short vowel can be shown by a small mark around the consonant: fatḥa َ gives a short a, kasra ِ a short i, and ḍamma ُ a short u.',
      pair:['بَ — short a','بِ — short i'],
      delta:'The consonant ب stays fixed. Only the vowel mark moves from above to below, changing the syllable from a short a to a short i.',
      anatomy:['Identify the consonant first.','Look directly above and below it for a vowel mark.','Read fatḥa as short a, kasra as short i, and ḍamma as short u.','Blend consonant and vowel as one syllable.'],
      sketch:'بَ  short a\nبِ  short i\nبُ  short u\n\nSame consonant; one small mark changes the syllable.',
      trap:'The dots that identify a consonant are part of the letter. Short-vowel marks are separate reading guides.',
      transfer:'Hold the consonant still and ask which single vowel mark changed.',
      questions:[
        Q('Which form has a fatḥa and therefore a short a?',['بِ','بُ','بَ','بْ'],2,'The fatḥa is the short diagonal mark above: بَ.','Look above the consonant for a short stroke.'),
        Q('Which form has a kasra and therefore a short i?',['تِ','تَ','تُ','تْ'],0,'The kasra appears below the consonant: تِ.','Look below the letter.'),
        Q('Which form has a ḍamma and therefore a short u?',['نَ','نِ','نُ','نْ'],2,'The small curled mark above ن is the ḍamma: نُ.','Distinguish the curled ḍamma from the straight fatḥa.'),
        Q('What changes between دَ and دِ?',['The consonant','The reading direction','Only the short vowel','The number of letters'],2,'د remains the consonant; fatḥa changes to kasra.','Compare one mark at a time.')
      ]
    },
    {
      id:'long-vowels', title:'A short sound becomes long', label:'Lesson 03', kicker:'One added letter holds the vowel.',
      pattern:'Long vowels use a vowel-bearing letter: ا can lengthen a, ي can lengthen i, and و can lengthen u when the surrounding short vowel supports that reading.',
      pair:['بَ — short a','بَا — long aa'],
      delta:'Only ا is added after بَ. The consonant remains ب, while the vowel is held longer.',
      anatomy:['Read the consonant and its short vowel.','Check the next letter.','After fatḥa, ا can extend a; after kasra, ي can extend i; after ḍamma, و can extend u.','Keep vowel length separate from loudness or stress.'],
      sketch:'بَ  short a  →  بَا  long aa\nبِ  short i  →  بِي  long ii\nبُ  short u  →  بُو  long uu',
      trap:'ا, ي and و are not automatically long vowels in every word. Their role depends on the surrounding pattern.',
      transfer:'Compare the two forms and identify the one added vowel letter.',
      questions:[
        Q('Which form shows a long aa after ب?',['بَ','بِ','بَا','بُ'],2,'بَا adds alif after fatḥa, extending the a sound.','Look for ا after the consonant.'),
        Q('Which letter carries the long ii in فِي?',['ف','ي','ا','و'],1,'In فِي, ي supports the long ii sound.','Read the word from right to left and inspect the second letter.'),
        Q('Which word contains a long uu written with و?',['نُور','نَار','مِن','لَكَ'],0,'In نُور, ḍamma plus و signals the long uu sound.','Look for و following a consonant with ḍamma.'),
        Q('What single addition changes بُ to بُو?',['ي','ا','و','ة'],2,'Adding و after بُ lengthens the u sound.','Keep the starting consonant and short vowel fixed.')
      ]
    },
    {
      id:'definite-article', title:'From a book to the book', label:'Lesson 04', kicker:'A small prefix changes reference.',
      pattern:'The definite article ال attaches to the beginning of a noun. كتاب can mean a book or book; الكتاب means the book.',
      pair:['كتاب — a book / book','الكتاب — the book'],
      delta:'Only ال is added at the beginning on the right. The noun كتاب remains visible inside the definite form.',
      anatomy:['Find the noun.','Look at its right edge for ال.','If ال is attached, interpret the noun as definite in this basic pattern.','Keep ال joined to the noun in writing.'],
      sketch:'كتاب    book / a book\nال + كتاب → الكتاب    the book\n\nThe article attaches on the right, where the word begins.',
      trap:'Do not place a space between ال and its noun. It is written as a connected prefix.',
      transfer:'Strip away ال mentally; if a familiar noun remains, the article changed definiteness rather than the core meaning.',
      questions:[
        Q('Which form means “the house”?',['بيت','البيت','في بيت','بيتي'],1,'البيت contains the definite article ال plus بيت, house.','Look for ال attached at the right edge.'),
        Q('What is added when باب becomes الباب?',['A plural ending','The definite article ال','A past-tense prefix','A question word'],1,'ال is added to make the noun definite: the door.','Separate the prefix from the unchanged noun.'),
        Q('Which noun is indefinite in this basic contrast?',['المدرسة','الكتاب','مسجد','البيت'],2,'مسجد lacks the attached definite article ال.','Check each word’s beginning on the right.'),
        Q('How is ال written with the noun?',['As a separate word after it','Attached at the beginning','As a mark below it','At the end'],1,'The article attaches to the beginning of the noun.','Arabic words begin on the right.')
      ]
    },
    {
      id:'nominal-sentences', title:'A sentence without written “is”', label:'Lesson 05', kicker:'Place the topic beside its description.',
      pattern:'In a basic present-time nominal sentence, Arabic can join a topic and a description without a separate written word for “is.” البيت كبير means “The house is big.”',
      pair:['البيت — the house','البيت كبير — the house is big'],
      delta:'Only كبير is added. It supplies the description; no separate present-tense form of “is” is inserted.',
      anatomy:['Identify the topic at the beginning.','Find the noun or adjective that says something about it.','Supply English “is” when translating the present relation.','Do not add an Arabic verb merely because English uses one.'],
      sketch:'البيت | كبير\nthe house | big\n→ The house is big.\n\nTopic + description forms a complete present relation.',
      trap:'Word-for-word English can hide the Arabic pattern. The missing written “is” is not missing meaning.',
      transfer:'Ask what the first phrase is about and what the second phrase says about it.',
      questions:[
        Q('What does البيت كبير mean?',['The big house','The house is big','A house was big','The house has a door'],1,'The definite topic البيت is followed by the description كبير: The house is big.','Read the two parts as topic and description.'),
        Q('Which Arabic sentence means “The book is new”?',['الكتاب جديد','كتاب الجديد','الجديد كتابًا','في الكتاب'],0,'الكتاب is the topic and جديد describes it, with no separate present “is.”','Choose topic plus description.'),
        Q('In هذا كتاب, what relation is expressed?',['This is a book','The book is here','This book was written','A book is under this'],0,'هذا identifies this, and كتاب supplies what it is: This is a book.','Do not search for a written form of “is.”'),
        Q('What is absent as a separate word in المدرسة قريبة?',['The noun “school”','The adjective “near”','Present-tense “is”','The definite article'],2,'The sentence means “The school is near,” but no standalone present “is” appears.','Compare Arabic structure with the English translation.')
      ]
    },
    {
      id:'agreement', title:'The description mirrors the noun', label:'Lesson 06', kicker:'Watch form travel across a pair.',
      pattern:'An adjective follows its noun and reflects features of that noun. In the basic singular contrast, a feminine noun commonly pairs with a feminine adjective ending in ة.',
      pair:['كتاب جديد — a new book','سيارة جديدة — a new car'],
      delta:'The noun changes from masculine كتاب to feminine سيارة. The adjective changes with it from جديد to جديدة.',
      anatomy:['Find the noun first.','Read the adjective that follows it.','Check whether the noun is masculine or feminine in this pattern.','Match the adjective form: جديد with masculine, جديدة with feminine.'],
      sketch:'كتاب  +  جديد\nmasculine + masculine\n\nسيارة + جديدة\nfeminine + feminine',
      trap:'The final ة is a useful signal, not a universal definition of gender. Learn each noun with its pattern.',
      transfer:'When the noun changes, look for the corresponding change on the adjective.',
      questions:[
        Q('Which phrase correctly means “a new car”?',['سيارة جديد','سيارة جديدة','جديدة كتاب','الكتاب جديدة'],1,'سيارة is feminine here, so the following adjective takes the feminine form جديدة.','Match the adjective to the noun.'),
        Q('Which adjective fits كتاب in the basic singular pattern?',['جديدة','جديد','جديدات','الجديدة'],1,'كتاب is treated as masculine, so جديد is the matching form.','Check gender before choosing the adjective ending.'),
        Q('What changes between كتاب جديد and سيارة جديدة?',['Only word order','The noun’s gender pattern and the adjective form','The sentence becomes past tense','The adjective moves before the noun'],1,'The feminine noun triggers the corresponding feminine adjective form.','Track the relation across both words.'),
        Q('Where does the adjective normally appear in these examples?',['Before the noun','After the noun','Inside ال','As a vowel mark'],1,'The adjective follows the noun: كتاب جديد.','Read the pair from right to left.')
      ]
    },
    {
      id:'root-families', title:'A root travels through a family', label:'Lesson 07', kicker:'Keep the consonants; change the role.',
      pattern:'Many Arabic words belong to consonantal root families. The root ك–ت–ب carries a field connected with writing, while different patterns shape words such as كَتَبَ, كِتَاب and كَاتِب.',
      pair:['كَتَبَ — he wrote','كَاتِب — writer'],
      delta:'The root consonants ك, ت and ب remain in order. The internal vowels and added ا reshape the grammatical role and meaning.',
      anatomy:['Look for recurring consonants in the same order.','Separate those consonants from added vowels or letters.','Treat the root as a meaning field, not a complete translation.','Use the full pattern to identify the actual word.'],
      sketch:'ك ـ ت ـ ب  writing field\nكَتَبَ   he wrote\nكِتَاب   book\nكَاتِب   writer\nمَكْتَبَة library',
      trap:'A root does not determine one exact meaning. The word pattern and context do the rest of the work.',
      transfer:'Circle the consonants that persist, then name what the surrounding pattern changed.',
      questions:[
        Q('Which consonants form the shared root of كَتَبَ and كِتَاب?',['ك–ب–ر','ك–ت–ب','ت–ا–ب','م–ك–ت'],1,'Both words preserve ك, then ت, then ب.','Ignore the changing vowels and added long-vowel letters.'),
        Q('Which word most clearly belongs to the ك–ت–ب family?',['مَدْرَسَة','كِتَاب','بَيْت','سَيَّارَة'],1,'كِتَاب contains the root consonants ك–ت–ب in order.','Track consonant order, not just one shared letter.'),
        Q('What does the root usually provide?',['One fixed translation','A broad field of related meaning','The sentence’s punctuation','Only the final vowel'],1,'The root suggests a semantic field; the pattern specifies the word.','Separate family resemblance from exact meaning.'),
        Q('What changes from كَتَبَ to كَاتِب?',['The root consonants disappear','The pattern and grammatical role','Arabic reading direction','The letter ب becomes ت'],1,'The same root is fitted into a different pattern, shifting from a past action to a person associated with writing.','Hold ك–ت–ب constant.')
      ]
    },
    {
      id:'present-prefixes', title:'The prefix points to the person', label:'Lesson 08', kicker:'One edge of the verb carries the subject pattern.',
      pattern:'In the present tense, a prefix helps mark the subject: أكتب “I write,” يكتب “he writes,” تكتب “she writes,” and نكتب “we write.”',
      pair:['هُوَ يَكْتُبُ — he writes','هِيَ تَكْتُبُ — she writes'],
      delta:'The lexical stem remains connected to writing. The pronoun changes from هو to هي and the verb prefix changes from يـ to تـ.',
      anatomy:['Find the subject pronoun when it is present.','Inspect the verb’s first letter on the right.','Match أ with I, ي with he, ت with she in this controlled set, and ن with we.','Keep the shared verb stem separate from the person prefix.'],
      sketch:'أنا أكتب   I write\nهو يكتب    he writes\nهي تكتب    she writes\nنحن نكتب   we write',
      trap:'A prefix is evidence, but context still matters. تـ can serve more than one subject pattern beyond this first controlled contrast.',
      transfer:'Hold the verb meaning constant and compare only the pronoun and prefix.',
      questions:[
        Q('Which form means “I write”?',['يكتب','تكتب','أكتب','نكتب'],2,'أكتب begins with the first-person singular prefix أ.','Match أنا with أـ.'),
        Q('Which form completes هُوَ ___ for “he writes”?',['يكتب','أكتب','نكتب','تكتب'],0,'هو pairs with يكتب in this controlled present-tense pattern.','Look for the يـ prefix.'),
        Q('What changes between هو يكتب and هي تكتب?',['The root meaning only','The pronoun and present-tense prefix','The reading direction','The word becomes a noun'],1,'هو/هي changes together with يـ/تـ while the writing stem remains related.','Track the subject marker at the verb’s beginning.'),
        Q('Which form means “we write”?',['أكتب','يكتب','نكتب','تكتب'],2,'نكتب uses the first-person plural prefix نـ.','Match نحن with نـ.')
      ]
    }
  ]
};

const practice={
  'arabic-foundations/letter-families':[
    Q('Which letter begins the word تُفَّاح?',['ب','ت','ث','ي'],1,'تُفَّاح begins with ت, recognized by two dots above.','Start on the right and inspect the dots.'),
    Q('Which letter begins ثَوْب?',['ت','ن','ث','ب'],2,'ثَوْب begins with ث, which has three dots above.','Count all three dots.'),
    Q('Which letter completes the shape family ب، ت، ___?',['ث','ج','د','ر'],0,'ث shares the base body and differs through three dots above.','Keep the body constant.'),
    Q('In بَاب, which consonant appears at both edges?',['ا','ت','ب','ث'],2,'ب appears at the beginning and end, with ا between them.','Read from the right, then check the final consonant.')
  ],
  'arabic-foundations/short-vowels':[
    Q('Which syllable begins with م and has a short i?',['مَ','مِ','مُ','مْ'],1,'مِ has kasra below the consonant, giving short i.','Look below م.'),
    Q('Which syllable has a short u?',['لَ','لِ','لُ','لْ'],2,'لُ has ḍamma above, giving short u.','Find the curled mark.'),
    Q('What vowel contrast separates سَ and سُ?',['Short a versus short u','Short i versus long i','No vowel versus short a','Long a versus long u'],0,'Fatḥa gives short a; ḍamma gives short u.','Name the two marks in order.'),
    Q('Which form places the vowel mark below ر?',['رُ','رَ','رِ','رْ'],2,'Kasra is written below: رِ.','Inspect the lower side of the letter.')
  ],
  'arabic-foundations/long-vowels':[
    Q('Which form lengthens the a sound after ت?',['تَ','تَا','تُ','تِ'],1,'تَا adds alif after fatḥa to extend a.','Look for ا after ت.'),
    Q('Which word shows a long ii with ي?',['فِي','فَ','فُو','فَا'],0,'فِي uses kasra followed by ي for long ii.','Find ي after the consonant.'),
    Q('Which form shows long uu after س?',['سِ','سَا','سُو','سَ'],2,'سُو combines ḍamma with و to lengthen u.','Look for و after ḍamma.'),
    Q('What changes from نَ to نَا?',['A new consonant root','The a vowel becomes long','The word becomes definite','The dots move'],1,'Adding ا holds the a sound longer.','Identify the single added letter.')
  ],
  'arabic-foundations/definite-article':[
    Q('Which form means “the school”?',['مدرسة','المدرسة','في مدرسة','مدرستي'],1,'المدرسة has ال attached to make the noun definite.','Inspect the right edge for ال.'),
    Q('Remove ال from المسجد. What noun remains?',['مسجد','ال','سجد','مدرسة'],0,'Removing the article leaves مسجد, mosque.','Separate only the attached prefix.'),
    Q('Which pair contrasts “a door” with “the door”?',['باب / الباب','البيت / بيتنا','كتاب / كاتب','مدرسة / مدارس'],0,'باب lacks the article; الباب adds ال to the same noun.','Find the pair with one controlled addition.'),
    Q('Where does the definite article appear in الكتاب?',['At the word’s beginning on the right','At the end on the left','Below the final letter','As a separate following word'],0,'ال is attached at the beginning, which is on the right.','Use Arabic reading direction.')
  ],
  'arabic-foundations/nominal-sentences':[
    Q('Which sentence means “The room is small”?',['الغرفة صغيرة','غرفة الصغير','الصغيرة غرفةً','في الغرفة'],0,'الغرفة is the topic and صغيرة is its description.','Look for topic followed by a property.'),
    Q('Translate الكتاب مفيد.',['The useful book','The book is useful','A book was useful','Use the book'],1,'The definite topic الكتاب plus مفيد forms “The book is useful.”','Supply present “is” in English, not Arabic.'),
    Q('Which part describes the topic in الماء بارد?',['الماء','بارد','ال','ماء'],1,'بارد says that the water is cold.','Find what is asserted about the first phrase.'),
    Q('Why is no separate Arabic word for “is” needed in هذا مسجد?',['The sentence is past tense','The present nominal pattern joins topic and description directly','مسجد is a verb','هذا means “was”'],1,'The basic present nominal sentence expresses the relation without a copular verb.','Use the structural pattern, not English word count.')
  ],
  'arabic-foundations/agreement':[
    Q('Which phrase correctly means “a big school”?',['مدرسة كبير','مدرسة كبيرة','كبير مدرسة','المدرسة كبير'],1,'مدرسة is feminine in this pattern, so كبيرة agrees with it.','Match the adjective ending to the noun.'),
    Q('Choose the matching adjective for بيت ___.',['صغيرة','صغير','صغيرات','الصغيرة'],1,'بيت is masculine here, so صغير is the basic matching adjective.','Check noun gender before adjective form.'),
    Q('Which pair shows masculine agreement?',['سيارة سريعة','بنت صغيرة','كتاب مفيد','مدرسة جديدة'],2,'كتاب and مفيد are both masculine singular forms in this contrast.','Find the pair without the feminine ة pattern.'),
    Q('What form mirrors a feminine noun such as مدينة?',['جميل','جميلة','جمال','الجميل'],1,'جميلة is the feminine adjective form that matches مدينة in this basic pattern.','Look for the corresponding ة ending.')
  ],
  'arabic-foundations/root-families':[
    Q('Which word belongs to the د–ر–س study family?',['مَدْرَسَة','كِتَاب','بَاب','طَعَام'],0,'مَدْرَسَة preserves د, ر and س and belongs to the study/school family.','Track the three consonants in order.'),
    Q('What is shared by دَرَسَ and دَرْس?',['Every vowel','The root د–ر–س','The definite article','The same grammatical role'],1,'Both forms preserve the root consonants د–ر–س.','Ignore changed vowels and word roles.'),
    Q('Which statement about roots is safest?',['A root is a complete sentence','A root suggests a meaning field','Every root has one English word','Roots remove the need for context'],1,'Roots organize related meaning, while patterns and context specify the word.','Avoid one-to-one translation claims.'),
    Q('In مَكْتَبَة, which root appears?',['م–ك–ت','ك–ت–ب','ت–ب–ة','ب–ت–ك'],1,'The word contains ك, ت and ب in order inside its larger pattern.','Separate added م and ة from the recurring consonants.')
  ],
  'arabic-foundations/present-prefixes':[
    Q('Complete أَنَا ___ for “I study.”',['يَدْرُسُ','تَدْرُسُ','أَدْرُسُ','نَدْرُسُ'],2,'أنا pairs with the first-person prefix أـ: أدرس.','Match the subject to the prefix.'),
    Q('Complete نَحْنُ ___ for “We study.”',['أَدْرُسُ','نَدْرُسُ','يَدْرُسُ','تَدْرُسُ'],1,'نحن pairs with نـ: ندرس.','Look for the we-prefix نـ.'),
    Q('Which change marks “he studies” versus “she studies” here?',['يـ versus تـ','أـ versus نـ','A final ال','Removing the verb'],0,'يدرس uses يـ for he; تدرس uses تـ for she in this controlled pair.','Inspect the verb’s first letter.'),
    Q('Which form fits هِيَ in “She reads”?',['يَقْرَأُ','تَقْرَأُ','أَقْرَأُ','نَقْرَأُ'],1,'هي pairs with the تـ form تقرأ.','Hold the reading stem and change only the person prefix.')
  ]
};

const retests={
  'arabic-foundations/letter-families':[
    Q('Which consonant has one dot below?',['ت','ث','ب','ن'],2,'ب is the member of this shape family with one dot below.','Check location as well as count.'),
    Q('Which consonant has three dots above?',['ب','ث','ت','ي'],1,'ث has three dots above.','Count the dots on the shared body.'),
    Q('Which letter begins تِين?',['ت','ب','ث','ي'],0,'تِين begins with ت on the right.','Start at the word’s right edge.'),
    Q('What distinguishes ب from ت?',['Reading direction','Dot number and position','A long vowel','The definite article'],1,'ب has one dot below; ت has two above.','Hold the base body constant.')
  ],
  'arabic-foundations/short-vowels':[
    Q('Which form reads with short a?',['كَ','كِ','كُ','كْ'],0,'Fatḥa above ك gives short a: كَ.','Find the straight mark above.'),
    Q('Which form reads with short i?',['دُ','دَ','دِ','دْ'],2,'Kasra below د gives short i: دِ.','Inspect below the consonant.'),
    Q('Which form reads with short u?',['رِ','رُ','رَ','رْ'],1,'Ḍamma above ر gives short u: رُ.','Find the curled mark.'),
    Q('What stays unchanged in لَ / لِ / لُ?',['The short vowel','The consonant ل','The mark location','The syllable sound'],1,'ل remains fixed while the vowel mark changes.','Separate letter identity from vowel guidance.')
  ],
  'arabic-foundations/long-vowels':[
    Q('Which form contains long aa?',['مَ','مَا','مِ','مُ'],1,'مَا adds ا after fatḥa and lengthens a.','Look for the following alif.'),
    Q('Which form contains long ii?',['بَا','بُو','بِي','بَ'],2,'بِي uses kasra plus ي for long ii.','Find the matching vowel letter.'),
    Q('Which form contains long uu?',['لُو','لَا','لِي','لَ'],0,'لُو uses ḍamma plus و for long uu.','Inspect the letter following ḍamma.'),
    Q('What does adding ا after fatḥa normally change in this lesson?',['Definiteness','Vowel length','Consonant identity','Word order'],1,'The added ا lengthens a.','Focus on duration, not stress.')
  ],
  'arabic-foundations/definite-article':[
    Q('Which word is definite?',['قلم','بيت','القلم','كتاب'],2,'القلم has the attached definite article ال.','Check the beginning on the right.'),
    Q('What does البيت contain beyond بيت?',['A plural suffix','The article ال','A past verb','A feminine adjective'],1,'ال is attached to بيت to make “the house.”','Remove only the prefix.'),
    Q('Which pair changes only definiteness?',['مسجد / المسجد','كتاب / كاتب','بيت / بيوت','مدرسة / معلمة'],0,'المسجد adds ال to the unchanged noun مسجد.','Look for one controlled prefix addition.'),
    Q('How should ال appear with كتاب?',['ال كتاب','كتاب ال','الكتاب','كتالاب'],2,'The article is attached: الكتاب.','Do not insert a space.')
  ],
  'arabic-foundations/nominal-sentences':[
    Q('Translate الجو جميل.',['The weather is beautiful','Beautiful weather only','The weather was beautiful','The weather has beauty'],0,'The topic الجو and description جميل form “The weather is beautiful.”','Supply present “is” in English.'),
    Q('Which sentence means “The lesson is easy”?',['الدرس سهل','درس السهل','سهل الدرسَ','في الدرس'],0,'الدرس is the topic; سهل is its description.','Choose topic plus property.'),
    Q('In القهوة ساخنة, which word is the description?',['القهوة','ساخنة','ال','قهوة'],1,'ساخنة describes the coffee as hot.','Inspect the second part.'),
    Q('What makes هذا بيت a complete basic present relation?',['A hidden past suffix','A topic and what it is','A written verb meaning “is”','A definite article on both words'],1,'هذا presents the topic and بيت identifies it: This is a house.','Use the Arabic nominal pattern.')
  ],
  'arabic-foundations/agreement':[
    Q('Which phrase has matching feminine forms?',['باب كبيرة','حديقة جميلة','كتاب جديدة','بيت صغيرة'],1,'حديقة and جميلة form a matching feminine singular pair.','Check both noun and adjective.'),
    Q('Which phrase has matching masculine forms?',['سيارة سريع','مدرسة جديد','قلم جديد','مدينة جميل'],2,'قلم and جديد are masculine singular forms here.','Avoid the mismatched pairs.'),
    Q('To describe بنت as “small,” choose:',['صغير','صغيرة','صغار','الصغير'],1,'بنت is feminine here, so صغيرة agrees.','Use the feminine adjective form.'),
    Q('What remains stable when كتاب جديد becomes بيت جديد?',['The masculine adjective form','The noun meaning','The number of nouns','The definite article'],0,'Both nouns are masculine in this controlled set, so جديد remains unchanged.','Ask which agreement feature stayed the same.')
  ],
  'arabic-foundations/root-families':[
    Q('Which root links عَلِمَ and عِلْم?',['ع–ل–م','ل–م–ع','ع–م–ل','م–ل–ك'],0,'Both preserve ع, ل and م in order within a knowledge-related family.','Track recurring consonants.'),
    Q('Which word belongs to the ك–ت–ب family?',['مَكْتَب','مَلْعَب','مَطْعَم','مَدْخَل'],0,'مَكْتَب contains ك–ت–ب and relates to writing/office.','Look through the added م and vowels.'),
    Q('Why can two words share a root but differ in meaning?',['The root is erased','Different patterns shape roles and meanings','Arabic has no consonants','One word must be wrong'],1,'The root supplies a field; the pattern and context specify the word.','Inspect more than the three consonants.'),
    Q('What stays in order across كَتَبَ, كِتَاب and كَاتِب?',['All vowels','ك–ت–ب','Every added letter','The grammatical category'],1,'The three root consonants remain in order.','Hold the consonantal spine constant.')
  ],
  'arabic-foundations/present-prefixes':[
    Q('Which verb form pairs with أَنَا for “I read”?',['أَقْرَأُ','يَقْرَأُ','تَقْرَأُ','نَقْرَأُ'],0,'أنا takes the أـ form: أقرأ.','Match the first-person prefix.'),
    Q('Which verb form pairs with نَحْنُ for “We write”?',['يكتب','تكتب','نكتب','أكتب'],2,'نحن takes نكتب with نـ.','Look for the plural speaker prefix.'),
    Q('Which pair correctly contrasts he and she?',['هو تكتب / هي يكتب','هو يكتب / هي تكتب','هو أكتب / هي نكتب','هو نكتب / هي أكتب'],1,'هو يكتب and هي تكتب show the controlled يـ/تـ contrast.','Match both pronouns and prefixes.'),
    Q('What is shared by أكتب, يكتب, تكتب and نكتب?',['The person prefix','The writing-related stem','The subject pronoun','The English subject'],1,'The writing-related stem persists while the prefix changes.','Separate lexical meaning from person marking.')
  ]
};

const observations={
  'arabic-foundations/letter-families':{
    stable:O('What stays the same between بَ and تَ?',['The base letter shape and fatḥa','The dot count','The consonant sound'],0,'The body and short-vowel mark remain; the identifying dots change.'),
    changed:O('What is the controlled change?',['Reading direction','Dot number and position','The addition of ال'],1,'One dot below becomes two dots above, changing the letter.')
  },
  'arabic-foundations/short-vowels':{
    stable:O('What remains fixed in بَ and بِ?',['The vowel sound','The mark position','The consonant ب'],2,'The consonant remains ب.'),
    changed:O('What moves?',['The vowel mark from above to below','The consonant dots','The reading direction'],0,'Fatḥa above changes to kasra below.')
  },
  'arabic-foundations/long-vowels':{
    stable:O('What stays the same in بَ and بَا?',['The consonant ب and starting fatḥa','The vowel length','The number of letters'],0,'Both begin with بَ.'),
    changed:O('What creates the long vowel?',['A second dot','Adding ا after بَ','Adding ال'],1,'The added alif lengthens the a sound.')
  },
  'arabic-foundations/definite-article':{
    stable:O('What remains visible in كتاب and الكتاب?',['The noun كتاب','The article ال','An adjective'],0,'The noun stays intact inside the definite form.'),
    changed:O('What is added?',['A long-vowel mark','The prefix ال','A plural ending'],1,'ال attaches at the beginning to mark definiteness.')
  },
  'arabic-foundations/nominal-sentences':{
    stable:O('What is the topic in both examples?',['كبير','The present verb “is”','البيت'],2,'Both expressions begin with the definite topic البيت.'),
    changed:O('What turns the noun phrase into a statement?',['Adding the description كبير','Adding a past verb','Removing the topic'],0,'كبير adds a property and completes the present nominal sentence.')
  },
  'arabic-foundations/agreement':{
    stable:O('What relation stays the same?',['The adjective precedes the noun','A noun is followed by a matching adjective','Both nouns are masculine'],1,'Both examples use noun followed by an agreeing adjective.'),
    changed:O('What changes together?',['Only punctuation','Only reading direction','The noun’s gender pattern and adjective form'],2,'The feminine noun pairs with the feminine adjective form.')
  },
  'arabic-foundations/root-families':{
    stable:O('What persists in كَتَبَ and كَاتِب?',['The consonants ك–ت–ب in order','Every vowel','The grammatical role'],0,'The root consonants stay in order.'),
    changed:O('What creates the different word?',['Reading left to right','The surrounding word pattern','A definite article'],1,'Vowels and added letters reshape meaning and role around the root.')
  },
  'arabic-foundations/present-prefixes':{
    stable:O('What is shared by يكتب and تكتب?',['The subject gender','The person prefix','The writing-related stem'],2,'The lexical stem remains connected to writing.'),
    changed:O('What marks he versus she here?',['The initial prefix يـ versus تـ','A final article','The number of root consonants'],0,'The prefix changes with the subject pronoun.')
  }
};

const connections={
  'arabic-foundations/letter-families':['arabic-foundations/short-vowels','arabic-foundations/long-vowels'],
  'arabic-foundations/short-vowels':['arabic-foundations/letter-families','arabic-foundations/long-vowels'],
  'arabic-foundations/long-vowels':['arabic-foundations/short-vowels','arabic-foundations/definite-article'],
  'arabic-foundations/definite-article':['arabic-foundations/nominal-sentences','arabic-foundations/agreement'],
  'arabic-foundations/nominal-sentences':['arabic-foundations/agreement','arabic-foundations/present-prefixes'],
  'arabic-foundations/agreement':['arabic-foundations/nominal-sentences','arabic-foundations/root-families'],
  'arabic-foundations/root-families':['arabic-foundations/present-prefixes','arabic-foundations/long-vowels'],
  'arabic-foundations/present-prefixes':['arabic-foundations/root-families','arabic-foundations/nominal-sentences']
};

window.PATTERN_CONTENT.courses.unshift(course);
window.PATTERN_ARABIC={course,practice,retests,observations,connections};
})();
