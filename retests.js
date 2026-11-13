/* Independently authored delayed retrieval: four unseen items per pattern.
   The learner receives two each retest, alternating pairs across review rounds. */
(function(){
'use strict';
const Q=(prompt,options,correct,explanation,tip)=>({prompt,options,correct,explanation,tip});
const bank={
'syntax/constituents':[
 Q('In “The surprisingly patient tutor smiled,” what is the category of “surprisingly patient”?',['NP','AP','PP','VP'],1,'Patient is the adjectival head; surprisingly is an AdvP modifying it. Together they form an AP.','Find the head that determines the whole phrase. Output it before you label its modifier.'),
 Q('Change “the garden” to “the quiet garden.” Which constituent is expanded?',['VP','PP','NP','S'],2,'The noun phrase is expanded internally by an adjectival modifier; the noun garden remains its head.','Preserve the head and find what new phrase surrounds it.'),
 Q('In “These unusually bright stars shine,” which word heads the subject NP?',['These','unusually','bright','stars'],3,'Stars is the noun head; the others determine or modify it.','Which word could keep the whole constituent nominal?'),
 Q('Which grouping best preserves the subject of “A very tall tree fell”?',['[A very] [tall tree]','[A [very tall] tree]','[A very tall] [tree fell]','[A tree] [very tall fell]'],1,'The complete subject is an NP: D plus the nominal projection containing the AP very tall and N tree.','First locate the verb and isolate the entire subject.')
],
'syntax/complements':[
 Q('In “The puppy slept under the table,” what is “the table” in relation to “under”?',['The subject of slept','The complement of under','An adjunct of table','An adverb'],1,'The PP is an event adjunct; inside it, the table is the NP complement selected by under.','Determine the inner PP relationship separately from the outer one.'),
 Q('In “Amira examined the painting carefully,” which phrase is directly related to the examined object?',['carefully','the painting','Amira','the entire clause'],1,'The painting is the object NP complement of examined. Carefully describes manner.','Identify what was examined.'),
 Q('Which phrase functions as an optional event modifier in “The singer performed beautifully”?',['the singer','performed','beautifully','the singer performed'],2,'Beautifully is an AdvP adjunct describing how the performance took place.','Distinguish the event from its manner.'),
 Q('In “the portrait of Rowan,” what does “of Rowan” most naturally supply?',['A location of the portrait','The depicted subject of the portrait','The verb of a clause','A determiner'],1,'The noun portrait licenses a relation to what is depicted, expressed here by the PP of Rowan.','Ask what the head noun depicts.')
],
'syntax/attachment':[
 Q('“I spotted the cyclist with binoculars.” In the high-attachment reading, which event uses the binoculars?',['spotting','cycling','wearing','the binoculars being manufactured'],0,'High attachment treats the PP as modifying spotting, not cyclist.','Ask which constituent contains the action.'),
 Q('In “Nora visited the artist in the studio,” which reading matches low PP attachment?',['Nora visited while she was in the studio','The artist was in the studio','The studio was visited instead of the artist','Nora owned the studio'],1,'Low attachment puts in the studio inside the object NP, locating the artist.','Place the PP inside or outside the object NP.'),
 Q('What stays unchanged between the two structural readings of “Lee saw the friend with a telescope”?',['The PP’s lexical words and internal P+NP structure','The PP’s parent constituent','The identity of the telescope user','The resulting proposition about who has the telescope'],0,'The internal PP remains with + NP a telescope; its higher attachment changes.','Look inside the PP before asking where to attach it.'),
 Q('For “The officer interviewed the witness in uniform,” which position represents an event-level reading?',['PP inside the object NP','PP as sister of V′ within VP','PP beneath the noun witness only','PP inside the preposition in'],1,'A VP-attached PP describes the interviewing event and can imply the officer wore the uniform.','An adjunct can attach to the completed action rather than the object.')
],
'syntax/verbs':[
 Q('“The child pushed the cart.” In this sentence, pushed is:',['intransitive','monotransitive','ditransitive','linking'],1,'Pushed takes one object NP, the cart.','Count the verb’s complements here, not in another sentence.'),
 Q('“The coach sent a message to Mara.” Which full set names the verb’s complements?',['Mara only','a message only','a message and to Mara','the coach and a message'],2,'Sent takes the sent NP and the recipient PP in this construction.','Separate the object sent from its destination or recipient.'),
 Q('In “The water became cold,” cold is:',['a direct object NP','an AP complement of a linking verb','an AdvP manner adjunct','the grammatical subject'],1,'Became links the subject to a resulting property expressed by an AP.','Does the predicate describe an object or property of the subject?'),
 Q('Which is an intransitive use of the verb?',['The dog barked.','The dog startled the cat.','The dog gave the child a toy.','The dog seemed hungry.'],0,'Barked takes no object or predicative complement in this sentence.','List the complements, if any.')
],
'quantities/difference-ratio':[
 Q('A machine adds 5 to its output each cycle, starting at 2. Which sequence fits?',['2,7,12,17','2,10,50,250','2,7,35,175','2,5,10,20'],0,'Constant addition of 5 produces 2, 7, 12, 17.','Track the size of the differences.'),
 Q('A value triples each step from 4. What is the third value?',['10','12','24','36'],3,'The sequence is 4, 12, 36, so the third value is 36.','Distinguish multiplying each step from adding a fixed amount.'),
 Q('Which sequence has a constant multiplicative ratio of 2?',['1,3,5,7','5,10,20,40','2,4,6,8','8,12,16,20'],1,'Each term is twice the preceding one in 5, 10, 20, 40.','Check quotients rather than differences.'),
 Q('Which change would turn “add 4” into a new kind of relationship?',['Start at a different value','Use a different label for terms','Multiply by 4 at each step','Write the terms vertically'],2,'Multiplying by 4 produces constant ratios, not constant differences.','Look for the operation that produces the sequence.')
],
'quantities/proportion':[
 Q('Three identical pens cost $9. At a constant unit price, seven cost:',['$18','$21','$27','$30'],1,'The unit price is $3, so seven pens cost $21.','Recover the per-unit rate before scaling.'),
 Q('A 2-liter mixture contains 500 mL concentrate. A 6-liter mixture at the same concentration contains:',['750 mL','1,000 mL','1,500 mL','3,000 mL'],2,'Tripling the total mixture from 2 to 6 liters requires tripling concentrate from 500 to 1,500 mL.','Scale both quantities by the same factor.'),
 Q('Which table could describe a proportional relationship?',['(1,2), (2,5), (3,8)','(1,4), (2,8), (3,12)','(1,3), (2,7), (3,11)','(1,5), (2,8), (3,11)'],1,'The output/input ratio stays 4 for all three pairs.','Check y divided by x in each pair.'),
 Q('If a bill has a fixed $10 fee plus $2 per hour, why is the total not proportional to hours?',['It never increases','The hourly change is negative','The fixed fee makes the ratio vary','The cost is always $2'],2,'The $10 starting fee prevents a constant total-cost-to-hours ratio.','Test the amount when hours are zero.')
],
'quantities/rates':[
 Q('A car travels 18 km in 3 hours at constant speed. Which rate describes the change?',['3 km per hour','6 km per hour','15 km per hour','54 km per hour'],1,'18 divided by 3 is 6 km per hour.','Express change in distance per one hour.'),
 Q('The points (1,5) and (4,17) belong to a line. Its slope is:',['3','4','12','16'],1,'Change in y is 12 and change in x is 3; the slope is 4.','Compare the change of outputs with the change of inputs.'),
 Q('A pattern moves from (2,7) to (5,7). The output change per input step is:',['0','1','3','7'],0,'The output stays 7 while x changes, so slope is zero.','Inspect the difference in y.'),
 Q('Two lines have the same starting output but one rises by 2 for each step and the other by 5. What differs?',['Only their names','Their slopes','Their starting outputs','Their input units must differ'],1,'Their rates of change differ: 2 versus 5 units of output per input unit.','Look at the per-step amount.')
],
'quantities/generalize':[
 Q('A rule fits n=1,2,3. Which claim is warranted without more reasoning?',['It must fit every n','It fits those three tested values','It is the only possible rule','It has no counterexamples'],1,'A finite sample establishes fit only to the cases checked unless a proof is supplied.','Separate observed success from universal validity.'),
 Q('The rule y=3x+2 gives y=5 when x=1. What does it give at x=10?',['12','22','30','32'],3,'3 times 10 plus 2 gives 32.','Use the same rule at a new input.'),
 Q('A conjecture says every even number is divisible by 4. Which counterexample is decisive?',['8','12','14','20'],2,'14 is even and is not divisible by 4, so it refutes the unrestricted claim.','Choose an item satisfying the premise but not the conclusion.'),
 Q('What strengthens a mathematical conjecture most beyond testing a few cases?',['A carefully justified proof','A prettier table','Repeating the examples','A larger heading'],0,'A proof explains why the rule must hold for all inputs in the claimed domain.','Ask what would establish the entire domain rather than sampled points.')
],
'inquiry/claim-evidence':[
 Q('Which is a verifiable observation rather than an evaluation?',['The course was outstanding','The students were clearly inspired','Seventeen participants completed the survey','The lesson was a complete success'],2,'Survey completion is a checkable count; the others are broad evaluations.','Which statement could be checked against records?'),
 Q('An author says a new bus route helps commuters. Which observation most directly bears on that claim?',['The route logo is blue','Average travel time declined on the route','The author likes buses','The brochure was widely shared'],1,'A decrease in travel time is relevant to commuters’ journeys, though alternative causes still matter.','Look for an outcome linked to the claim.'),
 Q('A student says “Everyone learned because everyone learned.” What is missing?',['A second repetition','Evidence independent of the claim','A stronger adjective','More certainty'],1,'The purported support merely repeats the claim, adding no independent observation.','Ask whether the reason supplies new information.'),
 Q('Which statement best distinguishes a claim from evidence?',['Evidence is always a number','A claim is what is asserted; evidence bears on whether it holds','Claims are always false','Evidence never needs interpretation'],1,'Claims assert propositions; evidence supports or challenges them and still requires reasoning.','Think about the roles rather than the length of the statements.')
],
'inquiry/cause':[
 Q('Class scores improve after a new timetable. Which rival explanation should be investigated?',['The timetable has a new name','Students received extra tutoring at the same time','The chart has green bars','The school mascot changed colors'],1,'Extra tutoring could improve scores independently of the timetable change.','Ask what else changed alongside the proposed cause.'),
 Q('Which evidence most strongly tests whether a new practice causes an improvement?',['A personal testimonial','A comparable control group without the practice','A persuasive speech','A large poster showing the improvement'],1,'A comparison group helps evaluate what might have happened without the practice.','Imagine the counterfactual outcome.'),
 Q('An observer sees more umbrellas when roads are wet. Which cause might explain both?',['Umbrellas make roads wet','Rainfall','The color of umbrellas','People walk slower'],1,'Rain can cause both wet roads and umbrella use.','Identify a factor affecting the two observations.'),
 Q('A headline changes “scores rose after training” into “training raised scores.” What changed?',['The measured outcome','The causal strength of the claim','The subject of the sentence','The number of observations'],1,'After states a sequence; raised asserts causation that needs additional evidence.','Read the causal commitment in the verbs.')
],
'inquiry/counterexamples':[
 Q('Which refutes “Every reptile has four legs”?',['A lizard with four legs','A snake with no legs','A four-legged tortoise','A crocodile with four legs'],1,'A snake is a reptile without legs, contradicting the universal statement.','Find a member of the category lacking the asserted property.'),
 Q('The claim is “At least one student likes poetry.” Which observation refutes it?',['One student dislikes poetry','Five students dislike poetry','Every student was checked and none likes poetry','One student prefers prose'],2,'To refute an existential claim one must rule out every instance in its stated domain.','Match the quantifier to the kind of counterevidence needed.'),
 Q('The claim is “Every square with a whole-number side length has even area.” Which case refutes it?',['A square with side 3 and area 9','A square with side 2 and area 4','A square with side 4 and area 16','A square with side 6 and area 36'],0,'A square with integer side 3 has area 9, which is odd, and refutes the universal claim.','Find a valid example whose area violates the universal conclusion.'),
 Q('An experiment reveals an exception to a claim using “always.” What should happen first?',['Ignore the exception','Check whether it is a valid counterexample and revise scope if so','Replace always with definitely','Repeat the original assertion'],1,'A genuine counterexample defeats an unrestricted universal statement; a narrower rule may survive.','Check whether the case falls within the original claim.')
],
'inquiry/assumptions':[
 Q('“The room is quiet, so all students understood.” What unstated link is assumed?',['Quietness reliably indicates understanding','Students were assigned seats','The class was short','Understanding is impossible'],0,'The inference requires quietness to be reliable evidence of understanding, which was not established.','Identify the bridge between observation and conclusion.'),
 Q('“The restaurant is busy, therefore its food is excellent.” What alternative explains the crowd?',['Its sign contains letters','It is next to a transit hub','It has a kitchen','Its menu contains food'],1,'A convenient location can draw customers independently of quality.','Look for a competing causal explanation.'),
 Q('Which new finding most directly challenges “All customers returned because of our service”?',['Some returning customers received substantial discounts','The service has a slogan','The shop repainted a wall','The business uses receipts'],0,'Discounts provide another plausible reason for repeat visits, weakening the exclusive causal claim.','Ask what else could motivate the same result.'),
 Q('An argument relies on a premise nobody has checked. Which response is most responsible?',['Declare the conclusion certain','Investigate the premise or qualify the conclusion','Ignore the premise','Restate the conclusion emphatically'],1,'Untested assumptions should be examined or the claim limited accordingly.','Match the confidence of the conclusion to available evidence.')
],
...Object.fromEntries(Object.entries(window.PATTERN_CASE_RELATIONS?.retests||{}).map(([k,v])=>['syntax/'+k,v])),
...Object.fromEntries(Object.entries(window.PATTERN_STRUCTURE_LINEARITY?.retests||{}).map(([k,v])=>['syntax/'+k,v])),
...(window.PATTERN_ARABIC?.retests||{})
};
const connections={
  'syntax/constituents':['syntax/complements','syntax/attachment'],
  'syntax/complements':['syntax/verbs','syntax/attachment'],
  'syntax/attachment':['syntax/constituents','syntax/complements'],
  'syntax/verbs':['syntax/complements','syntax/constituents'],
  'quantities/difference-ratio':['quantities/proportion','quantities/rates'],
  'quantities/proportion':['quantities/difference-ratio','quantities/rates'],
  'quantities/rates':['quantities/proportion','quantities/generalize'],
  'quantities/generalize':['quantities/rates','inquiry/counterexamples'],
  'inquiry/claim-evidence':['inquiry/cause','inquiry/assumptions'],
  'inquiry/cause':['inquiry/claim-evidence','inquiry/assumptions'],
  'inquiry/counterexamples':['quantities/generalize','inquiry/assumptions'],
  'inquiry/assumptions':['inquiry/claim-evidence','inquiry/cause'],
  ...Object.fromEntries(Object.entries(window.PATTERN_CASE_RELATIONS?.connections||{}).map(([k,v])=>['syntax/'+k,v])),
  ...Object.fromEntries(Object.entries(window.PATTERN_STRUCTURE_LINEARITY?.connections||{}).map(([k,v])=>['syntax/'+k,v])),
...(window.PATTERN_ARABIC?.connections||{})
};
for(const course of window.PATTERN_CONTENT.courses)for(const skill of course.skills){
  const id=course.id+'/'+skill.id;
  if(!bank[id]||bank[id].length!==4)throw new Error('Retest bank incomplete: '+id);
  const all=[...skill.questions,...bank[id]];
  if(new Set(all.map(q=>q.prompt)).size!==all.length)throw new Error('Duplicate question: '+id);
  skill.retest=bank[id];skill.related=connections[id]||[];
}
window.PATTERN_CONTENT.version='5.2.0';
})();
