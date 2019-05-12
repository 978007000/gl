import vert from '../shaders/default/vert.glsl.mjs';
import frag from '../shaders/default/frag.glsl.mjs';

const methods = {
	[5126]: 'uniform1f',
	[35665]: 'uniform3fv',
	[35666]: 'uniform4fv',

	// [35678]: 'texImage2D'
};

function bitmask(things) {
	let mask = 0;
	things.forEach((thing, i) => {
		if (thing) mask |= 1 << i;
	});
	return mask;
}

export default class Material {
	constructor(opts = {}) {
		this.vert = opts.vert || vert;
		this.frag = opts.frag || frag;

		this.color = opts.color;
		this.alpha = opts.alpha;
		this._map = opts.map;

		this._textures = {};

		this.blend = opts.blend;

		this._update_hash();
	}

	_update_hash() {
		// TODO make this real — https://github.com/mrdoob/three.js/blob/f186b20983e07564d62fb0c067726931c28d92f6/src/renderers/webgl/WebGLPrograms.js#L218
		// this.hash = Math.random().toString(36).slice(2);

		this.hash = bitmask([
			this.alpha < 1,
			!!this.map
		]) + this.vert + this.frag;
	}

	_link(gl) {
		this.gl = gl;

		// TODO this feels a bit weird, maybe there's a
		// better place for this work?
		if (this._map) this._bind_texture('map', this._map);
	}

	_bind_texture(id, img) {
		const { gl } = this;

		const texture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.generateMipmap(gl.TEXTURE_2D);

		this._textures[id] = texture;
	}

	get map() {
		return this._map;
	}

	set map(img) {
		this._map = img;
		this._update_hash();
		this._bind_texture('map', img);
	}

	set_uniforms(gl, uniforms, locations) {
		if (this.color) {
			gl.uniform3fv(locations.COLOR, this.color);
		}

		if (this.alpha < 1) {
			gl.uniform1f(locations.ALPHA, this.alpha);
		}

		if (this._map) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this._textures.map);
			gl.uniform1i(locations.TEXTURE, 0);
		}
	}
}