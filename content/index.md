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

 
<!-- QueryToSerialize: TABLE WITHOUT ID file.link AS "名称", file.folder AS "所属文件夹", dateformat(file.mtime, "yyyy-MM-dd") AS "最近更新" FROM "" AND -"Private" WHERE file.name != this.file.name AND file.name != "index" AND file.name != "欢迎" AND draft != true SORT file.mtime DESC LIMIT 5 -->
<!-- SerializedQuery: TABLE WITHOUT ID file.link AS "名称", file.folder AS "所属文件夹", dateformat(file.mtime, "yyyy-MM-dd") AS "最近更新" FROM "" AND -"Private" WHERE file.name != this.file.name AND file.name != "index" AND file.name != "欢迎" AND draft != true SORT file.mtime DESC LIMIT 5 -->

| 名称                                             | 所属文件夹                | 最近更新       |
| ---------------------------------------------- | -------------------- | ---------- |
| [[260316]]          | Interviews/wave      | 2026-03-22 |
| [[260303]]       | Interviews/Potatoi   | 2026-03-22 |
| [[UPCOMING]]                      |                      | 2026-03-20 |
| [[Pre-show]] | WTE ARCHIVE/Playlist | 2026-03-20 |
| [[260313-A]]   | Interviews/Potatoi   | 2026-03-20 |

<!-- SerializedQuery END -->



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

