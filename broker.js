const el=id=>document.getElementById(id);
const house=el('house'), unit=el('unit'), msg=el('msg');
const initial=new URLSearchParams(location.search).get('house');
if([...house.options].some(o=>o.value===initial))house.value=initial;
let images=[], description='';
function reset(){el('result').hidden=true;msg.textContent=''}
async function load(){
 reset();
 const file=house.value;
 el('unitLabel').hidden=file!=='house-rk10.html';
 el('unitLabel').style.display=el('unitLabel').hidden?'none':'block';
 el('photos').disabled=el('details').disabled=true;
 el('summary').textContent='กำลังโหลดข้อมูลบ้าน…';el('photos').textContent='ดาวน์โหลดรูปทั้งหมด';
 try{
 const response=await fetch(file);if(!response.ok)throw Error();
 const doc=new DOMParser().parseFromString(await response.text(),'text/html');
 if(file!==house.value)return;
 images=[...new Set([...doc.querySelectorAll('#mi,.thumbs img')].map(i=>i.getAttribute('src')))];
 const facts=[...doc.querySelectorAll('.facts>div')].map(d=>d.textContent.replace(/^(ราคา|สถานะ)/,'$1 '));
 description=[doc.querySelector('h1').textContent,...facts,doc.querySelector('.note')?.textContent].filter(Boolean).join('\n');
 el('summary').textContent=facts.join(' · ')+(file==='house-rk10.html'?' · จอง 160/32–34 · พร้อมขาย 160/35–38':'');
 el('photos').textContent=images.length?'ดาวน์โหลดรูปทั้งหมด ('+images.length+' รูป)':'ยังไม่มีรูปบ้านให้ดาวน์โหลด';
 el('photos').disabled=!images.length;el('details').disabled=false;
 }catch{if(file===house.value)el('summary').textContent='โหลดข้อมูลบ้านไม่ได้ กรุณาลองเปิดหน้านี้อีกครั้ง'}
}
function selectedUnit(){return house.value==='house-rk10.html'?unit.value:''}
function digits(){return el('phone').value.replace(/[\s()-]/g,'')}
el('form').onsubmit=e=>{
 e.preventDefault();const name=el('agentName').value.trim(), phone=digits();
 if(!name||!/^\+?\d{9,15}$/.test(phone)){msg.textContent='กรุณาตรวจชื่อและเบอร์โทรอีกครั้ง';return}
 const url=new URL(house.value,location.href);
 url.searchParams.set('agent',name);url.searchParams.set('phone',phone);
 if(selectedUnit())url.searchParams.set('unit',selectedUnit());
 el('url').value=el('preview').href=url.href;el('result').hidden=false;msg.textContent='สร้างลิงก์แล้ว';
};
async function copy(value){try{await navigator.clipboard.writeText(value);msg.textContent='คัดลอกแล้ว'}catch{prompt('เลือกและคัดลอกข้อความ',value)}}
el('copyLink').onclick=()=>copy(el('url').value);
el('details').onclick=()=>copy([description,selectedUnit(),el('agentName').value.trim(),el('phone').value.trim()].filter(Boolean).join('\n'));
el('photos').onclick=async()=>{
 const file=house.value, list=images.slice();el('photos').disabled=true;
 try{const zip=new JSZip();
 for(const [i,src] of list.entries()){
 msg.textContent='กำลังเตรียมรูป '+(i+1)+'/'+list.length;
 const r=await fetch(src);if(!r.ok)throw Error();const blob=await r.blob();if(!blob.type.startsWith('image/'))throw Error();
 zip.file(String(i+1).padStart(2,'0')+'-'+src.split('/').pop(),blob);
 }
 const href=URL.createObjectURL(await zip.generateAsync({type:'blob'}));
 const a=document.createElement('a');a.href=href;a.download=file.replace('.html','-photos.zip');a.click();setTimeout(()=>URL.revokeObjectURL(href),60000);msg.textContent='เตรียมไฟล์รูปเรียบร้อยแล้ว';
 }catch{msg.textContent='โหลดรูปไม่ครบ กรุณาลองดาวน์โหลดอีกครั้ง'}finally{if(file===house.value)el('photos').disabled=false}
};
house.onchange=()=>{unit.value='';load()};unit.onchange=reset;el('form').oninput=reset;load();
