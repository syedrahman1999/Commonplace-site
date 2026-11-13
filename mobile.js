/* Installable phone/tablet shell for the same local-first Patternwork classroom. */
(function(){
'use strict';
let installPrompt=null;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
const installLabel=()=>isStandalone()?'Installed on this device':installPrompt?'Install Patternwork':'How to install';

function installPanel(){return `<section class="phone-install-panel panel" id="phone-install" aria-labelledby="phone-install-title"><div class="item-tag">PHONE &amp; TABLET APP · SAME CLASSROOM</div><h2 id="phone-install-title">Put Patternwork on your Home Screen.</h2><p class="phone-install-lead">This is the complete Patternwork interface—not a smaller companion. Once it has opened successfully, its app shell and built-in lessons remain available offline. Progress stays private in that phone's browser storage.</p><div class="phone-install-grid"><article><span>IPHONE / IPAD</span><h3>Install with Safari</h3><ol><li>Open Patternwork in Safari.</li><li>Tap the Share button.</li><li>Choose <strong>Add to Home Screen</strong>, then Add.</li></ol></article><article><span>ANDROID</span><h3>Install with Chrome</h3><ol><li>Open Patternwork in Chrome.</li><li>Open the browser menu.</li><li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li></ol></article></div><div class="phone-install-actions"><button class="btn btn-primary" data-action="phone-install">${installLabel()}</button><p>Before removing the app or clearing browser data, use <strong>Export progress</strong>. There is no cross-device account sync.</p></div><div class="phone-install-message" aria-live="polite"></div></section>`;}

function enhance(){
  const meta=document.querySelector('.room-side-meta span:last-child');
  if(meta&&meta.textContent!=='V5.2.0')meta.textContent='V5.2.0';
  if(document.body.dataset.route==='settings'&&!document.getElementById('phone-install')){
    const heading=document.querySelector('#main-content .page-heading');
    if(heading)heading.insertAdjacentHTML('afterend',installPanel());
  }
}

function message(text){
  let box=document.querySelector('.phone-install-message');
  if(!box){
    window.Patternwork?.navigate('settings');
    setTimeout(()=>{enhance();box=document.querySelector('.phone-install-message');if(box){box.textContent=text;box.scrollIntoView({behavior:'smooth',block:'center'});}},80);
    return;
  }
  box.textContent=text;
  box.scrollIntoView({behavior:'smooth',block:'center'});
}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action="phone-install"]');
  if(!button)return;
  if(isStandalone()){message('Patternwork is already installed on this device.');return;}
  if(installPrompt){
    installPrompt.prompt();
    installPrompt.userChoice.then(choice=>{
      message(choice.outcome==='accepted'?'Patternwork is being added to your Home Screen.':'Installation was left unchanged. You can try again whenever you are ready.');
      installPrompt=null;enhance();
    });
    return;
  }
  message(isIOS?'On iPhone or iPad: open this page in Safari, tap Share, then choose Add to Home Screen.':'Open your browser menu and choose Install app or Add to Home screen.');
});

window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;enhance();});
window.addEventListener('appinstalled',()=>{installPrompt=null;message('Patternwork is installed. Open it from your Home Screen like your other apps.');enhance();});

const app=document.getElementById('app');
if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
enhance();

if('serviceWorker' in navigator&&location.protocol.startsWith('http')&&!new URLSearchParams(location.search).has('regression')){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js',{scope:'./'}).catch(()=>{}));
}

window.PatternworkPhone={enhance,isStandalone};
})();
