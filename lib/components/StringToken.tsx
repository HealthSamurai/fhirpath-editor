import { forwardRef, Ref } from "react";
import { useProgramContext } from "../utils/store";
import { IStringToken, TokenComponentProps } from "../types/internal";
import { useStyle } from "../style";

const StringToken = forwardRef<HTMLElement, TokenComponentProps>(
  function StringToken({ bindingId, tokenIndex }, ref) {
    const style = useStyle();
    const { token, updateToken } = useProgramContext((state) => ({
      token: state.getToken(bindingId, tokenIndex) as IStringToken,
      updateToken: state.updateToken,
    }));

    return (
      <label className={style.token.string.wrapper}>
        <span>"</span>
        <input
          ref={ref as Ref<HTMLInputElement>}
          type="text"
          value={token.value}
          onChange={(e) =>
            updateToken(bindingId, tokenIndex, { value: e.target.value })
          }
        />
        <span>"</span>
      </label>
    );
  },
);

export default StringToken;
