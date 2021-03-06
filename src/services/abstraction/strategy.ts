import { StrategyException } from "../../common/exceptions/strategy.exception";

export abstract class Strategy<T, E> {

    constructor(
        protected _type: string,
        protected _types: string[],
        protected _defaultType?: string
    ) {
        if (!!this._type && !this._types.includes(this._type))
            throw new StrategyException();
    }

    public call(params: T): E {
        return this[this._type || this._defaultType](params);
    }
}