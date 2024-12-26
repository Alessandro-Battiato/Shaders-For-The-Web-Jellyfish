const frag = `

    ${includes}

    uniform float time;
    uniform sampler2D cat;
    uniform samplerCube cube;

    varying vec3 v_position;
    varying vec3 v_normal;
    varying vec2 v_uv;

    vec3 addLight(vec3 lightColor, vec3 lightPosition) {
        // ambient color
        float ambientStrength = 0.3;
        vec3 ambientColor = ambientStrength * lightColor;

        // diffuse color - matte color
        vec3 lightDirection = normalize(lightPosition - v_position);
        float diffuseStrength = 1.0;
        float diffuseScore = max(dot(lightDirection, v_normal), 0.0); // the dot product, basically we're trying to understand the light direction and the surface direction, considering that the dot method returns a number between -1.0 and 1.0, if it's 1 for example, then the light will shine off the surface because both the directions are exactly the same, if the value returned is 0.0 then it's kind of at 90 degrees and at -1.0 then the direction is the opposite way around. Also we're using max and set 0.0, as to never have a -1.0 as a result of the dot product so there are no black areas with no lights on the surface
        vec3 diffuseColor = diffuseStrength * diffuseScore * lightColor;

        // specular color - gloss
        vec3 cameraDirection = normalize(cameraPosition - v_position);
        vec3 reflectionDirection = normalize(lightDirection + cameraDirection); // we want the light to be reflected on the camera
        // float specularStrength = 0.5; uncomment if not showing the jellyfish model
        float specularStrength = 5.5;
        float shininess = 12.0;
        float specularScore = pow(max(dot(reflectionDirection, v_normal), 0.0), shininess); // we use the pow function to multiply the result in order to increase the shininess on the surface, and we multiply it by itself
        vec3 specularColor = specularStrength * specularScore * lightColor;
    
        return (ambientColor + diffuseColor + specularColor);
    }

    void main () {
        // vec4 objectColor = texture2D(cat, v_uv);
        // vec3 objectColor = vec3(0.9, 0.4, 0.4);
        // vec3 lightColor = vec3(1.0, 1.0, 1.0);
        // vec3 lightPosition = vec3(50.0 * sin(time), 0.0, 30.0);
        // gl_FragColor = vec4(v_position.x + time, v_position.y, v_position.z, 1.0);
        // vec4 color = vec4(ambientColor * objectColor, 1.0); 
        // vec4 color = vec4((ambientColor + diffuseColor) * objectColor, 1.0);
        // vec4 objectColor = texture2D(cat, v_uv);
        // vec4 objectColor = mix(vec4(0.5, 0.5, 0.5, 1.0), textureCube(cube, v_normal), 0.5);

        vec3 dir = reflect(v_normal, vec3(0.0, 1.0, 0.0));
        dir = reflect(dir, vec3(1.0, 0.0, 0.0));

        vec3 cameraDirection = normalize(cameraPosition - v_position);

        vec3 wind = vec3(
            mix(-2.5, 2.5, fbm(0.1 * v_position + 0.1 * time)),
            mix(-2.5, 2.5, fbm(0.2 * v_position - 0.2 * time)),
            mix(-2.5, 2.5, fbm(0.3 * v_position + 0.3 * time))
        );

        float thickness = mix(-0.5, 0.5, fbm(0.1 * v_position + wind));

        vec3 refractedRed = refract(cameraDirection, v_normal, 0.6 + thickness);
        vec3 refractedGreen = refract(cameraDirection, v_normal, 0.7 + thickness);
        vec3 refractedBlue = refract(cameraDirection, v_normal, 0.8 + thickness);

        vec4 redSample = textureCube(cube, refractedRed);
        vec4 greenSample = textureCube(cube, refractedGreen);
        vec4 blueSample = textureCube(cube, refractedBlue);

        vec4 objectColor = vec4(redSample.r, greenSample.g, blueSample.b, 1.0);

        vec3 light1 = addLight(
            // vec3(1.0, 1.0, 1.0), uncomment if not showing jellyfish
            vec3(0.1, 0.1, 1.0),
            vec3(60.0 * cos(time), 60.0 * sin(time), 60.0)
        );

        // vec3 light2 = addLight( uncomment if not showing jellyfish
        //    vec3(1.0, 1.0, 1.0),
        //   vec3(100.0 * cos(time), 100.0 * sin(time), 0.0)
        // );

        vec3 light2 = addLight(
            vec3(0.5, 0.1, 0.5),
            vec3(100.0 * sin(time), 0.0, 30.0)
        );

        // final color
        vec4 color = vec4(
            (light1 + light2) * objectColor.rgb, 
            1.0
        );
        gl_FragColor = color;
    }
`;
