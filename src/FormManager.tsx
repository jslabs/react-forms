import { createContext } from "react";

export const FormManager = createContext({ state: {}, setState: () => {} });

export default FormManager;