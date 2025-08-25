// 1. Firebase 서비스 모듈 가져오기 (CDN 방식)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// =================================================================
// 2. 'EunHa' 프로젝트의 Firebase 설정 값 (★★★★★ 여기가 제일 중요 ★★★★★)
// =================================================================
const firebaseConfig = {
    apiKey: "AIzaSyDORnc00mlGrymHB5PekOR1JkKmpggjzpM",
    authDomain: "eunha-9e617.firebaseapp.com",
    projectId: "eunha-9e617",
    storageBucket: "eunha-9e617.firebasestorage.app",
    messagingSenderId: "11922084914",
    appId: "1:11922084914:web:c397d89cab25f24e4b982b",
    measurementId: "G-QRLG97YGM6"
};

// =================================================================
// 3. Firebase 앱 초기화 및 서비스 사용 준비
// =================================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// =================================================================
// 4. 페이지 로드 완료 후 기능 실행 (이 부분은 이전과 동일합니다)
// =================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- 페이지 공통: 인증 상태 감지 ---
    onAuthStateChanged(auth, (user) => {
        const currentPath = window.location.pathname;
        if (user) {
            // 사용자가 로그인한 경우
            console.log("로그인 상태:", user.uid);
            if (currentPath.includes("index.html") || currentPath === "/") {
                window.location.href = 'main.html';
            }
        } else {
            // 사용자가 로그아웃한 경우
            console.log("로그아웃 상태");
            if (currentPath.includes("main.html")) {
                window.location.href = 'index.html';
            }
        }
    });

    // --- index.html (로그인/회원가입 페이지) 전용 로직 ---
    if (document.getElementById('auth-container')) {
        const loginView = document.getElementById('login-view');
        const signupView = document.getElementById('signup-view');
        const showSignup = document.getElementById('show-signup');
        const showLogin = document.getElementById('show-login');
        
        const loginEmailInput = document.getElementById('login-email');
        const loginPasswordInput = document.getElementById('login-password');
        const emailLoginButton = document.getElementById('email-login-button');
        const loginError = document.getElementById('login-error');

        const signupEmailInput = document.getElementById('signup-email');
        const signupPasswordInput = document.getElementById('signup-password');
        const emailSignupButton = document.getElementById('email-signup-button');
        const signupError = document.getElementById('signup-error');

        const googleLoginButton = document.getElementById('google-login-button');

        // 회원가입 뷰 보이기
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.classList.add('hidden');
            signupView.classList.remove('hidden');
        });

        // 로그인 뷰 보이기
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupView.classList.add('hidden');
            loginView.classList.remove('hidden');
        });

        // 이메일 회원가입
        emailSignupButton.addEventListener('click', () => {
            const email = signupEmailInput.value;
            const password = signupPasswordInput.value;
            signupError.textContent = '';
            createUserWithEmailAndPassword(auth, email, password).catch(err => signupError.textContent = getAuthErrorMessage(err.code));
        });

        // 이메일 로그인
        emailLoginButton.addEventListener('click', () => {
            const email = loginEmailInput.value;
            const password = loginPasswordInput.value;
            loginError.textContent = '';
            signInWithEmailAndPassword(auth, email, password).catch(err => loginError.textContent = getAuthErrorMessage(err.code));
        });

        // 구글 로그인
        googleLoginButton.addEventListener('click', () => {
            signInWithPopup(auth, googleProvider).catch(() => loginError.textContent = "구글 로그인에 실패했습니다.");
        });
    }

    // --- main.html (메인 페이지) 전용 로직 ---
    if (document.getElementById('user-profile')) {
        const userPhoto = document.getElementById('user-photo');
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const logoutButton = document.getElementById('logout-button');
        const purchaseButton = document.querySelector('.btn-primary');

        // 사용자 정보 표시
        const user = auth.currentUser;
        if (user) {
            userPhoto.src = user.photoURL || 'https://placehold.co/96x96/E2E8F0/A0AEC0?text=User';
            userName.textContent = user.displayName || '사용자';
            userEmail.textContent = user.email;
        }

        // 로그아웃
        logoutButton.addEventListener('click', () => signOut(auth));

        // 구매하기
        purchaseButton.addEventListener('click', () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return alert('로그인이 필요합니다.');
            
            addDoc(collection(db, "purchases"), {
                productName: "BOT 마스크패치 구매하기",
                purchaseTime: serverTimestamp(),
                userId: currentUser.uid,
                userEmail: currentUser.email
            })
            .then(() => alert('구매해주셔서 감사합니다!'))
            .catch((err) => console.error("구매 정보 저장 오류: ", err));
        });
    }
    
    // 에러 코드에 맞는 한글 메시지 반환 함수
    function getAuthErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/invalid-email': return '유효하지 않은 이메일 주소입니다.';
            case 'auth/user-not-found': return '존재하지 않는 계정입니다.';
            case 'auth/wrong-password': return '비밀번호가 올바르지 않습니다.';
            case 'auth/email-already-in-use': return '이미 사용 중인 이메일 주소입니다.';
            case 'auth/weak-password': return '비밀번호는 6자 이상이어야 합니다.';
            default: return '오류가 발생했습니다. 다시 시도해 주세요.';
        }
    }
});
