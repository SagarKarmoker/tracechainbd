import React from 'react';
import { Box, Text, Heading, useColorModeValue } from '@chakra-ui/react';
import backgroundImage from '../img/homeBG5.png'; // Update with the correct path to your image

function Welcome() {
    // Use color mode values to adjust text color for light/dark mode
    const textColor = useColorModeValue('Black', 'gray.200');

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgImage={`url(${backgroundImage})`}
            bgSize="cover"
            bgPosition="center"
            color={textColor}
            padding="5"
            textAlign="center"
        >
            <Heading as="h1" fontSize="4xl" mb="4">
                Welcome to the Dashboard
            </Heading>
            <Text fontSize="lg" mb="8">
                Manage your data and track your progress efficiently with our powerful tools.
            </Text>
        </Box>
    );
}

export default Welcome;
