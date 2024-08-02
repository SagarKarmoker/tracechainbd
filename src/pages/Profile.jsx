import React from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { Box, Button, Icon, Text, useClipboard } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

function Profile() {
    const activeAccount = useActiveAccount();
    const { onCopy } = useClipboard(activeAccount?.address || '');

    return (
        <div className='flex justify-center mt-4'>
            <Box
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="md"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                className='w-1/2'
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
                    {activeAccount?.address}
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
