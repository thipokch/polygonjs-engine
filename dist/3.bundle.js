(window.webpackJsonpPOLY=window.webpackJsonpPOLY||[]).push([[3],{499:function(e,t,s){"use strict";s.d(t,"a",(function(){return o}));var r=s(8),a=new r.a,n=new r.a;function o(e,t){if(e=e||[],this.bones=e.slice(0),this.boneMatrices=new Float32Array(16*this.bones.length),this.frame=-1,void 0===t)this.calculateInverses();else if(this.bones.length===t.length)this.boneInverses=t.slice(0);else{console.warn("THREE.Skeleton boneInverses is the wrong length."),this.boneInverses=[];for(var s=0,a=this.bones.length;s<a;s++)this.boneInverses.push(new r.a)}}Object.assign(o.prototype,{calculateInverses:function(){this.boneInverses=[];for(var e=0,t=this.bones.length;e<t;e++){var s=new r.a;this.bones[e]&&s.getInverse(this.bones[e].matrixWorld),this.boneInverses.push(s)}},pose:function(){var e,t,s;for(t=0,s=this.bones.length;t<s;t++)(e=this.bones[t])&&e.matrixWorld.getInverse(this.boneInverses[t]);for(t=0,s=this.bones.length;t<s;t++)(e=this.bones[t])&&(e.parent&&e.parent.isBone?(e.matrix.getInverse(e.parent.matrixWorld),e.matrix.multiply(e.matrixWorld)):e.matrix.copy(e.matrixWorld),e.matrix.decompose(e.position,e.quaternion,e.scale))},update:function(){for(var e=this.bones,t=this.boneInverses,s=this.boneMatrices,r=this.boneTexture,o=0,i=e.length;o<i;o++){var l=e[o]?e[o].matrixWorld:n;a.multiplyMatrices(l,t[o]),a.toArray(s,16*o)}void 0!==r&&(r.needsUpdate=!0)},clone:function(){return new o(this.bones,this.boneInverses)},getBoneByName:function(e){for(var t=0,s=this.bones.length;t<s;t++){var r=this.bones[t];if(r.name===e)return r}},dispose:function(){this.boneTexture&&(this.boneTexture.dispose(),this.boneTexture=void 0)}})},504:function(e,t,s){"use strict";s.r(t),s.d(t,"GLTFLoader",(function(){return z}));var r=s(41),a=s(181),n=s(34),o=s(3),i=s(5),l=s(0),c=s(4),u=s(130),p=s(70),h=s(23),d=s(134),m=s(67),f=s(52),v=s(59),g=s(37),T=s(231),y=s(35),S=s(25),M=s(186),R=s(6),x=s(11),b=s(8),w=s(17),A=s(38),E=s(182),_=s(58),L=s(86),I=s(10),P=s(44),O=s(32),H=s(131),U=s(61),C=s(72),N=s(185),F=s(104),D=s(499),G=s(180),k=s(39),K=s(132),j=s(184),B=s(2),V=s(1),X=s(78),z=function(){function e(e){S.a.call(this,e),this.dracoLoader=null,this.ddsLoader=null}function t(){var e={};return{get:function(t){return e[t]},add:function(t,s){e[t]=s},remove:function(t){delete e[t]},removeAll:function(){e={}}}}e.prototype=Object.assign(Object.create(S.a.prototype),{constructor:e,load:function(e,t,s,r){var a,n=this;a=""!==this.resourcePath?this.resourcePath:""!==this.path?this.path:M.a.extractUrlBase(e),n.manager.itemStart(e);var o=function(t){r?r(t):console.error(t),n.manager.itemError(e),n.manager.itemEnd(e)},i=new p.a(n.manager);i.setPath(this.path),i.setResponseType("arraybuffer"),i.setRequestHeader(this.requestHeader),"use-credentials"===n.crossOrigin&&i.setWithCredentials(!0),i.load(e,(function(s){try{n.parse(s,a,(function(s){t(s),n.manager.itemEnd(e)}),o)}catch(e){o(e)}}),s,o)},setDRACOLoader:function(e){return this.dracoLoader=e,this},setDDSLoader:function(e){return this.ddsLoader=e,this},parse:function(e,t,r,a){var n,o={};if("string"==typeof e)n=e;else if(M.a.decodeText(new Uint8Array(e,0,4))===J){try{o[s.KHR_BINARY_GLTF]=new $(e)}catch(e){return void(a&&a(e))}n=o[s.KHR_BINARY_GLTF].content}else n=M.a.decodeText(new Uint8Array(e));var i=JSON.parse(n);if(void 0===i.asset||i.asset.version[0]<2)a&&a(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));else{if(i.extensionsUsed)for(var l=0;l<i.extensionsUsed.length;++l){var c=i.extensionsUsed[l],u=i.extensionsRequired||[];switch(c){case s.KHR_LIGHTS_PUNCTUAL:o[c]=new W(i);break;case s.KHR_MATERIALS_CLEARCOAT:o[c]=new q;break;case s.KHR_MATERIALS_UNLIT:o[c]=new Y;break;case s.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:o[c]=new re;break;case s.KHR_DRACO_MESH_COMPRESSION:o[c]=new ee(i,this.dracoLoader);break;case s.MSFT_TEXTURE_DDS:o[c]=new z(this.ddsLoader);break;case s.KHR_TEXTURE_TRANSFORM:o[c]=new te;break;case s.KHR_MESH_QUANTIZATION:o[c]=new ae;break;default:u.indexOf(c)>=0&&console.warn('THREE.GLTFLoader: Unknown extension "'+c+'".')}}var p=new Le(i,o,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,manager:this.manager});p.fileLoader.setRequestHeader(this.requestHeader),p.parse(r,a)}}});var s={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:"KHR_materials_pbrSpecularGlossiness",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",MSFT_TEXTURE_DDS:"MSFT_texture_dds"};function z(e){if(!e)throw new Error("THREE.GLTFLoader: Attempting to load .dds texture without importing DDSLoader");this.name=s.MSFT_TEXTURE_DDS,this.ddsLoader=e}function W(e){this.name=s.KHR_LIGHTS_PUNCTUAL;var t=e.extensions&&e.extensions[s.KHR_LIGHTS_PUNCTUAL]||{};this.lightDefs=t.lights||[]}function Y(){this.name=s.KHR_MATERIALS_UNLIT}function q(){this.name=s.KHR_MATERIALS_CLEARCOAT}W.prototype.loadLight=function(e){var t,s=this.lightDefs[e],r=new c.a(16777215);void 0!==s.color&&r.fromArray(s.color);var a=void 0!==s.range?s.range:0;switch(s.type){case"directional":(t=new u.a(r)).target.position.set(0,0,-1),t.add(t.target);break;case"point":(t=new H.a(r)).distance=a;break;case"spot":(t=new K.a(r)).distance=a,s.spot=s.spot||{},s.spot.innerConeAngle=void 0!==s.spot.innerConeAngle?s.spot.innerConeAngle:0,s.spot.outerConeAngle=void 0!==s.spot.outerConeAngle?s.spot.outerConeAngle:Math.PI/4,t.angle=s.spot.outerConeAngle,t.penumbra=1-s.spot.innerConeAngle/s.spot.outerConeAngle,t.target.position.set(0,0,-1),t.add(t.target);break;default:throw new Error('THREE.GLTFLoader: Unexpected light type, "'+s.type+'".')}return t.position.set(0,0,0),t.decay=2,void 0!==s.intensity&&(t.intensity=s.intensity),t.name=s.name||"light_"+e,Promise.resolve(t)},Y.prototype.getMaterialType=function(){return A.a},Y.prototype.extendParams=function(e,t,s){var r=[];e.color=new c.a(1,1,1),e.opacity=1;var a=t.pbrMetallicRoughness;if(a){if(Array.isArray(a.baseColorFactor)){var n=a.baseColorFactor;e.color.fromArray(n),e.opacity=n[3]}void 0!==a.baseColorTexture&&r.push(s.assignTexture(e,"map",a.baseColorTexture))}return Promise.all(r)},q.prototype.getMaterialType=function(){return E.a},q.prototype.extendParams=function(e,t,s){var r=[],a=t.extensions[this.name];if(void 0!==a.clearcoatFactor&&(e.clearcoat=a.clearcoatFactor),void 0!==a.clearcoatTexture&&r.push(s.assignTexture(e,"clearcoatMap",a.clearcoatTexture)),void 0!==a.clearcoatRoughnessFactor&&(e.clearcoatRoughness=a.clearcoatRoughnessFactor),void 0!==a.clearcoatRoughnessTexture&&r.push(s.assignTexture(e,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),void 0!==a.clearcoatNormalTexture&&(r.push(s.assignTexture(e,"clearcoatNormalMap",a.clearcoatNormalTexture)),void 0!==a.clearcoatNormalTexture.scale)){var n=a.clearcoatNormalTexture.scale;e.clearcoatNormalScale=new B.a(n,n)}return Promise.all(r)};var J="glTF",Z=1313821514,Q=5130562;function $(e){this.name=s.KHR_BINARY_GLTF,this.content=null,this.body=null;var t=new DataView(e,0,12);if(this.header={magic:M.a.decodeText(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==J)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");for(var r=new DataView(e,12),a=0;a<r.byteLength;){var n=r.getUint32(a,!0);a+=4;var o=r.getUint32(a,!0);if(a+=4,o===Z){var i=new Uint8Array(e,12+a,n);this.content=M.a.decodeText(i)}else if(o===Q){var l=12+a;this.body=e.slice(l,l+n)}a+=n}if(null===this.content)throw new Error("THREE.GLTFLoader: JSON content not found.")}function ee(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=s.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}function te(){this.name=s.KHR_TEXTURE_TRANSFORM}function se(e){_.a.call(this),this.isGLTFSpecularGlossinessMaterial=!0;var t=["#ifdef USE_SPECULARMAP","\tuniform sampler2D specularMap;","#endif"].join("\n"),s=["#ifdef USE_GLOSSINESSMAP","\tuniform sampler2D glossinessMap;","#endif"].join("\n"),r=["vec3 specularFactor = specular;","#ifdef USE_SPECULARMAP","\tvec4 texelSpecular = texture2D( specularMap, vUv );","\ttexelSpecular = sRGBToLinear( texelSpecular );","\t// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture","\tspecularFactor *= texelSpecular.rgb;","#endif"].join("\n"),a=["float glossinessFactor = glossiness;","#ifdef USE_GLOSSINESSMAP","\tvec4 texelGlossiness = texture2D( glossinessMap, vUv );","\t// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture","\tglossinessFactor *= texelGlossiness.a;","#endif"].join("\n"),n=["PhysicalMaterial material;","material.diffuseColor = diffuseColor.rgb;","vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );","float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );","material.specularRoughness = max( 1.0 - glossinessFactor, 0.0525 );// 0.0525 corresponds to the base mip of a 256 cubemap.","material.specularRoughness += geometryRoughness;","material.specularRoughness = min( material.specularRoughness, 1.0 );","material.specularColor = specularFactor.rgb;"].join("\n"),o={specular:{value:(new c.a).setHex(16777215)},glossiness:{value:1},specularMap:{value:null},glossinessMap:{value:null}};this._extraUniforms=o,this.onBeforeCompile=function(e){for(var i in o)e.uniforms[i]=o[i];e.fragmentShader=e.fragmentShader.replace("uniform float roughness;","uniform vec3 specular;"),e.fragmentShader=e.fragmentShader.replace("uniform float metalness;","uniform float glossiness;"),e.fragmentShader=e.fragmentShader.replace("#include <roughnessmap_pars_fragment>",t),e.fragmentShader=e.fragmentShader.replace("#include <metalnessmap_pars_fragment>",s),e.fragmentShader=e.fragmentShader.replace("#include <roughnessmap_fragment>",r),e.fragmentShader=e.fragmentShader.replace("#include <metalnessmap_fragment>",a),e.fragmentShader=e.fragmentShader.replace("#include <lights_physical_fragment>",n)},Object.defineProperties(this,{specular:{get:function(){return o.specular.value},set:function(e){o.specular.value=e}},specularMap:{get:function(){return o.specularMap.value},set:function(e){o.specularMap.value=e}},glossiness:{get:function(){return o.glossiness.value},set:function(e){o.glossiness.value=e}},glossinessMap:{get:function(){return o.glossinessMap.value},set:function(e){o.glossinessMap.value=e,e?(this.defines.USE_GLOSSINESSMAP="",this.defines.USE_ROUGHNESSMAP=""):(delete this.defines.USE_ROUGHNESSMAP,delete this.defines.USE_GLOSSINESSMAP)}}}),delete this.metalness,delete this.roughness,delete this.metalnessMap,delete this.roughnessMap,this.setValues(e)}function re(){return{name:s.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS,specularGlossinessParams:["color","map","lightMap","lightMapIntensity","aoMap","aoMapIntensity","emissive","emissiveIntensity","emissiveMap","bumpMap","bumpScale","normalMap","normalMapType","displacementMap","displacementScale","displacementBias","specularMap","specular","glossinessMap","glossiness","alphaMap","envMap","envMapIntensity","refractionRatio"],getMaterialType:function(){return se},extendParams:function(e,t,s){var r=t.extensions[this.name];e.color=new c.a(1,1,1),e.opacity=1;var a=[];if(Array.isArray(r.diffuseFactor)){var n=r.diffuseFactor;e.color.fromArray(n),e.opacity=n[3]}if(void 0!==r.diffuseTexture&&a.push(s.assignTexture(e,"map",r.diffuseTexture)),e.emissive=new c.a(0,0,0),e.glossiness=void 0!==r.glossinessFactor?r.glossinessFactor:1,e.specular=new c.a(1,1,1),Array.isArray(r.specularFactor)&&e.specular.fromArray(r.specularFactor),void 0!==r.specularGlossinessTexture){var o=r.specularGlossinessTexture;a.push(s.assignTexture(e,"glossinessMap",o)),a.push(s.assignTexture(e,"specularMap",o))}return Promise.all(a)},createMaterial:function(e){var t=new se(e);return t.fog=!0,t.color=e.color,t.map=void 0===e.map?null:e.map,t.lightMap=null,t.lightMapIntensity=1,t.aoMap=void 0===e.aoMap?null:e.aoMap,t.aoMapIntensity=1,t.emissive=e.emissive,t.emissiveIntensity=1,t.emissiveMap=void 0===e.emissiveMap?null:e.emissiveMap,t.bumpMap=void 0===e.bumpMap?null:e.bumpMap,t.bumpScale=1,t.normalMap=void 0===e.normalMap?null:e.normalMap,t.normalMapType=l.Tc,e.normalScale&&(t.normalScale=e.normalScale),t.displacementMap=null,t.displacementScale=1,t.displacementBias=0,t.specularMap=void 0===e.specularMap?null:e.specularMap,t.specular=e.specular,t.glossinessMap=void 0===e.glossinessMap?null:e.glossinessMap,t.glossiness=e.glossiness,t.alphaMap=null,t.envMap=void 0===e.envMap?null:e.envMap,t.envMapIntensity=1,t.refractionRatio=.98,t}}}function ae(){this.name=s.KHR_MESH_QUANTIZATION}function ne(e,t,s,r){f.a.call(this,e,t,s,r)}ee.prototype.decodePrimitive=function(e,t){var s=this.json,r=this.dracoLoader,a=e.extensions[this.name].bufferView,n=e.extensions[this.name].attributes,o={},i={},l={};for(var c in n){var u=ge[c]||c.toLowerCase();o[u]=n[c]}for(c in e.attributes){u=ge[c]||c.toLowerCase();if(void 0!==n[c]){var p=s.accessors[e.attributes[c]],h=de[p.componentType];l[u]=h,i[u]=!0===p.normalized}}return t.getDependency("bufferView",a).then((function(e){return new Promise((function(t){r.decodeDracoFile(e,(function(e){for(var s in e.attributes){var r=e.attributes[s],a=i[s];void 0!==a&&(r.normalized=a)}t(e)}),o,l)}))}))},te.prototype.extendTexture=function(e,t){return e=e.clone(),void 0!==t.offset&&e.offset.fromArray(t.offset),void 0!==t.rotation&&(e.rotation=t.rotation),void 0!==t.scale&&e.repeat.fromArray(t.scale),void 0!==t.texCoord&&console.warn('THREE.GLTFLoader: Custom UV sets in "'+this.name+'" extension not yet supported.'),e.needsUpdate=!0,e},se.prototype=Object.create(_.a.prototype),se.prototype.constructor=se,se.prototype.copy=function(e){return _.a.prototype.copy.call(this,e),this.specularMap=e.specularMap,this.specular.copy(e.specular),this.glossinessMap=e.glossinessMap,this.glossiness=e.glossiness,delete this.metalness,delete this.roughness,delete this.metalnessMap,delete this.roughnessMap,this},ne.prototype=Object.create(f.a.prototype),ne.prototype.constructor=ne,ne.prototype.copySampleValue_=function(e){for(var t=this.resultBuffer,s=this.sampleValues,r=this.valueSize,a=e*r*3+r,n=0;n!==r;n++)t[n]=s[a+n];return t},ne.prototype.beforeStart_=ne.prototype.copySampleValue_,ne.prototype.afterEnd_=ne.prototype.copySampleValue_,ne.prototype.interpolate_=function(e,t,s,r){for(var a=this.resultBuffer,n=this.sampleValues,o=this.valueSize,i=2*o,l=3*o,c=r-t,u=(s-t)/c,p=u*u,h=p*u,d=e*l,m=d-l,f=-2*h+3*p,v=h-p,g=1-f,T=v-p+u,y=0;y!==o;y++){var S=n[m+y+o],M=n[m+y+i]*c,R=n[d+y+o],x=n[d+y]*c;a[y]=g*S+T*M+f*R+v*x}return a};var oe=0,ie=1,le=2,ce=3,ue=4,pe=5,he=6,de={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},me={9728:l.mb,9729:l.T,9984:l.qb,9985:l.X,9986:l.pb,9987:l.W},fe={33071:l.n,33648:l.ib,10497:l.uc},ve={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},ge={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv2",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Te={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},ye={CUBICSPLINE:void 0,LINEAR:l.N,STEP:l.M},Se="OPAQUE",Me="MASK",Re="BLEND",xe={"image/png":l.Gb,"image/jpeg":l.gc};function be(e,t){return"string"!=typeof e||""===e?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}function we(e,t,s){for(var r in s.extensions)void 0===e[r]&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=s.extensions[r])}function Ae(e,t){void 0!==t.extras&&("object"==typeof t.extras?Object.assign(e.userData,t.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+t.extras))}function Ee(e,t){if(e.updateMorphTargets(),void 0!==t.weights)for(var s=0,r=t.weights.length;s<r;s++)e.morphTargetInfluences[s]=t.weights[s];if(t.extras&&Array.isArray(t.extras.targetNames)){var a=t.extras.targetNames;if(e.morphTargetInfluences.length===a.length){e.morphTargetDictionary={};for(s=0,r=a.length;s<r;s++)e.morphTargetDictionary[a[s]]=s}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function _e(e){for(var t="",s=Object.keys(e).sort(),r=0,a=s.length;r<a;r++)t+=s[r]+":"+e[s[r]]+";";return t}function Le(e,s,r){this.json=e||{},this.extensions=s||{},this.options=r||{},this.cache=new t,this.associations=new Map,this.primitiveCache={},this.textureLoader=new j.a(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.fileLoader=new p.a(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),"use-credentials"===this.options.crossOrigin&&this.fileLoader.setWithCredentials(!0)}function Ie(e,t,s){var r=t.attributes,a=[];function o(t,r){return s.getDependency("accessor",t).then((function(t){e.setAttribute(r,t)}))}for(var i in r){var l=ge[i]||i.toLowerCase();l in e.attributes||a.push(o(r[i],l))}if(void 0!==t.indices&&!e.index){var c=s.getDependency("accessor",t.indices).then((function(t){e.setIndex(t)}));a.push(c)}return Ae(e,t),function(e,t,s){var r=t.attributes,a=new n.a;if(void 0!==r.POSITION){var o=(m=s.json.accessors[r.POSITION]).min,i=m.max;if(void 0!==o&&void 0!==i){a.set(new V.a(o[0],o[1],o[2]),new V.a(i[0],i[1],i[2]));var l=t.targets;if(void 0!==l){for(var c=new V.a,u=new V.a,p=0,h=l.length;p<h;p++){var d=l[p];if(void 0!==d.POSITION){var m;o=(m=s.json.accessors[d.POSITION]).min,i=m.max;void 0!==o&&void 0!==i?(u.setX(Math.max(Math.abs(o[0]),Math.abs(i[0]))),u.setY(Math.max(Math.abs(o[1]),Math.abs(i[1]))),u.setZ(Math.max(Math.abs(o[2]),Math.abs(i[2]))),c.max(u)):console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}a.expandByVector(c)}e.boundingBox=a;var f=new k.a;a.getCenter(f.center),f.radius=a.min.distanceTo(a.max)/2,e.boundingSphere=f}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}(e,t,s),Promise.all(a).then((function(){return void 0!==t.targets?function(e,t,s){for(var r=!1,a=!1,n=0,o=t.length;n<o;n++){if(void 0!==(c=t[n]).POSITION&&(r=!0),void 0!==c.NORMAL&&(a=!0),r&&a)break}if(!r&&!a)return Promise.resolve(e);var i=[],l=[];for(n=0,o=t.length;n<o;n++){var c=t[n];if(r){var u=void 0!==c.POSITION?s.getDependency("accessor",c.POSITION):e.attributes.position;i.push(u)}if(a){u=void 0!==c.NORMAL?s.getDependency("accessor",c.NORMAL):e.attributes.normal;l.push(u)}}return Promise.all([Promise.all(i),Promise.all(l)]).then((function(t){var s=t[0],n=t[1];return r&&(e.morphAttributes.position=s),a&&(e.morphAttributes.normal=n),e.morphTargetsRelative=!0,e}))}(e,t.targets,s):e}))}function Pe(e,t){var s=e.getIndex();if(null===s){var r=[],a=e.getAttribute("position");if(void 0===a)return console.error("THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),e;for(var n=0;n<a.count;n++)r.push(n);e.setIndex(r),s=e.getIndex()}var o=s.count-2,i=[];if(t===l.Uc)for(n=1;n<=o;n++)i.push(s.getX(0)),i.push(s.getX(n)),i.push(s.getX(n+1));else for(n=0;n<o;n++)n%2==0?(i.push(s.getX(n)),i.push(s.getX(n+1)),i.push(s.getX(n+2))):(i.push(s.getX(n+2)),i.push(s.getX(n+1)),i.push(s.getX(n)));i.length/3!==o&&console.error("THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");var c=e.clone();return c.setIndex(i),c}return Le.prototype.parse=function(e,t){var s=this,r=this.json,a=this.extensions;this.cache.removeAll(),this.markDefs(),Promise.all([this.getDependencies("scene"),this.getDependencies("animation"),this.getDependencies("camera")]).then((function(t){var n={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:s,userData:{}};we(a,n,r),Ae(n,r),e(n)})).catch(t)},Le.prototype.markDefs=function(){for(var e=this.json.nodes||[],t=this.json.skins||[],s=this.json.meshes||[],r={},a={},n=0,o=t.length;n<o;n++)for(var i=t[n].joints,l=0,c=i.length;l<c;l++)e[i[l]].isBone=!0;for(var u=0,p=e.length;u<p;u++){var h=e[u];void 0!==h.mesh&&(void 0===r[h.mesh]&&(r[h.mesh]=a[h.mesh]=0),r[h.mesh]++,void 0!==h.skin&&(s[h.mesh].isSkinnedMesh=!0))}this.json.meshReferences=r,this.json.meshUses=a},Le.prototype.getDependency=function(e,t){var r=e+":"+t,a=this.cache.get(r);if(!a){switch(e){case"scene":a=this.loadScene(t);break;case"node":a=this.loadNode(t);break;case"mesh":a=this.loadMesh(t);break;case"accessor":a=this.loadAccessor(t);break;case"bufferView":a=this.loadBufferView(t);break;case"buffer":a=this.loadBuffer(t);break;case"material":a=this.loadMaterial(t);break;case"texture":a=this.loadTexture(t);break;case"skin":a=this.loadSkin(t);break;case"animation":a=this.loadAnimation(t);break;case"camera":a=this.loadCamera(t);break;case"light":a=this.extensions[s.KHR_LIGHTS_PUNCTUAL].loadLight(t);break;default:throw new Error("Unknown type: "+e)}this.cache.add(r,a)}return a},Le.prototype.getDependencies=function(e){var t=this.cache.get(e);if(!t){var s=this,r=this.json[e+("mesh"===e?"es":"s")]||[];t=Promise.all(r.map((function(t,r){return s.getDependency(e,r)}))),this.cache.add(e,t)}return t},Le.prototype.loadBuffer=function(e){var t=this.json.buffers[e],r=this.fileLoader;if(t.type&&"arraybuffer"!==t.type)throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(void 0===t.uri&&0===e)return Promise.resolve(this.extensions[s.KHR_BINARY_GLTF].body);var a=this.options;return new Promise((function(e,s){r.load(be(t.uri,a.path),e,void 0,(function(){s(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))}))}))},Le.prototype.loadBufferView=function(e){var t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then((function(e){var s=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+s)}))},Le.prototype.loadAccessor=function(e){var t=this,s=this.json,r=this.json.accessors[e];if(void 0===r.bufferView&&void 0===r.sparse)return Promise.resolve(null);var a=[];return void 0!==r.bufferView?a.push(this.getDependency("bufferView",r.bufferView)):a.push(null),void 0!==r.sparse&&(a.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),a.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(a).then((function(e){var a,n,i=e[0],l=ve[r.type],c=de[r.componentType],u=c.BYTES_PER_ELEMENT,p=u*l,h=r.byteOffset||0,f=void 0!==r.bufferView?s.bufferViews[r.bufferView].byteStride:void 0,v=!0===r.normalized;if(f&&f!==p){var g=Math.floor(h/f),T="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+g+":"+r.count,y=t.cache.get(T);y||(a=new c(i,g*f,r.count*f/u),y=new d.a(a,f/u),t.cache.add(T,y)),n=new m.a(y,l,h%f/u,v)}else a=null===i?new c(r.count*l):new c(i,h,r.count*l),n=new o.a(a,l,v);if(void 0!==r.sparse){var S=ve.SCALAR,M=de[r.sparse.indices.componentType],R=r.sparse.indices.byteOffset||0,x=r.sparse.values.byteOffset||0,b=new M(e[1],R,r.sparse.count*S),w=new c(e[2],x,r.sparse.count*l);null!==i&&(n=new o.a(n.array.slice(),n.itemSize,n.normalized));for(var A=0,E=b.length;A<E;A++){var _=b[A];if(n.setX(_,w[A*l]),l>=2&&n.setY(_,w[A*l+1]),l>=3&&n.setZ(_,w[A*l+2]),l>=4&&n.setW(_,w[A*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}}return n}))},Le.prototype.loadTexture=function(e){var t,r=this,a=this.json,n=this.options,o=this.textureLoader,i=self.URL||self.webkitURL,c=a.textures[e],u=c.extensions||{},p=(t=u[s.MSFT_TEXTURE_DDS]?a.images[u[s.MSFT_TEXTURE_DDS].source]:a.images[c.source]).uri,h=!1;return void 0!==t.bufferView&&(p=r.getDependency("bufferView",t.bufferView).then((function(e){h=!0;var s=new Blob([e],{type:t.mimeType});return p=i.createObjectURL(s)}))),Promise.resolve(p).then((function(e){var t=n.manager.getHandler(e);return t||(t=u[s.MSFT_TEXTURE_DDS]?r.extensions[s.MSFT_TEXTURE_DDS].ddsLoader:o),new Promise((function(s,r){t.load(be(e,n.path),s,void 0,r)}))})).then((function(s){!0===h&&i.revokeObjectURL(p),s.flipY=!1,c.name&&(s.name=c.name),t.mimeType in xe&&(s.format=xe[t.mimeType]);var n=(a.samplers||{})[c.sampler]||{};return s.magFilter=me[n.magFilter]||l.T,s.minFilter=me[n.minFilter]||l.W,s.wrapS=fe[n.wrapS]||l.uc,s.wrapT=fe[n.wrapT]||l.uc,r.associations.set(s,{type:"textures",index:e}),s}))},Le.prototype.assignTexture=function(e,t,r){var a=this;return this.getDependency("texture",r.index).then((function(n){if(!n.isCompressedTexture)switch(t){case"aoMap":case"emissiveMap":case"metalnessMap":case"normalMap":case"roughnessMap":n.format=l.gc}if(void 0===r.texCoord||0==r.texCoord||"aoMap"===t&&1==r.texCoord||console.warn("THREE.GLTFLoader: Custom UV set "+r.texCoord+" for texture "+t+" not yet supported."),a.extensions[s.KHR_TEXTURE_TRANSFORM]){var o=void 0!==r.extensions?r.extensions[s.KHR_TEXTURE_TRANSFORM]:void 0;if(o){var i=this.associations.get(n);n=a.extensions[s.KHR_TEXTURE_TRANSFORM].extendTexture(n,o),this.associations.set(n,i)}}e[t]=n}))},Le.prototype.assignFinalMaterial=function(e){var t=e.geometry,s=e.material,r=void 0!==t.attributes.tangent,a=void 0!==t.attributes.color,n=void 0===t.attributes.normal,o=!0===e.isSkinnedMesh,i=Object.keys(t.morphAttributes).length>0,l=i&&void 0!==t.morphAttributes.normal;if(e.isPoints){var c="PointsMaterial:"+s.uuid,u=this.cache.get(c);u||(u=new C.a,R.a.prototype.copy.call(u,s),u.color.copy(s.color),u.map=s.map,u.sizeAttenuation=!1,this.cache.add(c,u)),s=u}else if(e.isLine){c="LineBasicMaterial:"+s.uuid;var p=this.cache.get(c);p||(p=new g.a,R.a.prototype.copy.call(p,s),p.color.copy(s.color),this.cache.add(c,p)),s=p}if(r||a||n||o||i){c="ClonedMaterial:"+s.uuid+":";s.isGLTFSpecularGlossinessMaterial&&(c+="specular-glossiness:"),o&&(c+="skinning:"),r&&(c+="vertex-tangents:"),a&&(c+="vertex-colors:"),n&&(c+="flat-shading:"),i&&(c+="morph-targets:"),l&&(c+="morph-normals:");var h=this.cache.get(c);h||(h=s.clone(),o&&(h.skinning=!0),r&&(h.vertexTangents=!0),a&&(h.vertexColors=!0),n&&(h.flatShading=!0),i&&(h.morphTargets=!0),l&&(h.morphNormals=!0),this.cache.add(c,h),this.associations.set(h,this.associations.get(s))),s=h}s.aoMap&&void 0===t.attributes.uv2&&void 0!==t.attributes.uv&&t.setAttribute("uv2",t.attributes.uv),s.normalScale&&!r&&(s.normalScale.y=-s.normalScale.y),s.clearcoatNormalScale&&!r&&(s.clearcoatNormalScale.y=-s.clearcoatNormalScale.y),e.material=s},Le.prototype.loadMaterial=function(e){var t,r=this,a=this.json,n=this.extensions,o=a.materials[e],i={},u=o.extensions||{},p=[];if(u[s.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]){var h=n[s.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];t=h.getMaterialType(),p.push(h.extendParams(i,o,r))}else if(u[s.KHR_MATERIALS_UNLIT]){var d=n[s.KHR_MATERIALS_UNLIT];t=d.getMaterialType(),p.push(d.extendParams(i,o,r))}else{t=_.a;var m=o.pbrMetallicRoughness||{};if(i.color=new c.a(1,1,1),i.opacity=1,Array.isArray(m.baseColorFactor)){var f=m.baseColorFactor;i.color.fromArray(f),i.opacity=f[3]}void 0!==m.baseColorTexture&&p.push(r.assignTexture(i,"map",m.baseColorTexture)),i.metalness=void 0!==m.metallicFactor?m.metallicFactor:1,i.roughness=void 0!==m.roughnessFactor?m.roughnessFactor:1,void 0!==m.metallicRoughnessTexture&&(p.push(r.assignTexture(i,"metalnessMap",m.metallicRoughnessTexture)),p.push(r.assignTexture(i,"roughnessMap",m.metallicRoughnessTexture)))}!0===o.doubleSided&&(i.side=l.y);var v=o.alphaMode||Se;if(v===Re?(i.transparent=!0,i.depthWrite=!1):(i.transparent=!1,v===Me&&(i.alphaTest=void 0!==o.alphaCutoff?o.alphaCutoff:.5)),void 0!==o.normalTexture&&t!==A.a&&(p.push(r.assignTexture(i,"normalMap",o.normalTexture)),i.normalScale=new B.a(1,1),void 0!==o.normalTexture.scale&&i.normalScale.set(o.normalTexture.scale,o.normalTexture.scale)),void 0!==o.occlusionTexture&&t!==A.a&&(p.push(r.assignTexture(i,"aoMap",o.occlusionTexture)),void 0!==o.occlusionTexture.strength&&(i.aoMapIntensity=o.occlusionTexture.strength)),void 0!==o.emissiveFactor&&t!==A.a&&(i.emissive=(new c.a).fromArray(o.emissiveFactor)),void 0!==o.emissiveTexture&&t!==A.a&&p.push(r.assignTexture(i,"emissiveMap",o.emissiveTexture)),u[s.KHR_MATERIALS_CLEARCOAT]){var g=n[s.KHR_MATERIALS_CLEARCOAT];t=g.getMaterialType(),p.push(g.extendParams(i,{extensions:u},r))}return Promise.all(p).then((function(){var a;return a=t===se?n[s.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(i):new t(i),o.name&&(a.name=o.name),a.map&&(a.map.encoding=l.ld),a.emissiveMap&&(a.emissiveMap.encoding=l.ld),Ae(a,o),r.associations.set(a,{type:"materials",index:e}),o.extensions&&we(n,a,o),a}))},Le.prototype.loadGeometries=function(e){var t=this,r=this.extensions,a=this.primitiveCache;function n(e){return r[s.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then((function(s){return Ie(s,e,t)}))}for(var o,l,c=[],u=0,p=e.length;u<p;u++){var h,d=e[u],m=(l=void 0,(l=(o=d).extensions&&o.extensions[s.KHR_DRACO_MESH_COMPRESSION])?"draco:"+l.bufferView+":"+l.indices+":"+_e(l.attributes):o.indices+":"+_e(o.attributes)+":"+o.mode),f=a[m];if(f)c.push(f.promise);else h=d.extensions&&d.extensions[s.KHR_DRACO_MESH_COMPRESSION]?n(d):Ie(new i.a,d,t),a[m]={primitive:d,promise:h},c.push(h)}return Promise.all(c)},Le.prototype.loadMesh=function(e){for(var t,s=this,r=this.json.meshes[e],a=r.primitives,n=[],o=0,i=a.length;o<i;o++){var c=void 0===a[o].material?(void 0===(t=this.cache).DefaultMaterial&&(t.DefaultMaterial=new _.a({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:l.G})),t.DefaultMaterial):this.getDependency("material",a[o].material);n.push(c)}return n.push(s.loadGeometries(a)),Promise.all(n).then((function(t){for(var n=t.slice(0,t.length-1),o=t[t.length-1],i=[],c=0,u=o.length;c<u;c++){var p,d=o[c],m=a[c],f=n[c];if(m.mode===ue||m.mode===pe||m.mode===he||void 0===m.mode)!0!==(p=!0===r.isSkinnedMesh?new G.a(d,f):new w.a(d,f)).isSkinnedMesh||p.geometry.attributes.skinWeight.normalized||p.normalizeSkinWeights(),m.mode===pe?p.geometry=Pe(p.geometry,l.Vc):m.mode===he&&(p.geometry=Pe(p.geometry,l.Uc));else if(m.mode===ie)p=new y.a(d,f);else if(m.mode===ce)p=new v.a(d,f);else if(m.mode===le)p=new T.a(d,f);else{if(m.mode!==oe)throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);p=new U.a(d,f)}Object.keys(p.geometry.morphAttributes).length>0&&Ee(p,r),p.name=r.name||"mesh_"+e,o.length>1&&(p.name+="_"+c),Ae(p,r),s.assignFinalMaterial(p),i.push(p)}if(1===i.length)return i[0];var g=new h.a;for(c=0,u=i.length;c<u;c++)g.add(i[c]);return g}))},Le.prototype.loadCamera=function(e){var t,s=this.json.cameras[e],r=s[s.type];if(r)return"perspective"===s.type?t=new O.a(x.a.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):"orthographic"===s.type&&(t=new P.a(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),s.name&&(t.name=s.name),Ae(t,s),Promise.resolve(t);console.warn("THREE.GLTFLoader: Missing camera parameters.")},Le.prototype.loadSkin=function(e){var t=this.json.skins[e],s={joints:t.joints};return void 0===t.inverseBindMatrices?Promise.resolve(s):this.getDependency("accessor",t.inverseBindMatrices).then((function(e){return s.inverseBindMatrices=e,s}))},Le.prototype.loadAnimation=function(e){for(var t=this.json.animations[e],s=[],a=[],n=[],o=[],i=[],c=0,u=t.channels.length;c<u;c++){var p=t.channels[c],h=t.samplers[p.sampler],d=p.target,m=void 0!==d.node?d.node:d.id,f=void 0!==t.parameters?t.parameters[h.input]:h.input,v=void 0!==t.parameters?t.parameters[h.output]:h.output;s.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",f)),n.push(this.getDependency("accessor",v)),o.push(h),i.push(d)}return Promise.all([Promise.all(s),Promise.all(a),Promise.all(n),Promise.all(o),Promise.all(i)]).then((function(s){for(var a=s[0],n=s[1],o=s[2],i=s[3],c=s[4],u=[],p=0,h=a.length;p<h;p++){var d=a[p],m=n[p],f=o[p],v=i[p],g=c[p];if(void 0!==d){var T;switch(d.updateMatrix(),d.matrixAutoUpdate=!0,Te[g.path]){case Te.weights:T=L.a;break;case Te.rotation:T=F.a;break;case Te.position:case Te.scale:default:T=X.a}var y=d.name?d.name:d.uuid,S=void 0!==v.interpolation?ye[v.interpolation]:l.N,M=[];Te[g.path]===Te.weights?d.traverse((function(e){!0===e.isMesh&&e.morphTargetInfluences&&M.push(e.name?e.name:e.uuid)})):M.push(y);var R=f.array;if(f.normalized){var x;if(R.constructor===Int8Array)x=1/127;else if(R.constructor===Uint8Array)x=1/255;else if(R.constructor==Int16Array)x=1/32767;else{if(R.constructor!==Uint16Array)throw new Error("THREE.GLTFLoader: Unsupported output accessor component type.");x=1/65535}for(var b=new Float32Array(R.length),w=0,A=R.length;w<A;w++)b[w]=R[w]*x;R=b}for(w=0,A=M.length;w<A;w++){var E=new T(M[w]+"."+Te[g.path],m.array,R,S);"CUBICSPLINE"===v.interpolation&&(E.createInterpolant=function(e){return new ne(this.times,this.values,this.getValueSize()/3,e)},E.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0),u.push(E)}}}var _=t.name?t.name:"animation_"+e;return new r.a(_,void 0,u)}))},Le.prototype.loadNode=function(e){var t,r=this.json,n=this.extensions,o=this,i=r.meshReferences,l=r.meshUses,c=r.nodes[e];return(t=[],void 0!==c.mesh&&t.push(o.getDependency("mesh",c.mesh).then((function(e){var t;if(i[c.mesh]>1){var s=l[c.mesh]++;(t=e.clone()).name+="_instance_"+s}else t=e;return void 0!==c.weights&&t.traverse((function(e){if(e.isMesh)for(var t=0,s=c.weights.length;t<s;t++)e.morphTargetInfluences[t]=c.weights[t]})),t}))),void 0!==c.camera&&t.push(o.getDependency("camera",c.camera)),c.extensions&&c.extensions[s.KHR_LIGHTS_PUNCTUAL]&&void 0!==c.extensions[s.KHR_LIGHTS_PUNCTUAL].light&&t.push(o.getDependency("light",c.extensions[s.KHR_LIGHTS_PUNCTUAL].light)),Promise.all(t)).then((function(t){var s;if((s=!0===c.isBone?new a.a:t.length>1?new h.a:1===t.length?t[0]:new I.a)!==t[0])for(var r=0,i=t.length;r<i;r++)s.add(t[r]);if(c.name&&(s.userData.name=c.name,s.name=N.a.sanitizeNodeName(c.name)),Ae(s,c),c.extensions&&we(n,s,c),void 0!==c.matrix){var l=new b.a;l.fromArray(c.matrix),s.applyMatrix4(l)}else void 0!==c.translation&&s.position.fromArray(c.translation),void 0!==c.rotation&&s.quaternion.fromArray(c.rotation),void 0!==c.scale&&s.scale.fromArray(c.scale);return o.associations.set(s,{type:"nodes",index:e}),s}))},Le.prototype.loadScene=function(){function e(t,s,r,a){var n=r.nodes[t];return a.getDependency("node",t).then((function(e){return void 0===n.skin?e:a.getDependency("skin",n.skin).then((function(e){for(var s=[],r=0,n=(t=e).joints.length;r<n;r++)s.push(a.getDependency("node",t.joints[r]));return Promise.all(s)})).then((function(s){return e.traverse((function(e){if(e.isMesh){for(var r=[],a=[],n=0,o=s.length;n<o;n++){var i=s[n];if(i){r.push(i);var l=new b.a;void 0!==t.inverseBindMatrices&&l.fromArray(t.inverseBindMatrices.array,16*n),a.push(l)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[n])}e.bind(new D.a(r,a),e.matrixWorld)}})),e}));var t})).then((function(t){s.add(t);var o=[];if(n.children)for(var i=n.children,l=0,c=i.length;l<c;l++){var u=i[l];o.push(e(u,t,r,a))}return Promise.all(o)}))}return function(t){var s=this.json,r=this.extensions,a=this.json.scenes[t],n=new h.a;a.name&&(n.name=a.name),Ae(n,a),a.extensions&&we(r,n,a);for(var o=a.nodes||[],i=[],l=0,c=o.length;l<c;l++)i.push(e(o[l],n,s,this));return Promise.all(i).then((function(){return n}))}}(),e}()}}]);
//# sourceMappingURL=3.bundle.js.map