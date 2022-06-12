import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormat from 'ajv-formats';
import addErrors from 'ajv-errors';

const loginDTOSchema = Type.Object(
    {
        email: Type.String({
            format: 'email',
            errorMessage: {
                type: 'Email type must be string',
                format: 'Format email incorrect'
            }
        }),
        password: Type.String({
            errorMessage: {
                type: 'Password type must be string'
            }
        })
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: 'Object format is not valid'
        }
    }
);


const ajv = new Ajv({allErrors: true});
addFormat(ajv, ['email']).addKeyword('kind').addKeyword('modifier');
addErrors(ajv);

const validate = ajv.compile(loginDTOSchema);

const validateLoginDTO = (request, response, next) => {
    const isDTOValid = validate(request.body);
    if (!isDTOValid) return response.status(400).send(ajv.errorsText(validate.errors, {sperator: '\n'}));
    next();
};

/*const DTO_PROPERTY_NAMES = ['email', 'password'];

const loginDTOSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email'},
        password: { type: 'string'}
    },
    required: ['email', 'password'],
    additionalProperties: false
}

const validateLoginDTO = (request, response, next) => {
    const loginDto = request.body;
    if (typeof loginDto !== 'object') response.status(400).send('Body must have JSON format');
    const bodyPropertyNames = Object.keys(loginDto);
    const checkProperties = bodyPropertyNames.length === DTO_PROPERTY_NAMES
        && bodyPropertyNames.every(bodyProperty => DTO_PROPERTY_NAMES.includes(bodyProperty));
    if (!checkProperties) response.status(400).send('Body must contain email and password only');
}*/

export default validateLoginDTO;
