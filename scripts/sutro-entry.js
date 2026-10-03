// MAIN world: only public player UI, never extension APIs, service credentials or ASR requests.
import '@player.style/sutro';
import 'media-chrome/dist/lang/zh-CN.js';

const configured = new WeakSet();
function configure() {
  const theme = document.querySelector('#icp-panel media-theme-sutro');
  const controller = theme?.shadowRoot?.querySelector('media-controller');
  if (!controller || configured.has(controller)) return;
  configured.add(controller);
  controller.lang = 'zh-CN';
  controller.setAttribute('nohotkeys', '');
  controller.fullscreenElement = theme.closest('.icp-main');
  controller.querySelector('media-playback-rate-menu')?.setAttribute('rates', '0.75 1 1.25 1.5 1.75 2 2.5 3');
  const menu = controller.querySelector('media-settings-menu');
  if (menu) {
    const labels = {'Speed':'速度','Playback Speed':'速度','Quality':'画质','Captions':'字幕','Subtitles/CC':'字幕'};
    for (const item of menu.querySelectorAll(':scope > media-settings-menu-item')) {
      for (const node of item.childNodes) {
        if (node.nodeType === 3 && labels[node.textContent.trim()]) node.textContent = labels[node.textContent.trim()];
      }
    }
    for (const title of menu.querySelectorAll('[slot=title]')) {
      if (labels[title.textContent.trim()]) title.textContent = labels[title.textContent.trim()];
    }
    const item = document.createElement('media-settings-menu-item');
    item.textContent = '识别与人声增强';
    item.addEventListener('click', () => {
      menu.hidden = true;
      theme.dispatchEvent(new Event('icp-settings-request', {bubbles:true,composed:true}));
    });
    menu.append(item);
  }
  const video = theme.querySelector('video');
  if (video) video.controls = false;
  theme.setAttribute('data-icp-ready', 'true');
}
// The isolated content script creates the host later; the observer also handles host replacement.
new MutationObserver(configure).observe(document, {childList:true,subtree:true});
configure();
