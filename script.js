function login(){
let user=document.getElementById("username").value
let pass=document.getElementById("password").value

if(user==="admin" && pass==="1234"){

window.location.href="home.html"

}else{

document.getElementById("error").innerText="Invalid Username or Password"

}

}


/* show hide password */

function togglePassword(){

let pass=document.getElementById("password")

if(pass.type==="password"){

pass.type="text"

}else{

pass.type="password"

}

}

let medicines = JSON.parse(localStorage.getItem("medicines")) || [];

function goDashboard(){
window.location.href="dashboard.html";
}

function addMedicine(){

let name = document.getElementById("name").value;
let qty = document.getElementById("qty").value;
let expiry = document.getElementById("expiry").value;
showNotification("Medicine added successfully")
if(name=="" || qty=="" || expiry==""){
alert("Please fill all fields");
return;
}

let today = new Date();
let expDate = new Date(expiry);

let status = "Safe";

let diff = (expDate - today) / (1000*60*60*24);

if(diff < 0){

status = "Expired";

}
else if(diff <=7){

status = "Expiring Soon";

}
let percent = Math.max(0, Math.min(100, 100 - diff));

medicines.push({name,qty,expiry,status,percent});

localStorage.setItem("medicines", JSON.stringify(medicines));
displayMedicines();
checkNotifications();
document.getElementById("name").value="";
document.getElementById("qty").value="";
document.getElementById("expiry").value="";

}

function displayMedicines(){

let container = document.getElementById("medicineList");

container.innerHTML="";

let total=0;
let expired=0;
let expSoon=0;

medicines.forEach((med,index)=>{

total++;

if(med.status=="Expired") expired++;

if(med.status=="Expiring Soon") expSoon++;

container.innerHTML+=`

<div class="medicine-card" id="med-${index}">

<h3>${med.name}</h3>
<div class="ring">
<div class="circle" style="--percent:${med.percent}"></div>
</div>

<p>Quantity: ${med.qty}</p>

<p>Expiry: ${med.expiry}</p>

<p>Status: ${med.status}</p>

<button class="delete-btn" onclick="deleteMed(${index})">
Delete
</button>

</div>

`;

});

document.getElementById("totalMed").innerText=total;
document.getElementById("expiredMed").innerText=expired;
document.getElementById("expiringMed").innerText=expSoon;

}

function deleteMed(index){

medicines.splice(index,1);
localStorage.setItem("medicines", JSON.stringify(medicines));

displayMedicines();

}

function searchMedicine(){

let input= document.getElementById("search").value.toLowerCase();


let found=false;
medicines.forEach((med,index)=>{

if(med.name.toLowerCase().includes(search)){

let card = document.getElementById(`med-${index}`);

card.scrollIntoView({
behavior:"smooth",
block:"center"
});

card.classList.add("highlight");
setTimeout(()=>{
card.classList.remove("highlight");
},2000);

found = true;

}

});

if(!found){
alert("Medicine not found");
}


}
function showNotification(text){

let box=document.getElementById("notification");

box.innerText=text;

box.style.opacity="1";

setTimeout(()=>{
box.style.opacity="0";
},3000)

}

function sendMessage(event){

event.preventDefault();

let name=document.getElementById("name").value;

let email=document.getElementById("email").value;

let message=document.getElementById("message").value;

alert("Message sent successfully!");

document.getElementById("name").value="";
document.getElementById("email").value="";
document.getElementById("message").value="";

}

function loadChart(){

if(!document.getElementById("medicineChart")) return;

let expired=0;
let expSoon=0;
let safe=0;

medicines.forEach(med=>{

if(med.status==="Expired") expired++;

else if(med.status==="Expiring Soon") expSoon++;

else safe++;

});

let ctx=document.getElementById("medicineChart");

new Chart(ctx,{
type:"pie",

data:{
labels:["Safe","Expiring Soon","Expired"],

datasets:[{

data:[safe,expSoon,expired],

backgroundColor:[
"#2ecc71",
"#f1c40f",
"#e74c3c"
]

}]

}

});

}
window.onload=function(){

if(typeof medicines !== "undefined"){
loadChart();
}

}
window.onload = function(){

if(document.getElementById("medicineList")){
displayMedicines();
}
checkNotifications();
if(document.getElementById("medicineChart")){
loadChart();

}

};

function checkNotifications(){

let bell=document.getElementById("bell");
let box=document.getElementById("notifBox");
let count=document.getElementById("notifCount");

if(!bell || !box) return;

let notifications=[];

medicines.forEach(med=>{

if(med.status==="Expired"){
notifications.push({
text: med.name + " (expired)",
type:"expired"
});
}

else if(med.status==="Expiring Soon"){
notifications.push({
text: med.name + " (expiring soon)",
type:"expiring"
});
}

});

count.innerText=notifications.length;

box.innerHTML="";

if(notifications.length===0){

box.innerHTML="<p style='text-align:center;color:gray'>No alerts</p>";

}

notifications.forEach(n=>{

let div=document.createElement("div");

div.className="notif-item "+n.type;

div.innerText=n.text;

box.appendChild(div);

});

bell.onclick=function(){

box.style.display=
box.style.display==="block" ? "none" : "block";

};

}