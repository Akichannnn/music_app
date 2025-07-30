let url = "https://www.akiweb.click";
let iut = 0;
if(iut === 0){
  url = "http://localhost:3000"
}else{
  url = "https://www.akiweb.click";
}
  function onClick(e) {
    e.preventDefault();
    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute('6LflTDMrAAAAAPsESBlbdVM9_-Vi1pxoUeC12ZyR', {action: 'LOGIN'});
    });
  }
  async function b(){
    try {
  
  const req = await fetch("https://recaptchaenterprise.googleapis.com/v1/projects/august-jigsaw-458604-h6/assessments?key=AIzaSyBfcMv5sQ7O7ewdO-4Kwwcy8DnOFfhBZmk")
      const res = req.json
      console.log(res)
    } catch (e) {}
  }
async function loginWithGoogle() {
    const response = await fetch(`${url}/login/google`);
    const data = await response.json();
    console.log("Thông tin người dùng:", data);
  }
  function k(){
    window.location.href = `${url}/login/google`;
  }
  document.getElementById("google-login").addEventListener("click", k);
function changeProgressColor() {
  const t = document.querySelector(".background-random");
  const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  t.style.background = `linear-gradient(to right, ${randomColor1}, ${randomColor2})`;
}
setInterval(()=>{
  changeProgressColor()
},2500)
const firebaseConfig = {
  apiKey: "AIzaSyCVZHrleIZ_QVT0U-S6s2W2DIO1bFfi0bg",
  authDomain: "music-app-74ade.firebaseapp.com",
  databaseURL: "https://music-app-74ade-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "music-app-74ade",
  storageBucket: "music-app-74ade.firebasestorage.app",
  messagingSenderId: "366868707766",
  appId: "1:366868707766:web:84b4951b2b01a7fcd32917",
  measurementId: "G-GB252W8D3B"
};
const provider = new firebase.auth.GoogleAuthProvider();

auth.signInWithPopup(provider)
  .then(async (result) => {
    const user = result.user;

    // Lưu thông tin người dùng vào Firestore
    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log("Đăng nhập thành công:", user.displayName);
  })
  .catch((error) => {
    console.error("Lỗi đăng nhập:", error.message);
  });