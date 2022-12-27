import "./styles.css";
import * as React from "react";
import { useState } from "react";
import { save, cancel, check } from "./paths";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimationPlaybackControls,
  useAnimationControls
} from "framer-motion";
import { getIndex, useFlubber } from "./use-flubber";
// import { CheckCircleOutline, Save, Cancel  } from '@mui/icons-material'
import { Button, Stack } from "@mui/material";

const paths = [save, check, save, cancel];
const colors = ["#0099ff", "#00cc88", "#0099ff", "#ff0055"];

export default function App() {
  const animationControl = useAnimationControls();
  const [pathIndex, setPathIndex] = useState(0);
  const progress = useMotionValue(pathIndex);
  const opacity = useMotionValue(1);
  const fill = useTransform(progress, paths.map(getIndex), colors);
  const path = useFlubber(progress, paths);

  let opacityAnimation = React.useRef<AnimationPlaybackControls | null>(null);

  const setSaving = () => {
    animationControl.animate(opacity, 1, {
      duration: 0.5,
      onComplete: () => {
        if (
          opacityAnimation.current &&
          opacityAnimation.current.isAnimating()
        ) {
          return;
        }
        opacityAnimation.current = animate(opacity, [1, 0.8, 1], {
          repeat: Infinity
        });
      }
    });
  };

  const setSuccess = () => {
    if (opacityAnimation.current) {
      opacityAnimation.current.stop();
      opacity.set(1);
    }
    progress.set(0);
    animate(progress, 1, {
      duration: 1,
      ease: "easeInOut",
      onComplete: () => {
        animate(opacity, 0, {
          delay: 1,
          duration: 1
        });
      }
    });
  };

  const setFailure = () => {
    if (opacityAnimation.current) {
      opacityAnimation.current.stop();
      opacity.set(1);
    }
    progress.set(2);
    animate(progress, 3, {
      duration: 1,
      ease: "easeInOut"
    });
  };

  // React.useEffect(() => {
  //   const animation = animate(progress, [0, 1, 0], {
  //     duration: 4,
  //     ease: "easeInOut"
  //     // onComplete: () => {
  //     //   if (pathIndex === paths.length - 1) {
  //     //     progress.set(0);
  //     //     setPathIndex(1);
  //     //   } else {
  //     //     setPathIndex(pathIndex + 1);
  //     //   }
  //     // }
  //   });

  //   return () => animation.stop();
  // }, [pathIndex]);

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={setSaving}>
          Saving
        </Button>
        <Button variant="contained" color="success" onClick={setSuccess}>
          Success
        </Button>
        <Button variant="contained" color="error" onClick={setFailure}>
          Failed
        </Button>
      </Stack>
      <svg width="400" height="400">
        <g transform="translate(10 10) scale(17 17)">
          <motion.path fill={fill} d={path} opacity={opacity} />
        </g>
      </svg>
    </>
  );
}
