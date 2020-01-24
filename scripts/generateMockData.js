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
                    userId: {
                        type: 'integer',
                        unique: true,
                        minimum: 1
                    },
                    displayName: {
                        type: 'string',
                        faker: 'name.findName'
                    }
                },
                required: ['userId', 'displayName']
            }
        },
        workouts: {
            type: 'array',
            minItems: 3,
            maxItems: 5,
            items: {
                type: 'object',
                properties: {
                    workoutId: {
                        type: 'integer',
                        unique: true,
                        minimum: 1
                    },
                    workoutName: {
                        type: 'string',
                        faker: 'lorem.word'
                    },
                    workoutExercises: {
                        type: 'array',
                        minItems: 3,
                        maxItems: 5,
                        items: {
                            type: 'object',
                            properties: {
                                exerciseId: {
                                    type: 'integer',
                                    unique: true,
                                    minimum: 1
                                },
                                exerciseName: {
                                    type: 'string',
                                    enum: [
                                        'Squat',
                                        'Bench Press',
                                        'Barbell Row',
                                        'OH Press',
                                        'Deadlift'
                                    ]
                                },
                                numSets: {
                                    type: 'integer',
                                    minimum: 3,
                                    maximum: 10
                                },
                                numReps: {
                                    type: 'integer',
                                    minimum: 5,
                                    maximum: 10
                                },
                                weight: {
                                    type: 'integer',
                                    minimum: 40,
                                    maximum: 300
                                }
                            },
                            required: [
                                'exerciseId',
                                'exerciseName',
                                'numSets',
                                'numReps',
                                'weight'
                            ]
                        }
                    }
                },
                required: ['workoutId', 'workoutName', 'workoutExercises']
            }
        },
        exercises: {
            type: 'array',
            minItems: 3,
            maxItems: 5,
            items: {
                type: 'object',
                properties: {
                    exerciseName: {
                        type: 'string',
                        enum: [
                            'Squat',
                            'Bench Press',
                            'Barbell Row',
                            'OH Press',
                            'Deadlift'
                        ]
                    },
                    numSets: {
                        type: 'integer',
                        minimum: 3,
                        maximum: 10
                    },
                    numReps: {
                        type: 'integer',
                        minimum: 5,
                        maximum: 10
                    },
                    weight: {
                        type: 'integer',
                        minimum: 40,
                        maximum: 300
                    },
                    sets: {
                        type: 'array',
                        minItems: 3,
                        maxItems: 10,
                        items: {
                            type: 'object',
                            properties: {
                                completedReps: {
                                    type: 'integer',
                                    minimum: 0,
                                    maximum: 10
                                }
                            },
                            required: ['completedReps']
                        }
                    }
                },
                required: [
                    'exerciseName',
                    'numSets',
                    'numReps',
                    'weight',
                    'sets'
                ]
            }
        }
    },
    required: ['users', 'workouts']
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
