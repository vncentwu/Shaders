
uniform vec4 LMa; // Light-Material ambient
uniform vec4 LMd; // Light-Material diffuse
uniform vec4 LMs; // Light-Material specular
uniform float shininess;

uniform sampler2D normalMap;
uniform sampler2D decal;
uniform sampler2D heightField;
uniform samplerCube envmap;

uniform mat3 objectToWorld;

varying vec2 normalMapTexCoord;
varying vec3 lightDirection;
varying vec3 eyeDirection;
varying vec3 halfAngle;
varying vec3 c0, c1, c2;

void main()
{
    vec3 eye_normal = normalize(eyeDirection);
    mat3 mat = mat3(c0, c1, c2);
    vec3 bump_normal = 2.f * texture2D(normalMap, vec2(normalMapTexCoord.x * 6.f, normalMapTexCoord.y * -2.f)).rgb - 1.f;
    bump_normal = normalize(bump_normal);
    vec3 reflect_normal = mat * reflect(eye_normal, bump_normal);
    reflect_normal = normalize(objectToWorld * reflect_normal);
    gl_FragColor = textureCube(envmap, -1.f * reflect_normal);
}
