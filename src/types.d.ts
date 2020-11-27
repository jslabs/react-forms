interface IField {
    element: React.ElementType;
    component: React.ElementType;
    template: React.ElementType;
    props: {
        [key: string]: any;
    }
    label: string;
    schema: IFieldSchema;
    hooks: Array<THook>;
    markup: TFormMarkup;
    prefix: TFormMarkup;
    suffix: TFormMarkup;
    prepend: TFormMarkup;
    append: TFormMarkup;
}

interface IFields {
    [key: string]: IField;
}

interface ISchema {
    properties: IFieldSchema;
    [key: string]: any; // @todo (Ajv)
}

interface IFieldSchema {
    [key: string]: any;
}

interface IFormManagerContext {
    state: React.ComponentState;
    setState: React.SetStateAction<React.ComponentState>;
    reducer: React.Reducer<React.ComponentState, React.ReducerAction<any>>;
    dispatch: React.Dispatch<React.ReducerAction<any>>;
}

type THook = (field: IField, context: IFormManagerContext) => void;
type TFormInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type TFormMarkup = string | React.ElementType | Array<React.ElementType>;
