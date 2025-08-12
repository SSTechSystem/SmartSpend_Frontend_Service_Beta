import * as lucideIcons from "lucide-react";
import clsx from "clsx";

export const { createReactComponent, ...icons } = lucideIcons;

type Icon = keyof typeof icons;

interface LucideProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: Icon | undefined; // Ensure icon can be undefined
  title?: string;
}

function Lucide(props: LucideProps) {
  const { icon, className, ...restProps } = props;

  // Check if the icon exists in lucideIcons
  const Component = icon ? lucideIcons[icon] : null;

  if (!Component) {
    console.error(`Icon '${icon}' not found or is undefined.`);
    return null; // Or render a default icon or placeholder
  }

  return (
    <Component
      {...restProps}
      className={clsx("stroke-[1.2]", className)} // Example of using clsx for classes
    />
  );
}

export default Lucide;
