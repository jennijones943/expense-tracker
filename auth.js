import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
}  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebase={
    apiKey: "AIzaSyA7pESbUlYl9RTzyeubQoJE6zbmyMwevK8",
  authDomain: "expense-track-cae1f.firebaseapp.com",
  projectId: "expense-track-cae1f",
  storageBucket: "expense-track-cae1f.firebasestorage.app",
  messagingSenderId: "526957361899",
  appId: "1:526957361899:web:6b264419fa819c2965dcae"
}
const app=initializeApp(firebase);
const auth=getAuth(app);
const login=document.querySelector("#login");
const signup=document.querySelector("#signup");
const db = getFirestore(app);
if(login){
    login.addEventListener("click",()=>{
    const mail=document.querySelector("#email").value.trim();
    const password=document.querySelector("#password").value.trim();
    signInWithEmailAndPassword(auth,mail,password)
    .then(()=>{
        alert("succuessfully login")
        window.location.href="dashboard.html";
     }).catch((error)=>{
        alert("invaild email or password");
     });
})
}
if(signup){
    signup.addEventListener("click",()=>{
    const name=document.querySelector("#name").value.trim();
    const mail=document.querySelector("#emailsignup").value.trim();
    const password=document.querySelector("#passwordsignup").value.trim();

     createUserWithEmailAndPassword(auth,mail,password)
    .then(async (userCredential)=>{

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name: name
        });

        alert("signup successfull");
        window.location.href="dashboard.html";
    }).catch((error)=>{
        alert(error.message);
    })
})
}
