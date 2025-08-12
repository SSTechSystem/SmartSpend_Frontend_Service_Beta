import clsx from "clsx";
import Statistics from "../../components/Dashboard/statistics";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { getUserData } from "../../stores/dashboard";
import moment from "moment";
import { removeItemFromLocalStorage } from "../../stores/sideMenuSlice";

function Main() {
  const dispatch = useAppDispatch();
  const userState: any = useAppSelector(getUserData);
  const [message, setMessage] = useState<string>("");
  const statisticsData = [
    {
      title: "Site Statistics",
      icon: "TrendingUp",
      items: [
        {
          icon: "Users",
          title: "Users",
          number: 0,
        },
        {
          icon: "Truck",
          title: "Drivers or carriers",
          number: 0,
        },
        {
          icon: "UserCheck",
          title: "Online drivers",
          number: 0,
        },
        {
          icon: "ShoppingBag",
          title: "Retailer",
          number: 0,
        },
      ],
    },
    {
      title: "Job Statistics",
      icon: "Sliders",
      items: [
        {
          icon: "Codesandbox",
          title: "Total jobs",
          number: 0,
        },
        {
          icon: "Briefcase",
          title: "Running job",
          number: 0,
        },
        {
          icon: "CheckCircle",
          title: "Completed jobs",
          number: 0,
        },
        {
          icon: "PlusSquare",
          title: "Created jobs",
          number: 0,
        },
      ],
    },
  ];

  useEffect(() => {
    dispatch(removeItemFromLocalStorage());
  }, []);

  useEffect(() => {
    if (userState?.user?.last_login) {
      const lastLoginText = moment(userState?.user?.last_login).format(
        "MM/DD/YYYY hh:mm a"
      );
      setMessage(`Last Login - ${lastLoginText}`);

      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [userState?.user?.last_login]);

  return (
    <div className="w-full min-w-full px-4">
      <div className="w-full mx-auto">
        {userState?.user && (
          <div className="w-full">
            <div className="items-center block h-10 intro-y sm:flex sm:justify-between">
              <h2 className="mr-5 text-base sm:text-lg font-medium truncate">
                Dashboard
              </h2>
              <h2 className="text-xs sm:text-sm">{message}</h2>
            </div>

            <div className="w-full space-y-6 mt-6">
              {statisticsData?.map((item: any, i: number) => (
                <Statistics
                  key={i}
                  title={item.title}
                  items={item.items}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
