import {BaseCommand} from './_Base';
// import {BaseNode} from 'src/Engine/Node/_Base'
// import {BaseParamType} from 'src/engine/params/_Base';
import {ParamType} from 'src/engine/poly/ParamType';
import {ParamConstructorMap} from 'src/engine/params/types/ParamConstructorMap';
import {ParamValuesTypeMap} from 'src/engine/params/types/ParamValuesTypeMap';

export class ParamSetCommand<T extends ParamType> extends BaseCommand {
	private _old_expression: string | undefined;

	constructor(
		private _param: ParamConstructorMap[T],
		private _new_value: ParamValuesTypeMap[T],
		private _old_value?: ParamValuesTypeMap[T]
	) {
		super();

		if (this._param.has_expression()) {
			this._old_expression = this._param.expression_controller?.expression;
		} else {
			if (this._old_value === undefined) {
				this._old_value = this._param.value as never;
			}
		}
	}

	do() {
		this._param.set(this._new_value as never);
		console.log('do', this._param.name, this._new_value);
	}

	undo() {
		if (this._old_expression) {
			this._param.set(this._old_expression as never);
			console.log('undo expr', this._param.name, this._old_expression);
		} else {
			this._param.set(this._old_value as never);
			console.log('undo val', this._param.name, this._old_value);
		}
	}
}
