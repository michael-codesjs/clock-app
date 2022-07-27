import { Box, Center, Flex, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';

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
 * The scroll input has child nodes of height 80px.
 * So when a user has scrolled 80px thats 1, 160px thats 2, 240px thats 3 and so on.
 * A users scroll is not perfect and will not exactly scroll in increments of 80px;
 * For technical and visual purposes, we will need to round off the users scrollTop after he finishes scrolling.
*/

export default function NumberScrollInput({ name, max, state }: Props) {

    // TO DO: IMPROVE SCROLL UX

    const [value, setValue] = state;
    const scrollableInputRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const touchIsActive = useRef(false);

    // height of each indivisual child in the scroll input.
    const childNodesHeight = 80;

    const scrollHandler:React.UIEventHandler<HTMLDivElement> = (e) => {
        if(scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(postScrollHandler,200);

    }

    const postScrollHandler = () => {
        let scrollInput = scrollableInputRef.current;
        if (scrollInput && scrollableInputRef.current && !touchIsActive.current) {
            const scrollTop = scrollInput.scrollTop;
            const valueFromScroll = Math.round(scrollTop/childNodesHeight);
            setValue(valueFromScroll);
        }

    }

    useEffect(() => {
        if (scrollableInputRef.current) {
            scrollableInputRef.current.scrollTop = childNodesHeight * value;
        }
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
                ref={scrollableInputRef}
                onScroll={scrollHandler}
                direction={"column"}
                width={"full"}
                height={60}
                overflowY={"scroll"}
                className={"number-scroll-input " + useColorModeValue("light", "dark")}
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