import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  // 无渲染内容的静默逻辑组件
  const CountdownScript: QuartzComponent = () => null

  CountdownScript.afterDOMLoaded = `
    const initCountdowns = () => {
      const widgets = document.querySelectorAll('.countdown-widget')
      widgets.forEach((box) => {
        const targetStr = box.getAttribute('data-target') || '2026-12-31 23:59:59'
        
        // 修正跨浏览器日期解析：斜杠分隔 + 空格代替 T
        const formattedStr = targetStr.replace(/-/g, '/').replace('T', ' ')
        const target = new Date(formattedStr).getTime()

        if (isNaN(target)) return

        const update = () => {
          const now = Date.now()
          const diff = target - now

          if (diff <= 0) {
            box.innerHTML = "<div class='countdown-finished'>🎉 go and stream bad pieces！</div>"
            return
          }

          const d = Math.floor(diff / 86400000)
          const h = Math.floor((diff % 86400000) / 3600000)
          const m = Math.floor((diff % 3600000) / 60000)
          const s = Math.floor((diff % 60000) / 1000)

          const elD = box.querySelector('.cd-d')
          const elH = box.querySelector('.cd-h')
          const elM = box.querySelector('.cd-m')
          const elS = box.querySelector('.cd-s')

          if (elD) elD.textContent = String(d).padStart(2, '0')
          if (elH) elH.textContent = String(h).padStart(2, '0')
          if (elM) elM.textContent = String(m).padStart(2, '0')
          if (elS) elS.textContent = String(s).padStart(2, '0')
        }

        update()
        setInterval(update, 1000)
      })
    }

    document.addEventListener('nav', initCountdowns)
    initCountdowns()
  `

  return CountdownScript
}) satisfies QuartzComponentConstructor