export interface GetResponse<Document> {
    doc: Document;
}

export interface MLTResponse<Document> {
    match: {
        docs: Document[];
        numFound: number;
        numFoundExact: boolean;
        start: number;
    };
    response: {
        docs: Document[];
        numFound: number;
        numFoundExact: boolean;
        start: number;
    };
}

export interface QueryRequest {
    facet?: Record<string, unknown>;
    fields?: string[];
    filter?: string | string[];
    limit?: number;
    offset?: number;
    params?: Record<string, number | string>;
    queries?: unknown;
    query: string;
    sort?: string | string[];
}

export interface QueryResponse<Document> {
    highlighting?: Record<string, Record<string, string[]>>;
    response: {
        docs: Document[];
        numFound: number;
        numFoundExact: boolean;
        start: number;
    };
    responseHeader: {
        params: Record<string, number | string>;
        QTime: number;
        status: number;
    };
    spellcheck?: {
        collations: string[];
        suggestions: (
            | {
                  endOffset: number;
                  numFound: number;
                  startOffset: number;
                  suggestion: string[];
              }
            | string
        )[];
    };
}
