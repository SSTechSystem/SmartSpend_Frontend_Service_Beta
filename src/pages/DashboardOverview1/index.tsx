import clsx from "clsx";
import Statistics from "../../components/Dashboard/statistics";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { getDashboardData,setDashboardData } from "../../stores/dashboard";
import moment from "moment";
import { removeItemFromLocalStorage } from "../../stores/sideMenuSlice";
import { Car, CheckCircle, Eye, MessageSquare, Shield, UserCheck, Users } from "lucide-react";

function Main() {
  const dispatch = useAppDispatch();
  const dashboardState: any = useAppSelector(getDashboardData);
  const [message, setMessage] = useState<string>("");
  type Card = {
    icon: (props: any) => JSX.Element;
    title: string;
    number: number;
  };
  const statisticsCards = [
    {
      icon: Shield,
      title: "Registered Admins",
      number: dashboardState?.dashboard?.totalRegisteredAdmins || 0,
    },
    {
      icon: Users,
      title: "Registered Users",
      number: dashboardState?.dashboard?.totalRegisteredAppUsers || 0,
    },
    {
      icon: Eye,
      title: "Guest Users",
      number: dashboardState?.dashboard?.totalGuestUsers || 0,
    },
    {
      icon: MessageSquare,
      title: "Viewed Feedback",
      number: dashboardState?.dashboard?.totalViewedFeedbacks + '/' + dashboardState?.dashboard?.totalFeedbacks || 0,
    },
  ].filter(Boolean) as Card[];

  useEffect(() => {
    dispatch(removeItemFromLocalStorage());
    dispatch(setDashboardData());
  }, []);

  useEffect(() => {
    if (dashboardState?.dashboard?.lastLogin) {
      const lastLoginText = moment(dashboardState?.dashboard?.lastLogin).format(
        "MM/DD/YYYY hh:mm a"
      );
      setMessage(`Last Login - ${lastLoginText}`);

      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [dashboardState?.dashboard?.lastLogin]);

  return (
    <div className="p-3 box flex-1 mt-5">
      <div className="px-1 pt-2 flex text-base font-medium items-center">
        Dashboard
      </div>

      <div className="flex gap-3 flex-wrap my-2 h-full overflow-y-auto">
        {statisticsCards.map((card, i) => {
          const IconComponent = card.icon;
          return (
            <section
              key={i}
              className={`flex justify-between items-center w-full 
            ${
              statisticsCards.length === 2
                ? "sm:w-[calc(50%-8px)]"
                : "sm:w-[calc(49%-8px)] md:w-[calc(25%-10px)]"
            }
            p-2 border border-dark/30 dark:border-white/20 rounded-[0.5rem]`}
            >
              <article className="flex flex-col gap-1">
                <header>
                    {(
                      <p className="text-lg font-extrabold pl-2 text-success dark:text-green-500">
                        {card.number}
                      </p>
                    )}
                </header>
                <footer className="pl-2 font-bold" style={{ fontSize: "16px" }}>
                  {card.title}
                </footer>
              </article>
              <article className="pr-3">
                <IconComponent className="w-8 h-8 text-[#3e8db1] dark:text-[#8ecbe7]" />
              </article>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default Main;
