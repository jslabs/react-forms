type THook = (field: IField, context: any) => void; // @todo context type
type TFormInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type TFormMarkup = string | React.ElementType | Array<React.ElementType>;

interface IField {
    label: string;
    input: React.ElementType;
    props: {
        [key: string]: any;
    }
    prefix: TFormMarkup;
    suffix: TFormMarkup;
    prepend: TFormMarkup;
    append: TFormMarkup;
    markup: TFormMarkup;
    template: React.ElementType;
    component: React.ElementType;
    schema: IFieldSchema;
    hooks: Array<THook>;
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