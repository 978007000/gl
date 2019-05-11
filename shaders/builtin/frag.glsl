precision mediump float;

uniform vec3 AMBIENT_LIGHT;

struct DirectionalLight {
	vec3 direction;
	vec3 color;
	float intensity;
};

uniform DirectionalLight DIRECTIONAL_LIGHTS[8];

uniform vec3 POINT_LIGHTS_LOCATION[8];
uniform vec4 POINT_LIGHTS_COLOR[8];

uniform vec3 COLOR;