// import {BaseNodeType} from '../../../nodes/_Base';

export enum AssemblerName {
	GL_MESH_BASIC = 'GL_MESH_BASIC',
	GL_MESH_LAMBERT = 'GL_MESH_LAMBERT',
	GL_MESH_STANDARD = 'GL_MESH_STANDARD',
	GL_PARTICLES = 'GL_PARTICLES',
	GL_POINTS = 'GL_POINTS',
	GL_TEXTURE = 'GL_TEXTURE',
	GL_VOLUME = 'GL_VOLUME',
}

export interface ControllerAssemblerPair {
	controller: any;
	assembler: any;
}

export class BaseAssemblersRegister {
	protected _controller_assembler_by_name: Map<AssemblerName, ControllerAssemblerPair> = new Map();

	register_assembler(name: AssemblerName, controller: any, assembler: any) {
		this._controller_assembler_by_name.set(name, {
			controller: controller,
			assembler: assembler,
		});
	}

	unregister_assembler(name: AssemblerName) {
		this._controller_assembler_by_name.delete(name);
	}
}
