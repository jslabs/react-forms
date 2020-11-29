interface IFormElementSpec {
    key: string;
    group: Array<IFormElementSpec>;
    element: React.ElementType;
    factory: TFormElementFactory;
    templates: IFormTemplates;
    schema: IFormElementDataSchema;
    props: React.PropsWithChildren<any>;
    hooks: Array<THook>;
    label: string;
    data: any;
    prepend: React.ElementType;
    append: React.ElementType;
    html: React.ElementType;
}

interface IFormSpec {
    [key: string]: IFormElementSpec;
}

interface IFormDataSchema {  // (Ajv)
    [key: string]: IFormElementDataSchema;
}

interface IFormElementDataSchema {
    [key: string]: any;
}

interface IFormManagerContext {
    state: React.ComponentState;
    setState: React.SetStateAction<React.ComponentState>;
    reducer: React.Reducer<React.ComponentState, React.ReducerAction<any>>;
    dispatch: React.Dispatch<React.ReducerAction<any>>;
}

interface IFormTemplates {
    element: React.ElementType;
    group: React.ElementType | boolean;
}

type THook = (spec: IFormElementSpec, context: IFormManagerContext) => void;
type TFormInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type TFormElementFactory = (spec: IFormElementSpec, context: IFormManagerContext) => React.ReactNode;