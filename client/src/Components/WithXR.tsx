import { useXR } from "@react-three/xr";

const WithXR = ({
  setIsARMode,
}: {
  setIsARMode: (isARMode: boolean) => void;
}) => {
  const { isPresenting } = useXR();
  console.log(isPresenting);

  setIsARMode(isPresenting);
  return <></>;
};

export default WithXR;
