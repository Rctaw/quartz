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
  
  // 基础检查：如果找不到元素或已加载则退出
  if (!countEl || countEl.dataset.loaded === "true") return;

  try {
    // 强制指定路径：既然已知你的子路径是 /quartz/，我们直接写死这个路径
    // 这样无论是在首页还是刷新，都能精准找到文件
    const indexPath = "/quartz/static/contentIndex.json";

    const res = await fetch(indexPath);
    if (!res.ok) throw new Error("File not found");
    
    const index = await res.json();
    const pages = Object.values(index);
    
    // 1. 统计文章数目 (过滤掉 index 和 tags 等页面)
    const postCount = pages.filter(p => {
      const isContent = p.title && p.title.toLowerCase() !== "index";
      const isNotTag = !p.slug.startsWith("tags/"); // 排除标签页
      return isContent && isNotTag;
    }).length;
    
    countEl.innerText = postCount;

    // 2. 统计最后更新时间
    const dates = pages.map(p => new Date(p.date)).filter(d => !isNaN(d));
    if (dates.length > 0) {
      const latest = new Date(Math.max(...dates));
      const now = new Date();
      // 计算天数差
      const diffTime = Math.abs(now - latest);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      updateEl.innerText = diffDays === 0 ? "今天" : `${diffDays} 天前`;
    }
    
    // 标记为已加载
    countEl.dataset.loaded = "true";
  } catch (e) {
    console.error("Stats Error:", e);
    // 如果 /quartz/ 路径也失败，尝试备用相对路径
    if (countEl.innerText === "读取中...") {
      countEl.innerText = "重新尝试...";
      setTimeout(() => {
         // 尝试相对路径兜底
         fetch("static/contentIndex.json")
           .then(r => r.json())
           .then(data => { /* 重复逻辑... */ });
      }, 1000);
    }
  }
}

// 适配 Quartz 的导航逻辑
document.addEventListener("nav", initStats);
window.addEventListener("load", initStats);
initStats();
</script>