import {PolyScene} from 'src/engine/scene/PolyScene';
// import {JsonImporterVisitor} from './Visitor'
import {SceneJsonExporterData} from '../export/Scene';
import {JsonImportDispatcher} from './Dispatcher';

export class SceneJsonImporter {
	constructor(private _data: SceneJsonExporterData) {}

	scene(): PolyScene {
		const scene = new PolyScene();
		scene.loading_controller.mark_as_loading();

		// scene.set_js_version(this._data['__js_version'])
		const properties = this._data['properties'];
		if (properties) {
			// scene.set_name(properties['name'])
			scene.set_frame(properties['frame'] || 1);
			const frame_range = properties['frame_range'] || [];
			scene.time_controller.set_frame_range(frame_range[0] || 1, frame_range[1] || 100);
			const frame_range_locked = properties['frame_range_locked'];
			if (frame_range_locked) {
				scene.time_controller.set_frame_range_locked(frame_range_locked[0], frame_range_locked[1]);
			}
			scene.time_controller.set_fps(properties['fps'] || 30);
			if (properties['master_camera_node_path']) {
				scene.cameras_controller.set_master_camera_node_path(properties['master_camera_node_path']);
			}
		}

		const importer = JsonImportDispatcher.dispatch_node(scene.root);
		if (this._data['root']) {
			importer.process_data(this._data['root']);
		}
		if (this._data['ui']) {
			importer.process_ui_data(this._data['ui']);
		}

		return scene;
	}
}