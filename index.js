document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: scrollToBottomRepeatedly
    });
  });
});

function scrollToBottomRepeatedly() {
  let attempts = 0;
  const maxAttempts = 50;
  let lastScrollTop = -1;

  const intervalId = setInterval(() => {
    const threadContainer = document.querySelector('.p-flexpane__body .c-scrollbar__hider');
    if (threadContainer) {
      const currentScrollTop = threadContainer.scrollTop;
      const maxScrollTop = threadContainer.scrollHeight - threadContainer.clientHeight;

      threadContainer.scrollTop = maxScrollTop;

      if (currentScrollTop === lastScrollTop) {
        attempts++;
      } else {
        lastScrollTop = currentScrollTop;
        attempts = 0;
      }

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        console.log('Max attempts reached. Stopping scroll.');
      }

      if (currentScrollTop >= maxScrollTop) {
        clearInterval(intervalId);
        console.log('Reached the bottom of the thread.');
      }

    } else {
      clearInterval(intervalId);
      console.log('Slack thread container not found.');
    }
  }, 1000);
}
