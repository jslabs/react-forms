import * as React from "react";
import { InputTemplate, HtmlTemplate, ElementGroupTemplate } from "./templates";

export function FormElementFactory(spec: IFormElementSpec, context: IFormManagerContext) {

    spec.props = {
        ...{
            "name": spec.key,
            "id": spec.props?.name || spec.key,
        },
        ...spec.props,
    }

    if (!spec.templates) {
        spec.templates = { element: null, group: true };
    }

    if (!spec.templates?.element) {
        spec.templates.element = (!spec.html) ? InputTemplate : HtmlTemplate;
    }

    if ((!spec.templates?.group && spec.templates?.group !== false) || spec.templates?.group === true) {
        spec.templates.group = ElementGroupTemplate;
    }

    if (spec.hooks && spec.hooks.length) {
        for (const hook of spec.hooks) {
            hook(spec, context);
        }
    }

    let element = React.createElement(spec.templates.element, {spec});

    if (spec.templates?.group) {
        return React.createElement(spec.templates.group, {spec}, element);
    }

    return element;

}

export function FormElementGroupFactory(spec: IFormElementSpec, context: IFormManagerContext) {

    if (!spec.templates) {
        spec.templates = { element: null, group: true };
    }

    if ((!spec.templates?.group && spec.templates?.group !== false) || spec.templates?.group === true) {
        spec.templates.group = ElementGroupTemplate;
    }

    let elements = spec.group.map((element, index) => {

        element.props = {
            ...{
                "name": spec.key,
                "id": (element.props?.name || spec.key) + `_${index}`,
            },
            ...spec.props,
            ...element.props,
        }

        element.key = element.props.id;

        if (!element.templates) {
            element.templates = { element: null, group: false };
        }

        if (!element.templates?.element) {
            element.templates.element = (spec.templates?.element) ? spec.templates.element : ((!element.html) ? InputTemplate : HtmlTemplate);
        }

        if (element.templates?.group === true) {
            element.templates.group = ElementGroupTemplate;
        }

        element.hooks = [...spec.hooks || [], ...element.hooks || []];

        if (element.hooks.length) {
            for (const hook of element.hooks) {
                hook(element, context);
            }
        }

        let template = element.templates.element;
        let props: TElementProps = { spec: element };
        let children: React.ReactChild = null;

        if (element.templates?.group) {
            children = React.createElement(template, props);
            template = element.templates.group;
        }

        props.key = element.key;

        return React.createElement(template, props, children);

    });

    if (spec.templates?.group) {
        return React.createElement(spec.templates.group, {spec}, elements);
    }

    return elements;

}