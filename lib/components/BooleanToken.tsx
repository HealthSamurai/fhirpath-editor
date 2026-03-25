import { forwardRef, Ref } from "react";
import { useProgramContext } from "../utils/store";
import { CheckSquareIcon } from "@phosphor-icons/react/CheckSquare";
import { SquareIcon } from "@phosphor-icons/react/Square";
import { IBooleanToken, TokenComponentProps } from "../types/internal";
import { useStyle } from "../style";

const BooleanToken = forwardRef<HTMLElement, TokenComponentProps>(
  function BooleanToken({ bindingId, tokenIndex }, ref) {
    const style = useStyle();
    const { token, updateToken } = useProgramContext((state) => ({
      token: state.getToken(bindingId, tokenIndex) as IBooleanToken,
      updateToken: state.updateToken,
    }));

    const isChecked = token.value === "true";

    return (
      <label
        ref={ref as Ref<HTMLLabelElement>}
        className={style.token.boolean.checkbox}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) =>
            updateToken(bindingId, tokenIndex, {
              value: e.target.checked ? "true" : "false",
            })
          }
        />
        {isChecked ? <CheckSquareIcon size={18} /> : <SquareIcon size={18} />}
        {token.value}
      </label>
    );
  },
);

export default BooleanToken;
