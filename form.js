import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { serverTimestamp } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
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
const addexpense=document.querySelector("#addexpense");
if(addexpense){
    addexpense.addEventListener("click",async()=>{
    const user=auth.currentUser;
    if(!user){
        alert("login first!");
        return;
    }
    const expensename=document.querySelector("#expensename").value;
    const amount=document.querySelector("#amount").value;
    const category=document.querySelector("select").value;
    if(!expensename || !amount){
        alert("plz fill all the fields");
        return;
    }
    try{
        await addDoc(collection(db,"expenses"),{
            uid:user.uid,
            expensename:expensename,
            amount:Number(amount),
            category:category,
            createdAt: new Date()
        });
         alert("Expense Added ✅");
      window.location.href = "dashboard.html";
    }catch (error) {
      console.log(error);
    }
})
}