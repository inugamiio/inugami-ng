// ====================================================================================================================
// C
// ====================================================================================================================
export interface OpenApiComponentSchema {
  id: string;
  name: string;
  type?: string;
  properties?: OpenApiProperty[];

}


export interface OpenApiComponent {
  schemas?: OpenApiComponentSchema[];
  securitySchemes?: OpenApiComponentSecurityScheme[];
}

// ====================================================================================================================
// E
// ====================================================================================================================

export interface Example {
  name: string;
  summary?: string;
  value?: string;
  description?: string;
  externalValue?: string;
  extensions?: Extension[];
  display?: boolean;
}


export interface Extension {
  name: string;
  value?: string;
}

export interface ExternalDocs {
  description?: string;
  url?: String;
  extension?: any;
}

// ====================================================================================================================
// I
// ====================================================================================================================

export interface OpenApiInfo {
  title?: string;
  description?: string;
  version?: string;
}


// ====================================================================================================================
// H
// ====================================================================================================================
export interface Header {
  name: string;
  description?: string;
  externalDocs?: string;
  style?: string;
}


// ====================================================================================================================
// M
// ====================================================================================================================

export interface MediaTypeObject {
  schema?: OpenApiSchema;
  example?: any;
  examples?: any;
  encoding?: any;
}


// ====================================================================================================================
// O
// ====================================================================================================================

export interface ObjectType {
  array?: boolean;
  value?: any;
  name?: string;
}

// ====================================================================================================================
// P
// ====================================================================================================================
/** https://swagger.io/specification/#paths-object */
export interface OpenApiPathEndpoint {
  uri: string;
  url: string;
  verb: string;
  globalSummary?: string;
  globalDescription?: string;
  globalTags?: string;
  summary?: string;
  description?: string;
  tags?: string[]
  operationId?: string;
  parameters?: OpenApiPathEndpointParameter[];
  requestBody?: OpenApiPathEndpointRequestBody;
  responses?: OpenApiPathEndpointResponse [];

}


export interface OpenApiPathEndpointParameter {
  name?: string;
  in?: string;
  required?: boolean;
  description?: string;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  schema?: OpenApiSchema;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  example?: any;
  examples?: Example[];

}

export interface OpenApiPathEndpointResponse {
  status?: string;
  description?: string;
  contentType?: string;
  headers?: Header[];
  schema?: OpenApiSchema;
  examples?: Example[]
}

export interface OpenApiProperty {
  type: string;
  name?: string;
  ref?: string;
  additionalProperties?: OpenApiProperty;
  items?: OpenApiSchema
}

// ====================================================================================================================
// S
// ====================================================================================================================
export interface OpenApiSchema {
  type?: string;
  ref?: string;
  name?: string;
  format?: string;
  array?: boolean;
}

export interface OpenApiServer {
  url?: string;
  description?: string;
}


export interface OpenApiComponentSecurityScheme {
  name?: string;
  type?: string;
  scheme?: string;
}

// ====================================================================================================================
// T
// ====================================================================================================================
export interface Tags {
  name: string;
  description?: string;
  externalDocs?: ExternalDocs;
  selected?: boolean;
}

export interface TagsWrapper {
  tag?: Tags;
  tags?: Tags[];
  endpoint?: OpenApiPathEndpoint[];
  display?: boolean;
}

// ====================================================================================================================
// R
// ====================================================================================================================
export interface OpenApiPathEndpointRequestBody {
  contentType?: string;
  required?: boolean;
  schema?: OpenApiSchema;
  description?: string;
  content?: MediaTypeObject;
}

// ====================================================================================================================
// OpenApi
// ====================================================================================================================
export interface OpenApi {
  openapi?: string;
  components?: OpenApiComponent;
  externalDocs?: ExternalDocs;
  info?: OpenApiInfo;
  paths?: OpenApiPathEndpoint[];
  servers?: OpenApiServer[];
  tags?: Tags[]

}


export interface OpenApiFilter {
  verb: string[];
  uri: string;
}
