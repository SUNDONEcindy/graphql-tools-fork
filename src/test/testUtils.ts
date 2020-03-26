import { expect } from 'chai';
import { GraphQLObjectType } from 'graphql';

import { healSchema } from '../utils';
import { toConfig } from '../polyfills';
import { makeExecutableSchema } from '../generate';

describe('heal', () => {
  it('should prune empty types', () => {
    const schema = makeExecutableSchema({
      typeDefs: `
      type WillBeEmptyObject {
        willBeRemoved: String
      }

      type Query {
        someQuery: WillBeEmptyObject
      }
      `,
    });
    const originalTypeMap = schema.getTypeMap();

    const config = toConfig(originalTypeMap['WillBeEmptyObject']);
    originalTypeMap['WillBeEmptyObject'] = new GraphQLObjectType({
      ...config,
      fields: {},
    });

    healSchema(schema);

    const healedTypeMap = schema.getTypeMap();
    expect(healedTypeMap).not.to.haveOwnProperty('WillBeEmptyObject');
  });
});
