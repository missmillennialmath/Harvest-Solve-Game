import {fresh} from './state.js';
import {read,write,download} from './storage.js?v=0031';
const el=id=>document.getElementById(id);
const name=el('farmerName'),begin=el('begin'),notice=el('creationNotice');
let pending=null,committed=false;
const firstNames=["Barnaby", "Agatha", "Percival", "Mildred", "Oswald", "Gertrude", "Reginald", "Bertha", "Archibald", "Euphemia", "Bartholomew", "Prudence", "Humphrey", "Ethelbert", "Dorothea", "Wilbur", "Beatrice", "Cornelius", "Winifred", "Mortimer", "Cedric", "Edith"];
const lastNames=["Mudboots", "Turnipwhistle", "Picklethorn", "Mossbottom", "Onionbane", "Goosewick", "Puddlefoot", "Bumblethorn", "Crumblepot", "Picklewick", "Bogbottom", "Porridgeworth", "Grumblewort", "Wobbleknees", "Dungworthy", "Wartwhistle", "Bramblewick", "Cabbageworth", "Wobblepot", "Rootbottom", "Crumblebrook", "Eggsworth"];
const farmerNames=["Sir Plants-a-Lot", "Baron von Broccoli", "Count Compost", "Professor Potato", "Lord of the Leeks", "Doctor Dirt", "Viscount of Vegetables", "Captain Crop Failure", "Duke of Dirt", "Sir Wilts-a-Lot", "Baron Badharvest", "Madam Mulch", "Countess Cabbage", "Professor Parsnip", "Sir Overwaters", "Baron Barrenfield", "Captain Compost", "Lord Turnipton", "Lady Weedwhacker", "Duke Dungheap", "Sir Reaps-a-Not", "Baron von Beetroot", "Count Cropula", "Doctor Dandelion", "Captain Badseed", "Lady Rottenroot", "Professor Pestcontrol", "Sir Soil-a-Lot", "Admiral Asparagus", "Chancellor Chard", "Duchess of Dirt", "General Germination"];
const algebraNames=["Al Gebra", "Polly Nomial", "Sir Cumference", "Xavier Unknown", "Max Imum", "Minnie Mum", "Theo Rem", "Connie Constant", "Addie Sumwell", "Rex Reciprocal", "Ella Ment", "Des Cartes", "Abby Solute", "Ray Tio", "Lynn Ear", "Sir Plus", "Flora Function", "Ivan Integer"];
const pickName=a=>a[Math.floor(Math.random()*a.length)];
function generateName(previous){const r=Math.random();const pool=r<.35?firstNames.flatMap(f=>lastNames.map(l=>f+" "+l)):r<.65?farmerNames:algebraNames;return pickName(pool.filter(n=>n!==previous));}
const valid=()=>name.value.trim().length>0&&name.value.trim().length<=60&&!/[\x00-\x1f\x7f]/.test(name.value);
function update(){begin.disabled=committed||!window.characterReady||!valid();}
name.addEventListener('input',update);document.addEventListener('character-preview-change',update);
el('randomName').onclick=()=>{name.value=generateName(name.value);update();};
el('randomAppearance').onclick=()=>window.randomizeCharacter();
const overwriteDialog=el('overwriteDialog');
function confirmOverwrite(){return new Promise(resolve=>{
 if(!overwriteDialog||typeof overwriteDialog.showModal!=='function'){resolve(window.confirm('Overwrite your existing character, farm, inventory and progress?'));return;}
 overwriteDialog.returnValue='cancel';
 overwriteDialog.addEventListener('close',()=>resolve(overwriteDialog.returnValue==='overwrite'),{once:true});
 overwriteDialog.showModal();el('overwriteCancel').focus();
});}
el('overwriteCancel').onclick=()=>overwriteDialog.close('cancel');
el('overwriteConfirm').onclick=()=>overwriteDialog.close('overwrite');
overwriteDialog.addEventListener('cancel',e=>{e.preventDefault();overwriteDialog.close('cancel');});
overwriteDialog.addEventListener('click',e=>{if(e.target!==overwriteDialog)return;const r=overwriteDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)overwriteDialog.close('cancel');});
let deciding=false;
begin.onclick=async()=>{if(!valid()||!window.characterReady||committed||deciding)return;let existing=null,unknown=false;try{existing=read();}catch{unknown=true;}if(existing||unknown){deciding=true;let approved=false;try{approved=await confirmOverwrite();}finally{deciding=false;}if(!approved)return;}if(!valid()||!window.characterReady||committed)return;
const state=fresh();state.player.name=name.value.trim();state.player.appearance=window.characterAppearance();pending={state,revision:0,exportedAt:null,exportedRevision:null,savedAt:new Date().toISOString()};
try{write(pending);committed=true;location.href='factorford.html';}catch{pending.savedAt=null;committed=true;notice.textContent='Browser save failed. Your new farmer is still in this tab. Export now before leaving, then import the file in The Chronicles.';el('exportCreated').hidden=false;update();}};
el('exportCreated').onclick=()=>{if(!pending)return;try{download(pending.state);notice.textContent='Export requested. Verify the downloaded file before leaving, then import it in The Chronicles.';}catch(e){notice.textContent='Export failed: '+e.message;}};
window.addEventListener('beforeunload',e=>{if(committed&&pending&&!pending.savedAt){e.preventDefault();e.returnValue='';}});update();
