import {BaseHttpController, controller, httpGet, results} from 'inversify-express-utils';

@controller('/')
export class IndexController extends BaseHttpController {
    @httpGet('/status')
    private index(): results.JsonResult {
        return this.json({status: 'ok'});
    }
}
