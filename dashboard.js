import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { collection, getDocs, query, where,orderBy} 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyA7pESbUlYl9RTzyeubQoJE6zbmyMwevK8",
  authDomain: "expense-track-cae1f.firebaseapp.com",
  projectId: "expense-track-cae1f",
  storageBucket: "expense-track-cae1f.firebasestorage.app",
  messagingSenderId: "526957361899",
  appId: "1:526957361899:web:6b264419fa819c2965dcae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const heading = document.querySelector("h1");
const formateincome=(amount)=>{
  return "₹"+Number(amount).toLocaleString("en-IN");
}
onAuthStateChanged(auth, async (user) => {
  if (user) {
    let income=0;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      heading.innerText = `Hello,${data.name}!`;
      income=data.income || 0;
      document.querySelector("#Totalbalance").innerHTML =`<h3 style="color:black">${formateincome(income)|| 0}</h3>`;
    }

    const list = document.querySelector("#expenselist");

    const q = query(
      collection(db, "expenses"),
      where("uid", "==", user.uid),
      orderBy("createdAt","desc")
    );

    const qsnapshot = await getDocs(q);

    let totalexp = 0;
    let animatedval=0;
    let categoryTotals = {
  Food: 0,
  travel: 0,
  Shopping: 0,
  others: 0
};
    list.innerHTML = "";
    let todaySection="";
    let yesterdaySection="";
    let otherSections={};
    const today=new Date();
      today.setHours(0,0,0,0);
      const yesterday=new Date();
      yesterday.setDate(yesterday.getDate()-1);
      yesterday.setHours(0,0,0,0);
    qsnapshot.forEach((docSnap) => {
      const data = docSnap.data();
       const id = docSnap.id;
      if(!data.createdAt){
          return;
      }
      const expenseDate=data.createdAt.toDate();
      expenseDate.setHours(0,0,0,0);
      let targetSection="";
      if(expenseDate.getTime()===today.getTime()){
         targetSection="today";
      }
      else if(expenseDate.getTime()===yesterday.getTime()){
       targetSection="yesterday";
      }
      else{
        targetSection="older";
      }

      totalexp += Number(data.amount) || 0;
      categoryTotals[data.category] += Number(data.amount) || 0;
      let image = "";
      if (data.category == "Food") {
        image = "food1.png";
      }
      else if (data.category == "travel") {
        image = "travel.jpeg";
      }
      else if (data.category == "Shopping") {
        image = "shop.png";
      }
      else {
        image = "others.png";
      }
      let expenseHTML=`<div class="item">
          <img src="${image}" class="images">
          <div class="info">
            <h4>${data.expensename}</h4>
            <p>-${data.category}</p>
          </div>
          <h3>₹ ${data.amount}</h3>
          <div class="actions">
            <button class="edit" data-id="${id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="delete" data-id="${id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>`;
      if(targetSection=="today"){
        todaySection+=expenseHTML;
      }
      else if(targetSection=="yesterday"){
        yesterdaySection+=expenseHTML;
      }
      else{
        let formatted=expenseDate.toLocaleDateString();
        if(!otherSections[formatted]){
          otherSections[formatted]="";
        }
        otherSections[formatted]+=expenseHTML;
      }
    });
      list.innerHTML="";
      if(todaySection){
        list.innerHTML+="<h3>Today</h3>" + todaySection;
      }
      if(yesterdaySection){
        list.innerHTML+="<h3>yesterday</h3>"+yesterdaySection;
      }
      for(let date in otherSections){
        list.innerHTML+=`<h3>${date}</h3>`+otherSections[date];
      }
      if(totalexp==0){
        list.innerHTML=`
        <div class="noexpense">
      <p>No expenses yet 🚀</p>
      <small>Click + to add your first expense</small>
    </div>`
      }
      const centerTextPlugin={
        id:"centerText",
        beforeDraw(chart){
          const {ctx}=chart;
          const meta=chart.getDatasetMeta(0);
           if (!meta.data.length) return;
          const xaxis=meta.data[0].x;
          const yaxis=meta.data[0].y;
          ctx.save();
          ctx.textAlign="center";
          ctx.textBaseline="middle";
          ctx.font = "bold 22px Poppins, sans-serif";
          ctx.fillText(formateincome(animatedval),xaxis,yaxis-8);
          ctx.font = "15px Poppins, sans-serif";
          ctx.fillText(`spent out of ${formateincome(income)}`,xaxis,yaxis+15);
          ctx.restore();
        }
      }
      const ctx = document.getElementById("expenseChart");
      const mychart=new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Food", "Travel", "Shopping", "Others"],
    datasets: [{
      data: [
        categoryTotals["Food"],
        categoryTotals["travel"],
        categoryTotals["Shopping"],
        categoryTotals["others"]
      ],
      backgroundColor: [
           "#A5B4FC",  
           "#6EE7B7",  
           "#FCD34D",  
           "#FCA5A5"   
      ],
      borderWidth: 0
         }]
  },
  options: {
    responsive: true,
   maintainAspectRatio: false,          
  cutout: "75%",
    plugins: {
      legend: {
        position: "right",
        labels:{
          generateLabels(chart){
          const data=chart.data;
          const dataset=data.datasets[0];
          return data.labels.map((label,i)=>{
            const val=dataset.data[i];
            const percentage=totalexp?((val/totalexp)*100).toFixed(1):0;
            return{
            text:`${label}-${formateincome(val)}(${percentage}%)`,
            fillStyle:dataset.backgroundColor[i],
            index:i,
            hidden:false
            }
          })
         }
        }
      }
    }
  },
  plugins: [centerTextPlugin]
});
animatedval=0;
function animatecounter(){
    const duration=1000;
    const starttime=performance.now();
    function update(CurrentTime){
      const progress=Math.min((CurrentTime-starttime)/duration,1);
      animatedval=Math.floor(progress*totalexp);
      mychart.draw();
      if(progress<1){
         requestAnimationFrame(update);
      }
    }
     requestAnimationFrame(update);
}
animatecounter();
    document.querySelectorAll(".delete").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id");
        await deleteDoc(doc(db, "expenses", id));
        alert("expense deleted! ✅");
        location.reload();
      });
    });

    document.querySelectorAll(".edit").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id");
        const newamt = prompt("Enter amount");

        if (!newamt) return;

        await updateDoc(doc(db, "expenses", id), {
          amount: Number(newamt)
        });

        alert("Amount updated!");
        location.reload();
      });
    });
    document.querySelector("#Totalexpense").innerHTML=`<h3 style="color:black">${formateincome(totalexp)}</h3>`
    const remaingbal=document.querySelector("#Remainingbalance");
    remaingbal.innerHTML=`<h3 id="remainingtext">${formateincome(income-totalexp)}</h3>`
    let remain=income-totalexp;
    const remaingtext=document.querySelector("#remainingtext");
    if(remain<0){
      remaingtext.style.color="#CC0000 ";
    }
    else{
      remaingtext.style.color="black";
    }
  } else {
    window.location.href = "login.html";
  }
});

const add = document.querySelector("#additem");
if (add) {
  add.addEventListener("click", () => {
    window.location.href = "form.html";
  });
}

const setincome = document.querySelector("#setincome");
if (setincome) {
  setincome.addEventListener("click", () => {
    window.location.href = "income.html";
  });
}

const set = document.querySelector("#set");
if (set) {
  set.addEventListener("click", async () => {

    const user = auth.currentUser;


    const incomeval = document.querySelector("#income").value;
    if (!incomeval) {
      alert("Enter income");
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        income: Number(incomeval)
      });

      alert("Income value is set");
      window.location.href = "dashboard.html";

    } catch (error) {
      console.log(error);
    }
  });
}
