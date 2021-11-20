import express from 'express';
import { RESTResp } from '@yukiTenshi/utils'
const router = express.Router();
router.all('/', (_, res) => {
    const response: RESTResp<never> = {
        success: true,
        statusCode: 200,
        message: 'Welcome to Project-Tenshi project!',
    }
    res.status(200).send(response)
})
export default router;