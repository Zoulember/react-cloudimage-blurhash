import React, { useEffect, useRef, useMemo, useContext } from 'react'
import cxs from 'cxs'

// Context
import { ReactCloudimageContext } from '../ReactCloudimageProvider'

// Utils
import clsx from 'clsx'
import { decode } from 'blurhash'

// Types
import { PlaceholderBlurhashProps } from './types'

const PlaceholderBlurhash: React.FC<PlaceholderBlurhashProps & React.HTMLAttributes<HTMLCanvasElement>> = (props) => {
  const { hash, isMainImageLoaded, classes, className, ...otherProps } = props
  const reactCloudimageBlurhashContext = useContext(ReactCloudimageContext)

  const blurhashCanvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (blurhashCanvas) {
      const pixels = decode(hash, 32, 32)

      const ctx = blurhashCanvas.current?.getContext('2d')
      if (ctx) {
        const imageData = ctx.createImageData(32, 32)
        imageData.data.set(pixels!)
        ctx.putImageData(imageData, 0, 0)
      }
    }
  }, [hash, blurhashCanvas])

  const css = {
    placeholderImage: cxs({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 10,
      width: '100%',
      height: '100%',
      opacity: 1,
      backgroundColor: reactCloudimageBlurhashContext.theme?.placeholderBackgroundColor ?? 'lightgrey',
      '.is-loaded': {
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out 0s',
      },
    }),
  }

  return useMemo(
    () => (
      <canvas
        ref={blurhashCanvas}
        className={clsx(css.placeholderImage, className, classes?.placeholderImage, {
          'is-loaded': isMainImageLoaded,
        })}
        {...otherProps}
        height="32"
        width="32"
      />
    ),
    [classes, className, isMainImageLoaded, otherProps]
  )
}

export default PlaceholderBlurhash
