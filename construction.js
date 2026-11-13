/* Patternwork 5.1 — the same method in every pathway.
   1. Three-way comparison. Real comparisons are rarely perfectly controlled, so every
      pattern names the VARIABLE under study, the INVARIANT, and asks what ELSE differs
      (sometimes nothing; sometimes vocabulary, script, word order or a co-varying signal).
   2. Construction. Before the model representation is shown, the learner builds it from
      tiles into slots. Structures are checked exactly; specific wrong structures map to
      named misconceptions. Nothing here uses AI or leaves the device.

   Authoring: other.options[0] is the authored answer; place() rotates its position.
   build.rows[].answers lists every acceptable tile sequence (ordered unless unordered:true). */
(function(){
'use strict';
const P={};
const add=(id,spec)=>{P[id]=spec;};

/* ---------------- Arabic Foundations ---------------- */
add('arabic-foundations/letter-families',{
 variable:'The number and position of dots',
 other:{options:['Nothing else: the letter body and the fatḥa stay identical','The vowel mark changes too','The letter body changes too'],explanation:'The body and the fatḥa are untouched. The new sound (b → t) is the result of the variable, not a second change.'},
 build:{prompt:'Build each letter from a body and a dot pattern.',rtl:false,tiles:['Shared body (as in ب ت ث)','One dot below','Two dots above','Three dots above'],
  rows:[{label:'ب',slots:2,unordered:true,answers:[['Shared body (as in ب ت ث)','One dot below']]},{label:'ت',slots:2,unordered:true,answers:[['Shared body (as in ب ت ث)','Two dots above']]},{label:'ث',slots:2,unordered:true,answers:[['Shared body (as in ب ت ث)','Three dots above']]}],
  misconceptions:[{row:1,seq:['Shared body (as in ب ت ث)','One dot below'],feedback:'That is ب. The body is right, but ت has two dots above.'},{row:2,seq:['Shared body (as in ب ت ث)','Two dots above'],feedback:'That is ت. ث has three dots above.'}],
  hint:'Every row uses the same body. Only the dots decide the letter.',
  explain:'All three letters share one body; the dots alone carry the contrast.'}
});
add('arabic-foundations/short-vowels',{
 variable:'Which short-vowel mark the consonant carries',
 other:{options:['Nothing else: the consonant ب and its dot stay the same','The consonant changes from ب to ت','The word gains a long-vowel letter'],explanation:'Only the mark moves; the consonant and its dot are constant.'},
 build:{prompt:'Build each syllable from a consonant and a vowel mark.',tiles:['ب','ت','fatḥa — short a (stroke above)','kasra — short i (stroke below)','ḍamma — short u (small و above)'],
  rows:[{label:'ba',slots:2,unordered:true,answers:[['ب','fatḥa — short a (stroke above)']]},{label:'bi',slots:2,unordered:true,answers:[['ب','kasra — short i (stroke below)']]},{label:'bu',slots:2,unordered:true,answers:[['ب','ḍamma — short u (small و above)']]}],
  misconceptions:[{row:1,seq:['ب','fatḥa — short a (stroke above)'],feedback:'Fatḥa gives a. For i, the stroke goes below: kasra.'},{row:0,seq:['ت','fatḥa — short a (stroke above)'],feedback:'ت is a different consonant (t). Keep ب; only the mark changes.'}],
  hint:'Hold the consonant still; choose only the mark.',
  explain:'One consonant, three marks, three syllables.'}
});
add('arabic-foundations/long-vowels',{
 variable:'An added vowel-lengthening letter',
 other:{options:['Nothing else: the consonant and the fatḥa stay; only ا is added','The consonant changes','The short-vowel mark changes to kasra'],explanation:'بَ is fully preserved inside بَا.'},
 build:{prompt:'Make each long vowel: choose the short syllable, then the letter that lengthens it.',rtl:true,tiles:['بَ','بِ','بُ','ا','ي','و'],
  rows:[{label:'baa',slots:2,answers:[['بَ','ا']]},{label:'bii',slots:2,answers:[['بِ','ي']]},{label:'buu',slots:2,answers:[['بُ','و']]}],
  misconceptions:[{row:0,seq:['بَ','و'],feedback:'و lengthens u after ḍamma. After fatḥa, ا lengthens a.'},{row:1,seq:['بِ','ا'],feedback:'After kasra, ي lengthens i; ا lengthens a.'}],
  hint:'Match the long letter to the short vowel already on the consonant.',
  explain:'Short vowel + matching letter: a+ا, i+ي, u+و.'}
});
add('arabic-foundations/definite-article',{
 variable:'The presence of ال',
 other:{options:['Nothing else: كتاب stays fully visible; only ال is added','The noun changes to a different word','An adjective is added'],explanation:'“A book” becoming “the book” is the effect of ال, not a second change.'},
 build:{prompt:'Build each phrase. Arabic is read from the right, so the first slot is on the right.',rtl:true,tiles:['ال','كتاب','بيت','ة'],
  rows:[{label:'a book',slots:1,answers:[['كتاب']]},{label:'the book',slots:2,answers:[['ال','كتاب']]},{label:'the house',slots:2,answers:[['ال','بيت']]}],
  misconceptions:[{row:1,seq:['كتاب','ال'],feedback:'ال comes at the beginning of the word, which in Arabic script is on the right: ال + كتاب = الكتاب.'},{row:0,seq:['ال'],feedback:'ال alone is the article; the noun itself is كتاب.'}],
  hint:'The article attaches where the word begins.',
  explain:'ال + noun, attached at the start: الكتاب, البيت.'}
});
add('arabic-foundations/nominal-sentences',{
 variable:'An added description',
 other:{options:['Nothing else: البيت stays; only كبير is added','A verb meaning “is” is added','The topic changes to a different noun'],explanation:'No word for “is” appears; the sentence comes from topic + description.'},
 build:{prompt:'Build a sentence and a phrase from the same words. The first slot is on the right.',rtl:true,tiles:['البيت','كبير','الكبير','هو'],
  rows:[{label:'The house is big.',slots:2,answers:[['البيت','كبير']]},{label:'the big house',slots:2,answers:[['البيت','الكبير']]}],
  misconceptions:[{row:0,seq:['البيت','الكبير'],feedback:'With ال on both words this is a phrase, “the big house”. For the sentence, the description has no ال.'},{row:1,seq:['البيت','كبير'],feedback:'Without ال on the adjective this is the sentence “the house is big”. The phrase needs الكبير.'},{row:0,seq:['البيت','هو'],feedback:'هو means “he/it”; Arabic needs no separate word for “is” here. Use the description كبير.'}],
  hint:'Definite + indefinite makes a sentence; definite + definite makes a phrase.',
  explain:'البيت كبير is a statement; البيت الكبير is one noun phrase.'}
});
add('arabic-foundations/agreement',{
 variable:'The noun’s gender, mirrored on the adjective',
 other:{options:['The noun is a different word (book → car), not only a different gender','Nothing else: only gender changes','The adjective moves before the noun'],explanation:'كتاب and سيارة differ in meaning as well as gender. A cleaner pair holds the noun’s meaning: طالب جديد / طالبة جديدة, a new (male / female) student — which you build next.'},
 build:{prompt:'Build a cleaner minimal pair: the same noun meaning, two genders. The first slot is on the right.',rtl:true,tiles:['طالب','طالبة','جديد','جديدة'],
  rows:[{label:'a new student (male)',slots:2,answers:[['طالب','جديد']]},{label:'a new student (female)',slots:2,answers:[['طالبة','جديدة']]}],
  misconceptions:[{row:1,seq:['طالبة','جديد'],feedback:'The adjective must mirror the feminine noun: جديدة.'},{row:0,seq:['جديد','طالب'],feedback:'The adjective follows the noun: طالب جديد.'},{row:1,seq:['جديدة','طالبة'],feedback:'The adjective follows the noun: طالبة جديدة.'}],
  hint:'Noun first (on the right), then an adjective that matches it.',
  explain:'Now only gender varies — and the adjective follows the noun’s gender.'}
});
add('arabic-foundations/root-families',{
 variable:'The vowel pattern around the root',
 other:{options:['Nothing else: the shift from “he wrote” to “writer” is what the pattern itself does','The root consonants change','A definite article is added'],explanation:'ك–ت–ب persists; the change in meaning and word class is the effect of the pattern.'},
 build:{joiner:'–',prompt:'Extract the three root consonants of each word, in order. The first slot is on the right.',rtl:true,tiles:['ك','ت','ب','د','ر','س','م','ا','ة'],
  rows:[{label:'كَاتِب (writer)',slots:3,answers:[['ك','ت','ب']]},{label:'مَدْرَسَة (school)',slots:3,answers:[['د','ر','س']]}],
  misconceptions:[{row:1,seq:['م','د','ر'],feedback:'م belongs to the place pattern (ma-…-a), not the root. The root is د–ر–س.'},{row:0,seq:['ك','ا','ت'],feedback:'ا is part of the pattern that makes “writer”, not a root consonant: ك–ت–ب.'}],
  hint:'Strip away the pattern letters (م, ا, ة) and keep the consonants that recur across the family.',
  explain:'Roots carry the field; patterns build the words.'}
});
add('arabic-foundations/present-prefixes',{
 variable:'The person prefix on the verb',
 other:{options:['The separate pronoun also changes (هو → هي), so two signals mark the subject','Nothing else changes','The verb stem changes'],explanation:'The pronoun and the prefix co-vary. The prefix is the variable under study, but the pronoun is a second, supporting signal.'},
 build:{prompt:'Build each present-tense verb from a person prefix and the stem. The first slot is on the right.',rtl:true,tiles:['أ','يـ','تـ','نـ','كتب'],
  rows:[{label:'I write',slots:2,answers:[['أ','كتب']]},{label:'he writes',slots:2,answers:[['يـ','كتب']]},{label:'she writes',slots:2,answers:[['تـ','كتب']]},{label:'we write',slots:2,answers:[['نـ','كتب']]}],
  misconceptions:[{row:2,seq:['يـ','كتب'],feedback:'يـ marks “he”. “She” takes تـ (which also serves “you”, masculine).'},{row:1,seq:['كتب','يـ'],feedback:'The person marker is a prefix: it comes first, on the right.'}],
  hint:'Keep the stem; change only the prefix.',
  explain:'One stem, four prefixes, four subjects.'}
});

/* ---------------- Syntax & structure ---------------- */
add('syntax/constituents',{
 variable:'An added modifier inside the subject NP',
 other:{options:['Nothing else: the determiner, the head noun and the verb stay','The verb changes','A new object is added'],explanation:'Only careful is added; everything else is preserved.'},
 build:{prompt:'Build the subject NP of “The careful student laughed.”',tiles:['D','N′','AP','N','VP','PP'],
  rows:[{label:'NP →',slots:2,answers:[['D','N′']]},{label:'N′ →',slots:2,answers:[['AP','N′']]},{label:'N′ →',slots:1,answers:[['N']]}],
  misconceptions:[{row:0,seq:['AP','N′'],feedback:'The determiner “the” is part of the NP, outside the modifier layer: NP → D + N′.'},{row:1,seq:['N′','AP'],feedback:'In English this adjective precedes the noun it modifies: N′ → AP + N′.'},{row:1,seq:['AP','VP'],feedback:'Careful modifies student, not the verb; keep it inside the NP.'}],
  hint:'Work from the outside in: determiner, then modifier layer, then the head noun.',
  explain:'The added AP creates one new layer inside the NP; nothing outside it changes.'}
});
add('syntax/complements',{
 variable:'An added adjunct',
 other:{options:['Nothing else: Nina, opened and the suitcase stay','The object changes','The verb changes tense'],explanation:'Only quietly is added.'},
 build:{prompt:'Build the VP of “Nina opened the suitcase quietly.”',tiles:['V','V′','NP','AdvP','PP'],
  rows:[{label:'VP →',slots:2,answers:[['V′','AdvP']]},{label:'V′ →',slots:2,answers:[['V','NP']]}],
  misconceptions:[{row:1,seq:['V','AdvP'],feedback:'Quietly is an adjunct. The complement inside V′ is the object NP: V′ → V + NP.'},{row:0,seq:['V','NP'],feedback:'That leaves no place for quietly. The adjunct attaches above V′: VP → V′ + AdvP.'}],
  hint:'The complement sits closest to the verb; the adjunct attaches outside.',
  explain:'Complement inside (V + NP); adjunct outside (V′ + AdvP).'}
});
add('syntax/attachment',{
 variable:'Where the PP attaches',
 other:{options:['No words differ at all; only the analysis differs','The preposition changes','The verb changes tense'],explanation:'This is the most controlled pair in the course: identical strings, two structures.'},
 build:{prompt:'Attach “with binoculars” for each reading of “I saw the guide with binoculars.”',tiles:['N′','V′','PP','NP','V'],
  rows:[{label:'The guide has binoculars: N′ →',slots:2,answers:[['N′','PP']]},{label:'I used binoculars: VP →',slots:2,answers:[['V′','PP']]}],
  misconceptions:[{row:0,seq:['V′','PP'],feedback:'That attaches the PP to the seeing, so I have the binoculars. For the guide to have them, attach inside the object NP: N′ → N′ + PP.'},{row:1,seq:['N′','PP'],feedback:'That puts the binoculars with the guide. For the instrument reading, attach at the VP: VP → V′ + PP.'}],
  hint:'Ask what the PP modifies, then attach it to that constituent.',
  explain:'Same PP, same words; the attachment site decides the meaning.'}
});
add('syntax/verbs',{
 variable:'An added recipient complement',
 other:{options:['Nothing else: the subject, verb and object stay','The object NP changes','The verb changes'],explanation:'Only to Mara is added.'},
 build:{prompt:'Build what each verb calls for, as used here.',tiles:['V','NP','PP','AP'],
  rows:[{label:'sleep: VP →',slots:1,answers:[['V']]},{label:'read the book: VP →',slots:2,answers:[['V','NP']]},{label:'hand the book to Mara: VP →',slots:3,answers:[['V','NP','PP']]},{label:'seem tired: VP →',slots:2,answers:[['V','AP']]}],
  misconceptions:[{row:3,seq:['V','NP'],feedback:'Tired is an AP describing the subject, not an object NP.'},{row:2,seq:['V','NP','NP'],feedback:'To Mara is a PP, not a bare NP. (Hand Mara the book would have two NPs.)'}],
  hint:'Count relationships, not words.',
  explain:'Each verb use selects its own complements.'}
});
add('syntax/case-position',{
 variable:'Which participant is in subject and which in object position',
 other:{options:['Nothing else: the verb and the subject–verb–object frame stay; who welcomes whom follows from the swap','The verb changes','A preposition is added'],explanation:'Meaning changes because positions change; that is the variable at work, not a second change.'},
 build:{prompt:'Assign case by position in “She welcomed them” and “Our dog is beside us.”',tiles:['nominative','accusative','genitive'],
  rows:[{label:'She (subject of welcomed)',slots:1,answers:[['nominative']]},{label:'them (object of welcomed)',slots:1,answers:[['accusative']]},{label:'Our (possessor in our dog)',slots:1,answers:[['genitive']]},{label:'us (object of beside)',slots:1,answers:[['accusative']]}],
  misconceptions:[{row:2,seq:['nominative'],feedback:'Our sits inside the subject NP but is itself a possessor: genitive.'},{row:3,seq:['nominative'],feedback:'Us is the complement of the preposition beside: accusative.'}],
  hint:'Locate each NP relative to S, V, P or a larger NP first.',
  explain:'Case follows position: subject → nominative, possessor → genitive, complement of V or P → accusative.'}
});
add('syntax/theta-roles',{
 variable:'The predicate reading, and with it Mira’s role in the stated analysis',
 other:{options:['Nothing else: both NPs keep their positions and case','Mira moves to object position','The dog is removed'],explanation:'Only the verb changes; the role follows from the verb.'},
 build:{prompt:'Assign theta roles in “Rae gave the book to Jan” and “Mira unexpectedly noticed the dog.”',tiles:['agent','theme','recipient','experiencer','nominative'],
  rows:[{label:'Rae',slots:1,answers:[['agent']]},{label:'the book',slots:1,answers:[['theme']]},{label:'Jan',slots:1,answers:[['recipient']]},{label:'Mira (in Mira unexpectedly noticed the dog)',slots:1,answers:[['experiencer']]}],
  misconceptions:[{row:3,seq:['agent'],feedback:'This example specifies unexpected perception, so this lesson’s stated analysis uses experiencer. A course may use agent for an intentional reading of “see”; name the reading and follow that convention explicitly.'},{row:0,seq:['nominative'],feedback:'Nominative is a case — where Rae is. The question is what Rae does: agent.'}],
  hint:'Ask what part each participant plays in the event, not where it sits.',
  explain:'Position gives case; the predicate gives roles.'}
});
add('syntax/predicate-arguments',{
 variable:'An added adjunct',
 other:{options:['Nothing else: Kobi and worked stay','A second participant is added','The verb changes'],explanation:'Only quickly is added, and it adds no participant.'},
 build:{joiner:',',prompt:'Sort the parts of “Kobi worked quickly yesterday.”',tiles:['Kobi','quickly','yesterday','worked'],
  rows:[{label:'Predicate',slots:1,answers:[['worked']]},{label:'Arguments',slots:1,answers:[['Kobi']]},{label:'Adjuncts',slots:2,unordered:true,answers:[['quickly','yesterday']]}],
  misconceptions:[{row:1,seq:['yesterday'],feedback:'Yesterday is a noun phrase, but it adds time, not a participant: an adjunct.'},{row:2,seq:['Kobi','quickly'],feedback:'Kobi is the participant who works: the argument.'}],
  hint:'Cover each word: does the predicate’s meaning still need it?',
  explain:'One argument; two adjuncts; arity stays 1.'}
});
add('syntax/crosslinguistic-case',{
 variable:'Which noun carries ga (NOM) and which carries o (ACC)',
 other:{options:['Word order also shifts: the noun with ga is first in both, so order and marking change together','Nothing else changes','The verb changes tense'],explanation:'Because the nouns also swap places, this pair alone cannot show whether order or marking decides. The build below separates them: Japanese allows either order.'},
 build:{joiner:'·',prompt:'Write “The cat bit the dog” in Japanese. Build both orders the markers allow.',tiles:['neko ga','neko o','inu ga','inu o','kanda'],
  rows:[{label:'Order 1',slots:3,answers:[['neko ga','inu o','kanda'],['inu o','neko ga','kanda']]},{label:'Order 2 (the other order)',slots:3,answers:[['inu o','neko ga','kanda'],['neko ga','inu o','kanda']],distinctFrom:0}],
  misconceptions:[{row:0,seq:['inu ga','neko o','kanda'],feedback:'That says the dog bit the cat: ga marks the biter.'},{row:1,seq:['inu ga','neko o','kanda'],feedback:'That says the dog bit the cat: ga marks the biter.'}],
  hint:'Keep ga on the biter and o on the bitten, then try both orders.',
  explain:'Both orders mean the same thing: the markers, not the order, identify the roles.'}
});
add('syntax/possessive-nps',{
 variable:'The form of the possessor',
 other:{options:['The visible ’s disappears and the possessor refers differently; only the possessor slot is the variable','Nothing else changes','The head noun changes'],explanation:'Swapping Leila’s for their changes form and reference together; the outer NP and head noun stay.'},
 build:{prompt:'Split each NP into its possessor and its head.',tiles:['the new captain’s','badge','the new','captain’s badge','Leila’s','mentor'],
  rows:[{label:'the new captain’s badge: NP →',slots:2,answers:[['the new captain’s','badge']]},{label:'Leila’s mentor: NP →',slots:2,answers:[['Leila’s','mentor']]}],
  misconceptions:[{row:0,seq:['the new','captain’s badge'],feedback:'That splits the possessor. The whole phrase “the new captain” carries ’s.'}],
  hint:'Find the head noun first; everything that carries ’s before it is the possessor.',
  explain:'A whole NP can sit in the possessor position.'}
});
add('syntax/head-complement-order',{
 variable:'The order of the verb and its object complement',
 other:{options:['Vocabulary, script, case markers (-ga, -o) and the whole language differ too','Nothing else: only verb–object order differs','The meaning of the sentence differs'],explanation:'Comparing two languages changes much more than one feature. The investigated variable is head–complement direction; the rest are incidental differences you must set aside on purpose.'},
 build:{prompt:'Arrange heads and complements into structurally valid representations.',tiles:['V','NP','P','S','C'],
  rows:[{label:'English VP (repairs clocks) →',slots:2,answers:[['V','NP']]},{label:'Japanese VP (tokei-o naosu) →',slots:2,answers:[['NP','V']]},{label:'English PP (from Tokyo) →',slots:2,answers:[['P','NP']]},{label:'Japanese PP (Tōkyō kara) →',slots:2,answers:[['NP','P']]},{label:'Japanese CP (Nia-ga kuru to) →',slots:2,answers:[['S','C']]}],
  misconceptions:[{row:1,seq:['V','NP'],feedback:'That is the English order. In tokei-o naosu the object comes first: NP + V.'},{row:3,seq:['P','NP'],feedback:'Kara follows Tōkyō: it is a postposition, NP + P.'},{row:4,seq:['C','S'],feedback:'To follows the clause Nia-ga kuru: S + C.'}],
  hint:'In each row the head pairs with the same complement; only the side changes.',
  explain:'Every row keeps the same head–complement relation; only its direction varies.'}
});

/* ---------------- Mathematical patterns ---------------- */
add('quantities/difference-ratio',{
 variable:'The operation: add 3 or multiply by 3',
 other:{options:['Nothing else: both start at 3','The starting number changes','The number of steps changes'],explanation:'Same start, same step count; only the operation differs.'},
 build:{joiner:'→',prompt:'Build the first four terms of each sequence.',tiles:['3','6','9','12','15','27','81'],
  rows:[{label:'Start at 3; add 3',slots:4,answers:[['3','6','9','12']]},{label:'Start at 3; multiply by 3',slots:4,answers:[['3','9','27','81']]}],
  misconceptions:[{row:1,seq:['3','6','9','12'],feedback:'That adds 3 each time. Multiplying gives 3, 9, 27, 81.'},{row:0,seq:['3','9','27','81'],feedback:'That multiplies by 3. Adding 3 gives 3, 6, 9, 12.'}],
  hint:'Apply the same operation to every term.',
  explain:'Additive keeps a difference; multiplicative keeps a ratio.'}
});
add('quantities/proportion',{
 variable:'The number of notebooks, with the total cost held at $6',
 other:{options:['Nothing else: the total stays $6; the price per notebook changes as a result','The total cost changes','The item changes'],explanation:'The falling unit price is a consequence of the variable, not a separate change.'},
 build:{prompt:'Notebooks cost $3 each. Build the proportional costs.',tiles:['$6','$8','$12','$18'],
  rows:[{label:'2 notebooks →',slots:1,answers:[['$6']]},{label:'4 notebooks →',slots:1,answers:[['$12']]},{label:'6 notebooks →',slots:1,answers:[['$18']]}],
  misconceptions:[{row:1,seq:['$8'],feedback:'Adding $2 for 2 more notebooks keeps a difference, not the ratio. At $3 each, 4 notebooks cost $12.'}],
  hint:'Multiply both quantities by the same factor.',
  explain:'Cost ÷ notebooks stays $3: the ratio is invariant.'}
});
add('quantities/rates',{
 variable:'The second y-value',
 other:{options:['Nothing else: the x-values and the starting y stay','The x-interval changes','The starting y changes'],explanation:'Only 7 → 8 changes.'},
 build:{prompt:'Find the slope from (1, 4) to (3, 10).',tiles:['1','2','3','6','10'],
  rows:[{label:'Δx',slots:1,answers:[['2']]},{label:'Δy',slots:1,answers:[['6']]},{label:'slope = Δy ÷ Δx',slots:1,answers:[['3']]}],
  misconceptions:[{row:2,seq:['6'],feedback:'6 is Δy. The slope divides by Δx: 6 ÷ 2 = 3.'},{row:1,seq:['10'],feedback:'10 is the second y-value; Δy is 10 − 4 = 6.'}],
  hint:'Change in y per one unit of x.',
  explain:'Slope = Δy ÷ Δx, whatever the step in x.'}
});
add('quantities/generalize',{
 variable:'The input x',
 other:{options:['Nothing else: the rule y = 2x + 1 stays','The rule changes','The constant changes'],explanation:'Only the input changes; the same rule must hold.'},
 build:{prompt:'Apply y = 2x + 1 to each input.',tiles:['1','2','7','31','60','61'],
  rows:[{label:'x = 3',slots:1,answers:[['7']]},{label:'x = 30',slots:1,answers:[['61']]},{label:'x = 0',slots:1,answers:[['1']]}],
  misconceptions:[{row:1,seq:['60'],feedback:'You doubled 30 but did not add 1.'},{row:1,seq:['31'],feedback:'You added 1 but did not double: 2 × 30 + 1 = 61.'}],
  hint:'Double, then add one — for every input.',
  explain:'A rule earns trust when it holds far from the first examples.'}
});

/* ---------------- Critical inquiry ---------------- */
add('inquiry/claim-evidence',{
 variable:'An added piece of offered evidence',
 other:{options:['Nothing else: the claim is word-for-word the same','The claim changes','The subject of the claim changes'],explanation:'Only because attendance rose is added.'},
 build:{prompt:'Build an argument from these sentences.',tiles:['The new schedule helps students','Attendance rose from 82% to 91%','Students clearly love it'],
  rows:[{label:'Claim',slots:1,answers:[['The new schedule helps students']]},{label:'Evidence',slots:1,answers:[['Attendance rose from 82% to 91%']]}],
  misconceptions:[{row:1,seq:['Students clearly love it'],feedback:'That restates enthusiasm; it is not a checkable observation.'}],
  hint:'Evidence is something someone could check.',
  explain:'A claim asserts; evidence is an observation that bears on it.'}
});
add('inquiry/cause',{
 variable:'The connective: after or because',
 other:{options:['Nothing else: the same observation about scores and tutoring','The scores change direction','Tutoring stops'],explanation:'One word changes, and with it the strength of the claim.'},
 build:{prompt:'Build a causal investigation.',tiles:['Scores rose after tutoring began','Scores rose because tutoring began','Practice tests began the same week','Compare tutored students without practice tests to untutored students'],
  rows:[{label:'Observation',slots:1,answers:[['Scores rose after tutoring began']]},{label:'Rival explanation',slots:1,answers:[['Practice tests began the same week']]},{label:'Separating comparison',slots:1,answers:[['Compare tutored students without practice tests to untutored students']]}],
  misconceptions:[{row:0,seq:['Scores rose because tutoring began'],feedback:'That is already a causal claim. The observation is only the sequence.'},{row:1,seq:['Scores rose because tutoring began'],feedback:'That restates the causal claim; a rival names something else that changed.'}],
  hint:'Observation, then what else changed, then a comparison that separates them.',
  explain:'Causation needs rivals ruled out, not just a sequence.'}
});
add('inquiry/counterexamples',{
 variable:'A negation of the observation',
 other:{options:['Nothing else: the same bird and the same ability','A different bird is introduced','The ability changes from flying to swimming'],explanation:'Only not is added.'},
 build:{joiner:',',prompt:'One verified bird cannot fly. Sort the claims.',tiles:['All birds can fly','Most birds can fly','Some birds can fly','No birds can fly'],
  rows:[{label:'Refuted by that bird',slots:1,answers:[['All birds can fly']]},{label:'Not refuted by that bird',slots:2,unordered:true,answers:[['Most birds can fly','Some birds can fly'],['Most birds can fly','No birds can fly'],['Some birds can fly','No birds can fly']]}],
  misconceptions:[{row:0,seq:['Most birds can fly'],feedback:'One exception cannot refute “most”; it refutes “all”.'},{row:0,seq:['No birds can fly'],feedback:'A flightless bird agrees with “no birds can fly”; a flying bird would refute it.'}],
  hint:'Check what each quantifier commits to.',
  explain:'One counterexample defeats an unrestricted universal, not weaker claims.'}
});
add('inquiry/assumptions',{
 variable:'An added conclusion',
 other:{options:['Nothing else: the observation is unchanged','The observation changes','A survey is added'],explanation:'The second sentence only adds the conclusion.'},
 build:{prompt:'Expose the hidden bridge in the argument.',tiles:['The library is crowded','People are there to use printed books','Everyone prefers printed books','The library has Wi-Fi'],
  rows:[{label:'Evidence',slots:1,answers:[['The library is crowded']]},{label:'Hidden bridge',slots:1,answers:[['People are there to use printed books']]},{label:'Conclusion',slots:1,answers:[['Everyone prefers printed books']]}],
  misconceptions:[{row:1,seq:['The library is crowded'],feedback:'That is the evidence itself; the bridge connects it to the conclusion.'},{row:1,seq:['The library has Wi-Fi'],feedback:'That is a rival reason people might be there — it weakens the bridge rather than being it.'}],
  hint:'Complete “this only follows if…”.',
  explain:'An argument is only as strong as its unstated bridge.'}
});

/* Rotate the authored 'other' answer through positions A–C. */
let n=0;
Object.values(P).forEach(spec=>{const o=spec.other;const target=n++%3;const right=o.options[0],rest=o.options.slice(1);rest.splice(target,0,right);o.options=rest;o.correct=target;o.prompt=o.prompt||'Besides the variable, what else differs between the two examples?';});

/* Attach to the built-in courses. */
for(const course of window.PATTERN_CONTENT.courses)for(const skill of course.skills){
 const spec=P[course.id+'/'+skill.id];if(!spec)throw new Error('Missing construction for '+course.id+'/'+skill.id);
 skill.variable=spec.variable;skill.construct=spec.build;
 if(skill.observe)skill.observe.other=spec.other;
}

/* Exact structure checking, shared by the app and the tests. */
function same(a,b,unordered){if(a.length!==b.length)return false;if(unordered){const x=[...a].sort(),y=[...b].sort();return x.every((v,i)=>v===y[i]);}return a.every((v,i)=>v===b[i]);}
function checkBuild(build,fills){
 const rows=build.rows.map((row,i)=>{
  const got=(fills[i]||[]).slice(0,row.slots);const complete=got.length===row.slots&&got.every(Boolean);
  let correct=complete&&row.answers.some(ans=>same(got,ans,row.unordered));
  if(correct&&Number.isInteger(row.distinctFrom)){const other=(fills[row.distinctFrom]||[]);if(same(got,other,row.unordered))correct=false;}
  const mis=!correct&&complete?(build.misconceptions||[]).find(m=>m.row===i&&same(got,m.seq,row.unordered)):null;
  const duplicate=!correct&&complete&&Number.isInteger(row.distinctFrom)&&same(got,fills[row.distinctFrom]||[],row.unordered)&&row.answers.some(ans=>same(got,ans,row.unordered));
  return {complete,correct,feedback:mis?mis.feedback:duplicate?'That repeats the first order. Build the other order the markers allow.':''};
 });
 return {rows,correct:rows.every(r=>r.correct),complete:rows.every(r=>r.complete)};
}
window.PatternConstruction={check:checkBuild,ids:()=>Object.keys(P)};
})();
