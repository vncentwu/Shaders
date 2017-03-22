
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

// combination of the previous shaders
void main()
{
    // initial variables
    vec3 eye_normal = normalize(eyeDirection);
    mat3 mat = mat3(c0, c1, c2);    
    vec3 bump_normal = 2.f * texture2D(normalMap, vec2(normalMapTexCoord.x * 6.f, normalMapTexCoord.y * -2.f)).rgb - 1.f;

    //modification
    bump_normal = normalize(bump_normal);
    vec3 reflect_vector = mat * reflect(eye_normal, bump_normal);
    reflect_vector = normalize(objectToWorld * reflect_vector);
    vec3 light_normal = normalize(lightDirection);
    float diffuse = 0.0;
    if (light_normal.z >= 0.0)
        diffuse = max( dot(bump_normal,light_normal), 0.0);
    vec3 half_normal = normalize(halfAngle);
    float specular = max(dot(vec3(0,0,1),half_normal),0);
    gl_FragColor = 0.5f * (LMa + diffuse * LMd) 
        + 0.6f * textureCube(envmap, -1.f * reflect_vector)
        + 0.5f * pow(specular, shininess) * LMs;
    //50% of ambient + diffuse, 50% of specular, and 60% of bumpy reflection.

}
