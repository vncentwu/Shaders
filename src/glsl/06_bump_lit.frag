
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
  vec3 bump_normal = 2.f * texture2D(normalMap, vec2(normalMapTexCoord.x * 6.f, normalMapTexCoord.y * -2.f)).rgb - 1.f;
  bump_normal = normalize(bump_normal);
  vec3 light_direction_normal = normalize(lightDirection);
  float diffuse = 0.f;
  if(light_direction_normal.z >= 0.f)
      diffuse = max( dot(bump_normal,light_direction_normal), 0.f);
  vec3 half_normal = normalize(halfAngle);
  float specular = max(dot(vec3(0, 0, 1), half_normal), 0);
  gl_FragColor = 0.5f * (LMa + diffuse * LMd) 
  	+ texture2D(decal, normalMapTexCoord * vec2(-6.f, 2.f))
  	+ 0.5f * pow(specular, shininess) * LMs;
}
