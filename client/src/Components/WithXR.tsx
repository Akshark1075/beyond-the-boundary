import { useXR } from "@react-three/xr";
//Component for updating the state of isARMode
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
