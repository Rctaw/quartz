import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { Options } from "./quartz/components/Explorer"
import ScheduleWidget from "./quartz/components/ScheduleWidget"


  // 自定义explorer排序逻辑
  export const mySortFn: Options["sortFn"] = (a, b) => {
  const topItems = ["SCHEDULE", "DISCOGRAPHY", "WTE ARCHIVE"]
  // 强力置顶逻辑
  const nameA = (a.name || a.displayName || "").toUpperCase()
  const nameB = (b.name || b.displayName || "").toUpperCase()
  const topItemsUpper = topItems.map(i => i.toUpperCase())
  const isATop = topItemsUpper.some(item => nameA.includes(item))
  const isBTop = topItemsUpper.some(item => nameB.includes(item))
  if (isATop && !isBTop) return -1
  if (!isATop && isBTop) return 1
  // 如果两者都在置顶列表中，按它们在 topItems 里的先后顺序排
  if (isATop && isBTop) {
    const indexA = topItemsUpper.findIndex(item => nameA.includes(item))
    const indexB = topItemsUpper.findIndex(item => nameB.includes(item))
    if (indexA !== indexB) return indexA - indexB
  }
  // 文件夹 vs 文件 逻辑
  const aIsFolder = a.children && a.children.length > 0
  const bIsFolder = b.children && b.children.length > 0
  if (aIsFolder && !bIsFolder) return -1
  if (!aIsFolder && bIsFolder) return 1
  // 字母排序为基础
  return (a.displayName || a.name || "").localeCompare((b.displayName || b.name || ""), "zh-CN", { 
    numeric: true, 
    sensitivity: "base" 
  })
}

// 自定义explorer文件夹图标映射
export const myMapFn: Options["mapFn"] = (node) => {
  const customIcons: Record<string, string> = {
    "INTERVIEWS": "📜",
    "POTATOI": "🥔",
    "SCHEDULE": "📆",
    "TMI": "🍬",
    "PLAYLIST": "🎧",
    "CREDITS": "ℹ️",
    "WAVE": "🌊",
    "POLES": "🎱",
    "GEARS": "🎛",
    "ECHOES": "✨",
    "PIECES OF THE PROCESS": "🧩",
    "DISCOGRAPHY": "💽",
    "WAVE 0.01": "🍁",
    "SUMMER FLOWS 0.02": "🌊",
    "0.1 FLAWS AND ALL.": "◑",
    "PLAY WITH EARTH! 0.03": "📽️",
    "BAD PIECES": "🤍",
    "DAISY.": "🌼",
    "MIND WAVES": "💭",
  }


// 获取处理后的名称：去掉后缀并转大写
  const rawName = (node.displayName || node.name || "")
  const name = rawName.replace(/\.md$/, "").toUpperCase()

  // 核心修正：使用直接索引（全字匹配）
  const icon = customIcons[name]
  if (icon) {
    node.displayName = icon + " " + node.displayName
  } else if (node.children && node.children.length > 0) {
    // 默认文件夹图标
    node.displayName = "🗃 " + node.displayName
  } else {
    // 默认文件图标
    node.displayName = "🌏 " + node.displayName
  }
}


// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "An archive by Rctaw": "https://wtearchive.vercel.app",
      //"GitHub": "https://github.com/jackyzha0/quartz",
      "Bilbili": "https://space.bilibili.com/3546392184228487",
     "回到顶部 ↑": "#", // 只要链接是 "#"，点击就会自动回到页面顶部
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta({
      showCreated: true,   //
      showModified: true,  // 如果你也想保留修改时间
    }),
    Component.TagList(),
    ScheduleWidget(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "CATALOGUE",
      folderDefaultState: "collapsed", 
      useSavedState: true,
      sortFn: mySortFn, // 直接引用上面的函数名
      mapFn: myMapFn,   // 直接引用上面的函数名
}),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "CATALOGUE",
      folderDefaultState: "collapsed", 
      useSavedState: true,
      sortFn: mySortFn, // 直接引用上面的函数名
      mapFn: myMapFn,   // 直接引用上面的函数名
}),
  ],
  right: [],
}
