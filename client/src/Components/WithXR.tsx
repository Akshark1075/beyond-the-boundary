import { useXR } from "@react-three/xr";

const WithXR = ({
  setIsARMode,
}: {
  setIsARMode: (isARMode: boolean) => void;
}) => {
  const { isPresenting } = useXR();

  setIsARMode(isPresenting);
  return <></>;
};

export default WithXR;
