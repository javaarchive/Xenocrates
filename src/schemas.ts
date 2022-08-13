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
            "type": "string",
            "facet": false,
            "optional": true
        },
        {
            "name": "score",
            "type": "int32",
            "facet": false
        }
    ] 
}