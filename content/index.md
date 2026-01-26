---
title: CATALOGUE
lastmod: YYYY-MM-DD
banner: WTE ARCHIVES/FILES/vid&pics/CATALOGUE-1.png
icon-image: WTE ARCHIVES/FILES/vid&pics/CATALOGUE-2.png
banner-height: 370
banner-x: 50
banner-y: 75
banner-fade: 0
icon-x: 51
icon-size: 200
icon-y: -100
icon-image-size-multiplier: 1.6
icon-rotate: 5
icon-padding-x: 10
content-start: 291
banner-radius: 21
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
```

文本文本  
文本文案  

<div class="site-stats-card">
  <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> Archive Info</h3>
  
  <div class="stats-item">
    <span>文章数目：</span>
    <span id="stats-count">读取中...</span>
  </div>
  
<div class="stats-item">
    <span>最后更新：</span>
    <span id="stats-updated">读取中...</span>
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
document.addEventListener("nav", async () => {
  const countEl = document.getElementById("stats-count");
  const updateEl = document.getElementById("stats-updated");
  if (!countEl) return;

  try {
    const res = await fetch("/static/contentIndex.json");
    const index = await res.json();
    const pages = Object.values(index);
    countEl.innerText = pages.filter(p => p.title !== "index").length;

    const dates = pages.map(p => new Date(p.date)).filter(d => !isNaN(d));
    if (dates.length > 0) {
      const latest = new Date(Math.max(...dates));
      const diffDays = Math.floor((new Date() - latest) / (1000 * 60 * 60 * 24));
      updateEl.innerText = diffDays === 0 ? "今天" : `${diffDays} 天前`;
    }
  } catch (e) { console.error(e); }
});
</script>

