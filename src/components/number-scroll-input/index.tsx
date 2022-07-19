import { Box, Center, Flex, Text, useBreakpointValue, useColorModeValue, VStack } from '@chakra-ui/react';
import { useDrag, useGesture, UserDragConfig, UserScrollConfig, useScroll } from '@use-gesture/react';
import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

interface Props {
    name: string,
    max: number,
    state: [number, React.Dispatch<React.SetStateAction<number>>]
}

enum ScrollDirection {
    up = "up",
    down = "down"
}

/*
 * Works by getting the number of pixels the user has scrolled from the top.
 * The scroll input has child nodes of 80px each.
 * Rounding the quotient of scrollableInput.current.scroll by childNodesHeight gives us the numerical value to be used.
*/

export default function NumberScrollInput({ name, max, state }: Props) {

    const childNodesHeight = 80; // height of each indivisual div in the scroll input.

    const [value, setValue] = state;
    const mainRef = useRef<HTMLDivElement | null>(null);

    const bindScroll = useGesture({
        onScrollEnd: ({ offset: [, my], movement: [, dy] }) => {childNodesHeight
            const valueFromScroll = Math.round(my / childNodesHeight);
            setValue(valueFromScroll);
        }
    });

    useEffect(() => {
        if (mainRef.current) mainRef.current.scrollTop = value * childNodesHeight;
    }, [value]);

    return (

        <VStack
            w={24}
            spacing={2}
        >
            <Text
                fontSize={"xs"}
                textTransform={"capitalize"}
                textAlign={"center"}
                color={useColorModeValue("gray.800", "gray.50")}
            > {name} </Text>

            <Flex
                ref={mainRef}
                as={animated.div}
                direction={"column"}
                width={"full"}
                height={60}
                overflowY={"scroll"}
                className={"number-scroll-input " + useColorModeValue("light", "dark")}
                {...bindScroll()}
            >
                <Box className={"after"} />

                {
                    /* actual elements we get the scrolled value from. */
                    /* add 2 to the max to account for the "--" i place at the top and bottom of the input */
                }

                {
                    Array(max + 2).fill(null).map((...loopArgs) => {
                        const value = loopArgs[1];
                        const displayValue = value - 1;
                        return (
                            <Center
                                key={value}
                                minH={20}
                                height={20}
                                width={"full"}
                            >
                                <Text
                                    fontSize={"4xl"}
                                    fontWeight={"medium"}
                                    color={useColorModeValue("gray.800", "gray.100")}
                                > {value === 0 || value === max + 1 ? "--" : (displayValue < 10 ? "0" : "") + (value - 1)} </Text>
                            </Center>
                        )
                    })
                }

            </Flex>

        </VStack>
    )
};