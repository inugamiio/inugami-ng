import {Injectable} from '@angular/core';
import {isDevMode} from '@angular/core';
import {
  Example, Extension,
  ExternalDocs, Header, ObjectType,
  OpenApi,
  OpenApiComponent,
  OpenApiComponentSchema, OpenApiComponentSecurityScheme, OpenApiInfo,
  OpenApiPathEndpoint, OpenApiPathEndpointParameter, OpenApiPathEndpointRequestBody, OpenApiPathEndpointResponse,
  OpenApiProperty, OpenApiSchema,
  OpenApiServer, Tags
} from "./open-api.model";

const VERBS: string[] = ['get', 'put', 'post', 'delete', 'options', 'patch', 'trace'];

@Injectable({providedIn: 'root'})
export class InuOpenApiServices {


  // =================================================================================================================
  // API
  // =================================================================================================================
  public convertToOpenApi(response: any): OpenApi {
    const schemaTypes: OpenApiComponent | undefined = this.unmarshallComponents(response.components);

    const result = {
      openapi: response.openapi,
      components: this.unmarshallComponents(response.components),
      externalDocs: this.unmarshallExternalDocs(response.externalDocs),
      info: this.unmarshallInfo(response.info),
      paths: this.unmarshallPaths(response.paths, schemaTypes),
      servers: this.unmarshallServers(response.servers),
      tags: this.unmarshallTags(response.tags)
    };

    return result;
  }


  // =================================================================================================================
  // PRIVATE
  // =================================================================================================================
  private unmarshallComponents(components: any): OpenApiComponent | undefined {
    if (!components) {
      return undefined;
    }
    return {
      schemas: this.unmarshallComponentsSchemas(components.schemas),
      securitySchemes: this.unmarshallComponentsSecuritySchemes(components.securitySchemes)
    };
  }

  private unmarshallComponentsSchemas(schemas: any): OpenApiComponentSchema[] | undefined {
    const result: OpenApiComponentSchema[] = [];
    if (!schemas) {
      return result;
    }

    const keys = Object.keys(schemas);
    keys.sort();
    for (let key of keys) {

      const properties: OpenApiProperty[] = [];
      const rawProperties = schemas[key].properties;
      if (rawProperties) {
        const propertyKeys = Object.keys(rawProperties);
        for (let propertyKey of propertyKeys) {
          const property = rawProperties[propertyKey];

          let additionalProperties: OpenApiProperty | undefined;
          if (property.additionalProperties) {
            additionalProperties = {
              type: property.additionalProperties.type
            }
          }

          let items: OpenApiSchema | undefined;
          if (property.items) {
            items = {
              type: property.items.type,
              format:property.items.format,
              ref: property.items['$ref'] ? property.items['$ref'] : undefined
            };
          }
          const propertyItem: OpenApiProperty = {
            type: property.type,
            ref:property['$ref'],
            name: propertyKey
          };

          if (additionalProperties) {
            propertyItem.additionalProperties = additionalProperties;
          }
          if (items) {
            propertyItem.items = items;
          }

          properties.push(propertyItem);
        }
      }

      result.push({
        id: `#/components/schemas/${key}`,
        name: key,
        type: schemas[key].type,
        properties: properties
      });
    }

    return result;
  }

  private unmarshallComponentsSecuritySchemes(schemas: any): OpenApiComponentSecurityScheme[] | undefined {
    const result: OpenApiComponentSecurityScheme[] = [];
    if (!schemas) {
      return result;
    }

    const keys = Object.keys(schemas);
    keys.sort();
    for (let key of keys) {
      const value = schemas[key];
      result.push({
        name: key,
        type: value.type,
        scheme: value.scheme
      });
    }

    return result;
  }

  private unmarshallExternalDocs(externalDocs: any): ExternalDocs | undefined {
    return !externalDocs ? undefined : {
      url: externalDocs.url,
      description: externalDocs.description,
      extension: this.unmarshallExtension(externalDocs)
    };
  }

  private unmarshallInfo(info: any): OpenApiInfo | undefined {
    return {
      title: info.title,
      description: info.description,
      version: info.version
    }
  }

  private unmarshallServers(servers: any): OpenApiServer[] | undefined {
    const result: OpenApiServer[] = [];
    if (!servers) {
      return result;
    }
    for (let server of servers) {
      result.push({
        url: server.url,
        description: server.description
      });
    }
    return result;
  }


  private unmarshallPaths(paths: any, schemaTypes: OpenApiComponent | undefined): OpenApiPathEndpoint[] {
    const result: OpenApiPathEndpoint[] = [];
    if (!paths) {
      return result;
    }

    const keys = Object.keys(paths);
    keys.sort();
    for (let key of keys) {
      const path = paths[key];
      const verbKeys = Object.keys(path);
      verbKeys.sort();

      for (let verbKey of verbKeys) {
        if (this.isVerb(verbKey)) {
          const openApiEndpoint = path[verbKey];
          const endpoint: OpenApiPathEndpoint = {
            uri: `${verbKey}_${key}`,
            url: key,
            verb: verbKey,
            tags: openApiEndpoint.tags,
            operationId: openApiEndpoint.operationId,
            summary: openApiEndpoint.summary,
            description: openApiEndpoint.description,
            parameters: this.unmarshallEndpointParameters(openApiEndpoint.parameters),
            requestBody: this.unmarshallEndpointRequestBody(openApiEndpoint.requestBody, schemaTypes),
            responses: this.unmarshallEndpointResponse(openApiEndpoint.responses, schemaTypes),
          };
          result.push(endpoint);
        }
      }
    }

    return result;
  }

  private isVerb(verb: string): boolean {
    return verb == undefined || verb == null ? false : VERBS.indexOf(verb) != -1
  }


  private unmarshallEndpointParameters(value: any): OpenApiPathEndpointParameter[] | undefined {
    if (!value) {
      return undefined;
    }

    const result: OpenApiPathEndpointParameter[] = [];
    for (let param of value) {
      let schema: OpenApiSchema | undefined = undefined;
      if (param.schema) {
        schema = {
          type: param.schema?.type,
          ref: param.schema['$ref']
        }
      }
      result.push({
        name: param.name,
        in: param.in,
        required: param.required,
        description: param.description,
        deprecated: param.deprecated,
        allowEmptyValue: param.allowEmptyValue,
        style: param.style,
        explode: param.explode,
        allowReserved: param.allowReserved,
        example: param.example,
        examples: this.unmarshallExamples(param.examples),
        schema: schema
      });
    }

    return result;
  }

  private unmarshallExamples(value: any): Example[] {
    const result: Example[] = [];
    if (!value) {
      return result;
    }

    const keys: string[] = Object.keys(value);
    keys.sort();
    for (let key of keys) {
      result.push(this.unmarshallExample(key, value[key]));
    }
    return result;
  }

  private unmarshallExample(name: string, value: any): Example {
    const result: Example = {
      name: name,
      summary: value.summary,
      description: value.description,
      value: value.value,
      externalValue: value.externalValue
    };

    let extension: any = {};

    const keys = Object.keys(value);
    keys.sort();
    for (let key of keys) {
      if (key.startsWith('x-')) {
        const field = key.substring(2);
        if (field) {
          extension[field] = value[key];
        }
      }
    }


    return result;
  }

  private unmarshallEndpointRequestBody(value: any, schemaTypes: OpenApiComponent | undefined): OpenApiPathEndpointRequestBody | undefined {
    if (!value) {
      return undefined;
    }

    let contentType: string | undefined;
    let schema: OpenApiSchema | undefined;

    if (value.content) {
      contentType = Object.keys(value.content)[0];
      const objectType = this.renderType(value.content[contentType].schema, schemaTypes);
      schema = {
        type: value.content[contentType].schema.type,
        ref: objectType?.value,
        array: objectType?.array,
        name: objectType?.name
      }
    }

    return {
      contentType: contentType,
      schema: schema,
      required: value.required
    };
  }

  private unmarshallEndpointResponse(value: any, schemaTypes: OpenApiComponent | undefined): OpenApiPathEndpointResponse[] | undefined {
    if (!value) {
      return undefined;
    }
    const result: OpenApiPathEndpointResponse[] = [];
    const keys = Object.keys(value);

    keys.sort();
    for (let key of keys) {
      const response = value[key];
      let contentType: string | undefined;
      let schema: OpenApiSchema | undefined;

      let examples: Example[] = [];
      if (response.content) {
        contentType = Object.keys(response.content)[0];
        const responseContent = response.content[contentType];
        const rawSchema: any = responseContent.schema;


        if (responseContent.examples) {
          examples = this.unmarshallEndpointResponseExample(responseContent.examples);
        }
        if (rawSchema) {
          let type: string | undefined = rawSchema.type;

          let ref: string | undefined = rawSchema['$ref']
          if (rawSchema['items']) {
            let items: any = rawSchema['items']
            ref = items ? items['$ref'] : undefined;
          }
          const objectType = this.renderType(value.content[contentType].schema, schemaTypes);
          schema = {
            type: type,
            ref: objectType?.value,
            array: objectType?.array,
            name: objectType?.name
          }
        }
      }


      result.push({
        status: key,
        description: response.description,
        contentType: contentType,
        headers: this.unmarshallEndpointResponseHeader(response.headers),
        schema: schema,
        examples: examples.length > 0 ? examples : undefined
      });
    }

    return result;
  }

  private unmarshallEndpointResponseHeader(value: any): undefined | Header[] {
    if (!value) {
      return undefined;
    }
    const result: Header[] = [];

    const keys: string[] = Object.keys(value);
    keys.sort();

    for (let key of keys) {
      const item = value[key];
      result.push({
        name: key,
        description: item.description,
        externalDocs: item.externalDocs,
        style: item.style
      });
    }

    return result;
  }

  private unmarshallEndpointResponseExample(value: any): Example[] {
    const result: Example[] = [];

    const keys: string[] = Object.keys(value);
    keys.sort();
    for (let key of keys) {
      const item = value[key];

      let valueContent = undefined;
      if (item.value) {
        if (typeof item.value == 'string') {
          valueContent = item.value;
        } else {
          valueContent = JSON.stringify(item.value, null, 2);
        }
      }

      result.push({
        name: key,
        summary: item.summary,
        description: item.externalDocs,
        value: valueContent,
        externalValue: item.externalValue,
        extensions: this.extractExtension(item)
      });
    }

    return result;
  }


  private extractExtension(value: any): Extension[] | undefined {
    if (!value) {
      return undefined;
    }
    const result: Extension[] = [];

    const keys: string[] = Object.keys(value);
    keys.sort();
    for (let key of keys) {
      if (key.startsWith('x-')) {
        result.push({
          name: key.substring(2),
          value: value[key]
        });
      }
    }

    return result.length == 0 ? undefined : result;
  }


  private unmarshallTags(value: any): Tags[] {
    const result: Tags[] = [];
    if (value == undefined || !Array.isArray(value)) {
      return result;
    }

    for (let tag of value) {
      if (tag.name) {
        const currentTag: Tags = {name: tag.name}
        if (tag.description) {
          currentTag.description = tag.description;
        }
        const externalDoc = this.unmarshallExternalDocs(tag.externalDocs);
        if (externalDoc) {
          currentTag.externalDocs = externalDoc;
        }

        result.push(currentTag);
      }

    }

    return result;
  }

  private unmarshallExtension(value: any): any | undefined {
    if (!value) {
      return undefined;
    }

    const result: any = {};
    const keys = Object.keys(value);
    keys.sort();

    for (let key of keys) {
      if (key.startsWith("x-")) {
        result[key.substring(2)] = value[key];
      }
    }

    return result;
  }


  private renderType(schema: any, schemaTypes: OpenApiComponent | undefined, level?:number): ObjectType | undefined {
    if (!schema) {
      return undefined;
    }

    const array = schema.type == 'array';
    let type: string = '';
    if (array) {
      if (schema.items) {
        type = schema.items['$ref'];
      }
    } else {
      type = schema.ref;
    }

    let currentType: any = undefined;
    if (schemaTypes?.schemas) {
      for (let item of schemaTypes?.schemas) {
        if (type == item.id) {
          currentType = item;
          break;
        }
      }
    }

    let object: any = {};
    if (currentType && currentType.properties) {
      object = this.convertObjectPropertiesToObject(currentType.properties,
        currentType.example?currentType.example:{},
        schemaTypes,
        level?level+1:0);
    }

    const result: ObjectType = {
      array: array,
      name: currentType?.name,
      value: array ? [object] : object
    }
    return result;
  }

  private convertObjectPropertiesToObject(properties: any,
                                          example:any,
                                          schemaTypes: OpenApiComponent | undefined,level:number): any {
    if (!properties) {
      return undefined;
    }
    if(level>20){
      return {};
    }
    const object: any = {};
    for (let property of properties) {
      if (!property.name) {
        continue;
      }
      const type = property.type ? property.type : 'object';
      const sample =example[property.name];

      switch (type) {
        case 'string':
          if('date' == property.format){
            object[property.name] = sample?sample:'yyyyMMdd';
          }else if('date-time' == property.format){
            object[property.name] = sample?sample:'yyyyMMddTHH:mm:ss';
          }else{
            object[property.name] = sample?sample:'string';
          }

          break
        case 'number':
          if ('float' == property.format || 'double' == property.format) {
            object[property.name] = sample?sample:0.0;
          } else {
            object[property.name] = sample?sample:0;
          }
          break
        case 'integer':
          object[property.name] = sample?sample:0;
          break
        case 'boolean':
          object[property.name] = false;
          break;
        case 'array':
          object[property.name] = this.convertArray(property,property.example?property.example:{},schemaTypes,level+1);
          break;
        default:
          const subType= this.renderType({ref:property.ref},schemaTypes, level+1 );
          object[property.name] =subType?.value;
          break;
      }

    }
    return object;
  }

  private convertArray(property: any, example:any,schemaTypes:OpenApiComponent | undefined, level:number): any[] {
    const result:any = [];
    const type = property.type ? property.type : 'object';
    const sample =example[property.name];
    switch (type) {
      case 'string':
        if('date' == property.format){
          result.push(sample?sample:'yyyyMMdd');
        }else if('date-time' == property.format){
          result.push(sample?sample:'yyyyMMddTHH:mm:ss');
        }else{
          result.push(sample?sample:'string');
        }
        break
      case 'number':
        if ('float' == property.format || 'double' == property.format) {
          result.push(sample?sample:0.0 );
        } else {
          result.push(sample?sample:0);
        }
        break
      case 'integer':
        result.push(sample?sample:0);
        break
      case 'boolean':
        result.push(false);
        break;
      default:
        const subType= this.renderType({ref:property.ref},schemaTypes, level+1 );
        result.push(subType?subType.value:{});
        break;
    }
    return result;
  }
}
