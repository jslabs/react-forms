interface IFormElementSpec {
    key: string,
    element: React.ElementType;
    template: React.ElementType;
    factory: TFormElementFactory;
    group: Array<IFormElementSpec>;
    schema: IFormElementDataSchema;
    props: React.PropsWithChildren<any>;
    hooks: Array<THook>;
    label: string;
    markup: TFormMarkup;
    prefix: TFormMarkup;
    suffix: TFormMarkup;
    prepend: TFormMarkup;
    append: TFormMarkup;
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

type THook = (spec: IFormElementSpec, context: IFormManagerContext) => void;
type TFormInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type TFormMarkup = string | React.ElementType | Array<React.ElementType>;
type TFormElementFactory = (spec: IFormElementSpec, context: IFormManagerContext) => React.ReactNode;