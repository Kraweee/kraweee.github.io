const routes={
  malolos:["Bagumbayan/San Jose","Maysantol","San Nicolas","Pitpitan","Mambog","Matimbo","Panasahan","Bagna","Atlag","San Juan/Sto. Rosario"],
  balagtas:["Bagumbayan/San Jose","Matungao","Panginay Guiguinto","Panginay Balagtas","Wawa"],
  guiguinto:["Bagumbayan/San Jose","Matungao","Tuktukan"]
};

const origin=document.getElementById("origin"),
      destination=document.getElementById("destination"),
      direction=document.getElementById("direction"),
      passengers=document.getElementById("passengers"),
      regularBox=document.getElementById("regularBox"),
      discountBox=document.getElementById("discountBox");

let currentRoute="malolos";
const dirs={
  malolos:["Bulakan → Malolos","Malolos → Bulakan"],
  balagtas:["Bulakan → Balagtas","Balagtas → Bulakan"],
  guiguinto:["Bulakan → Guiguinto","Guiguinto → Bulakan"]
};

document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active");
  currentRoute=t.dataset.route;
  populateDirection(true);
}));

function populateDirection(resetOrigin=false){
  direction.innerHTML=dirs[currentRoute].map(d=>`<option>${d}</option>`).join("");
  updateOriginDest(resetOrigin);
}

function updateOriginDest(resetOrigin=false){
  let list=[...routes[currentRoute]];
  if(direction.value.includes("→ Bulakan")) list.reverse();

  if(resetOrigin){
    origin.innerHTML=list.map(b=>`<option>${b}</option>`).join("");
    origin.selectedIndex=0;
  }

  destination.innerHTML=list.map(b=>`<option>${b}</option>`).join("");
  const oi=origin.selectedIndex;
  Array.from(destination.options).forEach((o,i)=>{
    o.disabled=i<=oi;
    o.style.color=i<=oi?"#888":"#f1f5f9";
  });

  destination.selectedIndex = Array.from(destination.options)
                                  .map((o,i)=>i)
                                  .filter(i=>!destination.options[i].disabled)
                                  .pop();

  calcFare();
}

function calcFare(){
  const oi=origin.selectedIndex,di=destination.selectedIndex;
  if(oi===-1||di===-1) return;
  const pax=parseInt(passengers.value)||1, dist=Math.abs(di-oi)+1;
  const fare={regular:13+Math.max(0,dist-4)*2,discount:11+Math.max(0,dist-4)*2}, pay=[20,50,100];
  const gen=(t,f)=>`<span class='highlight'>${t}</span> Per Passenger: ₱${f}<br>Total (${pax} pax): ₱${f*pax}<br><br>`+
    pay.map(a=>`<div class='change-line'><span class='pay'>Pay ₱${a}</span> → <span class='change'>Change: ₱${a-f*pax}</span></div>`).join("");
  regularBox.innerHTML=gen("Regular Fare",fare.regular);
  discountBox.innerHTML=gen("Senior/Student Fare",fare.discount);
  regularBox.classList.add("show"); discountBox.classList.add("show");
}

direction.addEventListener("change",()=>updateOriginDest(true));  
origin.addEventListener("change",()=>updateOriginDest(false));    
destination.addEventListener("change",calcFare);
passengers.addEventListener("input",calcFare);

populateDirection(true);
