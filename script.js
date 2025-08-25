const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    // ... 나머지 설정 값들
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 메인 화면 진입 시 로그인 체크
auth.onAuthStateChanged(user => {
    if (!user) {
        // 로그인 안되어 있으면 로그인 화면으로 이동
        window.location.href = "login.html";
    } else {
        // 사용자 정보 표시
        document.getElementById('user-photo').src = user.photoURL || "https://via.placeholder.com/96";
        document.getElementById('user-name').textContent = user.displayName || "이름 없음";
        document.getElementById('user-email').textContent = user.email || "";
    }
});

// 로그아웃 버튼
document.getElementById('logout-button').addEventListener('click', async function() {
    await auth.signOut();
    window.location.href = "login.html";
});

// 구매 버튼 예시 (실제 구매 기능은 따로 구현 필요)
document.getElementById('buy-button').addEventListener('click', function() {
    alert("구매 기능은 추후 구현해주세요!");
});
