import React, { useState } from "react";
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
  Select,
} from "@chakra-ui/react";
import { MdOutlineCallMade } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../img/homeBG2.png";
import sideImage from "../img/R1.png";

function Roles() {
  let navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  // Handle navigation based on selected role
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle dropdown change
  const handleDropdownChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    if (role === "Admin") handleNavigation("/admin");
    else if (role === "Customs") handleNavigation("/customs");
    else if (role === "Importer") handleNavigation("/importer");
    else if (role === "Distributor") handleNavigation("/distributor");
    else if (role === "Retailer") handleNavigation("/retailer");
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-2/3 flex justify-between items-center">
        <div className="w-1/2">
          <Heading className="text-black text-4xl font-bold mb-10 text-center">
            Welcome to TraceChainBD
          </Heading>
          <Card className="mb-8">
            <CardHeader>
              <Heading size="md" className="text-center">
                Choose Your Role First!
              </Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box className="custom-select">
                  <Select
                    placeholder="Select Role"
                    value={selectedRole}
                    onChange={handleDropdownChange}
                    borderColor="#5160be"
                    borderWidth="2px"
                    _focus={{ 
                      borderColor: "#5160be", 
                      boxShadow: "0 0 0 1px #5160be" 
                    }}
                    _hover={{ 
                      borderColor: "#5160be" 
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Customs">Customs</option>
                    <option value="Importer">Importer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Retailer">Retailer</option>
                  </Select>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </div>

        <div className="w-1/2">
          <img
            src={sideImage}
            alt="Role selection illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Roles;
