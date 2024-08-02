import React from "react";
import { useActiveAccount } from "thirdweb/react";

function Profile() {
  const activeAccount = useActiveAccount();
    return <div>
      {activeAccount?.address}
  </div>;
}

export default Profile;
