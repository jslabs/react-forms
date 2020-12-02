import { createContext } from "react";

export const FormManager = createContext({ state: {}, setState: () => {}, reducer: () => {}, dispatch: () => {} });

export default FormManager;