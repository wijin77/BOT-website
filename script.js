// =================================================================
// 1. Firebase 서비스 모듈 가져오기
// =================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// =================================================================
// 2. Firebase 프로젝트 설정
// !! 중요 !!: 아래 YOUR_... 부분들을 실제 자신의 값으로 바꿔주세요.
// Firebase 콘솔 > 프로젝트 설정(⚙️) > 일반 탭 > '내 앱'에서 찾을 수 있습니다.
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAZTyfnDTgozZBHDz0lkATvi2GxzZ_slxw",
  authDomain: "bot-wesite.firebaseapp.com",
  projectId: "bot-wesite",
  storageBucket: "bot-wesite.firebasestorage.app",
  messagingSenderId: "362902003287",
  appId: "1:362902003287:web:996608dcfd0e726e9c4d12"
};

// =================================================================
// 3. Firebase 앱 초기화 및 서비스 사용 준비
// =================================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// =================================================================
// 4. 웹페이지 로드 완료 후 기능 실행
// =================================================================
document.addEventListener('DOMContentLoaded', function() {
  
  const purchaseButton = document.querySelector('.btn-primary');
  let currentUser = null; // 로그인한 사용자 정보를 담을 변수

  // 실시간으로 사용자의 로그인 상태를 감지합니다.
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 사용자가 로그인 되어 있으면, currentUser 변수에 사용자 정보를 할당합니다.
      currentUser = user;
      console.log("사용자 로그인 상태:", currentUser.uid);
    } else {
      // 사용자가 로그아웃 되어 있으면, currentUser 변수를 비웁니다.
      currentUser = null;
      console.log("사용자 로그아웃 상태");
    }
  });

  // '구매하기' 버튼 기능
  if (purchaseButton) {
    purchaseButton.addEventListener('click', function() {
      // 먼저 로그인이 되어 있는지 확인합니다.
      if (!currentUser) {
        alert('구매를 진행하려면 먼저 로그인을 해주세요.');
        return; // 로그인 상태가 아니면 여기서 함수를 중단합니다.
      }

      // Firestore 'purchases' 컬렉션에 구매 정보를 저장합니다.
      addDoc(collection(db, "purchases"), {
        productName: "간단하게 잠깨려면 BOT 마스크패치",
        purchaseTime: serverTimestamp(), // 서버의 시간을 기준으로 기록
        userId: currentUser.uid,        // 구매자의 고유 ID
        userEmail: currentUser.email    // 구매자의 이메일 주소
      })
      .then((docRef) => {
        // 데이터 저장에 성공한 경우
        console.log("데이터가 성공적으로 저장되었습니다. 문서 ID: ", docRef.id);
        alert('구매해주셔서 감사합니다! 주문 정보가 저장되었습니다.');
      })
      .catch((error) => {
        // 데이터 저장에 실패한 경우
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
