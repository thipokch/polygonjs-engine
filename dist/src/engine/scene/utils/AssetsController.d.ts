import { StringParam } from '../../params/String';
export declare class SceneAssetsController {
    private _params_by_id;
    register_param(param: StringParam): void;
    deregister_param(param: StringParam): void;
    traverse_params(callback: (param: StringParam) => void): void;
}