function initCarousel() {
  // 1. 寻找所有的 <carousel> 标签
  const carousels = document.querySelectorAll('carousel');

  carousels.forEach((el) => {
    // 防止重复初始化
    if (el.getAttribute('data-processed')) return;

    // 2. 提取内部的 <img>
    const imgs = el.querySelectorAll('img');
    let slidesHtml = '';

    imgs.forEach(img => {
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt') || '';
      slidesHtml += `
        <div class="quartz-carousel-slide">
          <img src="${src}" alt="${alt}">
          ${alt ? `<div class="carousel-caption">${alt}</div>` : ''}
        </div>`;
    });

    // 3. 构建新的 HTML 结构
    const container = document.createElement('div');
    container.className = 'quartz-carousel';
    container.innerHTML = `
      <div class="quartz-carousel-slides">${slidesHtml}</div>
      <div class="quartz-carousel-dots"></div>
      <button class="quartz-carousel-prev" type="button">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
      </button>
      <button class="quartz-carousel-next" type="button">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
      </button>
    `;

    // 4. 替换原始标签
    el.parentNode?.replaceChild(container, el);
    
    // 5. 绑定轮播逻辑 (这里调用你原有的轮播 JS 逻辑)
    setupCarouselLogic(container);
  });
}

function setupCarouselLogic(container: HTMLElement) {
  const slides = container.querySelector('.quartz-carousel-slides') as HTMLElement;
  const slideElements = container.querySelectorAll('.quartz-carousel-slide');
  const prevBtn = container.querySelector('.quartz-carousel-prev');
  const nextBtn = container.querySelector('.quartz-carousel-next');
  const dotsContainer = container.querySelector('.quartz-carousel-dots');
  
  let currentIndex = 0;

  // 获取所有图片并绑定放大逻辑
  const images = container.querySelectorAll('.quartz-carousel-slide img');
  images.forEach((img) => {
    img.addEventListener('click', () => {
      const modal = document.querySelector('.carousel-image-modal') as HTMLElement;
      const modalImg = modal?.querySelector('.carousel-modal-image') as HTMLImageElement;
      if (modal && modalImg) {
        modalImg.src = (img as HTMLImageElement).src;
        modal.style.display = 'block';
      }
    });
  });

  // 创建小圆点
  slideElements.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止触发图片放大
      goToSlide(i);
    });
    dotsContainer?.appendChild(dot);
  });

  const updateDots = () => {
    container.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  const goToSlide = (index: number) => {
    currentIndex = (index + slideElements.length) % slideElements.length;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentIndex - 1);
  });
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentIndex + 1);
  });
}

// 确保页面上有模态框 HTML (如果不存在则创建一个)
function ensureModalExists() {
  if (document.querySelector('.carousel-image-modal')) return;
  const modal = document.createElement('div');
  modal.className = 'carousel-image-modal';
  modal.innerHTML = `
    <div class="carousel-modal-overlay">
      <div class="carousel-modal-content">
        <img class="carousel-modal-image" src="" alt="放大查看">
        <button class="carousel-modal-close" type="button">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"></path></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // 点击遮罩层或关闭按钮时关闭
  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// 监听 Quartz 事件
document.addEventListener("nav", () => {
  ensureModalExists();
  initCarousel();
});
window.addEventListener("DOMContentLoaded", () => {
  ensureModalExists();
  initCarousel();
});