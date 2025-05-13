import { useReducer } from "react";

export type FormState<T> = {
  original: T;
  current: T;
  changedFields: Set<keyof T>;
};

type FormAction<T> =
  | { type: "SET_FIELD"; field: keyof T; value: T[keyof T] }
  | { type: "RESET_FIELD"; field: keyof T }
  | { type: "RESET" };

export function createFormReducer<T>(
  equalityChecks: Partial<{
    [K in keyof T]: (a: T[K], b: T[K]) => boolean;
  }>
) {
  return function formReducer(
    state: FormState<T>,
    action: FormAction<T>
  ): FormState<T> {
    switch (action.type) {
      case "SET_FIELD": {
        const field = action.field;
        const newValue = action.value;
        const equals = equalityChecks[field];
        const originalValue = state.original[field];
        const isEqual = equals
          ? equals(newValue, originalValue)
          : newValue === originalValue;

        const changedFields = new Set(state.changedFields);
        if (!isEqual) {
          changedFields.add(field);
        } else {
          changedFields.delete(field);
        }

        return {
          ...state,
          current: { ...state.current, [field]: newValue },
          changedFields,
        };
      }
      case "RESET_FIELD": {
        const field = action.field;
        const changedFields = new Set(state.changedFields);
        changedFields.delete(field);

        return {
          ...state,
          current: {
            ...state.current,
            [field]: state.original[field],
          },
          changedFields,
        };
      }
      case "RESET":
        return {
          ...state,
          current: { ...state.original },
          changedFields: new Set(),
        };
      default:
        return state;
    }
  };
}

export function buildFormState<T>(fields: T): FormState<T> {
  return {
    original: { ...fields },
    current: { ...fields },
    changedFields: new Set(),
  };
}

export function useFormReducer<T>(
  initialFields: T,
  equalityChecks: Partial<{
    [K in keyof T]: (a: T[K], b: T[K]) => boolean;
  }> = {}
) {
  const reducer = createFormReducer<T>(equalityChecks);
  const [state, dispatch] = useReducer(reducer, buildFormState(initialFields));

  const getField = (field: keyof T): T[keyof T] => state.current[field];

  const setField =
    <K extends keyof T>(field: K) =>
    (value: T[K]) =>
      dispatch({ type: "SET_FIELD", field, value });

  const resetField = (field: keyof T) =>
    dispatch({ type: "RESET_FIELD", field });

  const reset = () => dispatch({ type: "RESET" });

  const hasChanged = (field: keyof T) => state.changedFields.has(field);

  const getChangedValues = (): Partial<T> => {
    const result: Partial<T> = {};
    state.changedFields.forEach((field) => {
      result[field] = state.current[field];
    });
    return result;
  };

  return {
    state,
    getField,
    setField,
    resetField,
    reset,
    hasChanged,
    getChangedValues,
  };
}
