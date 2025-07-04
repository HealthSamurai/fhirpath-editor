import { ReactNode, useRef, useState } from "react";
import { JsonView } from "react-json-view-lite";
import { ArrowRight, Empty, Warning } from "@phosphor-icons/react";
import { useProgramContext } from "../utils/store";
import {
  arrow,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { FhirValue } from "../types/internal";
import { Style, useStyle } from "../style";
import { useText } from "../text";

function format(
  value: FhirValue,
  style: Style,
  text: ReturnType<typeof useText>,
): ReactNode {
  if (value.error) {
    return (
      <span className={style.binding.value.failure}>
        <Warning /> {text.value.error.message}
      </span>
    );
  } else if (value.value == null) {
    return (
      <span className={style.binding.value.empty}>
        <Empty /> {text.value.error.empty}
      </span>
    );
  } else if (Array.isArray(value.value)) {
    return value.value.length ? (
      `${value.value
        .slice(0, 3)
        .map((x) => (typeof x !== "object" ? x : "{...}"))
        .join(", ")}${value.value.length > 3 ? ", ..." : ""}`
    ) : (
      <span className={style.binding.value.empty}>
        <Empty /> {text.value.error.empty}
      </span>
    );
  }
  if (typeof value.value === "object") {
    if (Object.keys(value.value).length === 0) return "{}";
    if (value.value.resourceType) return `${value.value.resourceType}`;
    return "{...}";
  }
  return String(value.value);
}

type EvalViewerProps = {
  bindingId: string;
};

const ValueViewer = ({ bindingId }: EvalViewerProps) => {
  const style = useStyle();
  const text = useText();
  const { name, value, portalRoot } = useProgramContext((state) => ({
    name: bindingId && state.getBindingName(bindingId),
    value: state.getBindingValue(bindingId),
    portalRoot: state.getPortalRoot(),
  }));

  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    placement: "right",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({
        mainAxis: 6,
      }),
      shift({
        padding: 24,
      }),
      flip(),
      size({
        apply({ availableHeight, elements }) {
          const target = elements.floating.querySelector("[role=tree]") as
            | HTMLDivElement
            | undefined;
          if (target) {
            Object.assign(target.style, {
              maxHeight: `${Math.min(500, Math.max(0, availableHeight))}px`,
            });
          }
        },
      }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const headingId = useId();

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={style.binding.value.button}
      >
        <ArrowRight size={12} className={style.binding.value.equals} />
        {format(value, style, text)}
      </button>

      {isOpen && (
        <FloatingPortal id={portalRoot}>
          <div style={floatingStyles}></div>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
            className={style.binding.value.popover}
          >
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className={style.dropdown.arrow}
              strokeWidth={1}
              height={6}
              width={10}
            />
            {value.error ? (
              <div className={style.binding.value.error}>
                <div>
                  {!value.origin || value.origin === name
                    ? value.error.message
                    : text.value.error.bindingError.replace(
                        "{origin}",
                        value.origin,
                      )}
                </div>
              </div>
            ) : (
              <JsonView
                data={value.value}
                style={{
                  container: style.binding.value.json.container,
                  punctuation: style.binding.value.json.punctuation,
                  label: style.binding.value.json.label,
                  stringValue: style.binding.value.json.stringValue,
                  collapsedContent: style.binding.value.json.collapsedContent,
                }}
              />
            )}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default ValueViewer;
