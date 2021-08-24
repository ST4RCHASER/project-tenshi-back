import express from 'express';
import { RESTResp } from '@yukiTenshi/utils'
const router = express.Router();
router.all('/', (_, res) => {
    const response: RESTResp<object> = {
        success: true,
        statusCode: 200,
        message: 'Welcome to Yuki-Tenshi project!',
        content: {
            guide: "You can change this message by edit file in: app/Express/script/index.ts"
        }
    }
    res.status(200).send(response)
})
export default router;