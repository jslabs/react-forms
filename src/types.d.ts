type Hook = (field: IField, context: any) => void;

interface IField {
    label: string;
    input: string;
    props: {
        [key: string]: any;
    }
    prefix: any;
    suffix: any;
    prepend: any;
    append: any;
    markup: any;
    template: any; // @todo
    component: any; // @todo
    schema: any; // @todo
    hooks: Array<Hook>;
}

interface IFields {
    [key: string]: IField;
}

interface ISchema { 
    properties: {
        [key: string]: any; // @todo (Ajv)
    }
    [key: string]: any;
}