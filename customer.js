(()=>{
 const q=new URLSearchParams(location.search), name=q.get('agent'), phone=q.get('phone');
 if(!name || !/^\+?\d{9,15}$/.test(phone||''))return;
 const contact=name+' · '+phone;
 const tel='tel:'+phone;
 for(const a of document.querySelectorAll('.call,.btns .t')){a.href=tel;a.textContent='โทร '+contact}
 document.querySelectorAll('.btns .l,.buddy,.agent,.com,.btns .x').forEach(e=>e.remove());
 const footer=document.querySelector('footer .wrap');
 const link=document.createElement('a');link.href=tel;link.textContent=contact;
 footer.replaceChildren('สอบถามหรือนัดชมบ้านกับ ',link);
 const unit=q.get('unit');
 if(location.pathname.endsWith('house-rk10.html') && /^160\/3[5-8]$/.test(unit))document.querySelector('h1').append(' · '+unit);
 document.querySelector('.btns .s').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(location.href);
 document.querySelector('#cp').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);document.querySelector('#cp').textContent='คัดลอกแล้ว'}catch{prompt('คัดลอกลิงก์',location.href)}};
})();
