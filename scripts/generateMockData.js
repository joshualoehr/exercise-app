/* eslint-disable no-console */

import jsf from 'json-schema-faker';
import fs from 'fs';
import chalk from 'chalk';

const schema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
        users: {
            type: 'array',
            minItems: 3,
            maxItems: 5,
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        unique: true,
                        minimum: 1
                    },
                    firstName: {
                        type: 'string',
                        faker: 'name.firstName'
                    },
                    lastName: {
                        type: 'string',
                        faker: 'name.lastName'
                    },
                    email: {
                        type: 'string',
                        faker: 'internet.email'
                    }
                },
                required: ['id', 'firstName', 'lastName', 'email']
            }
        }
    },
    required: ['users']
};

jsf.extend('faker', () => require('faker'));
jsf.resolve(schema)
    .then(json =>
        fs.promises.writeFile('./src/api/db.json', JSON.stringify(json))
    )
    .then(() => {
        console.log(chalk.green('Mock data generated.'));
    })
    .catch(err => {
        console.log(chalk.red(err));
    });
