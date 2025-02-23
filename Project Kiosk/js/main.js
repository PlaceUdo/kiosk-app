// main.js
class MenuManager {
  constructor() {
    this.currentLang = CONFIG.defaultLang;
    this.currentCategory = 'coffee';
    this.init();
  }

  init() {
    this.addStyles();
    this.setupLanguageButtons();
    this.setupTabs();
    this.setupPopup();
    this.renderMenu();
  }

  addStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  setupLanguageButtons() {
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.updateLanguage(btn.dataset.lang);
        languageButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  setupTabs() {
    const tabs = document.querySelectorAll('.header.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentCategory = tab.dataset.category;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderMenu();
      });
    });
  }

  setupPopup() {
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('close-popup');

    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
    });

    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.style.display = 'none';
      }
    });
  }

  updateLanguage(lang) {
    this.currentLang = lang;
    this.updateTranslations();
    this.renderMenu();
  }

  updateTranslations() {
    // 페이지 제목 업데이트
    document.title = translations[this.currentLang].title;
    
    // 탭 텍스트 업데이트
    const tabs = document.querySelectorAll('.header.tab');
    tabs.forEach(tab => {
      const category = tab.dataset.category;
      tab.textContent = translations[this.currentLang].tabs[category];
    });

    // 닫기 버튼 텍스트 업데이트
    document.getElementById('close-popup').textContent = 
      translations[this.currentLang].closeButton;
  }

  renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';

    const filteredItems = menuItems.filter(item => 
      item.category === this.currentCategory
    );

    filteredItems.forEach(item => {
      const menuItem = this.createMenuItem(item);
      menuContainer.appendChild(menuItem);
    });
  }

  createMenuItem(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('role', 'button');
    menuItem.setAttribute('tabindex', '0');

    const translatedName = translations[this.currentLang].menu[item.nameKey];
    
    menuItem.innerHTML = `
      <img src="${CONFIG.imageBasePath}${item.image}" 
           alt="${translatedName}" 
           loading="lazy">
      <div class="text-container">
        <p><strong>${translatedName}</strong></p>
        <p>₩ ${item.price.toLocaleString()}</p>
      </div>
    `;

    if (item.soldOut) {
      menuItem.classList.add('sold-out');
      menuItem.setAttribute('data-sold-out-text', 
        translations[this.currentLang].soldOut);
    } else {
      menuItem.addEventListener('click', () => this.showPopup(item));
      menuItem.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.showPopup(item);
        }
      });
    }

    return menuItem;
  }

  showPopup(item) {
    const popup = document.getElementById('popup');
    const popupImage = document.getElementById('popup-image');
    const translatedName = translations[this.currentLang].menu[item.nameKey];

    popupImage.src = `${CONFIG.imageBasePath}${item.image}`;
    popupImage.alt = translatedName;

    const hotButton = document.querySelector('.hot-button');
    const iceButton = document.querySelector('.ice-button');

    hotButton.style.display = item.availableOptions.includes('hot') ? 
      'inline-block' : 'none';
    iceButton.style.display = item.availableOptions.includes('ice') ? 
      'inline-block' : 'none';

    popup.style.display = 'flex';
  }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  const menuManager = new MenuManager();
  
  // URL 파라미터에서 언어 설정 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang');
  
  if (lang && CONFIG.supportedLanguages.includes(lang)) {
    menuManager.updateLanguage(lang);
  }
});