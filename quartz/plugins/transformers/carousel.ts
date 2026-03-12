import { QuartzTransformerPlugin } from "../types"
// @ts-ignore
import carouselScript from "../../components/scripts/carousel.inline"
import carouselStyle from "../../components/styles/carousel.inline.scss"

export const Carousel: QuartzTransformerPlugin<any> = () => {
  return {
    name: "Carousel",
    externalResources() {
      return {
        css: [{ content: carouselStyle, inline: true }],
        js: [{
          script: carouselScript,
          loadTime: "afterDOMReady",
          contentType: "inline",
        }],
      }
    },
  }
}

