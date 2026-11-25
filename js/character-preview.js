'use strict';
let species='goblin',view='front';
const descriptions={goblin:'Clever, resourceful, and full of ideas.',fairy:'Curious, imaginative, and ready for adventure.',troll:'Steady, determined, and ready to grow.'};
const cap=s=>s[0].toUpperCase()+s.slice(1);
const sprite=document.getElementById('sprite');
function render(){sprite.src=`assets/characters/base/${species}_${view}.png`;sprite.alt=`${cap(species)}, ${view} view`;document.getElementById('speciesName').textContent=cap(species);document.getElementById('description').textContent=descriptions[species];document.getElementById('status').textContent=`${cap(species)} · ${cap(view)} view`;document.querySelectorAll('[data-species]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.species===species)));document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));}
document.querySelectorAll('[data-species]').forEach(b=>b.addEventListener('click',()=>{species=b.dataset.species;render()}));document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;render()}));sprite.addEventListener('error',()=>{document.getElementById('status').textContent='Preview could not load. Check the character asset files.'});
