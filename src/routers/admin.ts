import express from 'express';
const router: express.Router = express.Router();

import {getStats} from '../controllers/admin';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/stats').get(authentication, restrictFunctionalityTo('admin'), getStats);

export default router;