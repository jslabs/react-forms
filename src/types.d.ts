interface IFormElementSpec {
    key: string;
    element: TElement;
    group?: Array<IFormElementSpec>;
    factory?: TFormElementFactory;
    templates?: IFormElementTemplates;
    schema?: IFormElementDataSchema;
    props?: TElementProps;
    hooks?: Array<TFormElementHook>;
    label?: string;
    data?: any;
    prepend?: React.ElementType;
    append?: React.ElementType;
    html?: React.ElementType;
}

interface IFormSpec {
    [key: string]: IFormElementSpec;
}

interface IFormDataSchema {
    // @todo Schemas types (Ajv)
    [key: string]: IFormElementDataSchema;
}

interface IFormElementDataSchema {
    [key: string]: any;
}

interface IFormState {
    [key: string]: any;
}

interface IFormManagerContext {
    state?: React.ComponentState;
    setState?: React.SetStateAction<React.ComponentState>;
    reducer?: React.Reducer<React.ComponentState, React.ReducerAction<any>>;
    dispatch?: React.Dispatch<React.ReducerAction<any>>;
}

interface IFormElementTemplates {
    element?: React.ElementType;
    group?: React.ElementType | boolean;
}

type TElement = React.ElementType;
type TElementProps = React.PropsWithRef<any> | React.PropsWithChildren<any>;
// type TInputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type TFormElementHook = (spec: IFormElementSpec, context: IFormManagerContext) => void;
type TFormElementFactory = (spec: IFormElementSpec, context: IFormManagerContext) => React.ReactNode;