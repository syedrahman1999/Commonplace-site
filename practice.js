/* Patternwork v4 question pools.
   Diagnostic, guided first transfer, open practice, and delayed mastery use
   separate authored prompts. Practice never falls back to a seen question. */
(function(){
'use strict';
const Q=(prompt,options,correct,explanation,tip)=>({prompt,options,correct,explanation,tip});
const bank={
'syntax/constituents':[
 Q('In “A sudden storm arrived,” which words form the complete subject constituent?',['A sudden storm','sudden storm','storm arrived','arrived'],0,'A sudden storm is the full subject NP; storm is its noun head.','Find the verb, then keep every word that belongs to its subject together.'),
 Q('What is the category of “extremely calm” in “The extremely calm guide waited”?',['NP','AP','PP','VP'],1,'Calm is the adjective head and extremely modifies it, so the whole phrase is an AP.','Let the head determine the category of the whole phrase.'),
 Q('Which word heads the phrase “those blue folders”?',['those','blue','folders','those blue'],2,'Folders is the noun head; those and blue occur inside the NP.','Remove modifiers mentally and find the word that keeps the phrase nominal.'),
 Q('Compare “Birds sing” with “Small birds sing.” What changed?',['The verb became a noun','An adjective was added inside the subject NP','A PP replaced the subject','The sentence lost its predicate'],1,'Small adds a modifier inside the subject NP while birds remains its head and sing remains the predicate.','Track one addition without changing the larger subject–predicate relationship.')
],
'syntax/complements':[
 Q('In “Lena placed the mug on the tray,” which pair completes the meaning of placed in this use?',['Lena and the mug','the mug and on the tray','placed and the tray','the tray and Lena'],1,'Placed relates an object, the mug, to a location, on the tray; both complete this use of the verb.','Ask what was placed and where it was placed.'),
 Q('Which phrase is an optional manner modifier in “The drummer played softly”?',['The drummer','played','softly','The drummer played'],2,'Softly describes how the playing occurred and can be removed while leaving a complete clause.','Try removing the candidate and see whether the verb still has what it requires.'),
 Q('In “proud of the result,” what is the role of “of the result”?',['It completes the adjective’s relation','It is the subject NP','It changes proud into a verb','It is a determiner'],0,'The PP supplies what the pride concerns, completing the relation licensed by proud.','Ask what the adjective is proud of.'),
 Q('Which phrase is most tightly selected by the noun in “the destruction of the bridge”?',['the destruction','of the bridge','the','the bridge was'],1,'Of the bridge identifies what was destroyed and is closely related to the noun destruction.','Recover the event relation expressed by the noun.')
],
'syntax/attachment':[
 Q('In “Kai photographed the actor on the balcony,” which reading puts the PP inside the object NP?',['Kai used the balcony to photograph','The actor was on the balcony','The photograph was on the balcony','The balcony photographed the actor'],1,'Low attachment makes on the balcony part of the actor NP, locating the actor.','Ask whether the PP describes the object or the photographing event.'),
 Q('For “Mina opened the package with a key,” which reading uses high attachment?',['The package contained a key','Mina used a key to open it','The key was inside the package name','The package opened Mina'],1,'High attachment places the PP with the VP, so it describes the means of opening.','Attach the PP to the action rather than the object.'),
 Q('What changes between the two readings of “Sam greeted the teacher in the hallway”?',['The words inside the PP','The preposition’s object','The PP’s attachment site','The verb’s spelling'],2,'The PP keeps the same internal words but attaches either within the object NP or at the event level.','Hold the PP itself constant and move only its parent constituent.'),
 Q('Which bracket gives the object-modifying reading of “We discussed the report from Oslo”?',['[discussed the report] [from Oslo]','discussed [the report [from Oslo]]','[discussed from] [Oslo the report]','discussed [the] [report from] Oslo'],1,'Putting from Oslo inside the report NP makes it identify which report was discussed.','For low attachment, keep the PP inside the object NP.')
],
'syntax/verbs':[
 Q('“The lantern glowed.” How is glowed used here?',['Intransitive','Monotransitive','Ditransitive','Linking with an AP'],0,'Glowed has no object or predicative complement in this sentence.','Count the complements that actually appear.'),
 Q('“Ravi carried the boxes.” How is carried used?',['Intransitive','Monotransitive','Ditransitive','Linking'],1,'Carried takes one object NP, the boxes.','Identify the one entity affected by the action.'),
 Q('“The guide gave the visitors a map.” How is gave used?',['Intransitive','Monotransitive','Ditransitive','Linking'],2,'Gave relates two object NPs: the visitors and a map.','Count both recipient and thing transferred.'),
 Q('In “The sky remained clear,” what is clear?',['A direct object NP','An AP complement describing the subject','An optional manner adverb','A second subject'],1,'Remained links the sky to the property clear, expressed by an AP complement.','Ask whether the phrase names an object or a property of the subject.')
],
'quantities/difference-ratio':[
 Q('Which sequence keeps a difference of 6?',['4, 10, 16, 22','4, 10, 60, 360','6, 12, 24, 48','3, 9, 27, 81'],0,'Each adjacent pair in 4, 10, 16, 22 differs by 6.','Subtract neighboring terms.'),
 Q('Which sequence keeps a ratio of 4?',['2, 6, 10, 14','3, 7, 11, 15','2, 8, 32, 128','5, 9, 13, 17'],2,'Each term is four times the preceding term in 2, 8, 32, 128.','Divide neighboring terms.'),
 Q('A savings balance grows by $12 each month. What stays constant?',['The monthly ratio','The monthly difference','The total balance','The percentage increase'],1,'Adding the same $12 preserves an additive difference, not a ratio.','Separate a fixed amount from a fixed percentage.'),
 Q('A culture grows by a factor of 1.5 each hour. Which description fits?',['Additive change with difference 1.5','Multiplicative change with ratio 1.5','No change','A decreasing additive rule'],1,'A factor describes multiplication, so consecutive values have ratio 1.5.','Treat “factor” as a clue about ratios.')
],
'quantities/proportion':[
 Q('Four tickets cost $28 at a constant price. What do nine tickets cost?',['$49','$56','$63','$72'],2,'Each ticket costs $7, so nine cost $63.','Find one ticket’s cost, then scale.'),
 Q('A map uses 3 cm for 12 km. At the same scale, 5 cm represents:',['15 km','18 km','20 km','24 km'],2,'The scale is 4 km per centimeter, so 5 cm represents 20 km.','Preserve the distance-to-centimeter ratio.'),
 Q('Which pair is equivalent to the ratio 6:8?',['9:12','8:10','12:20','15:18'],0,'Multiplying 6:8 by 1.5 gives 9:12; both simplify to 3:4.','Simplify or scale both entries by the same factor.'),
 Q('Why is y = 4x + 3 not proportional?',['The rate 4 is too large','The +3 creates a nonzero starting value','x is a letter','The output increases'],1,'A proportional relation has zero output at zero input; the added 3 changes the ratio.','Check the output when x is zero.')
],
'quantities/rates':[
 Q('Output changes from 9 to 21 while input changes from 2 to 5. What is the slope?',['3','4','6','12'],1,'The output change is 12 and the input change is 3, so slope is 4.','Compute change in output per change in input.'),
 Q('A tank fills 35 liters in 5 minutes at a steady rate. What is the rate?',['5 liters/minute','7 liters/minute','30 liters/minute','175 liters/minute'],1,'Thirty-five divided by five is 7 liters per minute.','Reduce the change to one minute.'),
 Q('Which pair of points has slope −2?',['(0,1) and (2,5)','(1,6) and (3,2)','(2,4) and (4,4)','(1,1) and (2,3)'],1,'From (1,6) to (3,2), y changes by −4 while x changes by 2, giving −2.','Track the signed changes in both coordinates.'),
 Q('Two graphs have equal slopes but different y-intercepts. What stays the same?',['Their starting outputs','Their rate of change','Every point','Their x-intercepts'],1,'Equal slopes mean equal output change per input step even when starting values differ.','Distinguish rate from starting position.')
],
'quantities/generalize':[
 Q('A rule matches inputs 2, 4, and 6. What is the safest conclusion?',['It works for every number','It works for the tested inputs','It is the only possible rule','It cannot ever fail'],1,'Matching three cases supports those cases; a general claim still needs broader testing or proof.','Do not let sampled evidence silently become a universal conclusion.'),
 Q('For g(x)=x²−1, what novel output is predicted at x=5?',['20','24','25','26'],1,'Five squared is 25, and subtracting 1 gives 24.','Apply every part of the proposed rule.'),
 Q('A conjecture says all multiples of 6 are even. Which method establishes it generally?',['Check only 6 and 12','Write any multiple as 6k = 2(3k)','Draw a larger table','Repeat the claim'],1,'Expressing 6k as twice an integer explains why every multiple of 6 is even.','Seek a reason that covers the entire domain.'),
 Q('A proposed rule predicts 18, but a valid new case gives 19. What should happen?',['Keep the rule unchanged','Revise the rule or narrow its scope','Discard the observation automatically','Call the rule proven'],1,'A valid mismatch is counterevidence and requires revision or a qualified domain.','Make the explanation answer to the fresh case.')
],
'inquiry/claim-evidence':[
 Q('Which sentence is a claim rather than a raw observation?',['The sensor recorded 18°C','Twelve forms were returned','The new process is more reliable','The meeting lasted 42 minutes'],2,'More reliable is an interpretation that needs supporting measurements; the others report records.','Ask which statement still needs to be defended.'),
 Q('A school claims a reading program improved comprehension. Which evidence is most relevant?',['The workbook cover changed','Comparable comprehension scores rose after the program','The program has a catchy name','Teachers received new mugs'],1,'A change in comparable comprehension measures bears directly on the stated outcome.','Match the evidence to the exact property in the claim.'),
 Q('What does reasoning contribute between evidence and a claim?',['It repeats the claim','It explains why the evidence bears on the claim','It removes the need for evidence','It makes every conclusion certain'],1,'Reasoning states the connection and its limits; it does not manufacture certainty.','Name the bridge from observation to conclusion.'),
 Q('“The plan is effective because it works well.” What is the central problem?',['The sentence is too short','The support restates the claim','The claim contains a verb','The evidence is numerical'],1,'Works well merely repeats effective and supplies no independent observation.','Check whether the supposed reason adds information.')
],
'inquiry/cause':[
 Q('Plant growth and daylight both increase in spring. What could help explain both?',['Longer days and warmer conditions','The spelling of spring','Pot color alone','The graph title'],0,'Seasonal conditions can influence both daylight and plant growth without one measured trend proving the other caused it.','Look for a common cause.'),
 Q('Which change most improves a test of whether a study method causes higher scores?',['Use a brighter poster','Compare similar learners assigned to different methods','Ask only high scorers','Announce the desired result'],1,'A comparable assigned group helps separate the method from pre-existing differences.','Construct a credible comparison for what would happen without the method.'),
 Q('A city adds bike lanes and crashes decline. Which question protects against a premature causal claim?',['Did traffic volume or enforcement change too?','Were the lanes painted green?','Is the city name long?','Did the report use a table?'],0,'Other simultaneous changes could also influence crashes and should be investigated.','List rival changes that could produce the outcome.'),
 Q('What extra commitment appears when “B followed A” becomes “A produced B”?',['A spelling claim','A causal claim','A count of events','A definition of B'],1,'Followed describes order, while produced says A caused B.','Separate sequence from mechanism.')
],
'inquiry/counterexamples':[
 Q('Which case refutes “All prime numbers are odd”?',['3','5','2','11'],2,'Two is prime and even, so it is a valid counterexample to the universal claim.','Find a member of the category without the claimed property.'),
 Q('Which observation would refute “No metal conducts electricity”?',['Copper conducts electricity','Wood does not conduct electricity','Glass is brittle','Iron is heavy'],0,'One conducting metal is enough to refute a claim that no metals conduct.','Match the counterexample to both the category and the forbidden property.'),
 Q('A statement says “Some birds migrate.” Which finding contradicts it?',['One bird does not migrate','Many birds do not migrate','A complete survey shows no birds migrate','One bird migrates'],2,'An existential claim fails only if there is no qualifying case in the domain.','Notice that “some” and “all” require different counterevidence.'),
 Q('A universal rule fails for one verified in-scope case. What remains possible?',['The unrestricted rule is still proven','A narrower rule may still be useful','The case must be ignored','No pattern can exist anywhere'],1,'The universal version fails, but a qualified rule may accurately describe a smaller domain.','Revise scope instead of choosing between denial and total abandonment.')
],
'inquiry/assumptions':[
 Q('“The lights are on, so someone is home.” What assumption connects the evidence to the conclusion?',['Lights are never automated or left on','Homes contain lights','Electricity exists','The sentence is present tense'],0,'The inference assumes no timer or absent person left the lights on.','State what would have to be true for the sign to be reliable.'),
 Q('“Downloads increased, so users love the app.” Which alternative weakens the bridge?',['A free promotion drove one-time downloads','The app has an icon','Downloads are counted','Phones use batteries'],0,'A promotion could increase downloads without establishing satisfaction or continued use.','Find another cause of the same observation.'),
 Q('Which question best tests a hidden premise?',['What must be true for this evidence to support that conclusion?','Is the paragraph long?','Does the author sound confident?','How many nouns appear?'],0,'The question asks directly for the necessary bridge and makes it available for testing.','Expose the missing connection before judging it.'),
 Q('If a conclusion depends on an uncertain bridge, how should the conclusion change?',['Become more absolute','Be investigated or qualified','Ignore the uncertainty','Replace evidence with repetition'],1,'Responsible reasoning either tests the premise or reduces the conclusion’s strength.','Match confidence to the weakest necessary link.')
],
...Object.fromEntries(Object.entries(window.PATTERN_CASE_RELATIONS?.practice||{}).map(([k,v])=>['syntax/'+k,v])),
...Object.fromEntries(Object.entries(window.PATTERN_STRUCTURE_LINEARITY?.practice||{}).map(([k,v])=>['syntax/'+k,v])),
...(window.PATTERN_ARABIC?.practice||{})
};

const cloneItems=(items,skillId)=>items.map((q,index)=>({...q,options:[...q.options],skillId,qindex:index}));
const answerSet=items=>[...new Set(items.map(q=>q.correct))].sort().join('');
function placeAnswer(q,target){
  if(q.correct===target)return;
  const old=q.correct,next=[...q.options];
  [next[old],next[target]]=[next[target],next[old]];
  q.options=next;q.correct=target;
}
function answerPositionAudit(skill){
  const diagnostic=skill.diagnostic||skill.questions.slice(0,2),first=skill.firstTransfer||skill.questions.slice(2,4),practice=skill.practice||[],mastery=skill.retest||[];
  const valid=[...diagnostic,...first,...practice,...mastery].every(q=>Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4);
  return {ok:valid&&diagnostic.length===2&&answerSet(diagnostic).length===2&&first.length===2&&answerSet(first).length===2&&practice.length>=4&&answerSet(practice.slice(0,4))==='0123'&&mastery.length>=4&&answerSet(mastery.slice(0,4))==='0123'&&mastery.slice(0,2)[0].correct!==mastery.slice(0,2)[1].correct&&mastery.slice(2,4)[0].correct!==mastery.slice(2,4)[1].correct};
}
const api={
 diagnosticItems(course){return course.skills.flatMap(skill=>cloneItems(skill.diagnostic||skill.questions.slice(0,2),skill.id));},
 firstTransferItems(skill){return skill.firstTransfer||skill.questions.slice(2,4);},
 practiceItems(skill){return cloneItems(Array.isArray(skill.practice)?skill.practice:[],skill.id);},
 retestItems(skill,priorRetestAnswers=0){
   const source=Array.isArray(skill.retest)?skill.retest:[];
   if(source.length<2)return [];
   const pair=(Math.floor(priorRetestAnswers/2)%Math.max(1,Math.floor(source.length/2)))*2;
   return cloneItems(source.slice(pair,pair+2),skill.id);
 },
 auditSkill(skill){
   const pools={diagnostic:skill.diagnostic||skill.questions.slice(0,2),firstTransfer:skill.firstTransfer||skill.questions.slice(2,4),practice:skill.practice||[],mastery:skill.retest||[]};
   const all=Object.entries(pools).flatMap(([pool,items])=>items.map(q=>({pool,prompt:q.prompt})));
   const seen=new Map(),duplicates=[];
   for(const item of all){if(seen.has(item.prompt))duplicates.push(`${seen.get(item.prompt)} / ${item.pool}: ${item.prompt}`);else seen.set(item.prompt,item.pool);}
   return {ok:pools.diagnostic.length===2&&pools.firstTransfer.length===2&&pools.practice.length>=4&&pools.mastery.length>=4&&!duplicates.length,pools,duplicates};
 },
 answerPositionAudit
};

let skillOrdinal=0;
for(const course of window.PATTERN_CONTENT.courses)for(const skill of course.skills){
  const id=course.id+'/'+skill.id;
  if(!bank[id]||bank[id].length!==4)throw new Error('Practice bank incomplete: '+id);
  skill.diagnostic=skill.questions.slice(0,2);
  skill.firstTransfer=skill.questions.slice(2,4);
  skill.practice=bank[id];
  const rotation=skillOrdinal%4;
  const coreTargets=[0,2,1,3],practiceTargets=[0,1,3,2],masteryTargets=[2,0,3,1];
  skill.questions.slice(0,4).forEach((q,index)=>placeAnswer(q,(coreTargets[index]+rotation)%4));
  skill.practice.slice(0,4).forEach((q,index)=>placeAnswer(q,(practiceTargets[index]+rotation)%4));
  skill.retest.slice(0,4).forEach((q,index)=>placeAnswer(q,(masteryTargets[index]+rotation)%4));
  const audit=api.auditSkill(skill);
  if(!audit.ok)throw new Error('Question pools overlap or are incomplete: '+id+' '+audit.duplicates.join('; '));
  if(!api.answerPositionAudit(skill).ok)throw new Error('Answer positions are not balanced: '+id);
  skillOrdinal++;
}
window.PatternPools=api;
window.PATTERN_CONTENT.version='5.2.0';
})();
