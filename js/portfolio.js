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

/* 섹션 진입 감지 → gnb 업데이트 */
const sections = document.querySelectorAll('section[data-section]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const section = entry.target;

    // data-section과 href가 같은 link 찾기 (#aboutMe === #aboutMe)
    const index = Array.from(links).findIndex(
      (link) => link.getAttribute('href') === `#${section.dataset.section}`
    );

    if (index !== -1) updateGnb(index);

    // light-section일 때 gnb 색상 변경
    gnb.classList.toggle('dark', section.classList.contains('light-section'));
  });
}, {
  // 화면 세로 중앙선을 지나는 섹션만 감지
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
});

sections.forEach((section) => sectionObserver.observe(section));


/* about-intro 영역 'about me' gnb 위치까지로 크기 맞춤 */
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

/* project */
const projectItems = document.querySelectorAll('.project-list__item');
const projectDetails = document.querySelectorAll('.project-detail__item');

// 프로젝트 목록 클릭 이벤트
projectItems.forEach((item) => {
  item.addEventListener('click', () => {
    const projectName = item.dataset.project;

    // 프로젝트 목록 active 변경
    projectItems.forEach((el) => {
      el.classList.remove('active');
    });

    item.classList.add('active');

    // 프로젝트 상세 정보 active 변경
    projectDetails.forEach((detail) => {
      detail.classList.remove('active');

      if (detail.dataset.project === projectName) {
        detail.classList.add('active');
      }
    });
  });
});


/* contact 말풍선 */
const contactItems = document.querySelectorAll('.contact-item');
const BUBBLE_MARGIN = 12; // 화면 가장자리와 말풍선 사이 최소 여백

// 모든 말풍선 닫기
function closeContactBubbles() {
  contactItems.forEach((item) => {
    item.classList.remove('is-open');
    item.querySelector('.contact-btn').setAttribute('aria-expanded', 'false');
  });
}

// 말풍선이 화면 밖으로 나가지 않도록 가로 위치 보정 (--shift)
function adjustBubble(bubble) {
  bubble.style.setProperty('--shift', '0px');

  const rect = bubble.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  let shift = 0;

  if (rect.left < BUBBLE_MARGIN) {
    shift = BUBBLE_MARGIN - rect.left;
  } else if (rect.right > viewportWidth - BUBBLE_MARGIN) {
    shift = viewportWidth - BUBBLE_MARGIN - rect.right;
  }

  bubble.style.setProperty('--shift', `${shift}px`);
}

// 버튼 클릭 시 해당 말풍선만 열기 (다시 누르면 닫힘)
contactItems.forEach((item) => {
  const button = item.querySelector('.contact-btn');
  const bubble = item.querySelector('.contact-bubble');

  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    closeContactBubbles();

    if (!isOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      adjustBubble(bubble);
    }
  });
});

// 바깥 클릭 / ESC 로 닫기
document.addEventListener('click', (e) => {
  if (!e.target.closest('.contact-item')) closeContactBubbles();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContactBubbles();
});

// 화면 크기가 바뀌면 열려 있는 말풍선 위치 다시 계산
window.addEventListener('resize', () => {
  const openBubble = document.querySelector('.contact-item.is-open .contact-bubble');

  if (openBubble) adjustBubble(openBubble);
});

// 복사 버튼
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // clipboard API를 쓸 수 없는 환경 대비
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }

    textarea.remove();
    return ok;
  }
}

document.querySelectorAll('.bubble-copy').forEach((copyBtn) => {
  copyBtn.addEventListener('click', async () => {
    const ok = await copyText(copyBtn.dataset.copy);

    copyBtn.textContent = ok ? '복사됨!' : '복사 실패';

    clearTimeout(copyBtn.resetTimer);
    copyBtn.resetTimer = setTimeout(() => {
      copyBtn.textContent = '복사';
    }, 1500);
  });
});
