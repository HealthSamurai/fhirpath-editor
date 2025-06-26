import { useCallback, useState } from "react";
import { Plus, X } from "@phosphor-icons/react";
import { JsonEditor } from "./JsonEditor";

interface ContextEditorProps {
  context: any;
  setContext: (context: any) => void;
  externalBindings: Record<string, any>;
  setExternalBindings: (value: Record<string, any>) => void;
}

export default function ContextEditor({
  context,
  setContext,
  externalBindings,
  setExternalBindings,
}: ContextEditorProps) {
  const [activeBindingName, setActiveBindingName] = useState<string | null>(
    null,
  );
  const [editingBindingName, setEditingBindingName] = useState<string | null>(
    null,
  );
  const [draftName, setDraftName] = useState("");

  const addNewBinding = () => {
    const name = `external${Object.keys(externalBindings).length + 1}`;

    setExternalBindings({
      ...externalBindings,
      [name]: {
        resourceType: "Patient",
      },
    });

    setActiveBindingName(name);
  };

  const updateBindingValue = useCallback(
    (name: string, newValue: any) => {
      setExternalBindings({
        ...externalBindings,
        [name]: newValue,
      });
    },
    [externalBindings, setExternalBindings],
  );

  const updateBindingName = (name: string, newName: string) => {
    if (name === newName || !newName) {
      return;
    }

    const newBindings = Object.keys(externalBindings).reduce(
      (acc, currentName) => {
        if (currentName === name) {
          acc[newName] = externalBindings[name];
        } else {
          acc[currentName] = externalBindings[currentName];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    setExternalBindings(newBindings);

    if (activeBindingName === name) {
      setActiveBindingName(newName);
    }
  };

  const deleteBinding = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: value, ...rest } = externalBindings;
    setExternalBindings(rest);
    if (activeBindingName === name) {
      const names = Object.keys(externalBindings);
      const index = names.findIndex((x) => x === name);
      if (index > 0) {
        setActiveBindingName(names[index - 1]);
      } else {
        setActiveBindingName(null);
      }
    }
  };

  const onChange = useCallback(
    (newValue: any) => {
      if (activeBindingName != null) {
        updateBindingValue(activeBindingName, newValue);
      } else {
        setContext(newValue);
      }
    },
    [setContext, activeBindingName, updateBindingValue],
  );

  const handleRename = () => {
    if (editingBindingName) {
      updateBindingName(editingBindingName, draftName);
    }
    setEditingBindingName(null);
    setDraftName("");
  };

  return (
    <div className="flex flex-col overflow-hidden flex-1">
      <div className="flex border-b border-gray-200">
        <div
          className={`text-sm cursor-pointer flex items-center border-t border-r border-gray-200 ${
            null === activeBindingName ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
          onClick={() => setActiveBindingName(null)}
        >
          <span className="py-1.5 px-2 text-green-700">context</span>
        </div>

        {Object.keys(externalBindings).map((name) => (
          <div
            key={name}
            className={`text-sm cursor-pointer flex items-center border-t border-r border-gray-200 ${
              name === activeBindingName ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveBindingName(name)}
          >
            {editingBindingName === name ? (
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRename();
                  }
                  if (e.key === "Escape") {
                    setEditingBindingName(null);
                  }
                }}
                ref={(ref) => {
                  if (ref && !ref.matches(":focus")) {
                    ref.focus();
                    ref.select();
                  }
                }}
                className="pl-2 py-1.5 focus:outline-none field-sizing-content"
              />
            ) : (
              <span
                className="truncate max-w-52 py-1.5 pl-2"
                onDoubleClick={() => {
                  setEditingBindingName(name);
                  setDraftName(name);
                }}
              >
                {name}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this binding?")) {
                  deleteBinding(name);
                }
              }}
              className="text-gray-400 hover:text-gray-700 cursor-pointer px-1 py-1"
              title="Delete binding"
            >
              <X size={14} weight="light" />
            </button>
          </div>
        ))}
        <button
          className="px-2 text-gray-400 hover:text-gray-700 cursor-pointer active:bg-gray-100 border-t border-r border-transparent active:border-gray-200"
          onClick={addNewBinding}
          title="Add new binding"
        >
          <Plus size={14} />
        </button>
      </div>

      <JsonEditor
        key={activeBindingName || "context"}
        value={
          activeBindingName ? externalBindings[activeBindingName] : context
        }
        onChange={onChange}
      />
    </div>
  );
}
