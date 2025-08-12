import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import clsx from "clsx";
import { icons } from "../../base-components/Lucide";
import { useEffect, useState } from "react";

export interface Card {
  icon: keyof typeof icons;
  title: string;
  number?: string | number;
}

interface AnimatedNumberProps {
  value: number;
  duration: number;
  delay: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration,
  delay,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let animationStart: number | null = null;
    let rAF: number;

    const startAnimation = (timestamp: number) => {
      if (animationStart === null) {
        animationStart = timestamp;
      }

      const elapsedTime = timestamp - animationStart;

      if (elapsedTime < delay * 1000) {
        rAF = requestAnimationFrame(startAnimation);
      } else {
        const progress = Math.min(
          1,
          (elapsedTime - delay * 1000) / (duration * 1000)
        );
        const nextValue = Math.floor(progress * value);
        setAnimatedValue(nextValue);

        if (progress < 1) {
          rAF = requestAnimationFrame(startAnimation);
        }
      }
    };

    rAF = requestAnimationFrame(startAnimation);

    return () => cancelAnimationFrame(rAF);
  }, [value, duration, delay]);

  return <span>{animatedValue}</span>;
};

function StatisticsCard(props: Card) {
  return (
    <div
      className={clsx([
        "flex-1 min-w-[150px] p-4 box border border-dark/30 dark:!border-white/20",
        "sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px]",
        "w-full sm:w-auto",
      ])}
    >
      <div className="mt-2 leading-7">
        <div className="flex w-fit m-auto items-center justify-center text-primary border rounded-full p-1 border-primary/50 dark:border-white/70">
          <Lucide className="w-8 h-8 dark:text-white/70" icon={props.icon} />
        </div>
      </div>
      <div className="flex flex-col items-center mt-3 text-center">
        <div className="font-medium text-sm sm:text-base leading-7 capitalize">
          {props.title}
        </div>
        <div>
          {typeof props.number === "number" &&
            !isNaN(props.number) &&
            props.number >= 0 && (
              <Tippy
                as="div"
                className="flex items-center text-base sm:text-xl font-medium pl-2 cursor-pointer text-success"
                content={`${props.number} active ${props.title.toLowerCase()}`}
              >
                <AnimatedNumber delay={1} duration={2} value={props.number} />
              </Tippy>
            )}
        </div>
      </div>
    </div>
  );
}
export default StatisticsCard;
