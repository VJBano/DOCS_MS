
import {body} from 'express-validator'

const Validator = {

    loginValidator: [
        body('email').not().isEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 5 }).withMessage('The minimum password length is 5 characters'),
    ],
    documentValidator:[
        body('doc_name').not().isEmpty().withMessage("Document name cannot be Empty"),
        body('doc_description').not().isEmpty().withMessage("description cannot be Empty"),
        body('permitted_user').isArray().withMessage('permitted user must be an array'),
        body('permitted_user.*').isString().withMessage('Each element in permitted_user must be a string'),
    ],
    
    userValidator: [
        body('firstname').not().isEmpty().withMessage('firstname cannot be empty!'),
        body('lastname').not().isEmpty().withMessage('lastname cannot be empty!'),
        body('email').not().isEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 5 }).withMessage('The minimum password length is 5 characters'),
        body('role').not().isEmpty().withMessage('role cannot be empty!'),

    ]

}

export default Validator