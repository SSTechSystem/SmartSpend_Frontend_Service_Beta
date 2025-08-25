import { createRef, useEffect, useRef } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { init, updateData, CkeditorProps, CkeditorElement } from "../ckeditor";

type CkeditorComponentProps<C extends React.ElementType = "div"> = {
  as?: C;
  disabled?: boolean;
  config?: Record<string, any>;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onReady?: () => void;
  getRef?: (ref: any) => void;
  className?: string;
} & React.ComponentPropsWithoutRef<C>;

function Ckeditor<C extends React.ElementType = "div">({
  as,
  disabled = false,
  config = {},
  value = "",
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  onReady = () => {},
  getRef = () => {},
  className,
  ...computedProps
}: CkeditorComponentProps<C>) {
  const editorRef = createRef<any>();
  const cacheData = useRef("");
  const initialRender = useRef(true);

  useEffect(() => {
    if (editorRef.current) {
      if (initialRender.current) {
        if (getRef) {
          getRef(editorRef.current);
        }
        init(editorRef.current, ClassicEditor, {
          props: {
            value,
            onChange,
            onFocus,
            onBlur,
            onReady,
            disabled,
            config,
          },
          cacheData,
        });
        initialRender.current = false;
      } else {
        updateData(editorRef.current, {
          props: {
            value,
            onChange,
            onFocus,
            onBlur,
            onReady,
            disabled,
            config,
          },
          cacheData,
        });
      }
    }
  }, [value]);

  const Component = as || "div";

  return (
    <Component
      {...computedProps}
      ref={editorRef}
      className={className}
      data-value={value}
    />
  );
}

export default Ckeditor;
