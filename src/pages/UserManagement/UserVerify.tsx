import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { verifyUser } from "../../stores/user";
import { useAppDispatch } from "../../stores/hooks";
import { useNavigate } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import CustomLoader from "../../components/Loader/CustomLoader";
import { SUCCESS_CODE, SUCCESS_TEXT } from "../../utils/constants";
import { toast } from "react-toastify";

const UserVerify: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [responseType, setResponseType] = useState<"Success" | "Error" | "">(
    ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const verifyUserByToken = async () => {
      const str: string = window.location.href;
      const regex = /user-verify\?uid=(.*)/;
      const matchResult = str.match(regex);
      let token;
      if (matchResult && matchResult[1]) {
        token = matchResult[1];
      }
      const payload = {
        token,
      };
      try {
        setIsLoading(true);
        const res = await dispatch(verifyUser(payload));
        if (res.payload?.status === SUCCESS_CODE) {
          setResponseType(res.payload?.data?.type);
        } else {
          toast.error(
            res.payload?.response?.data?.message || "Something went wrong"
          );
        }
      } catch (error) {
        console.log("Error--", error);
      } finally {
        setIsLoading(false);
      }
    };
    verifyUserByToken();
  }, []);

  return (
    <div className="container">
      <div className="flex items-center justify-center w-full min-h-screen p-5 md:p-20">
        {isLoading ? (
          <CustomLoader color="fill-green-600" />
        ) : (
          <div className="w-96 intro-y box px-5 py-5 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0">
            {responseType === SUCCESS_TEXT ? (
              <div className="flex flex-col justify-center items-center">
                <Lucide
                  icon="CheckCircle"
                  className="w-[5rem] h-[5rem] text-success"
                />
                <div className="text-lg sm:text-2xl font-medium text-center dark:text-slate-300 mt-5">
                  You are verified.
                </div>
                <p className="mt-3">
                  You are now able to log in to the dashboard.
                </p>
                <p>Click below to login.</p>
                <div className="mt-2 text-center xl:mt-4 xl:text-left">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full xl:mr-3"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center flex-col items-center">
                <Lucide
                  icon="XCircle"
                  className="w-[5rem] h-[5rem] text-danger"
                />
                <div className="mt-5">
                  <p className="text-2xl">You are not verified.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVerify;
