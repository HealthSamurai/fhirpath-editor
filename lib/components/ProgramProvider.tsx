import { ReactNode, useEffect, useState } from "react";
import {
  createProgramStore,
  IProgramStore,
  ProgramContext,
} from "../utils/store";
import {
  Context,
  ExternalBinding,
  FhirRegistry,
  IProgram,
} from "../types/internal";
import { StoreApi } from "zustand/index";
import { unparseProgram } from "../utils/fhirpath";
import { Model } from "fhirpath";

type ProgramProviderProps = {
  program: IProgram;
  onProgramChange?: (program: IProgram) => void;
  onFhirPathChange?: (fhirPath: string) => void;
  context: Context;
  isLambda?: boolean;
  externalBindings: ExternalBinding[];
  fhirSchema: FhirRegistry;
  model: Model;
  debug: boolean;
  portalRoot?: string;
  children: ReactNode;
};

export function ProgramProvider({
  program,
  onProgramChange,
  onFhirPathChange,
  context,
  isLambda = false,
  externalBindings,
  fhirSchema,
  model,
  debug,
  portalRoot,
  children,
}: ProgramProviderProps) {
  const [store, setStore] = useState<StoreApi<IProgramStore> | null>(null);

  useEffect(() => {
    const store = createProgramStore(
      context,
      isLambda,
      externalBindings,
      fhirSchema,
      model,
      debug,
      portalRoot,
    );

    setStore(store);
    store.getState().setProgram(program);
  }, [
    context,
    isLambda,
    externalBindings,
    fhirSchema,
    model,
    debug,
    portalRoot,
  ]);

  useEffect(() => {
    if (store) {
      return store.subscribe((curState, prevState) => {
        if (curState.program !== prevState.program) {
          const { program, getQuestionnaireItems, getBindingsOrder } = curState;
          onProgramChange?.(program);
          if (onFhirPathChange) {
            onFhirPathChange(
              unparseProgram(program, {
                questionnaireItems: getQuestionnaireItems(),
                bindingsOrder: getBindingsOrder(),
              }),
            );
          }
        }
      });
    }
  }, [store, onProgramChange, onFhirPathChange]);

  useEffect(() => {
    if (store) {
      store.getState().setProgram(program);
    }
  }, [store, program]);

  return (
    store && (
      <ProgramContext.Provider value={store}>
        {children}
      </ProgramContext.Provider>
    )
  );
}
