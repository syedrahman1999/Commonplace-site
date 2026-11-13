/* Patternwork 4.3 — reasoning investigations.
   Each built-in pattern gets an investigation that asks the learner to PRODUCE
   knowledge with it: state a hypothesis, construct an original case, meet an
   authored challenge case, revise, and compare with a transparent model.

   Authoring convention: in every challenge, options[0] is the authored answer.
   place() moves it to a rotating position so keys are balanced across A–D.
   Only the challenge choice is checked. Written parts are saved, never scored. */
(function(){
'use strict';
const I={};
const add=(id,spec)=>{I[id]=spec;};

/* ---------- Arabic Foundations ---------- */
add('arabic-foundations/letter-families',{
 build:'Choose two letters from one shape family (for example ج ح خ, or ب ت ث) and show how a reader tells them apart.',
 frame:[{id:'body',label:'The shared body',hint:'Describe the shape both letters keep.'},{id:'dots',label:'The distinguishing dots',hint:'How many dots, and above or below?'}],
 hypothesis:'State your rule: what identifies an Arabic letter?',
 challenge:{case:'ن has one dot above. خ also has one dot above.',prompt:'A rule says: “Letters with the same number of dots in the same position are the same letter.” What does this pair show?',options:['The rule fails: the dots match, but the bodies differ, so body and dots must be read together','The rule holds: ن and خ are the same letter','ن and خ belong to the same shape family','Dots never help identify Arabic letters']},
 model:{example:'ج — one dot below · ح — no dot · خ — one dot above',steps:['Hold the body constant: all three share the same curved body.','Inspect only the dots: none, one below, one above.','Revise the rule: a letter is identified by its body AND its dots; dots alone, or body alone, are not enough.'],boundary:'The rule would break if you compared dots across different bodies, as in ن and خ.'}
});
add('arabic-foundations/short-vowels',{
 build:'Write one consonant with two different short-vowel marks, and transliterate each.',
 frame:[{id:'held',label:'The consonant you held constant',hint:'Which letter stayed the same?'},{id:'marks',label:'Each mark and the vowel it gives',hint:'e.g. fatḥa → a'}],
 hypothesis:'State your rule: what changes the vowel sound in your two forms?',
 challenge:{case:'بَ (ba) and تَ (ta)',prompt:'A rule says: “If the syllable sounds different, a short-vowel mark changed.” What does this pair show?',options:['The rule fails: the mark is the same fatḥa; the consonant changed, so first find which part changed','The rule holds: the fatḥa changed into a kasra','بَ and تَ have no vowel marks','The two syllables sound identical']},
 model:{example:'كَ ka · كِ ki · كُ ku',steps:['Hold the consonant ك constant.','Name the only changing mark: fatḥa, kasra, ḍamma.','Revise the rule: a sound change can come from the consonant or the vowel mark, so isolate the part that changed before naming the cause.'],boundary:'The rule breaks when two syllables differ in consonant rather than vowel.'}
});
add('arabic-foundations/long-vowels',{
 build:'Write a short-vowel syllable and its long counterpart, with transliteration.',
 frame:[{id:'short',label:'The short form',hint:'e.g. بُ (bu)'},{id:'added',label:'The letter added and the vowel it lengthens',hint:'Which of ا ي و, and what changed in the sound?'}],
 hypothesis:'State your rule: when do ا, ي and و lengthen a vowel?',
 challenge:{case:'وَلَد (walad, “boy”) begins with و.',prompt:'A rule says: “و always marks a long u.” What does وَلَد show?',options:['The rule fails: here و is the consonant w, so its role depends on position and the surrounding vowels','The rule holds: walad contains a long u','و is a short-vowel mark in this word','وَلَد contains no consonants']},
 model:{example:'بُ bu → بُو buu',steps:['Keep the consonant and its ḍamma.','Notice the one added letter: و.','Revise the rule: و lengthens u when a ḍamma before it supports that reading; at the start of a syllable it can be the consonant w.'],boundary:'The rule breaks when و (or ي) begins a syllable and acts as a consonant.'}
});
add('arabic-foundations/definite-article',{
 build:'Take a noun you know, write it with and without ال, and give both meanings.',
 frame:[{id:'bare',label:'The bare noun and its meaning',hint:'e.g. قلم — a pen'},{id:'definite',label:'The noun with ال and its meaning',hint:'What did ال change, and what stayed?'}],
 hypothesis:'State your rule: what does ال do, and how is it written?',
 challenge:{case:'الشمس (“the sun”) is pronounced ash-shams, not al-shams.',prompt:'A rule says: “ال is always pronounced al-.” What does الشمس show?',options:['The spelling ال stays, but before certain letters its l sound assimilates; written form and pronunciation must be described separately','ال is not written in this word','الشمس is indefinite','شمس is not a noun']},
 model:{example:'قلم qalam “a pen” → القلم al-qalam “the pen”',steps:['Strip ال mentally: the familiar noun قلم remains.','The core meaning stays; definiteness changes.','Refine the rule: ال is always written attached, but before “sun letters” such as ش its l is pronounced as the next consonant.'],boundary:'The pronunciation rule breaks before sun letters (الشمس ash-shams).'}
});
add('arabic-foundations/nominal-sentences',{
 build:'Write (or adapt) a present-time nominal sentence: a topic plus a description. Gloss it in English.',
 frame:[{id:'topic',label:'The topic',hint:'What is the sentence about?'},{id:'description',label:'The description',hint:'What is said about it — and where would English add “is”?'}],
 hypothesis:'State your rule: how does Arabic form “X is Y” in the present?',
 challenge:{case:'البيت الكبير (al-bayt al-kabīr)',prompt:'A rule says: “A definite noun followed by an adjective is a sentence meaning ‘X is Y’.” What does البيت الكبير show?',options:['When the adjective also takes ال, the pair is a phrase (“the big house”), not a sentence; matching definiteness changes the relation','It means “the house is big”','It has no noun','It means “a big house”']},
 model:{example:'الباب مفتوح — “The door is open.”',steps:['Find the topic: الباب, definite.','Find the description: مفتوح, without ال.','Revise the rule: definite topic + indefinite description gives “X is Y”; if both are definite, the adjective describes inside one phrase.'],boundary:'The rule breaks when the adjective is also definite: الباب المفتوح “the open door”.'}
});
add('arabic-foundations/agreement',{
 build:'Pair one masculine noun and one feminine noun with the same adjective.',
 frame:[{id:'masc',label:'Masculine noun + adjective',hint:'e.g. ولد صغير'},{id:'fem',label:'Feminine noun + adjective',hint:'What changed on the adjective?'}],
 hypothesis:'State your rule: how does an adjective respond to its noun?',
 challenge:{case:'شمس (“sun”) has no final ة, yet the phrase is شمس حارة (“a hot sun”).',prompt:'A rule says: “A noun is feminine only if it ends in ة.” What does شمس حارة show?',options:['The adjective’s ة shows شمس is treated as feminine without ة, so gender must be learned with each noun','شمس is masculine because it has no ة','حارة is a masculine adjective','Arabic adjectives do not agree']},
 model:{example:'ولد صغير “a small boy” · بنت صغيرة “a small girl”',steps:['Hold the adjective صغير constant.','Change the noun’s gender and watch the adjective gain ة.','Revise the rule: the adjective mirrors the noun’s gender; ة on the noun is a frequent signal, not the definition.'],boundary:'The ة-only rule breaks with feminine nouns like شمس.'}
});
add('arabic-foundations/root-families',{
 build:'Choose a root and write two different words built from it, with meanings.',
 frame:[{id:'root',label:'The root consonants',hint:'e.g. د–ر–س'},{id:'words',label:'Two words and what the pattern changed',hint:'Which consonants persist? What does each pattern add?'}],
 hypothesis:'State your rule: what does a root contribute to a word’s meaning?',
 challenge:{case:'مكتب (maktab) “office, desk” and مكتبة (maktaba) “library”',prompt:'A rule says: “Every word from ك–ت–ب means writing or a writer.” What do these words show?',options:['The root contributes a field; the pattern can produce places or objects connected with it, so meaning comes from root plus pattern','They come from a different root','Roots carry no meaning at all','The م is one of the root consonants']},
 model:{example:'د–ر–س: دَرَسَ “he studied” · مدرسة “school” · مدرّس “teacher”',steps:['Circle the persisting consonants د ر س.','Name what each pattern adds: action, place, person.','Revise the rule: the root supplies a semantic field; the pattern and context determine the exact word.'],boundary:'The rule breaks if you expect the root alone to give one fixed meaning.'}
});
add('arabic-foundations/present-prefixes',{
 build:'Choose a verb and write it for two different persons in the present, with English.',
 frame:[{id:'stem',label:'The part you held constant',hint:'Which letters stay?'},{id:'prefixes',label:'Each prefix and the subject it signals',hint:'e.g. أ → I'}],
 hypothesis:'State your rule: how does the prefix identify the subject?',
 challenge:{case:'أنتَ تكتب “you (m.) write” · هي تكتب “she writes”',prompt:'A rule says: “تـ always means ‘she’.” What do these sentences show?',options:['The same prefix تـ marks both “she” and “you (m.)”, so the pronoun or context completes the identification','تكتب is a past-tense form','أنتَ is a verb prefix','تـ means “I”']},
 model:{example:'أنا أكتب “I write” · نحن نكتب “we write”',steps:['Hold the verb كتب constant.','Compare only the prefix: أ vs ن.','Revise the rule: the prefix narrows the subject, but some prefixes serve more than one person, so check the pronoun or context.'],boundary:'The rule breaks with تـ, which serves “she” and “you (m.)”.'}
});

/* ---------- Syntax & structure ---------- */
add('syntax/constituents',{
 build:'Write an original sentence, then expand ONE phrase inside it by adding a modifier.',
 frame:[{id:'expanded',label:'The expanded version',hint:'Rewrite the sentence with your addition.'},{id:'phrase',label:'The phrase that changed, its head, and its category',hint:'e.g. subject NP, head = “students”'}],
 hypothesis:'State your rule: what decides a phrase’s category?',
 challenge:{case:'Consider these phrases: bridges · old · in the river · very old',prompt:'A rule says: “A phrase’s category is set by its first word.” Which phrase refutes the rule?',options:['very old','bridges','old','in the river']},
 model:{example:'Students waited. → Tired students from Oslo waited.',steps:['The subject NP grew; the predicate waited stayed.','students is still the head: tired (AP) and from Oslo (PP) sit inside the NP.','Revise the rule: the HEAD decides the category. In “very old,” the first word is very, but the head old makes it an AP.'],boundary:'A first-word rule breaks whenever a modifier precedes the head.'}
});
add('syntax/complements',{
 build:'Write a sentence with a verb and its complement, then add an adjunct.',
 frame:[{id:'complement',label:'The complement(s) and the head that selects them',hint:'What does the head need to complete its meaning?'},{id:'adjunct',label:'The adjunct and the test you used',hint:'How do you know it is optional information?'}],
 hypothesis:'State your rule: how do you tell a complement from an adjunct?',
 challenge:{case:'Compare: Nina sang on the stage · Nina put the vase on the shelf · Nina slept in the car · Nina read in the garden',prompt:'A rule says: “Every location PP is an adjunct.” Which sentence shows the rule must be revised?',options:['Nina put the vase on the shelf.','Nina sang on the stage.','Nina slept in the car.','Nina read in the garden.']},
 model:{example:'Omar mailed the letter on Friday.',steps:['mailed selects the letter: what was mailed.','on Friday adds time to an already complete event.','Revise the rule: decide by the head’s relationship, not the PP’s meaning. put requires a location (“*Nina put the vase.”), so on the shelf is a complement.'],boundary:'A meaning-based rule breaks with verbs like put that select a location.'}
});
add('syntax/attachment',{
 build:'Write an original ambiguous sentence in which one PP can attach in two places. Paraphrase both readings.',
 frame:[{id:'pp',label:'The PP',hint:'Which phrase moves?'},{id:'readings',label:'Low reading and high reading',hint:'What does the PP modify in each?'}],
 hypothesis:'State your rule: what creates attachment ambiguity?',
 challenge:{case:'Lena ate the soup with a spoon.',prompt:'A rule says: “Every V–NP–PP sentence is ambiguous in practice.” What does this sentence show?',options:['Both structures are grammatical, but world knowledge strongly favors high attachment; structural ambiguity is not the same as two equally likely readings','Only low attachment is grammatical here','The PP has no attachment site','The PP is the subject of the sentence']},
 model:{example:'The officer watched the man with the telescope.',steps:['Hold the PP with the telescope constant.','Low: inside the NP — the man has the telescope. High: on the VP — the officer uses it.','Refine the rule: ambiguity is a fact about available structures; how likely each reading is depends on meaning and context.'],boundary:'The “always ambiguous in practice” rule breaks when one reading is implausible.'}
});
add('syntax/verbs',{
 build:'Use ONE verb in two different constructions (for example intransitive and transitive).',
 frame:[{id:'first',label:'Sentence A and its classification',hint:'What does the verb take here?'},{id:'second',label:'Sentence B and its classification',hint:'What changed in what the verb calls for?'}],
 hypothesis:'State your rule: how do you classify a verb’s use?',
 challenge:{case:'Mara seems happy.',prompt:'A rule says: “Count the phrases after the verb; one phrase means monotransitive.” What does this sentence show?',options:['happy is an AP describing the subject, so seems is a linking use; the kind of complement matters, not only the count','happy is an object NP, so seems is monotransitive','seems is ditransitive','seems is intransitive with no complement']},
 model:{example:'The ice melted. · The sun melted the ice.',steps:['Same verb, two uses.','First use: no object (intransitive). Second: one object NP (monotransitive).','Revise the rule: classify by the relationships the verb sets up in that sentence; an AP complement after a linking verb is not an object.'],boundary:'A pure counting rule breaks with linking verbs such as seem and remain.'}
});
add('syntax/case-position',{
 build:'Write a sentence with a subject pronoun, a possessive, and a pronoun after a verb or preposition.',
 frame:[{id:'positions',label:'Each NP and its structural position',hint:'spec S, spec NP, complement of V or P'},{id:'cases',label:'The case of each pronoun',hint:'nominative, genitive, accusative'}],
 hypothesis:'State your rule: what determines case in this model?',
 challenge:{case:'Her brother called me.',prompt:'A rule says: “The first pronoun in a sentence is nominative.” What does this sentence show?',options:['Her is genitive: a possessor inside the subject NP; the whole NP “her brother” occupies the subject position','Her is nominative','me is nominative','brother is accusative']},
 model:{example:'She lent our map to them.',steps:['She: spec of S → nominative.','our: possessor in spec of NP (our map) → genitive.','them: complement of P (to) → accusative. Revise: case follows structural position, not linear order.'],boundary:'An order-based rule breaks when a possessive begins the subject NP.'}
});
add('syntax/theta-roles',{
 build:'Write an original sentence whose grammatical subject is NOT an agent.',
 frame:[{id:'predicate',label:'The predicate',hint:'Which word sets up the event or state?'},{id:'roles',label:'Each participant: its position/case and its theta role',hint:'Give two answers per NP: where it is, and what part it plays.'}],
 hypothesis:'State your rule: how are grammatical subject and theta role related?',
 challenge:{case:'The key opened the door.',prompt:'A rule says: “The subject of an action verb is the agent.” What does this sentence show?',options:['The key is an instrument: structurally the subject, but not a volitional agent','The door is the agent','The key is accusative','open takes no arguments here']},
 model:{example:'Lina received a letter.',steps:['Predicate: received.','Lina: nominative subject, but recipient — she does not act.','a letter: accusative object, theme. Revise: position and case answer “where”; theta role answers “what part in the event.”'],boundary:'A subject = agent rule breaks with instruments, experiencers, recipients and weather it.'}
});
add('syntax/predicate-arguments',{
 build:'Write a sentence with a predicate and at least one adjunct.',
 frame:[{id:'args',label:'The predicate and its arguments (count them)',hint:'Which participants does the meaning require?'},{id:'adjuncts',label:'The adjunct(s) you excluded',hint:'Why don’t they add a participant?'}],
 hypothesis:'State your rule: how do you count a predicate’s arguments?',
 challenge:{case:'Ana gave Theo the keys yesterday.',prompt:'A rule says: “Count every NP in the sentence to find the argument count.” What does this sentence show?',options:['yesterday is an NP but an adjunct, so give remains a 3-place predicate','give is a 4-place predicate','Theo is an adjunct','give is a 1-place predicate']},
 model:{example:'It snowed in Boston last night.',steps:['Predicate: snow (weather).','it is a dummy subject — no participant. in Boston and last night are adjuncts.','Revise: count the participants the meaning requires (here 0), not NPs or words.'],boundary:'An NP-counting rule breaks with time NPs such as yesterday and with dummy it.'}
});
add('syntax/crosslinguistic-case',{
 build:'Using the Japanese ga/o pattern (or another language you know), write two glossed sentences that swap the participants.',
 frame:[{id:'marker',label:'The recurring marker(s)',hint:'Which forms repeat?'},{id:'evidence',label:'What each marker tracks, with your evidence',hint:'Keep the claim no stronger than your examples.'}],
 hypothesis:'State your rule: what identifies the subject in your data?',
 challenge:{case:'neko ga inu o mita · inu o neko ga mita (both: “The cat saw the dog.”)',prompt:'A rule says: “In Japanese, the first noun is the subject.” What does the second sentence show?',options:['The markers, not word order, identify the roles: ga still marks the subject when it is not first','The dog is the subject of the second sentence','o marks the subject','Word order alone decides the roles']},
 model:{example:'inu ga neko o kanda “The dog bit the cat.” · neko ga inu o kanda “The cat bit the dog.”',steps:['The verb stays constant; the nouns swap.','ga follows the biter each time; o follows the bitten.','Revise: ga tracks the subject and o the object across orders; test new orders before relying on position.'],boundary:'An order rule breaks once the object is placed first.'}
});
add('syntax/possessive-nps',{
 build:'Create a possessive noun phrase with a multiword possessor, then use the whole phrase in a sentence.',
 frame:[{id:'outer',label:'The outer NP and its head',hint:'Name the complete phrase and the possessed noun that heads it.'},{id:'inner',label:'The inner possessor NP',hint:'Include every word that belongs to the possessor and identify the genitive edge.'}],
 hypothesis:'State your rule: how is a possessor related to the larger noun phrase?',
 challenge:{case:'the old captain’s badge',prompt:'A rule says: “The possessive marker attaches only to a single noun.” What does this phrase show?',options:['The full multiword possessor “the old captain” bears the genitive marker at its edge inside the larger NP','Only captain is an NP and the is outside it','badge is the possessor','The entire expression is a verb phrase']},
 model:{example:'Mara’s blue lantern flickered.',steps:['Bracket the complete subject NP: Mara’s blue lantern.','Find the head of the outer NP: lantern.','Identify Mara’s as the inner genitive possessor; blue modifies the outer head. Revise the rule so a whole NP—not merely one noun—can occupy the possessor position.'],boundary:'A one-word rule fails with possessors such as “the old captain’s,” where the marker appears at the edge of a larger phrase.'}
});
add('syntax/head-complement-order',{
 build:'From real glossed data (the Japanese, Turkish, Hindi or Bengali examples in this lesson, or a language you know), write one phrase whose head and complement come in the opposite order from English.',
 frame:[{id:'head',label:'The head and its complement',hint:'Name their categories and the relationship that stays fixed.'},{id:'orders',label:'The two orders, with glosses',hint:'Write the English order and the other language’s order, glossing each word.'}],
 hypothesis:'State your rule: how does head–complement order work across languages?',
 challenge:{case:'Hindi: Ravi kitāb paṛhtā hai — “Ravi reads a book” (Ravi book reads) · mez par — “on the table” (table on) · maĩ jāntā hū̃ ki Ravi āegā — “I know that Ravi will come” (I know that Ravi will-come)',prompt:'A rule says: “A language that puts objects before verbs and uses postpositions puts every head after its complement.” What does the Hindi data show?',options:['Hindi’s complementizer ki comes before its clause, so head direction can differ by phrase type within one language','The rule holds for all three Hindi phrases','Hindi has no complementizers','Ki is a postposition attached to jāntā']},
 model:{example:'Japanese: Nia-ga tokei-o naosu (Nia-NOM clock-ACC repair) · Tōkyō kara (Tokyo from) · Nia-ga kuru to omou (Nia-NOM come that think)',steps:['In each phrase, find the head (naosu, kara, to) and its complement (tokei-o, Tōkyō, Nia-ga kuru).','Check the order: each Japanese complement precedes its head; English reverses all three (repairs clocks, from Tokyo, that Nia will come).','Test constituency separately—tokei-o naosu can be replaced as a unit by sō suru, “do so”—then state direction phrase type by phrase type, not for a whole language at once.'],boundary:'A whole-language rule breaks with mixed languages such as Hindi: objects and postpositions follow the head-last pattern, but the complementizer ki precedes its clause.'}
});

/* ---------- Mathematical patterns ---------- */
add('quantities/difference-ratio',{
 build:'Write a sequence of your own (at least four terms) and state its rule.',
 frame:[{id:'neighbors',label:'The relationship between neighboring terms',hint:'Subtract and divide neighbors.'},{id:'kind',label:'Additive, multiplicative, or neither — and why',hint:'What stays constant?'}],
 hypothesis:'State your rule: how do you classify a sequence?',
 challenge:{case:'1, 2, 4, 7, 11',prompt:'A rule says: “Every sequence is either additive or multiplicative.” What does this sequence show?',options:['Neither difference nor ratio is constant; the differences 1, 2, 3, 4 grow, so a sequence can follow another rule','It is additive with a difference of 1','It is multiplicative with a ratio of 2','It is decreasing']},
 model:{example:'5, 15, 45, 135',steps:['Differences: 10, 30, 90 — not constant.','Ratios: 3, 3, 3 — constant.','Revise: test both relationships on every neighboring pair; some sequences preserve neither.'],boundary:'The either/or rule breaks with sequences whose differences themselves change.'}
});
add('quantities/proportion',{
 build:'Describe a situation with two proportional quantities, then scale it.',
 frame:[{id:'scaled',label:'The original pair and the scaled pair',hint:'e.g. 3 cups : 2 eggs → 6 : 4'},{id:'ratio',label:'The ratio that stayed invariant',hint:'Show it is the same in both.'}],
 hypothesis:'State your rule: when are two quantities proportional?',
 challenge:{case:'A taxi charges $3 to start plus $2 per mile: 1 mile costs $5, 2 miles cost $7.',prompt:'A rule says: “If one quantity increases when the other increases, they are proportional.” What does the taxi show?',options:['Not proportional: 5/1 ≠ 7/2 because of the fixed $3; increasing together is not enough','Proportional, with ratio 5','Proportional, with ratio 2','Not related at all']},
 model:{example:'3 cups of flour : 2 eggs → 6 cups : 4 eggs',steps:['Both quantities were multiplied by 2.','Ratio 3/2 = 6/4 is preserved.','Revise: proportional means the ratio stays constant (and zero maps to zero); a starting fee breaks that.'],boundary:'The “increase together” rule breaks with any fixed starting amount.'}
});
add('quantities/rates',{
 build:'Make a table of three points for a linear relationship and find its slope.',
 frame:[{id:'points',label:'Your three points',hint:'(x, y)'},{id:'slope',label:'Change in y per change in x, and what it means',hint:'Δy ÷ Δx'}],
 hypothesis:'State your rule: how do you find a slope?',
 challenge:{case:'(0, 5), (2, 9), (5, 15)',prompt:'A rule says: “Slope = the second y minus the first y.” What do these points show?',options:['The slope is 2: Δy/Δx = 4/2 = 6/3; the x-values do not step by 1','The slope is 4','The slope is 9','There is no slope']},
 model:{example:'(1, 3), (2, 5), (3, 7)',steps:['Each step of 1 in x adds 2 to y.','Slope = Δy/Δx = 2/1.','Revise: divide by the change in x; subtraction alone only works when x steps by exactly 1.'],boundary:'The subtraction-only rule breaks whenever x does not step by 1.'}
});
add('quantities/generalize',{
 build:'Propose a rule for a pattern, list confirming cases, then test it on a case far from your examples.',
 frame:[{id:'confirm',label:'Confirming cases',hint:'Where does it already work?'},{id:'fresh',label:'Your fresh test and its result',hint:'Choose a case unlike the first ones.'}],
 hypothesis:'State your rule: when does a pattern become a rule?',
 challenge:{case:'n² + n + 41 gives a prime number for every n from 0 to 39.',prompt:'A rule says: “If a formula works for many consecutive cases, it works for all.” What does n = 40 show?',options:['40² + 40 + 41 = 1681 = 41 × 41, so forty confirming cases did not prove the rule','1681 is prime, so the rule holds','n = 40 is not allowed','The formula is undefined at 40']},
 model:{example:'1 + 3 + 5 + … (first n odd numbers) = n²',steps:['Check n = 1, 2, 3: 1, 4, 9.','Explain why: each odd number adds an L-shaped border to a square.','Test far away: n = 10 gives 100. The explanation, not the count of cases, carries the rule.'],boundary:'A count-of-cases rule breaks with formulas like n² + n + 41.'}
});

/* ---------- Critical inquiry ---------- */
add('inquiry/claim-evidence',{
 build:'Write a claim and the specific evidence that would support it.',
 frame:[{id:'evidence',label:'The evidence',hint:'An observation someone could check.'},{id:'bearing',label:'How the evidence bears on the claim',hint:'What would change if the evidence were different?'}],
 hypothesis:'State your rule: what makes something evidence for a claim?',
 challenge:{case:'“Our app is the best study tool. It is clearly the most effective option available.”',prompt:'A rule says: “Any sentence that follows a claim counts as evidence.” What does this passage show?',options:['The second sentence restates and intensifies the claim without an observation; evidence must be checkable and bear on truth','The second sentence is strong evidence','Both sentences are evidence','“Clearly” makes it evidence']},
 model:{example:'Claim: the new schedule improved attendance. Evidence: attendance rose from 82% to 91% across the same classes.',steps:['Separate the assertion from the observation.','Ask whether the observation could have come out otherwise.','Revise: evidence is a checkable observation that bears on the claim; restatement adds confidence, not support.'],boundary:'A position-based rule breaks with emphatic restatements.'}
});
add('inquiry/cause',{
 build:'Describe an outcome that changed, propose a cause, and name a rival explanation.',
 frame:[{id:'rival',label:'The rival explanation',hint:'What else changed at the same time?'},{id:'test',label:'A comparison that would separate them',hint:'What evidence would favor one over the other?'}],
 hypothesis:'State your rule: when does a sequence or correlation support causation?',
 challenge:{case:'Fires attended by more firefighters tend to cause more damage.',prompt:'A rule says: “When A and B rise together, A causes B.” What does this pattern show?',options:['Fire size likely drives both: larger fires bring more firefighters and cause more damage','Firefighters cause the damage','The two quantities are unrelated','Damage is caused by the number of fire trucks alone']},
 model:{example:'Scores rose after tutoring began; practice tests started the same week.',steps:['Name the co-occurring change: practice tests.','Propose a separating comparison: tutored students without practice tests.','Revise: co-occurrence becomes causal evidence only after rival explanations are tested.'],boundary:'The co-rise rule breaks whenever a third factor drives both.'}
});
add('inquiry/counterexamples',{
 build:'Write a claim with a clear quantifier, then test it with a case.',
 frame:[{id:'quantifier',label:'The quantifier and what it commits to',hint:'all, most, some, never…'},{id:'verdict',label:'Your test case and verdict',hint:'Does it refute, weaken, or leave the claim standing?'}],
 hypothesis:'State your rule: when does one case refute a claim?',
 challenge:{case:'Claim: “Most mammals live on land.” Case: whales live in the sea.',prompt:'A rule says: “Any single opposite case refutes a claim.” What does the whale case show?',options:['One exception does not refute “most”; it would refute “all mammals live on land”','Whales refute the claim','Whales are not mammals','The claim is now proven']},
 model:{example:'Claim: “All birds can fly.” Case: penguins.',steps:['Quantifier: all — no exceptions allowed.','Penguins are birds that cannot fly.','Revise: one genuine case refutes an unrestricted universal; weaker quantifiers need different evidence.'],boundary:'The single-case rule breaks with most, some and often.'}
});
add('inquiry/assumptions',{
 build:'Write a short argument (evidence, so conclusion), then expose its hidden bridge.',
 frame:[{id:'conclusion',label:'The evidence and the conclusion',hint:'Separate the two.'},{id:'bridge',label:'“This only follows if…”',hint:'State the unstated assumption.'}],
 hypothesis:'State your rule: how do you find an argument’s hidden assumption?',
 challenge:{case:'“Maya scored highest on the test, so she studied the most.”',prompt:'Which assumption must be true for the conclusion to follow?',options:['Higher scores come only (or mainly) from more studying','Maya took the test','The test was difficult','Maya scored highest']},
 model:{example:'“The library is crowded, so everyone prefers printed books.”',steps:['Evidence: crowding. Conclusion: a preference for print.','Bridge: people are there because of printed books.','Test the bridge: they could be there for quiet, Wi-Fi or exams. The argument is only as strong as the bridge.'],boundary:'Restating the evidence never supplies the missing bridge.'}
});

/* ---------- Generic investigation for imported pathways ---------- */
function generic(skill){
 return {generic:true,
  build:'Construct an original example of “'+String(skill.title||'this pattern')+'” that is different from the lesson pair.',
  frame:[{id:'relation',label:'The relationship your example shows',hint:'What stays constant, and what changes?'},{id:'test',label:'A case where the pattern would NOT hold',hint:'Where are its limits?'}],
  hypothesis:'State the pattern in your own words.',
  challenge:null,
  model:{example:Array.isArray(skill.pair)?skill.pair.join(' → '):'',steps:[skill.pattern||'',skill.trap?('Watch the near miss: '+skill.trap):'',skill.transfer?('Transfer strategy: '+skill.transfer):''].filter(Boolean),boundary:skill.trap||''}};
}

/* Balance authored keys across A–D. */
let n=0;
Object.keys(I).forEach(id=>{const c=I[id].challenge;if(!c)return;const target=n++%4;const right=c.options[0],rest=c.options.slice(1);rest.splice(target,0,right);c.options=rest;c.correct=target;c.explanation=c.explanation||('The authored answer: '+right+'.');});

window.PatternInvestigations={
 forSkill(courseId,skill){return I[courseId+'/'+skill.id]||generic(skill);},
 has(courseId,skillId){return !!I[courseId+'/'+skillId];},
 ids(){return Object.keys(I);},
 normalize(text){return String(text||'').toLowerCase().replace(/[ً-ْ]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();}
};
})();
