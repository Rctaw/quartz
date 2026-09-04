---
title: CATALOGUE
---
***Tracing small pieces of the wave.***

```
  ,-.       _,---._ __  / \
 /  )    .-'       `./ /   \
(  (   ,'            `/    /|
 \  `-"             \'\   / |
  `.              ,  \ \ /  |
   /`.          ,'-`----Y   |
  (            ;        |   '
  |  ,-.    ,-'         |  /
  |  | (   |        WTE | /
  )  |  \  `.___________|/
  `--'   `--'
                            
                        Beck翻出的贴纸一枚⬇️
```

  <div style='display: flex; justify-content: center; align-items: center; width: 100%; margin: 0.5rem 0; overflow: hidden;'>
  <sticker-forge 
    id='my-sticker' 
    style='display: block; width: 100%; max-width: 640px; aspect-ratio: 2 / 1; height: auto; transform: scale(2); transform-origin: center;'>
  </sticker-forge>
</div>

<script type='module'>
  async function initSticker() {
    const sticker = document.querySelector('#my-sticker');
    if (!sticker || sticker.dataset.initialized) return;

    // 标记已初始化，防止重复加载重绘
    sticker.dataset.initialized = 'true';

    // 等待 web component 注册完毕
    await customElements.whenDefined('sticker-forge');

    // 1. 设置图片资源路径
    await sticker.setSource({
      'type': 'image',
      'src': '/static/stickers/bad piecesholo.png',
      'name': 'bad piecesholo.png'
    });

    // 2. 配置贴纸参数
    sticker.setOptions({
      'outline': { 'width': 0, 'color': '#d4d1ff' },
      'edge': { 'width': 1.5, 'strength': 0.28 },
      'shadow': { 'opacity': 0.25, 'blur': 25, 'distance': 16, 'angle': 42, 'color': '#191823' },
      'lighting': {
        'direction': { 'x': -0.728804779938843, 'y': -0.42973295736811307, 'z': 0.5330789604645358 },
        'intensity': 1, 'ambient': 0.7, 'softness': 0.5
      },
      'peel': { 'radius': 0.12, 'stiffness': 0.65, 'grabWidth': 22, 'maxAngle': 3.55, 'release': 'snap' },
      'sound': { 'enabled': true, 'volume': 0.5 },
      'back': { 'color': '#b8e6ff', 'gloss': 0.7, 'roughness': 0.3 },
      'material': {
        'type': 'holographic', 'intensity': 0.86, 'scale': 2.1, 'holographicGrain': 0.4, 'seed': 0.61,
        'holographicColors': [ '#c3f944', '#6ef2f5', '#ed77ec' ]
      },
      'tilt': 0, 'wind': 0.35, 'quality': 'high'
    });

    // ==========================================
    // 撕下贴纸后跳转的监听逻辑
    // ==========================================
    
    // 目标笔记的相对路径（注意：请修改为你实际想要跳转的路径！）
    const targetUrl = '/WTE-ARCHIVE/ECHOES/Behind-the-Song/WTE/bad-pieces'; 

    const bindShadowEvents = () => {
      const shadowRoot = sticker.shadowRoot;
      // 穿透寻找内部真实的交互元素（Canvas 或组件根节点）
      const targetElement = shadowRoot ? (shadowRoot.querySelector('canvas') || shadowRoot) : sticker;

      targetElement.addEventListener('pointerup', () => {
        // 延迟 400ms，让撕纸动画飞一会儿再跳转，视觉体验更好
        setTimeout(() => {
          if (window.spaNavigate) {
            // Quartz 无刷新 SPA 跳转
            window.spaNavigate(new URL(targetUrl, location.origin));
          } else {
            // 标准跳转兜底
            window.location.href = targetUrl;
          }
        }, 1800);
      });
    };

    // 确保 Web Component 内部 DOM（Canvas）已渲染后再绑定事件
    if (sticker.shadowRoot?.querySelector('canvas')) {
      bindShadowEvents();
    } else {
      setTimeout(bindShadowEvents, 300);
    }
    // ==========================================
  }

  // 兼容直接刷新页面与 SPA 路由跳转
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSticker);
  } else {
    initSticker();
  }
  document.addEventListener('nav', initSticker);
</script>    



<!-- QueryToSerialize: TABLE WITHOUT ID file.link AS "笔记", file.folder AS "所属文件夹", dateformat(file.mtime, "yyyy-MM-dd") AS "最近更新" FROM "" AND -"Private" WHERE file.name != this.file.name AND file.name != "index" AND file.name != "Credits" AND draft != true SORT file.mtime DESC LIMIT 5 -->
<!-- SerializedQuery: TABLE WITHOUT ID file.link AS "笔记", file.folder AS "所属文件夹", dateformat(file.mtime, "yyyy-MM-dd") AS "最近更新" FROM "" AND -"Private" WHERE file.name != this.file.name AND file.name != "index" AND file.name != "Credits" AND draft != true SORT file.mtime DESC LIMIT 5 -->

| 笔记                                    | 所属文件夹           | 最近更新       |
| ------------------------------------- | --------------- | ---------- |
| [[Schedule]]             |                 | 2026-09-04 |
| [[260518]] | Interviews/wave | 2026-09-04 |
| [[采访节选]]     | Interviews/wave | 2026-08-29 |
| [[260817]] | Interviews/wave | 2026-08-25 |
| [[250212]] | Interviews/wave | 2026-08-22 |

<!-- SerializedQuery END -->


> [!tips]
> **◈**点击***左侧的logo(移动端位于最顶部)*** 即可快速回到此目录页面  
> P.S. ***logo***  出自👇😎  
> ![](./vid-pics/index-1.gif)  
> **◈**搜索结果的显示数量上限为**10** **◈**

<div class="site-stats-card">
  <h3>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
    </svg> 
    Archive Info
  </h3>
  
  <div class="stats-item">
    <span>文章数目：</span>
    <span id="stats-count">读取中...</span>
  </div>
  
  <div class="stats-item">
    <span>总访问量：</span>
    <span id="busuanzi_value_site_pv">--</span>
  </div>
  
  <div class="stats-item">
    <span>总访客数：</span>
    <span id="busuanzi_value_site_uv">--</span>
  </div>
</div>

<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>

<script>
async function initStats() {
  var countEl = document.getElementById('stats-count');
  if (!countEl) return;
  if (countEl.dataset.loaded === 'true') return;

  var isLocal = window.location.hostname.includes('localhost');
  var path = isLocal ? '/static/contentIndex.json' : '/quartz/static/contentIndex.json';

  try {
    var res = await fetch(path);
    if (!res.ok) return;
    
    var index = await res.json();
    var pages = Object.values(index);
    
    // 过滤逻辑：排除主页和标签页
    var filtered = pages.filter(function(p) {
      if (!p.title) return false;
      if (p.title.toLowerCase() === 'index') return false;
      if (p.slug) {
        if (p.slug.startsWith('tags/')) return false;
      }
      return true;
    });
    
    countEl.innerText = filtered.length;
    countEl.dataset.loaded = 'true';
  } catch (e) {
    console.error('Stats fail');
    countEl.innerText = '暂无数据';
  }
}

// 适配 Quartz 的 SPA 路由导航
document.addEventListener('nav', initStats);
window.addEventListener('load', initStats);
initStats();
</script>  

