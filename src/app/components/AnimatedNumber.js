'use client';

import { useState, useEffect } from 'react';

export default function AnimatedNumber({ value, duration = 1000 }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (typeof value !== 'number') return;

    const stepTime = Math.abs(Math.floor(duration / value));
    let timer;

    const updateValue = () => {
      setCurrentValue(prevValue => {
        const nextValue = prevValue + 1;
        if (nextValue < value) {
          timer = setTimeout(updateValue, stepTime);
          return nextValue;
        } else {
          return value;
        }
      });
    };

    timer = setTimeout(updateValue, stepTime);

    return () => clearTimeout(timer);
  }, [value, duration]);

  return (
    <>
      {currentValue}
    </>
  );
} 