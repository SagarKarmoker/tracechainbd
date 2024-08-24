import React from 'react';
import { Box, Button, Text, IconButton, useClipboard } from '@chakra-ui/react';
import { CopyIcon, ArrowLeftIcon } from '@chakra-ui/icons';
import userAuth from '../hooks/userAuth';
import backgroundImage from "../img/homeBG2.png";

function Profile() {
    const { isConnected, account } = userAuth();
    const { onCopy } = useClipboard(account || '');

    const goBack = () => {
        window.history.back();
    };

    return (
        <div
            className='flex flex-col items-center min-h-screen bg-cover bg-center'
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <IconButton
                aria-label="Go back"
                icon={<ArrowLeftIcon />}
                onClick={goBack}
                colorScheme="teal"
                alignSelf="flex-start"  // Aligns the back button to the top left
                m={4}
            />
            <Box
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="md"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                className='w-1/2 bg-white bg-opacity-90'
            >
                <Text fontSize="lg" fontWeight="bold">
                    Account Address:
                </Text>
                <Text
                    flex="1"
                    isTruncated
                    ml={2}
                    fontSize="md"
                    color="gray.600"
                >
                    {account}
                </Text>
                <Button
                    onClick={onCopy}
                    colorScheme="teal"
                    variant="outline"
                    leftIcon={<CopyIcon />}
                    ml={4}
                >
                    Copy
                </Button>
            </Box>
        </div>
    );
}

export default Profile;
