// import { JSONSchemaType } from "ajv"

// declare namespace ReactForms {}

interface IFormElementSpec {
    key: string;
    element: TElement;
    factory?: TFormElementFactory;
    templates?: IFormElementTemplates;
    schema?: IFormElementJsonSchema;
    props?: TElementProps;
    hooks?: Array<TFormElementHook>;
    label?: string;
    data?: any;
    prepend?: React.ElementType;
    append?: React.ElementType;
    html?: React.ElementType;
}

interface IFormElementWithGroupSpec extends IFormElementSpec {
    group?: Array<IFormGroupElementSpec>;
}

interface IFormGroupElementSpec extends IFormElementSpec {
    groupKey: string;
    index: number;
}

interface IFormSpec {
    [key: string]: IFormElementWithGroupSpec;
}

interface IFormJsonSchema {
    [key: string]: IFormElementJsonSchema;
}

interface IFormElementJsonSchema {
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
type TElementProps = React.PropsWithRef<any> & React.PropsWithChildren<any>;
// type TInputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// type TFormElementJsonSchema = JSONSchemaType<any>;
type TFormElementHook = (spec: IFormElementSpec, context: IFormManagerContext) => void;
type TFormElementFactory = (spec: IFormElementSpec, context: IFormManagerContext) => React.ReactNode;

type TFormElementTemplateSpec = IFormElementSpec | IFormGroupElementSpec;
type TFormGroupTemplateSpec = IFormElementWithGroupSpec | IFormGroupElementSpec;