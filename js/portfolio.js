/* intro */
const text = 'HELLO !';
const typingText = document.querySelector('#typingText');

let index = 0;

function typing() {
  if (index < text.length) {
    typingText.textContent += text[index];
    index++;

    setTimeout(typing, 300);
  } else {
    // HELLO 타이핑 완료
    // 이후 커서 깜빡임과 메인 화면 전환 처리
  }
}

setTimeout(typing, 300);

/* gnb */
const gnb = document.querySelector('.gnb');
const line = document.querySelector('.gnb-line');
const links = document.querySelectorAll('.gnb a');

function updateGnb(index) {
  // GNB의 시작 위치
  const gnbLeft = gnb.getBoundingClientRect().left;

  // 현재 메뉴의 위치와 너비
  const linkRect = links[index].getBoundingClientRect();

  let progressWidth = 0;

  if (index === 0) {
    progressWidth = 0;
  } else if (index === 1 || index === 2) {
    //about me or project
    progressWidth = linkRect.left + linkRect.width / 2 - gnbLeft;
  } else if (index === 3) {
    //contact에서는 라인 모두 채워지게
    progressWidth = linkRect.right - gnbLeft;
  }

  line.style.width = `${progressWidth}px`;

  // 현재 메뉴 글자색 변경
  links.forEach((link, i) => {
    link.classList.toggle('active', i === index);
  });
}

links.forEach((link, index) => {
  link.addEventListener('click', () => {
    updateGnb(index);
  });
});

//light-section에서 gnb 색상 변경
const lightSections = document.querySelectorAll('.light-section');

lightSections.forEach((lightSection) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gnb.classList.add('dark');
      } else {
        gnb.classList.remove('dark');
      }
    });
  }, {
    threshold: 1
  });

  observer.observe(lightSection);
})

/* about-intro 크기 맞춤 */
const aboutIntro = document.querySelectorAll('.about-intro');

//gnb의 about me 위치값 재사용 위하여 생성
function getAboutPosition() {
  const gnbLeft = gnb.getBoundingClientRect().left;
  const linkRect = links[1].getBoundingClientRect();

  return linkRect.left + linkRect.width / 2 - gnbLeft;
}

function updateAboutIntro() {
  aboutIntro.forEach((about) => {
    about.style.width = `${getAboutPosition()}px`;
  })
}

updateAboutIntro();

window.addEventListener('resize', updateAboutIntro);

/* journey */
//journey-line 높이값 맞춤
const journeyLine = document.querySelector('.journey-line');
const journeyItems = document.querySelectorAll('.journey-item');
const journeyDetails = document.querySelectorAll('.journey-detail');

function updateJourneyLine() {
  const servicePosition = journeyItems[0].getBoundingClientRect().top;
  const frontendPosition = journeyItems[2].getBoundingClientRect().top;
  const journeyLineHeight = frontendPosition - servicePosition;

  journeyLine.style.height = `calc(${journeyLineHeight}px + 2px)`;
}

updateJourneyLine();

window.addEventListener('resize', updateJourneyLine);

//journey-itme 클릭 시 해당하는 detail 카드 보여줌
journeyItems.forEach((journeyItem, index) => {
  journeyItem.addEventListener('click', () => {
    journeyItems.forEach((item) => {
      item.classList.remove('active');
    })

    journeyItem.classList.add('active');

    const itemIndex = journeyItem.dataset.index;

    journeyDetails.forEach((detail) => {
      detail.classList.remove('active');

      if (itemIndex === detail.dataset.index) {
        detail.classList.add('active');
      }
    })

    journeyDetails.forEach((detail) => {
      detail.index
    })
  })
})

/* about-bottom slide */
var swiper = new Swiper('.infoSwiper', {
  pagination: {
    el: '.swiper-pagination',
    type: 'fraction',
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});