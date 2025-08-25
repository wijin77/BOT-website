// 1. Firebase 서비스 모듈 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 2. Firebase 프로젝트 설정 (기존 값 그대로 사용)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // 본인 값으로 채워진 상태 유지
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 3. Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

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
