import {ParamJsonExporter, ParamJsonExporterDataByName} from '../Param';
// import {JsonExporterVisitor} from '../Visitor';
import {TypedMultipleParam} from 'src/engine/params/_Multiple';
import {JsonExportDispatcher} from '../Dispatcher';

export class ParamMultipleJsonExporter extends ParamJsonExporter<TypedMultipleParam<any>> {
	add_main() {
		const components_data: ParamJsonExporterDataByName = {};
		const component_names = this._param.component_names;
		this._param.components?.forEach((component, i) => {
			const exporter = JsonExportDispatcher.dispatch_param(component); //.accepts_visitor();
			components_data[component_names[i]] = exporter.data();
		});

		this._data['components'] = components_data;
	}
}