/* Patternwork v4: explicit trust boundary for learner-imported JSON. No dependencies. */
(function () {
  'use strict';
  const own = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  const slug = (v) => typeof v === 'string' && /^[a-z0-9_-]{2,45}$/i.test(v);
  const text = (v, max=20000, min=0) => typeof v === 'string' && v.length >= min && v.length <= max;
  const stamp = (v) => text(v, 80) && !Number.isNaN(Date.parse(v));
  const err = (where, explanation) => ({ok:false,error:`${where}: ${explanation}`});
  const good = {ok:true,error:null};
  function question(q,where) {
    if (!own(q)) return err(where,'expected a question object');
    if (!text(q.prompt,1200,3)) return err(where+'.prompt','expected a nonempty string under 1,200 characters');
    if (!Array.isArray(q.options) || q.options.length!==4 || !q.options.every(v=>text(v,650,1))) return err(where+'.options','expected exactly four nonempty strings');
    if (!Number.isInteger(q.correct) || q.correct<0 || q.correct>3) return err(where+'.correct','must be an index from 0 to 3');
    if (!text(q.explanation,3000,4) || (q.tip!==undefined && !text(q.tip,1500))) return err(where,'invalid explanation or hint');
    return good;
  }
  function course(c,where='course') {
    if (!own(c)) return err(where,'expected a course object');
    if (!slug(c.id)) return err(where+'.id','expected a unique slug of 2–45 letters, digits, hyphens or underscores');
    for (const f of ['title','short','tag','description','objective']) if (!text(c[f],f==='description'?2000:200,1)) return err(where+'.'+f,'expected nonempty text');
    for (const f of ['symbol','tone','number','duration']) if (c[f]!==undefined && !text(c[f],100)) return err(where+'.'+f,'expected text');
    if (!Array.isArray(c.skills) || !c.skills.length || c.skills.length>30) return err(where+'.skills','expected 1–30 skills');
    if (c.resources!==undefined) {
      if (!Array.isArray(c.resources) || c.resources.length>60) return err(where+'.resources','must be an array (not an object) of at most 60 resources');
      for (let i=0;i<c.resources.length;i++) {
        const r=c.resources[i],p=`${where}.resources[${i}]`;
        if (!own(r)||!text(r.name,180,1)||!text(r.url,1800,1)|| (r.desc!==undefined&&!text(r.desc,1200)))return err(p,'expected {name, url, optional desc} strings');
        try {const u = new URL(r.url); if(!['https:','http:'].includes(u.protocol))return err(p+'.url','must be an HTTP(S) link');} catch (_) {return err(p+'.url','invalid URL');}
      }
    }
    const seen=new Set();
    for(let i=0;i<c.skills.length;i++) {
      const s=c.skills[i],p=`${where}.skills[${i}]`;
      if (!own(s)||!slug(s.id)) return err(p+'.id','invalid skill ID');
      if (seen.has(s.id))return err(p+'.id',`duplicate skill identifier "${s.id}"`);
      seen.add(s.id);
      for(const f of ['title','label','kicker','pattern','delta','sketch','trap','transfer']) if (!text(s[f],f==='sketch'?6000:3000,1))return err(p+'.'+f,'required text is missing or too long');
      if (!Array.isArray(s.pair) || s.pair.length!==2 || !s.pair.every(v=>text(v,1500,1))) return err(p+'.pair','must contain exactly two nonempty strings');
      if (!Array.isArray(s.anatomy)||s.anatomy.length<2||s.anatomy.length>15||!s.anatomy.every(v=>text(v,1200,1)))return err(p+'.anatomy','expected 2–15 step strings');
      if (!Array.isArray(s.questions)||s.questions.length<4||s.questions.length>80)return err(p+'.questions','expected 4–80 questions');
      for (let j=0;j<s.questions.length;j++){const r=question(s.questions[j],`${p}.questions[${j}]`);if(!r.ok)return r;}
      if(s.practice!==undefined){
        if(!Array.isArray(s.practice)||s.practice.length<4||s.practice.length>40)return err(p+'.practice','expected at least four fresh practice questions');
        for(let j=0;j<s.practice.length;j++){const r=question(s.practice[j],`${p}.practice[${j}]`);if(!r.ok)return r;}
      }
      if(s.construct!==undefined){const b=s.construct,w=p+'.construct';
        if(!own(b)||!Array.isArray(b.tiles)||b.tiles.length<2||b.tiles.length>24||!b.tiles.every(t=>text(t,120,1)))return err(w,'expected 2–24 short text tiles');
        if(!Array.isArray(b.rows)||!b.rows.length||b.rows.length>8)return err(w,'expected 1–8 rows');if(b.joiner!==undefined&&!text(b.joiner,3,1))return err(w+'.joiner','expected a short separator');
        for(const [i,r] of b.rows.entries()){if(!own(r)||!text(r.label,160,1)||!Number.isInteger(r.slots)||r.slots<1||r.slots>6||!Array.isArray(r.answers)||!r.answers.length||!r.answers.every(a=>Array.isArray(a)&&a.length===r.slots&&a.every(t=>b.tiles.includes(t))))return err(w+'.rows['+i+']','each row needs a label, 1–6 slots, and answers made only of its tiles');}
      }
      if(s.observe!==undefined) {
        if(!own(s.observe))return err(p+'.observe','expected an object with stable and changed questions');
        for(const part of ['stable','changed']){
          const x=s.observe[part],where=p+'.observe.'+part;
          if(!own(x)||!text(x.prompt,350,5)||!Array.isArray(x.options)||x.options.length!==3||!x.options.every(v=>text(v,350,1))||!Number.isInteger(x.correct)||x.correct<0||x.correct>2||!text(x.explanation,1200,5))return err(where,'expected a prompt, three choices, a valid key and an explanation');
        }
      }
      if(s.retest!==undefined){
        if(!Array.isArray(s.retest)||s.retest.length<2||s.retest.length>30)return err(p+'.retest','expected at least two fresh retest questions');
        for(let j=0;j<s.retest.length;j++){const r=question(s.retest[j],`${p}.retest[${j}]`);if(!r.ok)return r;}
      }
      const poolPrompts=[...s.questions,...(s.practice||[]),...(s.retest||[])].map(q=>q.prompt);
      if(new Set(poolPrompts).size!==poolPrompts.length)return err(p,'question prompts must not repeat across diagnostic, first-transfer, practice, and mastery pools');
    }
    return good;
  }
  function progress(d,builtinCourses=[]) {
    if(!own(d)||d.version!==1)return err('progress','not a supported Patternwork history (version 1 compatible)');
    const arrays=['attempts','customCourses','artifacts','visitors','resources','activity','constructionHistory','freeConstructions','humanReviews','pilotStudies'];
    const objects=['completed','diagnostics','reflections'];
    for(const k of arrays)if(d[k]!==undefined&&!Array.isArray(d[k]))return err('progress.'+k,'must be an array');
    for(const k of objects)if(d[k]!==undefined&&!own(d[k]))return err('progress.'+k,'must be an object');
    if(!Array.isArray(d.attempts)||!own(d.completed)||!own(d.diagnostics)||!own(d.reflections)||!Array.isArray(d.customCourses))return err('progress','required history sections are missing');
    const unique=new Set(builtinCourses.map(c=>c.id));
    for(let i=0;i<d.customCourses.length;i++){
      let c=d.customCourses[i],r=course(c,`progress.customCourses[${i}]`);if(!r.ok)return r;
      if(unique.has(c.id))return err('progress.customCourses',`duplicate course ID "${c.id}"`);
      unique.add(c.id);
    }
    if(d.attempts.length>5000)return err('progress.attempts','too many attempts');
    for(let i=0;i<d.attempts.length;i++){
      const x=d.attempts[i];if(!own(x)||!slug(x.courseId)||!slug(x.skillId)||typeof x.correct!=='boolean'||!text(x.kind,50,1)||!stamp(x.at)||(x.hinted!==undefined&&typeof x.hinted!=='boolean'))return err(`progress.attempts[${i}]`,'invalid attempt record');
    }
    if((d.constructionHistory||[]).length>1000)return err('progress.constructionHistory','too many saved construction attempts');
    for(let i=0;i<(d.constructionHistory||[]).length;i++){const x=d.constructionHistory[i];if(!own(x)||!text(x.id,120,1)||!slug(x.courseId)||!slug(x.skillId)||!Number.isInteger(x.attempt)||x.attempt<1||typeof x.correct!=='boolean'||!stamp(x.at)||!Array.isArray(x.rows)||!x.rows.length||x.rows.length>8)return err(`progress.constructionHistory[${i}]`,'invalid construction snapshot');for(const r of x.rows)if(!own(r)||!text(r.label,160,1)||!Array.isArray(r.values)||r.values.length>6||!r.values.every(v=>typeof v==='string'&&v.length<=120)||typeof r.correct!=='boolean'||(r.feedback!==undefined&&!text(r.feedback,1200)))return err(`progress.constructionHistory[${i}].rows`,'invalid construction row');}
    if((d.freeConstructions||[]).length>500)return err('progress.freeConstructions','too many original constructions');
    for(let i=0;i<(d.freeConstructions||[]).length;i++){const x=d.freeConstructions[i];if(!own(x)||!text(x.id,120,1)||!slug(x.courseId)||!slug(x.skillId)||!text(x.example,4000,1)||!text(x.structure,8000,1)||(x.reasoning!==undefined&&!text(x.reasoning,4000))||!stamp(x.at))return err(`progress.freeConstructions[${i}]`,'invalid original construction');}
    const rubric=r=>own(r)&&['rule','example','limit'].every(k=>['demonstrated','developing','not-yet'].includes(r[k]));
    if((d.humanReviews||[]).length>500)return err('progress.humanReviews','too many human reviews');
    for(let i=0;i<(d.humanReviews||[]).length;i++){const x=d.humanReviews[i];if(!own(x)||!text(x.id,120,1)||(x.pilotId!==undefined&&!text(x.pilotId,120,1))||!slug(x.courseId)||!slug(x.skillId)||!text(x.reviewer,80,1)||!['Teacher','Peer'].includes(x.role)||!rubric(x.rubric)||(x.note!==undefined&&!text(x.note,3000))||!stamp(x.at))return err(`progress.humanReviews[${i}]`,'invalid disclosed human-review record');}
    if((d.pilotStudies||[]).length>200)return err('progress.pilotStudies','too many pilot studies');
    for(let i=0;i<(d.pilotStudies||[]).length;i++){const x=d.pilotStudies[i];if(!own(x)||!text(x.id,120,1)||!text(x.patternId,100,3)||!slug(x.courseId)||!slug(x.skillId)||!text(x.before,4000,1)||!text(x.after,4000,1)||!text(x.transfer,5000,1)||!text(x.delayed,4000,1)||(x.help!==undefined&&!text(x.help,3000))||(x.taskMeaning!==undefined&&!text(x.taskMeaning,3000))||!text(x.reviewer,80,1)||!['Teacher','Peer'].includes(x.role)||!rubric(x.rubric)||(x.reviewNote!==undefined&&!text(x.reviewNote,3000))||!stamp(x.at))return err(`progress.pilotStudies[${i}]`,'invalid educational pilot record');}
    for(const [k,v] of Object.entries(d.completed))if(!text(k,100,3)||typeof v!=='boolean')return err('progress.completed','invalid completion key or value');
    for(const [k,v] of Object.entries(d.reflections))if(!text(k,100,3)||!text(v,12000))return err('progress.reflections','expected short text keyed to a pattern');
    for(const [k,v] of Object.entries(d.diagnostics)){
      if(!slug(k)||!own(v)||!Number.isInteger(v.score)||!Number.isInteger(v.total)||v.score<0||v.score>v.total||v.total>100||!Array.isArray(v.results)||v.results.length>100||!stamp(v.at))return err('progress.diagnostics.'+k,'malformed diagnostic report');
      for(const result of v.results)if(!own(result)||!slug(result.skillId)||typeof result.correct!=='boolean'||(result.selected!==undefined&&(!Number.isInteger(result.selected)||result.selected<0||result.selected>3)))return err('progress.diagnostics.'+k,'invalid diagnostic result');
    }
    for(const section of ['artifacts','visitors','resources','activity'])if((d[section]||[]).length>500)return err('progress.'+section,'too many items');
    const ids=new Set();
    for(let i=0;i<(d.artifacts||[]).length;i++){
      let a=d.artifacts[i];if(!own(a)||!text(a.id,120,3)||ids.has(a.id)||!text(a.title,110,1)||!text(a.body,15000,1)||!text(a.kind,80,1)||!stamp(a.createdAt)||(a.updatedAt!==undefined&&!stamp(a.updatedAt))||(a.patternId!=null&&!text(a.patternId,100)))return err(`progress.artifacts[${i}]`,'invalid work or duplicate ID');ids.add(a.id);
      if(a.revisions!==undefined){if(!Array.isArray(a.revisions)||a.revisions.length>200)return err(`progress.artifacts[${i}].revisions`,'expected at most 200 revisions');for(let j=0;j<a.revisions.length;j++){let r=a.revisions[j];if(!own(r)||!text(r.title,110)||!text(r.body,15000)||!text(r.kind,80)||(r.patternId!=null&&!text(r.patternId,100))||!stamp(r.at))return err(`progress.artifacts[${i}].revisions[${j}]`,'invalid revision snapshot');}}
    }
    if(d.investigations!==undefined){if(!own(d.investigations))return err('progress.investigations','must be an object');const entries=Object.entries(d.investigations);if(entries.length>500)return err('progress.investigations','too many investigations');for(const [k,v] of entries){if(!text(k,100,3)||!own(v)||(v.completedAt!==undefined&&!stamp(v.completedAt))||['hypothesis','example','why','revision','counter','remaining'].some(f=>v[f]!==undefined&&!text(v[f],4000))||(v.challengeFirstCorrect!=null&&typeof v.challengeFirstCorrect!=='boolean'))return err('progress.investigations.'+k,'invalid investigation record');}}
    for(const [i,r] of (d.resources||[]).entries())if(!own(r)||!text(r.name,180,1)||!text(r.url,1800,1)||!text(r.id,120,1)||(r.desc!==undefined&&!text(r.desc,1200)))return err(`progress.resources[${i}]`,'invalid saved resource');
    for(const [i,v] of (d.visitors||[]).entries())if(!own(v)||!text(v.id,120,1)||!text(v.author,80,1)||!own(v.work)||!text(v.work.title,110,1)||!text(v.work.body,16000,1))return err(`progress.visitors[${i}]`,'invalid shared classroom capsule');
    for(const [i,v] of (d.activity||[]).entries())if(!own(v)||!text(v.id,120,1)||!text(v.title,200)||!text(v.type,100)||!text(v.description,1000)||!stamp(v.at))return err(`progress.activity[${i}]`,'invalid activity record');
    if(d.prefs!==undefined&&(!own(d.prefs)|| (d.prefs.theme!==undefined&&!['light','dark'].includes(d.prefs.theme))||(d.prefs.alias!==undefined&&!text(d.prefs.alias,50))||(d.prefs.depth!==undefined&&!text(d.prefs.depth,50))||(d.prefs.lessonMode!==undefined&&!['guided','standard','review'].includes(d.prefs.lessonMode))||(d.prefs.investigationMode!==undefined&&!['short','extended'].includes(d.prefs.investigationMode))||(d.prefs.languageSupport!==undefined&&typeof d.prefs.languageSupport!=='boolean')))return err('progress.prefs','invalid preferences');
    if(d.proficiency!==undefined){if(!own(d.proficiency))return err('progress.proficiency','expected an object');for(const [k,v] of Object.entries(d.proficiency)){if(!text(k,100,3)||!own(v)||!['transfer','retrieved','mastered','review'].includes(v.status)||(v.retrievedAt!==undefined&&v.retrievedAt!==null&&!stamp(v.retrievedAt))|| (v.firstTransferAt!==undefined&&!stamp(v.firstTransferAt))||(v.masteredAt!==undefined&&v.masteredAt!==null&&!stamp(v.masteredAt))||(v.reviewAt!==undefined&&v.reviewAt!==null&&!stamp(v.reviewAt))||(v.assisted!==undefined&&typeof v.assisted!=='boolean'))return err('progress.proficiency.'+k,'invalid proficiency status');}}
    if(d.drafts!==undefined){if(!own(d.drafts)||!own(d.drafts.workshop)||!own(d.drafts.reflections)||!own(d.drafts.investigations)||(d.drafts.constructions!==undefined&&!own(d.drafts.constructions))||(d.drafts.pilot!==undefined&&!own(d.drafts.pilot)))return err('progress.drafts','expected workshop, reflections, investigations, construction, and optional pilot objects');for(const [k,v] of Object.entries(d.drafts.workshop))if(!text(k,140,1)||!own(v)||!text(v.title,110)||!text(v.body,15000)||!text(v.kind,80)||(v.patternId!=null&&!text(v.patternId,100)))return err('progress.drafts.workshop.'+k,'invalid saved draft');for(const [k,v] of Object.entries(d.drafts.reflections))if(!text(k,100,1)||!text(v,12000))return err('progress.drafts.reflections.'+k,'invalid reflection draft');for(const [k,v] of Object.entries(d.drafts.investigations))if(!text(k,130,1)||!text(v,4000))return err('progress.drafts.investigations.'+k,'invalid observation');for(const [k,v] of Object.entries(d.drafts.constructions||{}))if(!text(k,130,1)||!own(v)||!text(v.example,4000)||!text(v.structure,8000)||!text(v.reasoning,4000))return err('progress.drafts.constructions.'+k,'invalid original construction draft');if(d.drafts.pilot!==undefined)for(const [k,v] of Object.entries(d.drafts.pilot))if(!text(k,80,1)||!text(v,k==='transfer'?5000:4000))return err('progress.drafts.pilot.'+k,'invalid pilot draft field');}
    if(d.observationEvidence!==undefined){
      if(!own(d.observationEvidence)||Object.keys(d.observationEvidence).length>1000)return err('progress.observationEvidence','expected an evidence record keyed by lesson');
      for(const [k,e] of Object.entries(d.observationEvidence)){
        const parts=e?.parts===3?3:2,required=parts===3?['stable','changed','other']:['stable','changed'],validChoices=x=>own(x)&&required.every(part=>Number.isInteger(x[part])&&x[part]>=0&&x[part]<=2);
        if(!text(k,100,3)||!own(e)||!validChoices(e.initial)||!validChoices(e.final)||typeof e.reconsidered!=='boolean'||!Number.isInteger(e.initialCorrect)||e.initialCorrect<0||e.initialCorrect>parts||!Number.isInteger(e.finalCorrect)||e.finalCorrect<0||e.finalCorrect>parts||!stamp(e.at))return err('progress.observationEvidence.'+k,'invalid initial/final investigation record');
      }
    }
    if(d.activeLesson!==undefined&&d.activeLesson!==null){const l=d.activeLesson;if(!own(l)||!slug(l.courseId)||!slug(l.skillId)||!Number.isInteger(l.step)||l.step<0||l.step>5|| (l.trial!==undefined&&(!Number.isInteger(l.trial)||l.trial<0||l.trial>20))||(l.reveal!==undefined&&typeof l.reveal!=='boolean')||(l.hint!==undefined&&typeof l.hint!=='boolean')||(l.hintUsed!==undefined&&typeof l.hintUsed!=='boolean')||(l.passed!==undefined&&typeof l.passed!=='boolean')||(l.selected!=null&&(!Number.isInteger(l.selected)||l.selected<0||l.selected>3))||(l.answerIndex!==undefined&&(!Number.isInteger(l.answerIndex)||l.answerIndex<0||l.answerIndex>70))||(l.feedback!=null&&(!own(l.feedback)||typeof l.feedback.correct!=='boolean'))||(l.attachmentMode!==undefined&&!['low','high'].includes(l.attachmentMode))||(l.probe!==undefined&&(!own(l.probe)||!['stable','changed'].every(k=>l.probe[k]===null||(Number.isInteger(l.probe[k])&&l.probe[k]>=0&&l.probe[k]<=2)))))return err('progress.activeLesson','invalid saved lesson state');}
    if(d.activeLesson?.probeReview!==undefined){
      const r=d.activeLesson.probeReview;
      if(!own(r)||typeof r.required!=='boolean'||typeof r.confirmed!=='boolean'||(r.initial!==null&&(!own(r.initial)||!['stable','changed'].every(part=>Number.isInteger(r.initial[part])&&r.initial[part]>=0&&r.initial[part]<=2))))return err('progress.activeLesson.probeReview','invalid reconsideration record');
    }
    if(d.activeQuiz!==undefined&&d.activeQuiz!==null){const q=d.activeQuiz;if(!own(q)||!['diagnostic','practice','retest'].includes(q.type)||!slug(q.courseId)||!Array.isArray(q.items)||!q.items.length||q.items.length>80||!Number.isInteger(q.pos)||q.pos<0||q.pos>=q.items.length||!Array.isArray(q.results)||q.results.length>q.items.length||!['boolean'].includes(typeof q.submitted)||(q.selected!=null&&(!Number.isInteger(q.selected)||q.selected<0||q.selected>3))||(q.hint!==undefined&&typeof q.hint!=='boolean'))return err('progress.activeQuiz','invalid session');for(let i=0;i<q.items.length;i++){const r=question(q.items[i],`progress.activeQuiz.items[${i}]`);if(!r.ok)return r;if(!slug(q.items[i].skillId))return err('progress.activeQuiz.items','missing question skill identifier');}for(const x of q.results.filter(Boolean))if(!own(x)||!slug(x.skillId)||typeof x.correct!=='boolean'||!Number.isInteger(x.selected)||x.selected<0||x.selected>3)return err('progress.activeQuiz.results','invalid graded answer');}
    if(d.lastView!==undefined&&!['overview','workshop','artifact','shelf','commons','courses','course','lesson','quiz','results','patterns','insights','pilot','settings'].includes(d.lastView))return err('progress.lastView','unknown route');
    return good;
  }
  window.PatternQuality={validateCourse:course,validateProgress:progress};
})();
