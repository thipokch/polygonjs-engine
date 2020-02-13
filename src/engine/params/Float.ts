// import lodash_isArray from 'lodash/isArray'
// import lodash_isString from 'lodash/isString'
// import lodash_isBoolean from 'lodash/isBoolean';
import lodash_isNumber from 'lodash/isNumber';
import {TypedNumericParam} from './_Numeric';
import {ParamType} from '../poly/ParamType';
import {CoreString} from 'src/core/String';
import {ParamInitValuesTypeMap} from './types/ParamInitValuesTypeMap';
import {ParamValuesTypeMap} from './types/ParamValuesTypeMap';

export class FloatParam extends TypedNumericParam<ParamType.FLOAT> {
	static type() {
		return ParamType.FLOAT;
	}
	get default_value_serialized() {
		return this.default_value;
	}
	get value_serialized() {
		return this.value;
	}
	static are_values_equal(val1: ParamValuesTypeMap[ParamType.FLOAT], val2: ParamValuesTypeMap[ParamType.FLOAT]) {
		return val1 == val2;
	}
	static convert(raw_val: ParamInitValuesTypeMap[ParamType.FLOAT]): number | null {
		if (lodash_isNumber(raw_val)) {
			return raw_val;
		} else {
			if (CoreString.is_number(raw_val)) {
				const parsed = parseFloat(raw_val);
				if (lodash_isNumber(parsed)) {
					return parsed;
				}
			}
			return null;
		}
	}
	convert(raw_val: ParamInitValuesTypeMap[ParamType.FLOAT]): number | null {
		return FloatParam.convert(raw_val);
	}
	// convert_value(v) {
	// 	// if(lodash_isNumber(v)){
	// 	// 	//
	// 	// }
	// 	if (lodash_isBoolean(v)) {
	// 		v = v ? 1 : 0
	// 	}
	// 	if (lodash_isString(v)) {
	// 		v = parseFloat(v)
	// 	}
	// 	if (lodash_isArray(v)) {
	// 		v = v[0]
	// 	}
	// 	return this._ensure_in_range(v)
	// }
	// convert_default_value(v) {
	// 	// if(lodash_isNumber(v)){
	// 	// 	//
	// 	// }
	// 	if (lodash_isBoolean(v)) {
	// 		v = v ? 1 : 0
	// 	}
	// 	// if(lodash_isString(v)){
	// 	// 	v = parseFloat(v)
	// 	// }
	// 	if (lodash_isArray(v)) {
	// 		v = v[0]
	// 	}
	// 	return v
	// }

	// is_value_expression(v) {
	// 	//console.log("is_value_expression", this, v, !lodash_isNumber(v))
	// 	//!lodash_isNumber(v)
	// 	return `${v}` !== `${parseFloat(v)}`
	// }
}
