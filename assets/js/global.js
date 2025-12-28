$(function () {
  /* General Settings */
  const open = 'open';
  const $hamburger = $('.hamburger');
  const $closeMenu = $('.menu-overlay');
  $hamburger.on('click',function () {
    const $this = $(this);
    $this.toggleClass(open);
    const opened = $this.hasClass(open);
    toggleScrollLock(opened);
  });
  $closeMenu.on('click',function () {
    $hamburger.removeClass(open);
    toggleScrollLock(false);
  });
  /*/ General Settings */

  /********************************************************************************* */

  /* Fixed Header Settings */
  /*
  const $window       = $(window).width();
  if($window > 992){
    var lastScrollTop = 0;
    var scrollTop = $(this).scrollTop();
    if (scrollTop > 200 && scrollTop < 600) {
      $('.header,.hamburger,.mobil-logo').addClass('header-white header-hidden');
    }
    $(window).scroll(function () {
      var scrollTop = $(this).scrollTop();
      if(scrollTop > 101 && scrollTop < 200){
        $('.header,.hamburger,.mobil-logo').addClass('header-animate');
      } else {
        $('.header,.hamburger,.mobil-logo').removeClass('header-animate');
      }
      if(scrollTop > 0){
        if (scrollTop > lastScrollTop) {
          $('.header,.hamburger,.mobil-logo').removeClass('header-animate');
          $('.header,.hamburger,.mobil-logo').addClass('header-hidden');
          if (scrollTop > 0) {
            $('.header,.hamburger,.mobil-logo').addClass('header-white header-hidden header-fixed');
          }
        } else if (scrollTop < lastScrollTop) {
          if (scrollTop > 0) {
            $('.header,.hamburger,.mobil-logo').addClass('header-white header-fixed');
            $('.header,.hamburger,.mobil-logo').removeClass('header-hidden');
          } else if (scrollTop < 1 && scrollTop != 0) {

          }
        }
        lastScrollTop = scrollTop;
      }
      if (scrollTop == 0 || scrollTop <= 200) {
        $('.header,.hamburger,.mobil-logo').removeClass('header-hidden');
      }
      if (scrollTop == 0) {
        $('.header,.hamburger,.mobil-logo').removeClass('header-fixed header-white');
      }
    });
  }*/
  /*/ fixed-header Settings */

  /********************************************************************************* */

  /* smooth scrolling with click */
  
  
  /*/ smooth scrolling with click  */

  /********************************************************************************* */

});

// Smooth scroll for down-arrow buttons (outside jQuery ready)
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".scroll-btn");
  if (!btn) return;
  e.preventDefault();
  const targetSel = btn.getAttribute("data-scroll-target");
  if (!targetSel) return;
  const offset = Number(btn.getAttribute("data-offset") || 0);
  const el = document.querySelector(targetSel);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
  gsap.to(window, { scrollTo: top, duration: 1, ease: "power2.out" });
});

function toggleScrollLock(lock) {
  const smoother = typeof ScrollSmoother !== "undefined" ? ScrollSmoother.get() : null;
  if (smoother) {
    smoother.paused(lock);
  } else {
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.overflow = lock ? "hidden" : "";
  }
}

// Header state (desktop): hide/show on scroll and dark toggle when not at top
(() => {
  const headerEl = document.querySelector(".header");
  const blurEl = document.querySelector(".header .blur");
  if (!headerEl) return;

  let lastY = window.pageYOffset;
  let tween = null;
  const hiddenY = -55;

  let darkTimeout = null;

  const setDark = (on) => {
    clearTimeout(darkTimeout);
    darkTimeout = setTimeout(() => {
      headerEl.classList.toggle("dark", on);
    }, on ? 500 : 300); // add after 500ms, remove after 300ms
  };

  const updateDark = () => {
    const atTop = window.pageYOffset <= 0;
    setDark(!atTop);
    if (blurEl) {
      if (atTop) {
        blurEl.style.width = "";
        blurEl.style.height = "";
        blurEl.style.borderRadius = "";
      } else {
        blurEl.style.width = "100%";
        blurEl.style.height = "100%";
        blurEl.style.borderRadius = "0";
      }
    }
  };

  const onScroll = () => {
    const y = window.pageYOffset;
    const down = y > lastY;
    lastY = y;
    if (window.innerWidth <= 991) {
      tween?.kill();
      gsap.set(headerEl, { y: 0 });
      updateDark();
      return;
    }
    tween?.kill();
    tween = gsap.to(headerEl, { y: down ? hiddenY : 0, duration: 0.25, ease: "power2.out" });
    updateDark();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  updateDark();
})();

// NEWS hover -> swap main image using data-src on items
(() => {
  const imgs = gsap.utils.toArray(".news-img-visual");
  const items = gsap.utils.toArray(".news-list .item");
  if (!imgs.length || !items.length) return;

  // ensure two layers for crossfade
  const activeClass = "is-active";
  const setSrc = (img, src) => { if (src) img.setAttribute("src", src); };

  const showImg = (src) => {
    if (!src) return;
    const current = imgs.find(img => img.classList.contains(activeClass)) || imgs[0];
    const next = imgs.find(img => img !== current) || current;
    if (next === current) { setSrc(current, src); return; }
    setSrc(next, src);
    gsap.set(next, { autoAlpha: 0, zIndex: 2 });
    gsap.set(current, { zIndex: 1 });
    gsap.to(next, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(current, { autoAlpha: 0, duration: 0.35, ease: "power2.out" });
    current.classList.remove(activeClass);
    next.classList.add(activeClass);
  };

  // initial: use first item's data-src if available
  const firstSrc = items[0]?.dataset.src;
  if (firstSrc) {
    setSrc(imgs[0], firstSrc);
    imgs[0].classList.add(activeClass);
  }

  items.forEach((item) => {
    const src = item.dataset.src || "";
    item.addEventListener("mouseenter", () => showImg(src));
    item.addEventListener("focus", () => showImg(src));
  });
})();

// NEWS fade-up on enter (each element individually)
(() => {
  const section = document.querySelector(".news");
  const img = section?.querySelector(".news-img");
  const items = gsap.utils.toArray(".news-list .item");
  if (!section || (!img && !items.length)) return;

  if (img) {
    gsap.from(img, {
      opacity: 0,
      y: 60,
      filter: "blur(12px)",
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: img,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  items.forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });
})();
/*/ intro */
(() => {
  const introEl = document.querySelector('.intro');
  if (!introEl) return;

  const cookieName = 'ose_intro_seen';
  const cookieDays = 7;
  const getCookie = (name) => document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='))?.split('=')[1];
  const setCookie = (name, value, days) => {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
  };

  const hasSeen = !!getCookie(cookieName);
  if (hasSeen) {
    introEl.remove();
    return;
  }
  setCookie(cookieName, '1', cookieDays);
  introEl.style.display = 'block';

  gsap.set([
  '.intro .logo',
  '.intro .part-1',
  '.intro .part-2',
  '.intro .part-3',
  '.intro .part-5',
  '.intro .part-6'
  ], { autoAlpha: 0 });

  gsap.set('.intro .part-4', { width: '200%', autoAlpha: 1 });
  gsap.set('.intro .part-crescents', { transformOrigin: '50% 50%', rotation: 0 });

  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline({
  defaults: { ease: 'power2.out' },
  onComplete: () => {
      const opener = document.querySelector('.intro');
      opener?.remove();
      document.body.style.overflow = '';
  }
  });

  tl.to('.intro .part-4', {
  width: '2%', duration: 0.8
  }).to('.intro .part-4', {
  width: '6.6%', duration: 0.2
  });

  tl.fromTo('.intro .part-crescents',
      { rotation: -220, transformOrigin: '50% 50%' },
      { rotation: 0, duration: 1.5, delay: 0.2, ease: 'power2.inOut' },
      '-=0.6'
  )

  .to('.intro .part-1', { autoAlpha: 1, delay: .4, duration: 0.2 }, '<+0.0')
  .to('.intro .part-2', { autoAlpha: 1, delay: .1, duration: 0.2 }, '<+0.15')
  .to('.intro .part-3', { autoAlpha: 1, delay: .1, duration: 0.2 }, '<+0.15');

  tl.to('.intro .part-5', { autoAlpha: 1, duration: 0.25 }, '-=0.25');

  tl.to('.intro .part-6', { autoAlpha: 1, duration: 0.25 }, '-=0.15');

  tl.to('.intro .part-5', {
  scale: 50,
  xPercent: 1494,
  transformOrigin: '50% 50%',
  duration: 0.8,
  ease: 'power2.in'
  }, 'final')
  .to(['.intro .part-crescents', '.intro .part-4', '.intro .part-6'], {
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power1.in'
  }, 'final')

  .to('.intro', { autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 'final+=0.1');
})();
/* Opening */




/* modal settings */


