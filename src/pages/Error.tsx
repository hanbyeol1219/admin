import { useEffect, useState } from "react";
import { useErrorStore } from "../store/ErrorStore";

const Error = () => {
  const [message, setMessage] = useState("에러입니다.");
  const { errorStatus } = useErrorStore();
  console.log(errorStatus);

  useEffect(() => {
    switch (Number(errorStatus)) {
      case 404:
        setMessage("NOT FOUND");
        break;
      default:
        setMessage("문제가 발생하였습니다. 다시 시도해주세요.");
        break;
    }
  }, [errorStatus]);

  return (
    <>
      <div>404</div>
      <div>{message}</div>
    </>
  );
};

export default Error;
