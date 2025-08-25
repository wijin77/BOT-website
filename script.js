// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDORnc00mlGrymHB5PekOR1JkKmpggjzpM",
  authDomain: "eunha-9e617.firebaseapp.com",
  projectId: "eunha-9e617",
  storageBucket: "eunha-9e617.firebasestorage.app",
  messagingSenderId: "11922084914",
  appId: "1:11922084914:web:c397d89cab25f24e4b982b",
  measurementId: "G-QRLG97YGM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 4. 기능 실행
document.addEventListener('DOMContentLoaded', () => {

    // --- 페이지 공통: 인증 상태 감지 ---
    onAuthStateChanged(auth, (user) => {
        const currentPath = window.location.pathname;
        if (user) {
            console.log("로그인 상태 (익명):", user.uid);
            if (currentPath.includes("index.html") || currentPath === "/") {
                window.location.href = 'main.html';
            }
        } else {
            console.log("로그아웃 상태");
            if (currentPath.includes("main.html")) {
                window.location.href = 'index.html';
            }
        }
    });

    // --- index.html (시작 페이지) 로직 ---
    const anonLoginButton = document.getElementById('anonymous-login-button');
    if (anonLoginButton) {
        anonLoginButton.addEventListener('click', () => {
            signInAnonymously(auth)
                .catch((error) => console.error("익명 로그인 에러:", error));
        });
    }

    // --- main.html (메인 페이지) 로직 ---
    if (document.getElementById('user-profile')) {
        const userDisplay = document.getElementById('user-name');
        const logoutButton = document.getElementById('logout-button');
        const purchaseButton = document.querySelector('.btn-primary');
        const user = auth.currentUser;

        if (user) {
            // 익명 사용자는 displayName이 없으므로, 고유 ID로 환영 메시지 표시
            userDisplay.textContent = `환영합니다! (사용자 ID: ${user.uid.substring(0, 6)}...)`;
        }

        logoutButton.addEventListener('click', () => signOut(auth));

        purchaseButton.addEventListener('click', () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return alert('로그인이 필요합니다.');
            
            addDoc(collection(db, "purchases"), {
                productName: "BOT 마스크패치 구매하기",
                purchaseTime: serverTimestamp(),
                userId: currentUser.uid // 익명 사용자의 고유 ID가 저장됨
            })
            .then(() => alert('구매해주셔서 감사합니다!'))
            .catch((err) => console.error("구매 정보 저장 오류: ", err));
        });
    }
});

