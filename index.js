document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: scrollWithShadowAnimation
    });
  });
});

function scrollWithShadowAnimation() {
  if (window.shadowAnimationRunning) return;
  window.shadowAnimationRunning = true;

  const style = document.createElement('style');
  style.innerHTML = `
    .shadow-animation-overlay {
      position: fixed;
      top: -20px;
      left: -20px;
      width: calc(100% + 40px);
      height: calc(100% + 40px);
      pointer-events: none;
      z-index: 9999;
      box-shadow: 
        0 0 0 0 rgba(234, 47, 237, 0.5) inset,
        0 0 0 0 rgba(0, 122, 255, 0.3) inset,
        0 0 0 0 rgba(0, 122, 255, 0.1) inset;
      animation: shadowGlow 2s infinite;
    }

    @keyframes shadowGlow {
      0% {
        box-shadow: 
          0 0 30px 20px rgba(234, 47, 237, 0.3) inset,
          0 0 60px 40px rgba(0, 122, 255, 0.2) inset,
          0 0 90px 50px rgba(0, 122, 255, 0.1) inset;
      }
      50% {
        box-shadow: 
          0 0 30px 20px rgba(234, 47, 237, 1) inset,
          0 0 60px 40px rgba(0, 122, 255, 0.3) inset,
          0 0 90px 50px rgba(0, 122, 255, 0.2) inset;
      }
      100% {
        box-shadow: 
          0 0 30px 20px rgba(234, 47, 237, 0.3) inset,
          0 0 60px 40px rgba(0, 122, 255, 0.2) inset,
          0 0 90px 50px rgba(0, 122, 255, 0.1) inset;
      }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.classList.add('shadow-animation-overlay');
  document.body.appendChild(overlay);

  const threadContainer = document.querySelector('.p-flexpane__body .c-scrollbar__hider');
  if (threadContainer) {
    let lastScrollTop = threadContainer.scrollTop;
    threadContainer.addEventListener('scroll', () => {
      if (threadContainer.scrollTop !== lastScrollTop) {
        console.log('ユーザーによるスクロールが検出されました。自動スクロールを停止します。');
        clearInterval(intervalId);
        overlay.remove();
        style.remove();
        window.shadowAnimationRunning = false;
      }
    });

    const intervalId = setInterval(() => {
      if (!window.shadowAnimationRunning) return;
      threadContainer.scrollTop = threadContainer.scrollHeight;
      lastScrollTop = threadContainer.scrollTop;
    }, 100);
  } else {
    console.log('Slackのスレッドが見つかりませんでした。');
    overlay.remove();
    style.remove();
    window.shadowAnimationRunning = false;
  }
}
