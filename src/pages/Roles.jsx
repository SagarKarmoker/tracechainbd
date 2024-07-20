import React from "react";
import { Link } from 'react-router-dom';
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
import { useNavigate } from "react-router-dom";

function Roles() {
  let navigate = useNavigate();

  // handle buttons
  const handleAdmin = () => {
    navigate("/admin");
  };
  const handleCustom = () => {
    navigate("/customs");
  };

  const handleImportar = () => {
    navigate("/importer");
  }

  const handleDistributor = () => {
    navigate("/distributor");
  }

  const handleRetailer = () => {
    navigate("/retailer");
  };

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <Card className="w-2/4 shadow-lg">
        <CardHeader>
          <Heading size="md" className="text-center">
            Choose Your Role First !
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
                Customs
              </Heading>
              <div className="flex justify-between">
                <Text pt="2" fontSize="sm">
                  View a summary of all your clients over the last month.
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={handleCustom}
                  rightIcon={<MdOutlineCallMade />}
                >
                  Customs Panel
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
                  // onClick={handleImportar}
                  rightIcon={<MdOutlineCallMade />}
                >
                  <Link to="/importer">
                    Importer Panel
                  </Link>
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
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Retailer
              </Heading>
              <div className="flex justify-between">
                <Text pt="2" fontSize="sm">
                  View a summary of all your clients over the last month.
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={handleRetailer}
                  rightIcon={<MdOutlineCallMade />}
                >
                  Retailer Panel
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
