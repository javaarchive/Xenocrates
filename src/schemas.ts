export const defaultSchema = {
    name: "default",
    fields: [
        {
            "name": "title",
            "type": "string",
            "facet": false
        },
        {
            "name": "desc",
            "type": "string",
            "facet": false
        },{
            "name": "uri",
            "type": "string",
            "facet": false
        },{
            "name": "page_title",
            "type": "string",
            "facet": false,
            "optional": true
        },
        {
            "name": "page_desc",
            "type": "string",
            "facet": false,
            "optional": true
        },{
            "name": "page_keywords",
            "type": "string[]",
            "facet": false,
            "optional": true
        },
        {
            "name": "points",
            "type": "int32",
            "facet": false,
        },
        {
            "name": "item_type",
            "type": "string",
            "facet": false
        },
        {
            // includes port
            "name": "host",
            "type": "string",
            "facet": false,
            "optional": true
        },
        {
            "name": "platform",
            "type": "string",
            "facet": false,
            "optional": true
        },
        {
            "name": "flags",
            "type": "string[]",
            "facet": false,
            // api autofills
            "optional": false
        },
        {
            "name": "time_indexed",
            "type": "int64",
            "facet": false,
            "optional": false
        }
    ],
    "default_sorting_field": "points"
}

const fieldNameSet = new Set(defaultSchema.fields.map(field => field.name));

export function isField(name: string){
    return fieldNameSet.has(name);
}