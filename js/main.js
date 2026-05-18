/* ============================================================
   FEBDWITHART LAB — Shared JS
   Dipakai oleh semua halaman.
   ============================================================ */
(function(){
  'use strict';

  /* ---------- NAV: mobile toggle ---------- */
  var nav=document.getElementById('nav');
  if(nav){
    var burger=document.getElementById('burger');
    if(burger){
      burger.addEventListener('click',function(){nav.classList.toggle('open');});
    }
    nav.querySelectorAll('.nav-collapse a').forEach(function(a){
      a.addEventListener('click',function(){nav.classList.remove('open');});
    });
  }

  /* ---------- FAQ accordion (event delegation) ---------- */
  document.addEventListener('click',function(e){
    var q=e.target.closest ? e.target.closest('.qa-q') : null;
    if(!q)return;
    var qa=q.parentElement,
        ans=q.nextElementSibling,
        isOpen=qa.classList.contains('open');
    document.querySelectorAll('.qa.open').forEach(function(o){
      o.classList.remove('open');
      var a=o.querySelector('.qa-a');
      if(a)a.style.maxHeight=null;
    });
    if(!isOpen){
      qa.classList.add('open');
      ans.style.maxHeight=ans.scrollHeight+'px';
    }
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
        });
      },{threshold:.12});
      reveals.forEach(function(el,i){
        el.style.transitionDelay=(i%5)*0.06+'s';
        io.observe(el);
      });
    }else{
      reveals.forEach(function(el){el.classList.add('in');});
    }
  }

  /* ---------- Urgency countdown ---------- */
  document.querySelectorAll('[data-countdown]').forEach(function(box){
    var hours=parseFloat(box.getAttribute('data-hours'))||24;
    var span=hours*3600*1000;
    var key='fwl_cd_'+location.pathname;
    var deadline=parseInt(localStorage.getItem(key),10);
    var now=Date.now();
    if(!deadline||isNaN(deadline)||deadline<=now){
      deadline=now+span;
      localStorage.setItem(key,deadline);
    }
    var elD=box.querySelector('[data-d]'),
        elH=box.querySelector('[data-h]'),
        elM=box.querySelector('[data-m]'),
        elS=box.querySelector('[data-s]');
    function pad(n){return n<10?'0'+n:''+n;}
    function tick(){
      var diff=deadline-Date.now();
      if(diff<=0){
        deadline=Date.now()+span;
        localStorage.setItem(key,deadline);
        diff=span;
      }
      var s=Math.floor(diff/1000);
      var d=Math.floor(s/86400);s-=d*86400;
      var h=Math.floor(s/3600);s-=h*3600;
      var m=Math.floor(s/60);s-=m*60;
      if(elD)elD.textContent=pad(d);
      if(elH)elH.textContent=pad(h);
      if(elM)elM.textContent=pad(m);
      if(elS)elS.textContent=pad(s);
    }
    tick();
    setInterval(tick,1000);
  });

  /* ---------- Hero particles (hanya jika ada #stars) ---------- */
  var cv=document.getElementById('stars');
  if(cv && cv.getContext){
    var ctx=cv.getContext('2d'),dots=[];
    function size(){cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;}
    function build(){
      dots=[];
      var n=Math.min(60,Math.round(cv.width/16));
      for(var i=0;i<n;i++){
        dots.push({
          x:Math.random()*cv.width,
          y:Math.random()*cv.height,
          r:Math.random()*1.3+0.3,
          s:Math.random()*0.28+0.06,
          o:Math.random()*0.5+0.18
        });
      }
    }
    function loop(){
      ctx.clearRect(0,0,cv.width,cv.height);
      for(var i=0;i<dots.length;i++){
        var d=dots[i];
        d.y-=d.s;
        if(d.y<-4){d.y=cv.height+4;d.x=Math.random()*cv.width;}
        ctx.beginPath();
        ctx.arc(d.x,d.y,d.r,0,6.283);
        ctx.fillStyle='rgba(77,159,255,'+d.o+')';
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    size();build();loop();
    window.addEventListener('resize',function(){size();build();});
  }
})();
