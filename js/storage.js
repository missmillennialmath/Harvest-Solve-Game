import {validate} from './state.js';
export const KEY='harvest-solve.active.v1';
export function read(store=localStorage){const raw=store.getItem(KEY);if(!raw)return null;const record=JSON.parse(raw);validate(record.state);return record;}
export function write(record,store=localStorage){validate(record.state);store.setItem(KEY,JSON.stringify(record));}
export function parseSave(raw){if(raw.length>1000000)throw Error('Save file too large.');return validate(JSON.parse(raw));}
export function saveFilename(name,date=new Date()){const safe=String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'unnamed_farmer';const pad=n=>String(n).padStart(2,'0');return `${safe}_${pad(date.getMonth()+1)}_${pad(date.getDate())}__${pad(date.getFullYear()%100)}.json`;}
export function download(state){validate(state);const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=saveFilename(state.player.name);a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
