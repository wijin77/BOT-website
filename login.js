// ------ Firebase 설정 ------
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    // ... 나머지 설정 값들
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 이메일/비밀번호 로그인
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = "main.html";
    } catch (error) {
        document.getElementById('error-msg').textContent = error.message;
        document.getElementById('error-msg').classList.remove('hidden');
    }
});

// 구글 로그인
document.getElementById('google-login').addEventListener('click', async function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        window.location.href = "main.html";
    } catch (error) {
        document.getElementById('error-msg').textContent = error.message;
        document.getElementById('error-msg').classList.remove('hidden');
    }
});
