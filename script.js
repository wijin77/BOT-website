// 이 부분은 HTML 파일의 <script> 태그 상단에 이미 설정되어 있어야 합니다.
// Firebase SDK 초기화 및 Firestore 인스턴스 생성
// (주의: 자신의 Firebase 프로젝트 설정 값으로 변경해야 합니다)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
// Firestore 및 Auth 서비스 가져오기
const db = getFirestore(app);
const auth = getAuth(app);


// DOM이 완전히 로드된 후 스크립트 실행
document.addEventListener('DOMContentLoaded', function() {
    const purchaseButton = document.querySelector('.btn-primary');
    
    // 현재 로그인한 사용자 정보 저장할 변수
    let currentUser = null;

    // 사용자의 로그인 상태 변화 감지
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // 사용자가 로그인한 경우
            currentUser = user;
            console.log("로그인된 사용자:", currentUser.uid);
        } else {
            // 사용자가 로그아웃한 경우
            currentUser = null;
            console.log("사용자가 로그아웃했습니다.");
        }
    });

    if (purchaseButton) {
        purchaseButton.addEventListener('click', function() {
            // *** 1. 로그인 상태 확인 ***
            if (!currentUser) {
                alert('구매를 진행하려면 먼저 로그인을 해주세요.');
                return; // 함수 종료
            }

            // *** 2. Firestore에 사용자 정보와 함께 데이터 추가 ***
            addDoc(collection(db, "purchases"), {
                productName: "간단하게 잠깨려면 BOT 마스크패치",
                purchaseTime: serverTimestamp(), // 서버의 현재 시간을 저장 (더 정확함)
                userId: currentUser.uid,        // 구매한 사용자의 고유 ID 저장
                userEmail: currentUser.email    // 구매한 사용자의 이메일 저장 (선택 사항)
            })
            .then((docRef) => {
                console.log("데이터가 성공적으로 저장되었습니다. ID: ", docRef.id);
                alert('구매해주셔서 감사합니다! 주문 정보가 저장되었습니다.');
            })
            .catch((error) => {
                console.error("데이터 저장 중 오류 발생: ", error);
                alert('죄송합니다. 주문 처리 중 오류가 발생했습니다.');
            });
        });
    }

    // 부드러운 스크롤 기능 (기존 기능 유지)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
