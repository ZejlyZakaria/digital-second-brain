/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useRef, cloneElement, isValidElement } from 'react';
import HoverTooltip from './HoverTooltip';
import Portal from '../portal/Portal';

interface OverflowTooltipWrapperProps {
  text: string;
  children: React.ReactNode;
  wordsPerLine?: number;
  className?: string;
  tooltipClassName?: string;
  forceTooltip?: boolean; // 👈 nouvelle prop pour forcer l'affichage du tooltip
}

const OverflowTooltipWrapper: React.FC<OverflowTooltipWrapperProps> = ({
  text,
  children,
  // wordsPerLine = 8,
  className = '',
  tooltipClassName = '',
  forceTooltip = false,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ bottom: 0, left: 0 });

  const isTruncated = (el: HTMLElement | null) => {
    if (!el) return false;
    return el.scrollWidth > el.clientWidth;
  };

  const isInput = (el: HTMLElement | null) => {
    return el?.tagName === 'INPUT';
  };

  const handleMouseEnter = () => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const gap = 12;

    setPosition({
      bottom: window.innerHeight - rect.top + gap,
      left: rect.left + rect.width / 2,
    });

    if (forceTooltip) {
      setShowTooltip(true);
      return;
    }

    if (isInput(ref.current)) {
      const input = ref.current as HTMLInputElement;
      if (input.value.length > 0 && isTruncated(ref.current)) {
        setShowTooltip(true);
      } else {
        setShowTooltip(isTruncated(ref.current));
      }
    } else {
      setShowTooltip(isTruncated(ref.current));
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleInput = () => {
    if (ref.current && isInput(ref.current)) {
      setShowTooltip(false);
    }
  };

  const child = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        ref: (node: HTMLElement) => {
          ref.current = node;
          const { ref: originalRef } = children as any;
          if (typeof originalRef === 'function') originalRef(node);
          else if (originalRef && typeof originalRef === 'object') originalRef.current = node;
        },
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleMouseEnter,
        onBlur: handleMouseLeave,
        onInput: handleInput,
        className: `${(children as any).props.className || ''} ${className}`,
      })
    : children;

  return (
    <>
      {child}
      {showTooltip && (
        <Portal>
          <div
            style={{
              position: 'fixed',
              bottom: `${position.bottom}px`,
              left: `${position.left}px`,
              transform: 'translateX(-50%)',
              zIndex: 9999,
            }}
          >
            <HoverTooltip text={text}  className={tooltipClassName} />
          </div>
        </Portal>
      )}
    </>
  );
};

export default OverflowTooltipWrapper;
