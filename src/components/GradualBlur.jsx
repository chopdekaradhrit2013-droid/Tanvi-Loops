import React, { useEffect, useRef, useState, useMemo } from 'react'
import './GradualBlur.css'

const DEFAULT_CONFIG = {
  position: 'bottom', strength: 2, height: '6rem', divCount: 5, exponential: false,
  zIndex: 40, animated: false, duration: '0.3s', easing: 'ease-out', opacity: 1,
  curve: 'linear', responsive: false, target: 'parent', className: '', style: {},
}
const PRESETS = {
  top: { position: 'top', height: '6rem' },
  bottom: { position: 'bottom', height: '6rem' },
  header: { position: 'top', height: '8rem', curve: 'ease-out' },
  footer: { position: 'bottom', height: '8rem', curve: 'ease-out' },
  'page-header': { position: 'top', height: '7rem', target: 'page', strength: 2 },
  'page-footer': { position: 'bottom', height: '7rem', target: 'page', strength: 2 },
}
const CURVE_FUNCTIONS = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - Math.pow(1 - p, 2),
}
const mergeConfigs = (...configs) => configs.reduce((acc, c) => ({ ...acc, ...c }), {})
const getGradientDirection = (position) => ({ top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' }[position] || 'to bottom')

function GradualBlur(props) {
  const containerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const config = useMemo(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {}
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props)
  }, [props])

  const blurDivs = useMemo(() => {
    const divs = []
    const increment = 100 / config.divCount
    const currentStrength = isHovered && config.hoverIntensity ? config.strength * config.hoverIntensity : config.strength
    const curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear
    for (let i = 1; i <= config.divCount; i++) {
      let progress = curveFunc(i / config.divCount)
      const blurValue = config.exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * config.divCount + 1) * currentStrength
      const p1 = Math.round((increment * i - increment) * 10) / 10
      const p2 = Math.round(increment * i * 10) / 10
      const p3 = Math.round((increment * i + increment) * 10) / 10
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10
      let gradient = `transparent ${p1}%, black ${p2}%`
      if (p3 <= 100) gradient += `, black ${p3}%`
      if (p4 <= 100) gradient += `, transparent ${p4}%`
      const direction = getGradientDirection(config.position)
      divs.push(
        <div key={i} style={{
          position: 'absolute', inset: 0,
          maskImage: `linear-gradient(${direction}, ${gradient})`,
          WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
          backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
          WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
          opacity: config.opacity,
        }} />,
      )
    }
    return divs
  }, [config, isHovered])

  const containerStyle = useMemo(() => {
    const isVertical = ['top', 'bottom'].includes(config.position)
    const isPageTarget = config.target === 'page'
    const baseStyle = {
      position: isPageTarget ? 'fixed' : 'absolute',
      pointerEvents: config.hoverIntensity ? 'auto' : 'none',
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style,
    }
    if (isVertical) {
      baseStyle.height = config.height
      baseStyle.width = config.width || '100%'
      baseStyle[config.position] = 0
      baseStyle.left = 0
      baseStyle.right = 0
    }
    return baseStyle
  }, [config])

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'} ${config.className || ''}`}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="gradual-blur-inner">{blurDivs}</div>
    </div>
  )
}

export default React.memo(GradualBlur)
