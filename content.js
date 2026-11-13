/* PATTERNWORK — self-contained, authored learning content. No network required. */
(function () {
  'use strict';
  const Q=(prompt,options,correct,explanation,tip)=>({prompt,options,correct,explanation,tip});
  const courses=[
  {
    id:'syntax', title:'The architecture of language', short:'Syntax & structure', tag:'LANGUAGE', number:'01', symbol:'∴', duration:'30–45 min',
    description:'Discover which words belong together—and why the branches of a sentence are never arbitrary.',
    objective:'From words to constituents, from intuition to an explainable tree.',
    tone:'sage', resources:[{name:'Purdue OWL — Grammar',url:'https://owl.purdue.edu/owl/general_writing/grammar/index.html',desc:'Reference material for English grammatical concepts.'}],
    skills:[
      {
        id:'constituents', title:'Words become phrases', label:'Lesson 01', kicker:'What belongs together first?',
        pattern:'Words assemble into constituents. A phrase takes its category from its head, not from the first word in it.',
        pair:['The student laughed.','The careful student laughed.'], delta:'Only the adjective careful is added. The subject stays an NP and laughed remains unchanged. The added AP creates a new N′ modifier layer.',
        anatomy:['Find the smallest meaningful units: the / careful / student / laughed.','Name each word: D / A / N / V.','Group careful with student inside the subject NP.','Preserve the larger S → NP + VP skeleton.'],
        sketch:'S  →  NP + VP\nNP → D + N′\nN′ → AP + N′\nN′ → N',
        trap:'An adjective is not a noun, and an AP does not become an NP simply because it appears inside one.',
        transfer:'When something is added, ask which LOCAL constituent changes; keep the rest of the structure unchanged.',
        questions:[
          Q('In “The curious fox slept,” which label belongs to “curious”?',['N','A','Adv','V'],1,'Curious describes the noun fox, so it is an adjective (A).','Ask which word curious describes.'),
          Q('Which is the subject constituent in “Those musicians sang”?',['Those','Those musicians','Musicians sang','Sang'],1,'Those musicians forms the entire subject NP; musicians alone is only its head.','A subject can contain more than one word.'),
          Q('In “very tired,” what is the category of the whole phrase?',['AdvP','VP','AP','NP'],2,'Tired is the adjective head, so the whole expression is an AP; very is an AdvP inside it.','The head controls the phrase category.'),
          Q('A new adjective is added to “the box” → “the red box.” What changes?',['The entire S becomes a PP','Only the subject NP must disappear','The NP gains a modifier layer','The verb acquires a second complement'],2,'The NP remains an NP; an N′ layer lets the adjective modify the noun within it.','Keep the existing phrase category if the head stays the same.')
        ]
      },
      {
        id:'complements', title:'Complements live inside relationships', label:'Lesson 02', kicker:'A role depends on its head.',
        pattern:'A complement participates in a relationship established by a head. An adjunct adds information about an already-established structure.',
        pair:['Nina opened the suitcase.','Nina opened the suitcase quietly.'],
        delta:'The suitcase is the object complement of opened. Quietly adds a manner description without becoming a second object.',
        anatomy:['Identify the head and what it relates to: opened → the suitcase.','Mark the suitcase as NP complement of V.','Treat quietly as an AdvP adjunct modifying the event.','Look inside each phrase: in “beside Nina,” Nina is also a complement—but of P.'],
        sketch:'VP → V′ + AdvP\nV′ → V + NP\nPP → P + NP',
        trap:'Removability alone is not a perfect test. “Nina reads” is grammatical, but “a book” is still the verb’s object in “Nina reads a book.”',
        transfer:'Ask two questions separately: what is INSIDE this phrase, and what is its RELATIONSHIP to the larger phrase?',
        questions:[
          Q('In “Leah opened the window slowly,” what is the complement of “opened”?',['Leah','the window','slowly','the sentence'],1,'The NP the window names what was opened; slowly is an optional manner adjunct.','Which phrase fills the object role?'),
          Q('In “behind the curtain,” what is the complement of the preposition “behind”?',['behind','the curtain','the','None; P has no complements'],1,'The curtain is the NP that completes the spatial relation introduced by behind.','A preposition can take an NP complement.'),
          Q('In “Ravi read the letter carefully,” what does “carefully” do?',['It is an object NP','It is an AdvP adjunct of the verbal event','It is a complement of read','It is a preposition'],1,'Carefully is an AdvP modifying the reading event, not the object of read.','Find which constituent describes HOW the action happened.'),
          Q('The PP “under the desk” can be an adjunct of a VP. What role can “the desk” still have INSIDE that PP?',['A complement of under','An adjunct of desk','The subject of the sentence','A verb'],0,'The full PP can be an adjunct externally while its NP is a complement of P internally.','Separate the PP’s internal and external relationships.')
        ]
      },
      {
        id:'attachment', title:'One phrase, two possible homes', label:'Lesson 03', kicker:'Ambiguity is a structural choice.',
        pattern:'Attachment ambiguity arises when one PP can modify more than one larger constituent, producing different readings without changing its internal structure.',
        pair:['I saw the guide with binoculars. [PP attached to the guide]','I saw the guide with binoculars. [PP attached to the seeing]'],
        delta:'Not a single spoken word has changed. The same PP is attached to the object NP in the first analysis, and to the VP in the second. Two structures, two readings.',
        anatomy:['Build the PP internally first: P + NP.','Low attachment: place the PP inside the object NP, modifying the noun.','High attachment: place the PP higher inside VP, modifying the event.','The complement of the preposition stays unchanged in both readings.'],
        sketch:'LOW:  N′ → N′ + PP  (inside object NP)\nHIGH: VP → V′ + PP  (outside object NP)\nBOTH: PP → P + NP',
        trap:'Low does not mean “near the ground” in the drawing; it means lower in the grammatical hierarchy, attached to a noun-centered phrase.',
        transfer:'Do not memorize meanings in isolation. Say “what does this PP modify?” and use that to locate its branch.',
        questions:[
          Q('“Noah photographed the teacher with a camera.” In the high reading, the PP modifies:',['the teacher','the camera','the photographing event','Noah as a noun'],2,'High attachment connects with a camera to the photographing event: Noah used the camera.','Ask whether the PP describes an object or an event.'),
          Q('For the LOW reading of “the singer in a red jacket,” the PP belongs:',['Inside the singer’s NP','As the subject NP','Directly above S','As the object of the preposition red'],0,'The PP modifies singer inside the noun phrase, not the larger verbal action.','Low attachments are noun-centered.'),
          Q('What remains the same between high and low PP attachments?',['Which head the entire PP modifies','The PP’s internal P + NP structure','The sentence’s meaning','The location of the PP inside the larger tree'],1,'With a camera remains P with plus NP a camera; only the PP’s external attachment changes.','Look inside the PP, not above it.'),
          Q('Which sentence most clearly offers two attachment readings?',['The child slept peacefully.','I met the neighbor with a telescope.','The window shattered.','They are ready.'],1,'With a telescope can plausibly describe the neighbor or the means of meeting/seeing; the other choices do not supply that PP ambiguity.','Look for a PP that can connect to more than one larger structure.')
        ]
      },
      {
        id:'verbs', title:'Count what the verb calls for', label:'Lesson 04', kicker:'Zero, one, two, or a property?',
        pattern:'Different verb constructions select different complements. Count the relationships—not simply the number of words after the verb.',
        pair:['The student handed a book.','The student handed a book to Mara.'],
        delta:'Only to Mara is added. The head verb and direct-object NP remain the same; the second expression makes the recipient relationship explicit through an additional PP complement.',
        anatomy:['Identify the verb head.','Ask what participants or properties the predicate relates to.','Classify this use: 0 = intransitive, 1 NP = monotransitive, 2 = ditransitive, AP = linking.','Build a V′ layer when necessary to maintain binary branching.'],
        sketch:'sleep → V only\nread the book → V + NP\nhand the book to Mara → (V + NP) + PP\nseem tired → V + AP',
        trap:'A noun after the verb is not automatically another subject. In “A robot startled Mira,” Mira is the object and the use is monotransitive.',
        transfer:'Classify the verb as it is USED in that sentence; a word can appear in different constructions.',
        questions:[
          Q('“The tiny robot startled Mira.” What is the verb classification here?',['Intransitive','Monotransitive','Ditransitive','Linking'],1,'Startled takes one object NP, Mira, so this is monotransitive.','Count object complements.'),
          Q('“The library offered a map to Amir.” Which class fits?',['Intransitive','Monotransitive','Ditransitive','Linking'],2,'Offered takes an NP (a map) and a PP (to Amir) in this construction.','Two complements can be different phrase types.'),
          Q('“The children seemed exhausted.” What is “exhausted”?',['A direct object NP','A subject NP','An AP complement of a linking verb','An AdvP adjunct'],2,'Seemed is linking here and connects the subject to a property expressed by an AP.','Not every verb-object relationship involves a noun.'),
          Q('Which has an intransitive verb use?',['Maya laughed.','Maya opened the door.','Maya lent a pen to Lee.','Maya appeared tired.'],0,'Laughed has no complement in this sentence; the other predicates use complements.','Count complements of the verb in each choice.')
        ]
      }
    ]
  },
  {
    id:'quantities', title:'The hidden logic of change', short:'Mathematical patterns', tag:'MATHEMATICS', number:'02', symbol:'↗', duration:'25–35 min',
    description:'Go beyond formulas. Learn to see how quantities change together and which relationship stays invariant.',
    objective:'Read changes before computing answers.', tone:'coral',
    resources:[{name:'Khan Academy — Math',url:'https://www.khanacademy.org/math',desc:'Additional examples and guided mathematical practice.'}],
    skills:[
      {id:'difference-ratio',title:'Difference or multiplier?',label:'Lesson 01',kicker:'What changed—and how?',
        pattern:'An additive pattern preserves a difference; a multiplicative pattern preserves a ratio.',
        pair:['Start at 3; add 3 each step.','Start at 3; multiply by 3 each step.'],delta:'Only the operation changed. Addition produces 3, 6, 9; multiplication produces 3, 9, 27. Growth alone does not reveal the rule.',
        anatomy:['Compare adjacent terms.','Test whether the difference repeats.','If not, test whether the multiplier repeats.','Write the rule in words before writing a formula.'],
        sketch:'SAME START: 3\nADD 3:  3 → 6 → 9 → 12  (+3 each time)\nMULTIPLY 3:  3 → 9 → 27 → 81  (×3 each time)',trap:'A sequence rising quickly is not necessarily multiplicative; compare relationships, not appearance.',
        transfer:'Ask what operation would take you from every term to the next without changing its rule.',questions:[
          Q('Which sequence has a constant additive difference?',['2, 4, 8, 16','3, 7, 11, 15','1, 3, 9, 27','5, 10, 20, 40'],1,'Each term increases by 4, producing a constant difference.','Subtract adjacent terms.'),
          Q('Which sequence is generated by multiplying by the same number?',['4, 7, 10','1, 5, 9','3, 9, 27','2, 6, 10'],2,'Each term in 3, 9, 27 is three times its predecessor.','Check neighboring quotients.'),
          Q('A price rises by $5 every week. What kind of change is described?',['Multiplicative','Additive','Exponential','Inverse'],1,'A fixed $5 increment means a fixed additive difference.','Distinguish fixed amounts from fixed percentages.'),
          Q('A population doubles each year. Which relationship stays constant?',['The number of new people each year','The ratio between consecutive years','The total population','The difference between consecutive years'],1,'A doubling pattern preserves a ratio of 2, while differences become larger.','Identify what doubling keeps unchanged.')
        ]},
      {id:'proportion',title:'The invariant ratio',label:'Lesson 02',kicker:'Scale changes; the relationship stays.',
        pattern:'Proportional quantities preserve their ratio when both quantities are scaled by the same factor.',pair:['2 notebooks cost $6.','4 notebooks cost $6.'],
        delta:'Only notebook quantity doubles; the total stays fixed. The price per notebook falls from $3 to $1.50. A proportional price would require the cost to double too.',
        anatomy:['Identify the paired quantities.','Find the cost of one unit, or another common rate.','Check whether both quantities scaled by the same factor; here only the notebook count did.','Check that the invariant relationship survives.'],sketch:'NOTEBOOKS: 2 → 4   (×2)\nCOST:      $6 → $6 (×1)\nPRICE EACH: $3 → $1.50\nNOT PROPORTIONAL: the multipliers differ.',
        trap:'Adding the same number to both quantities usually changes their ratio; multiplying both by the same factor preserves it.',
        transfer:'When the numbers change, look for the ratio that does NOT change.',questions:[
          Q('Three pens cost $9. At the same rate, five pens cost:',['$11','$12','$15','$18'],2,'Each pen costs $3, so five pens cost $15.','Find the per-item rate first.'),
          Q('Which pair has the same ratio as 2:5?',['4:7','6:15','3:5','8:12'],1,'Both 2 and 5 are multiplied by 3 to form 6 and 15.','Scale both sides together.'),
          Q('A recipe uses 2 cups of rice for 3 cups of water. For 6 cups of rice, use:',['5 cups water','7 cups water','8 cups water','9 cups water'],3,'Rice is multiplied by 3, so water must also be multiplied by 3: 9 cups.','Keep the ratio invariant.'),
          Q('Which operation preserves the ratio 4:7?',['Add 2 to both','Multiply both by 3','Subtract 1 from both','Swap the numbers'],1,'Multiplying both quantities by 3 gives 12:21, equivalent to 4:7.','Ask how the numerator and denominator change.')
        ]},
      {id:'rates',title:'From examples to slope',label:'Lesson 03',kicker:'See the amount per step.',
        pattern:'For linear relationships, slope captures the change in output per one-unit change in input.',pair:['At x = 1, y = 4; at x = 2, y = 7.','At x = 1, y = 4; at x = 2, y = 8.'],
        delta:'Only the final output changes: 7 becomes 8. The x-interval stays 1; slope changes from 3 to 4. One different observation can revise the proposed rate.',
        anatomy:['Find the change in x.','Find the change in y.','Compare output change per unit of input change.','Check the same pattern at another pair of points.'],sketch:'BOTH: x 1 → 2  (Δx = 1)\nFIRST: y 4 → 7  (Δy = 3; slope 3)\nSECOND: y 4 → 8  (Δy = 4; slope 4)\nOnly the final y-value changed.',
        trap:'Slope is not the output itself; it measures the change in output RELATIVE to input.',transfer:'Before calculating, say what one step along x does to y.',questions:[
          Q('When x grows by 2 and y grows by 8, the slope is:',['2','4','6','8'],1,'Slope equals change in y divided by change in x: 8 / 2 = 4.','Compare output change per one input step.'),
          Q('A line goes through (0, 2) and (1, 5). Its slope is:',['2','3','5','7'],1,'y increases by 3 while x increases by 1, giving slope 3.','Measure changes, not coordinates alone.'),
          Q('In y = 7x + 2, what does 7 represent?',['The starting value','The slope','The x-intercept','The maximum value'],1,'7 is the output change for a 1-unit input increase.','Which number describes change, not starting position?'),
          Q('Which two points describe a negative slope?',['(1, 2) and (2, 5)','(1, 8) and (3, 4)','(0, 2) and (2, 2)','(1, 1) and (4, 9)'],1,'As x increases from 1 to 3, y decreases from 8 to 4, producing a negative slope.','Watch the direction of both quantities.')
        ]},
      {id:'generalize',title:'Prove the pattern survives',label:'Lesson 04',kicker:'Beyond the example.',
        pattern:'A pattern becomes a rule when it accounts for new cases—not just the first familiar examples.',pair:['The rule y = 2x + 1 works when x = 3.','The rule y = 2x + 1 works when x = 30.'],
        delta:'Only the input changes from 3 to 30. The same proposed equation must be applied at both scales: 7 and 61, respectively.',
        anatomy:['Form a tentative rule from several pairs.','Test a new input not used to create the rule.','Check whether the rule fails on any given case.','Revise the rule when counterevidence appears.'],sketch:'RULE: y = 2x + 1\nWHEN x = 3: y = 7\nWHEN x = 30: y = 61\nSame rule; a new input tests its reach.',
        trap:'A few matching cases make a rule plausible, not automatically universal.',transfer:'Always reserve a fresh example for checking your proposed explanation.',questions:[
          Q('A rule is f(x) = 2x + 1. What is f(6)?',['12','13','14','15'],1,'Twice 6 is 12, plus 1 is 13.','Apply both operations in order.'),
          Q('A student infers “add 4 each time” from 2, 6, 10. Which next term supports the rule?',['12','13','14','16'],2,'Adding 4 to 10 gives 14, consistent with the hypothesis.','Keep the difference unchanged.'),
          Q('Which is the strongest way to test a proposed rule?',['Repeat the original example','Try a new case the rule predicts','Look only at a matching diagram','Avoid counterexamples'],1,'A fresh case tests whether the rule transfers beyond what suggested it.','Look for evidence the rule did not already fit by construction.'),
          Q('A rule predicts output 11 for input 5, but observation shows 12. What follows?',['The rule is confirmed','The rule needs revision or a qualified scope','All observations are false','The inputs must be ignored'],1,'A mismatching observation is counterevidence requiring investigation or refinement.','A rule must answer to the data.')
        ]}
    ]
  },
  {
    id:'inquiry', title:'How an explanation earns its place', short:'Critical inquiry', tag:'REASONING', number:'03', symbol:'⌁', duration:'25–35 min',
    description:'Find the relation between a claim, its evidence, and the alternative explanations it must survive.',
    objective:'Move from plausible statements to responsible conclusions.',tone:'lavender',
    resources:[{name:'Purdue OWL — Argument',url:'https://owl.purdue.edu/owl/general_writing/academic_writing/essay_writing/argumentative_essays.html',desc:'Foundations of argument structure and evidence.'}],
    skills:[
      {id:'claim-evidence',title:'Separate claim from support',label:'Lesson 01',kicker:'What is said, and why believe it?',
        pattern:'A claim asserts something; evidence supplies observations or facts that bear on whether it is true.',
        pair:['The new schedule helps students.','The new schedule helps students because attendance rose.'],
        delta:'The claim stays identical; the second sentence adds attendance as purported evidence. Attendance may be relevant without by itself proving that the schedule caused an improvement.',
        anatomy:['Locate the assertion being defended.','Find the observation or record offered in support.','Explain why the evidence is relevant to the claim.','Ask whether it also fits an alternative explanation.'],sketch:'CLAIM → assertion\nEVIDENCE → observation\nREASONING → connection',
        trap:'An emphatic restatement of a claim is not new evidence.',transfer:'When a paragraph feels convincing, identify the precise observation doing the work.',questions:[
          Q('Which sentence is an observation rather than a conclusion?',['This is the best school.','The lesson was successful.','Twenty-four students completed the task.','The teacher was effective.'],2,'Twenty-four students completed the task describes a measurable observation.','Look for a report that can be checked.'),
          Q('“The policy improved access.” Which would be relevant evidence?',['The author strongly believes it','The number of eligible applicants increased','The policy has a memorable name','The sentence is written in bold'],1,'An increase in eligible applicants bears directly on access, though causation still requires examination.','Which option actually measures access?'),
          Q('What is reasoning in a claim–evidence argument?',['A second opinion with no link','The explanation connecting evidence to the claim','A decorative example','A longer version of the claim'],1,'Reasoning explains how the evidence supports or limits the conclusion.','Ask what links the observation to the conclusion.'),
          Q('A report says “The strategy is excellent because it is excellent.” What is missing?',['A stronger adjective','Independent support','A longer title','Another identical claim'],1,'Repeating excellence supplies no independent evidence of effectiveness.','Does the support add any new information?')
        ]},
      {id:'cause',title:'Sequence is not causation',label:'Lesson 02',kicker:'What else could explain the change?',
        pattern:'Two events occurring together or in sequence do not, by themselves, establish that one caused the other.',
        pair:['Scores rose after tutoring began.','Scores rose because tutoring began.'],
        delta:'One connective changes: after describes sequence, whereas because asserts causation. Neither wording alone establishes causation; comparison and alternatives matter.',
        anatomy:['Identify the proposed cause and outcome.','List possible alternative variables.','Ask how the comparison was constructed.','Keep the conclusion no stronger than the design allows.'],sketch:'ASSOCIATION ≠ CAUSATION\nBetter test: compare controlled groups',
        trap:'“After” is a time description, not proof of “because.”',transfer:'Whenever you see an outcome change, ask what else changed at the same time.',questions:[
          Q('Ice cream sales and swimming incidents rise in summer. What is a plausible third factor?',['The flavor of ice cream','Hot weather and more swimming','The spelling of summer','The number of spoons'],1,'Hot weather can increase both ice cream sales and swimming activity.','Find a variable that could affect both.'),
          Q('What does correlation alone establish?',['One factor caused the other','Both variables are associated','Neither variable exists','The association is permanent'],1,'Correlation identifies an association, not a proven direction of cause.','Distinguish observing a relationship from explaining it.'),
          Q('Scores rise after a tutoring program starts. What question matters for causation?',['Was the logo attractive?','Could other changes explain the rise?','Were the worksheets colorful?','Was the result announced loudly?'],1,'Other changes—practice, selection, time—might explain the scores without tutoring causing the improvement.','What competing explanation remains?'),
          Q('Which design generally provides stronger causal evidence when properly conducted?',['One person’s anecdote','A controlled randomized comparison','A slogan','A list of predictions without outcomes'],1,'Randomization and control help reduce confounding, making causal inference stronger.','Which comparison limits alternative explanations?')
        ]},
      {id:'counterexamples',title:'The counterexample test',label:'Lesson 03',kicker:'Can your rule survive exception?',
        pattern:'One genuine counterexample can refute an unrestricted universal claim, even when many confirming examples exist.',
        pair:['This bird can fly.','This bird cannot fly.'],
        delta:'Adding not reverses one observation. A verified bird that cannot fly is sufficient to challenge the separate universal claim that every bird flies.',
        anatomy:['Find words such as every, always, never, all.','Imagine one case the claim must cover.','Check whether that case actually violates the claim.','Revise the scope, rather than ignoring the exception.'],sketch:'ALL A are B\nFind A that is NOT B\n→ unrestricted claim fails',
        trap:'A counterexample to “all” is not necessarily a counterexample to “some” or “often.”',transfer:'Test the strength of the quantifier before arguing about a claim.',questions:[
          Q('Which observation refutes “All mammals live on land”?',['An elephant lives on land','A dolphin lives in water','A lion hunts','A cat sleeps'],1,'Dolphins are aquatic mammals, so the universal statement fails.','Find one case that violates both parts of the claim.'),
          Q('A single counterexample most directly challenges which claim?',['Some students enjoy reading','Many students enjoy reading','Every student enjoys reading','Reading can be enjoyable'],2,'One student who does not enjoy reading refutes “every,” but not the weaker claims.','Look for the strongest universal quantifier.'),
          Q('A rule fits 50 cases but fails on one valid case. What should happen?',['Treat it as universally proven','Reconsider the unrestricted rule','Delete the failed case automatically','Conclude no pattern exists'],1,'A valid exception defeats the unrestricted universal version, though a narrower rule may still work.','Distinguish useful patterns from exceptionless laws.'),
          Q('Which replacement is logically weaker than “All students speak two languages”?',['No students speak two languages','Some students speak two languages','Exactly two students speak two languages','Every student speaks three languages'],1,'Some students is an existential claim and does not assert the property of everyone.','Compare the scope of the quantifiers.')
        ]},
      {id:'assumptions',title:'Find the hidden bridge',label:'Lesson 04',kicker:'What must be true for the claim to work?',
        pattern:'An inference often rests on an unstated assumption connecting its evidence to its conclusion.',
        pair:['The library is crowded.','The library is crowded, so everyone prefers printed books.'],
        delta:'The observation does not establish the conclusion unless we assume the crowd is there to use printed books—and even then “everyone” is too strong.',
        anatomy:['Separate the observation and the conclusion.','Ask what unstated bridge would make the leap plausible.','Check whether the bridge itself has evidence.','Reduce the strength of the conclusion when needed.'],sketch:'EVIDENCE + ASSUMPTION → CLAIM\nTest the missing bridge',
        trap:'A convincing story can still depend on an unsupported bridge between evidence and conclusion.',
        transfer:'Before accepting an argument, complete the phrase “This only follows if…”',questions:[
          Q('“The class was quiet, so everyone understood.” What assumption is being made?',['Silence reliably indicates understanding','All classes are large','The room had windows','Understanding makes noise'],0,'The inference treats silence as evidence of comprehension without establishing that link.','What connects the observed silence to the conclusion?'),
          Q('“The shop is busy, so its products are high quality.” What is an alternative explanation?',['The shop has shelves','The shop is near a transport hub','The products have names','The store has a door'],1,'Convenient location may generate traffic independently of product quality.','What else might explain crowds?'),
          Q('Which question best exposes an unstated assumption?',['Is the conclusion long?','What must be true for this evidence to support that conclusion?','Is the claim popular?','How many commas appear?'],1,'The question asks directly for the unspoken premise linking evidence and conclusion.','Look for the missing bridge.'),
          Q('A conclusion needs an unsupported assumption. The best response is to:',['Treat it as a proof','Investigate the assumption or qualify the conclusion','Ignore the evidence','Add confident language'],1,'A responsible inference tests its necessary assumptions or weakens its claim.','Match the strength of belief to the support.')
        ]}
    ]
  }
  ];
  window.PATTERN_CONTENT={courses,version:'1.0.0'};
})();
