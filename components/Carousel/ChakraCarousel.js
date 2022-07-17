// adapted from https://codesandbox.io/s/dd8vn?file=/src/ChakraCarousel.js


//TODO: Properly handle user tabbing

import React, {
  useLayoutEffect,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef
} from "react";

import {
  useMediaQuery,
  useTheme,
  Progress,
  VStack,
  Button,
  Flex,
  Box,
  useColorModeValue
} from "@chakra-ui/react";

import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { useBoundingRect } from "./hooks";
import { percentage } from "../../utils/helpers";

const MotionFlex = motion(Flex);

const transitionProps = {
  stiffness: 400,
  type: "spring",
  damping: 60,
  mass: 3
};

const ChakraCarousel = ({ children, gap, activeCarouselItem, setActiveCarouselItem }) => {

  const [trackIsActive, setTrackIsActive] = useState(false);
  const [multiplier, setMultiplier] = useState(0.35);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [constraint, setConstraint] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const initSliderWidth = useCallback((width) => setSliderWidth(width), []);

  const positions = useMemo(
    () => children.map((_, index) => -Math.abs((itemWidth + gap) * index)),
    [children, itemWidth, gap]
  );

  const { breakpoints } = useTheme();

  const [isBetweenBaseAndMd] = useMediaQuery(
    `(min-width: ${breakpoints.base}) and (max-width: ${breakpoints.md})`
  );

  const [isBetweenMdAndXl] = useMediaQuery(
    `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.xl})`
  );

  const [isGreaterThanXL] = useMediaQuery(`(min-width: ${breakpoints.xl})`);

  useEffect(() => {
    if (isBetweenBaseAndMd) {
      setItemWidth(sliderWidth - gap);
      setMultiplier(0.65);
      setConstraint(1);
    }
    if (isBetweenMdAndXl) {
      setItemWidth(sliderWidth / 2 - gap);
      setMultiplier(0.5);
      setConstraint(2);
    }
    if (isGreaterThanXL) {
      setItemWidth(sliderWidth / 3 - gap);
      setMultiplier(0.35);
      setConstraint(3);
    }
  }, [isBetweenBaseAndMd, isBetweenMdAndXl, isGreaterThanXL, sliderWidth, gap]);

  const sliderProps = {
    setTrackIsActive,
    initSliderWidth,
    setActiveCarouselItem,
    activeCarouselItem,
    constraint,
    itemWidth,
    positions,
    gap
  };

  const trackProps = {
    setTrackIsActive,
    trackIsActive,
    setActiveCarouselItem,
    sliderWidth,
    activeCarouselItem,
    constraint,
    multiplier,
    itemWidth,
    positions,
    gap
  };

  const itemProps = {
    setTrackIsActive,
    trackIsActive,
    setActiveCarouselItem,
    activeCarouselItem,
    constraint,
    itemWidth,
    positions,
    gap
  };

  return (
    <Slider {...sliderProps}>
      <Track {...trackProps}>
        {children.map((child, index) => (
          <Item {...itemProps} index={index} key={index}>
            {child}
          </Item>
        ))}
      </Track>
    </Slider>
  );
};

const Slider = ({
  setTrackIsActive,
  initSliderWidth,
  setActiveCarouselItem,
  activeCarouselItem,
  constraint,
  itemWidth,
  positions,
  children,
  gap
}) => {
  const [ref, { width }] = useBoundingRect();

  useLayoutEffect(() => initSliderWidth(Math.round(width)), [
    width,
    initSliderWidth
  ]);

  const handleFocus = () => setTrackIsActive(true);

  const handleDecrementClick = () => {
    setTrackIsActive(true);
    (activeCarouselItem !== 0) &&
      setActiveCarouselItem((prev) => prev - 1);
  };

  const handleIncrementClick = () => {
    setTrackIsActive(true);
    (activeCarouselItem !== positions.length - constraint) &&
      setActiveCarouselItem((prev) => prev + 1);
  };

  return (
    <>
      <Flex w={`${itemWidth}px`} mb={`${gap / 2}px`} mx="auto">
        <Button
          onClick={handleDecrementClick}
          onFocus={handleFocus}
          mr={`${gap / 3}px`}
          color={useColorModeValue("blackAlpha.800", "gray.200")}
          variant="link"
          minW={0}
          aria-label='scroll left'
        >
          <ChevronLeftIcon boxSize={9} />
        </Button>

        <Progress
          value={percentage(activeCarouselItem, positions.length - constraint)}
          alignSelf="center"
          borderRadius="2px"
          bg={useColorModeValue("blackAlpha.300", "whiteAlpha.300")}
          flex={1}
          h="3px"
          // sx={{
          //   "> div": {
          //     backgroundColor: "gray.400"
          //   }
          // }}
          colorScheme={'green'}
          aria-label='progress bar'
        />

        <Button
          onClick={handleIncrementClick}
          onFocus={handleFocus}
          ml={`${gap / 3}px`}
          color={useColorModeValue("blackAlpha.800", "gray.200")}
          variant="link"
          zIndex={2}
          minW={0}
          aria-label='scroll right'
        >
          <ChevronRightIcon boxSize={9} />
        </Button>
      </Flex>
      <Box
        ref={ref}
        w={{ base: "100%", md: `calc(100% + ${gap}px)` }}
        ml={{ base: 0, md: `-${gap / 2}px` }}
        px={`${gap / 2}px`}
        position="relative"
        overflow="hidden"
        _before={{
          // bgGradient: "linear(to-r, blackAlpha.400, transparent)",
          position: "absolute",
          w: `${gap / 2}px`,
          content: "''",
          zIndex: 1,
          h: "100%",
          left: 0,
          top: 0
        }}
        _after={{
          // bgGradient: "linear(to-l, blackAlpha.400, transparent)",
          position: "absolute",
          w: `${gap / 2}px`,
          content: "''",
          zIndex: 1,
          h: "100%",
          right: 0,
          top: 0
        }}
      >
        {children}
      </Box>
    </>
  );
};

const Track = ({
  setTrackIsActive,
  trackIsActive,
  setActiveCarouselItem,
  activeCarouselItem,
  constraint,
  multiplier,
  itemWidth,
  positions,
  children
}) => {
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const node = useRef(null);

  const handleDragStart = () => setDragStartPosition(positions[activeCarouselItem]);

  const handleDragEnd = (_, info) => {
    const distance = info.offset.x;
    const velocity = info.velocity.x * multiplier;
    const direction = velocity < 0 || distance < 0 ? 1 : -1;

    const extrapolatedPosition =
      dragStartPosition +
      (direction === 1
        ? Math.min(velocity, distance)
        : Math.max(velocity, distance));

    const closestPosition = positions.reduce((prev, curr) => {
      return Math.abs(curr - extrapolatedPosition) <
        Math.abs(prev - extrapolatedPosition)
        ? curr
        : prev;
    }, 0);

    if ((closestPosition >= positions[positions.length - constraint])) {
      setActiveCarouselItem(positions.indexOf(closestPosition));
      controls.start({
        x: closestPosition,
        transition: {
          velocity: info.velocity.x,
          ...transitionProps
        }
      });
    } else {
      setActiveCarouselItem(positions.length - constraint);
      controls.start({
        x: positions[positions.length - constraint],
        transition: {
          velocity: info.velocity.x,
          ...transitionProps
        }
      });
    }
  };

  const handleResize = useCallback(
    () =>
      controls.start({
        x: positions[activeCarouselItem],
        transition: {
          ...transitionProps
        }
      }),
    [activeCarouselItem, controls, positions]
  );

  const handleClick = useCallback(
    (event) =>
      node.current?.contains(event.target)
        ? setTrackIsActive(true)
        : setTrackIsActive(false),
    [setTrackIsActive]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (trackIsActive) {
        if (activeCarouselItem < positions.length - constraint) {
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            setActiveCarouselItem((prev) => prev + 1);
          }
        }
        if (activeCarouselItem > 0) {
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            setActiveCarouselItem((prev) => prev - 1);
          }
        }
      }
    },
    [trackIsActive, setActiveCarouselItem, activeCarouselItem, constraint, positions.length]
  );

  useEffect(() => {
    handleResize(positions);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick, handleResize, handleKeyDown, positions]);

  return (
    <>
      {itemWidth && (
        <VStack ref={node} spacing={5} alignItems="stretch">
          <MotionFlex
            dragConstraints={node}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x }}
            drag="x"
            _active={{ cursor: "grabbing" }}
            minWidth="min-content"
            flexWrap="nowrap"
            cursor="grab"
          >
            {children}
          </MotionFlex>
        </VStack>
      )}
    </>
  );
};

const Item = ({
  setTrackIsActive,
  setActiveCarouselItem,
  activeCarouselItem,
  constraint,
  itemWidth,
  positions,
  children,
  index,
  gap
}) => {
  const [userDidTab, setUserDidTab] = useState(false);

  const handleFocus = () => setTrackIsActive(true);

  const handleBlur = () => {
    userDidTab && index + 1 === positions.length && setTrackIsActive(false);
    setUserDidTab(false);
  };

  const handleKeyUp = (event) =>
    event.key === "Tab" &&
    (activeCarouselItem !== positions.length - constraint) &&
    setActiveCarouselItem(index);

  const handleKeyDown = (event) => event.key === "Tab" && setUserDidTab(true);

  return (
    <Flex
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      w={`${itemWidth}px`}
      _notLast={{
        mr: `${gap}px`
      }}
      py="4px"
    >
      {children}
    </Flex>
  );
};

export default ChakraCarousel;
