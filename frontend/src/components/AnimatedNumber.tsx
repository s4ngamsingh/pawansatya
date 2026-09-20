import React, { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const motionVal = useMotionValue(value);
  const springVal = useSpring(motionVal, { damping: 28, stiffness: 180 });
  const displayVal = useTransform(springVal, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  return <motion.span className={className}>{displayVal}</motion.span>;
};

export default AnimatedNumber;
