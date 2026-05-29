import { useState, useEffect } from 'react'
import { loadScript } from '../utils/scriptLoader'

export const useLibraries = () => {
  const [libsLoaded, setLibsLoaded] = useState(false)

  useEffect(() => {
    const initLibs = async () => {
      try {
        await Promise.all([
          loadScript('https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js'),
          loadScript('https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js'),
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
        ])
        setLibsLoaded(true)
      } catch (err) {
        console.error('Failed to load libraries', err)
      }
    }

    initLibs()
  }, [])

  return libsLoaded
}
