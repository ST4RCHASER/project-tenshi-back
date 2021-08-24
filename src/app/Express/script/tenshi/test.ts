import express,{Router} from 'express';
import { RESTResp } from '@yukiTenshi/utils'
const router = express.Router();
router.all('/', (_, res) => {
    const response: RESTResp<never> = {
        success: true,
        statusCode: 200,
        message: 'Here is test path in: /tenshi/test.js',
    }
    res.status(200).send(response)
})
export default router;