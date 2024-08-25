import React from 'react';
import { Box, Text, Heading, Button, useColorModeValue } from '@chakra-ui/react';

function Welcome() {
    // Use color mode values to make it responsive to light/dark mode
    const bgGradient = useColorModeValue(
        'linear(to-r, #7928CA, #FF0080)',
        'linear(to-r, #2D3748, #1A202C)'
    );
    const textColor = useColorModeValue('white', 'gray.200');

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgGradient={bgGradient}
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
            <Button
                colorScheme="teal"
                size="lg"
                onClick={() => console.log('Explore Dashboard')}
                _hover={{ bg: "teal.400" }}
            >
                Explore Dashboard
            </Button>
        </Box>
    );
}

export default Welcome;
