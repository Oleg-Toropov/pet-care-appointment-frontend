import { useEffect, useState } from "react";

const useColorMapping = () => {
  const [colors, setColors] = useState({});

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    setColors({
      "on-going": rootStyle.getPropertyValue("--color-on-going").trim(),
      "up-coming": rootStyle.getPropertyValue("--color-up-coming").trim(),
      completed: rootStyle.getPropertyValue("--color-completed").trim(),
      "not-approved": rootStyle.getPropertyValue("--color-not-approved").trim(),
      cancelled: rootStyle.getPropertyValue("--color-cancelled").trim(),
      "waiting-for-approval": rootStyle
        .getPropertyValue("--color-waiting-for-approval")
        .trim(),
      pending: rootStyle.getPropertyValue("--color-pending").trim(),
      approved: rootStyle.getPropertyValue("--color-approved").trim(),
      default: rootStyle.getPropertyValue("--color-default").trim(),
    });
  }, []);
  return colors;
};

export default useColorMapping;
