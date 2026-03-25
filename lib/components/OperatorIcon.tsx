import { CommandIcon } from "@phosphor-icons/react/Command";
import { DivideIcon } from "@phosphor-icons/react/Divide";
import { EqualsIcon } from "@phosphor-icons/react/Equals";
import { GreaterThanIcon } from "@phosphor-icons/react/GreaterThan";
import { GreaterThanOrEqualIcon } from "@phosphor-icons/react/GreaterThanOrEqual";
import { LessThanIcon } from "@phosphor-icons/react/LessThan";
import { LessThanOrEqualIcon } from "@phosphor-icons/react/LessThanOrEqual";
import { LineVerticalIcon } from "@phosphor-icons/react/LineVertical";
import { MinusIcon } from "@phosphor-icons/react/Minus";
import { NotEqualsIcon } from "@phosphor-icons/react/NotEquals";
import { PlusIcon } from "@phosphor-icons/react/Plus";
import type { Icon } from "@phosphor-icons/react/lib";
import { XIcon } from "@phosphor-icons/react/X";
import { createElement } from "react";

import { OperatorName } from "../types/internal";
import clx from "classnames";
import { useStyle } from "../style";

const operatorIcons: Partial<Record<OperatorName, Icon>> = {
  "+": PlusIcon,
  "-": MinusIcon,
  "*": XIcon,
  "/": DivideIcon,
  "=": EqualsIcon,
  "!=": NotEqualsIcon,
  "<": LessThanIcon,
  "<=": LessThanOrEqualIcon,
  ">": GreaterThanIcon,
  ">=": GreaterThanOrEqualIcon,
  "|": LineVerticalIcon,
};

type OperatorIconProps = {
  name: OperatorName;
  size?: number;
  compact?: boolean;
  className?: string;
};

const OperatorIcon = ({
  name,
  size = 16,
  compact = true,
  className,
}: OperatorIconProps) => {
  const style = useStyle();
  return (
    <span className={clx(style.token.operator.icon.wrapper, className)}>
      {operatorIcons[name] ? (
        createElement(operatorIcons[name], { size })
      ) : compact ? (
        !name.match(/[a-z]/) ? (
          <span className={style.token.operator.icon.letter}>{name}</span>
        ) : (
          <CommandIcon size={size} />
        )
      ) : (
        name
      )}
    </span>
  );
};

export default OperatorIcon;
