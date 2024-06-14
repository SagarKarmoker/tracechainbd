import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stack,
  StackDivider,
  Box,
  Button,
} from "@chakra-ui/react";
import { MdOutlineCallMade } from "react-icons/md";

function Roles() {


    // handle buttons
  const handleAdmin = () => window.location.href = "/admin";
  const handleDistributor = () => window.location.href = "/distributor";
  const handleImportar = () => window.location.href = "/importar";

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <Card className="w-2/4 shadow-lg">
        <CardHeader>
          <Heading size="md" className="text-center">
            Choice Your Role
          </Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Admin
              </Heading>
              <div className="flex justify-between">
                <Text pt="2" fontSize="sm">
                  View a summary of all your clients over the last month.
                </Text>
                <Button
                  colorScheme="blue"
                  rightIcon={<MdOutlineCallMade />}
                  onClick={handleAdmin}
                >
                  Admin Panel
                </Button>
              </div>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Importar
              </Heading>
              <div className="flex justify-between">
                <Text pt="2" fontSize="sm">
                  View a summary of all your clients over the last month.
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={handleImportar}
                  rightIcon={<MdOutlineCallMade />}
                >
                  Importar Panel
                </Button>
              </div>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Distributor
              </Heading>
              <div className="flex justify-between">
                <Text pt="2" fontSize="sm">
                  View a summary of all your clients over the last month.
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={handleDistributor}
                  rightIcon={<MdOutlineCallMade />}
                >
                  Distributor Panel
                </Button>
              </div>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
}

export default Roles;
