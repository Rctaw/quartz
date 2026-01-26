---
title: CATALOGUE
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
# *Last Upadated File*

```dataview
TABLE file.mtime AS "Last Updated"
FROM "WTE ARCHIVES/FILES"
WHERE file.name != this.file.name
SORT file.mtime DESC
LIMIT 5
```
