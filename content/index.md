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

  try {
    // 核心修改：使用绝对路径，并增加缓存刷新后缀
    // 既然你在浏览器输入这个路径报 404，但仓库里又有，说明是路径解析层级问题
    // 我们尝试使用最稳妥的根路径写法
    const indexPath = "/quartz/static/contentIndex.json?v=" + new Date().getTime();

    const res = await fetch(indexPath);
    if (!res.ok) throw new Error("Fetch failed");
    
    const index = await res.json();
    const pages = Object.values(index);
    
    // 1. 统计文章数目
    const postCount = pages.filter(p => {
      const isContent = p.title && p.title.toLowerCase() !== "index";
      const isNotTag = !p.slug.startsWith("tags/"); 
      return isContent && isNotTag;
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
  } catch (e) {
    console.error("Stats Error:", e);
    // 最后的温柔：如果还是读不到，尝试去除 /quartz 前缀
    if (countEl.innerText === "读取中...") {
      fetch("/static/contentIndex.json").then(r => r.json()).then(data => {
         // ... 重复一遍逻辑 (由于此处较长，建议先试上面的路径)
      }).catch(() => { countEl.innerText = "数据暂时不可用"; });
    }
  }
}

document.addEventListener("nav", initStats);
window.addEventListener("load", initStats);
initStats();
</script>