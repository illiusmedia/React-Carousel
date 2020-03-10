import { Hidden } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type CarouselProps = {
  items: React.ReactElement[]
  width?: number
}

export const Carousel = ({ items, width }: CarouselProps) => {
  const offset = 15 //calibrate the Slider width (for margins and so on)
  const [totalSteps, setTotalSteps] = useState(0)
  const [showNextButton, setShowNextButton] = useState(false)
  const [showPreviousButton, setShowPreviousButton] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const SliderRef = useRef(null)
  const references = Array(items.length)
    .fill(0)
    .map(() => useRef(null))

  React.useEffect(() => {
    calculateSteps()
  }, [])

  React.useEffect(() => {
    window.addEventListener('resize', calculateSteps)
    ;() => window.removeEventListener('resize', calculateSteps)
  }, [references, window.innerWidth])

  const calculateSteps = () => {
    setScrollPosition(0)
    let _steps = 0
    const sliderWidth = SliderRef.current.offsetWidth + offset
    let slidesWidth = 0

    let temp = 0
    references.forEach(r => {
      slidesWidth += r.current.offsetWidth
      if (sliderWidth > slidesWidth && sliderWidth > temp) {
        temp += slidesWidth
      } else {
        _steps++
      }
    })
    console.log('STEPS: ' + _steps)

    setShowNextButton(_steps > 0 && sliderWidth < slidesWidth)
    // setShowPreviousButton(scrollPosition != 0 && _steps > 0 && _steps < totalSteps)
    setTotalSteps(_steps)
  }

  const step = (value: number) => {
    let step = scrollPosition + value

    if (step >= totalSteps) {
      setShowNextButton(false)
      setShowPreviousButton(true)
    }
    if (step <= 0) {
      setShowPreviousButton(false)
    }
    if (step < totalSteps) {
      setShowNextButton(true)
    }
    if (step > 0 && step <= totalSteps) {
      setShowPreviousButton(true)
    }

    setScrollPosition(step)
  }

  useEffect(() => {
    if (references[scrollPosition]) {
      references[scrollPosition].current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      })
    }
  }, [scrollPosition])

  const carousel = (
    <Slider ref={SliderRef} width={width}>
      {items && items.length > 1 && (
        <Hidden only={['xs']}>
          <SlideButton
            style={{ display: showPreviousButton ? 'block' : 'none', left: '5px' }}
            onClick={() => step(-1)}
          >
            {'<'}
          </SlideButton>
          <SlideButton
            style={{ display: showNextButton ? 'block' : 'none', right: '5px' }}
            onClick={() => step(1)}
          >
            {'>'}
          </SlideButton>
        </Hidden>
      )}
      <Slides>
        {items &&
          items.map((item: any, index: number) => (
            <Slide key={index} id={`slide-${index}`} ref={references[index]}>
              {item}
            </Slide>
          ))}
      </Slides>
    </Slider>
  )

  return carousel
}

const SlideButton = styled.button`
  background: white;
  text-decoration: none;
  border-radius: 50%;
  border: none;
  box-shadow: 4px 5px 11px -4px rgba(0, 0, 0, 0.6);
  margin: 0 0 0.5rem 0;
  z-index: 2;
  height: 45px;
  width: 45px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  cursor: pointer;
`
const Slider = styled.div`
  width: ${({ width }: { width: number }) => (width > 0 ? width + 'px' : '100%')};
  position: relative;
  display: inline-grid;
  overflow: hidden;
  ${SlideButton}
`
const Slide = styled.div``
const Slides = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    background: black;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  ${Slide} {
    scroll-snap-align: start;
    flex-shrink: 0;
    transform-origin: center center;
    transition: transform 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
