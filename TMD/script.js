// 나중에 웹사이트에 동적인 기능을 추가할 때 이 파일에 코드를 작성합니다.

document.addEventListener('DOMContentLoaded', function() {
    // '구매하기' 버튼 클릭 시 알림 창 띄우기 (임시 기능)
    const purchaseButton = document.querySelector('.btn-primary');
    
    if (purchaseButton) {
        purchaseButton.addEventListener('click', function() {
            alert('구매 기능은 현재 준비 중입니다!');
            // 나중에 실제 구매 페이지 URL로 이동하는 코드를 여기에 추가할 수 있습니다.
            // window.location.href = '결제페이지_주소';
        });
    }

    // 부드러운 스크롤 기능
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});