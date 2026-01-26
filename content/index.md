---
title: CATALOGUE
lastmod: YYYY-MM-DD
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
async function initStats() {
  const countEl = document.getElementById("stats-count");
  const updateEl = document.getElementById("stats-updated");
  if (!countEl || countEl.dataset.loaded === "true") return;

  // 定义所有可能的路径补全方式
  const possiblePaths = [
    "static/contentIndex.json",
    "../static/contentIndex.json",
    "/quartz/static/contentIndex.json",
    "/quartz/quartz/static/contentIndex.json"
  ];

  for (const path of possiblePaths) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        const index = await res.json();
        const pages = Object.values(index);
        
        // 1. 统计文章数目
        const postCount = pages.filter(p => {
          return p.title && 
                 p.title.toLowerCase() !== "index" && 
                 p.slug && !p.slug.startsWith("tags/");
        }).length;
        countEl.innerText = postCount;

        // 2. 统计最后更新时间
        const dates = pages.map(p => new Date(p.date)).filter(d => !isNaN(d));
        if (dates.length > 0) {
          const latest = new Date(Math.max(...dates));
          const diffDays = Math.floor((new Date() - latest) / (1000 * 60 * 60 * 24));
          updateEl.innerText = diffDays === 0 ? "今天" : `${diffDays} 天前`;
        }
        
        countEl.dataset.loaded = "true";
        console.log("Stats loaded from: " + path);
        return; // 成功后跳出循环
      }
    } catch (e) {
      continue; // 尝试下一个路径
    }
  }
  countEl.innerText = "读取失败";
}

document.addEventListener("nav", initStats);
window.addEventListener("load", initStats);
initStats();
</script>