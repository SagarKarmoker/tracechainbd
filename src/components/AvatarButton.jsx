import { useEffect } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import {
  useActiveAccount,
  useDisconnect,
  useActiveWallet,
} from "thirdweb/react";
import Wallet from "./Wallet";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  MenuDivider,
} from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { RiLogoutBoxRFill } from "react-icons/ri";

function AvatarButton() {
  const smartAccount = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (smartAccount) {
      console.log("Account: ", smartAccount.address);
    }
  }, []);

  return (
    <Menu>
      {smartAccount && smartAccount.address ? (
        <>
          <MenuButton
            as={Button}
            colorScheme="blue"
            rightIcon={<IoIosArrowDropdownCircle />}
          >
            {smartAccount.address.substring(0, 5) +
              "..." +
              smartAccount.address.substring(37, 42)}
          </MenuButton>
        </>
      ) : (
        <Wallet />
      )}

      <MenuList>
        <MenuItem icon={<CgProfile />}>Profile</MenuItem>
        <MenuDivider />
        <MenuItem
          icon={<RiLogoutBoxRFill />}
          onClick={() => disconnect(wallet)}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default AvatarButton;
