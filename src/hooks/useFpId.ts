import React from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export function useFpId() {
  const [fpHash, setFpHash] = React.useState("");

  React.useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      setFpHash(visitorId);
    };
    setFp();
  }, []);

  return fpHash;
}
