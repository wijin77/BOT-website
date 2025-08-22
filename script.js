document.addEventListener('DOMContentLoaded', function() {
    // '구매하기' 버튼 요소를 찾습니다.
    const purchaseButton = document.querySelector('.btn-primary');

    if (purchaseButton) {
        purchaseButton.addEventListener('click', function() {
            // Firestore에 데이터 추가하기
            db.collection("purchases").add({
                productName: "간단하게 잠깨려면 BOT 마스크패치",
                purchaseTime: new Date() // 현재 시간을 저장
            })
            .then((docRef) => {
                // 성공했을 때
                console.log("데이터가 성공적으로 저장되었습니다. ID: ", docRef.id);
                alert('구매해주셔서 감사합니다! 주문 정보가 저장되었습니다.');
            })
            .catch((error) => {
                // 실패했을 때
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
