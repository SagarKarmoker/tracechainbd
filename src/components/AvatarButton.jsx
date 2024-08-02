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
import { useNavigate } from 'react-router-dom';

function AvatarButton({setRole}) {
  const smartAccount = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate()

  const navigate = useNavigate();

    const handleProfile = () => {
        navigate('/profile');
    };

  useEffect(() => {
    if (smartAccount) {
      console.log("Account: ", smartAccount.address);
    }
  }, []);

  const handleProfile = () => {
    navigate("/profile")
  }

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
        <MenuItem
          icon={<CgProfile />}
          onClick={handleProfile}
        >
          Profile
        </MenuItem>
        <MenuDivider />
        <MenuItem
          icon={<RiLogoutBoxRFill />}
          onClick={() => {
            disconnect(wallet)
            setRole('');
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default AvatarButton;
