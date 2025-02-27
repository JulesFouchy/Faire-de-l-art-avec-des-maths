[Shadertoy](https://www.shadertoy.com/)<br/>
[Extension Shadertoy pour rajouter des sliders (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/shadertoy-unofficial-plugin/)<br/>
[Extension Shadertoy pour rajouter des sliders (Chrome)](https://chromewebstore.google.com/detail/shadertoy-unofficial-plug/ohicbclhdmkhoabobgppffepcopomhgl?hl=en)<br/>

Ou alors, un excellent éditeur beaucoup plus complet (avec breakpoint, autocomplétion, inspection des différentes valeurs, etc.) : https://shadered.org/

## Step 1 : UV

```glsl
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Output to screen
    fragColor = vec4(uv, 0., 1.0);
}
```

## Step 2 : Grille

```glsl
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    
    uv *= 5.;
    uv = fract(uv);

    // Output to screen
    fragColor = vec4(uv, 0., 1.0);
}
```

## Step 3 : Aspect Ratio

```glsl
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.y;

    // TODO mettez vos modifications de uv ici
    
    uv *= 5.;
    uv = fract(uv);
    
    // TODO ou ici ?

    // Output to screen
    fragColor = vec4(uv, 0., 1.0);
}
```

## Step 4 : Transformations spatiales

[Voir les slides](https://julesfouchy.github.io/Faire-de-l-art-avec-des-maths/#/5/0/0)

## Step 5 : Noise (setup)

```glsl
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.y;
    
    float color = 0.;

    // TODO Colorez comme vous voulez ici
    color = uv.x;

    // Output to screen
    fragColor = vec4(vec3(color), 1.0);
}
```

## Step 6 : Noise (à vous de jouer)

[Voir les slides](https://julesfouchy.github.io/Faire-de-l-art-avec-des-maths/#/14/0/0)

## Step 7 : Courbes (setup)

```glsl
const float pi = 3.141592653;

#define saturate(v) clamp(v, 0., 1.)

// https://iquilezles.org/articles/distfunctions2d/
float sdSegment(vec2 p, vec2 a, vec2 b, float thickness) {
  vec2 pa = p - a, ba = b - a;
  float h = saturate(dot(pa, ba) / dot(ba, ba));
  return length(pa - ba * h) - thickness;
}

float get_dist(vec2 uv) {
  float dist_to_curve = 9999999.;
  vec2 previous_position; // Will be filled during the first iteration of the loop

  const int nb_segments = 100;
  const float thickness = 0.005;

  for (int i = 0; i <= nb_segments; i++) {
    float t = float(i) / float(nb_segments); // 0 to 1
    float angle = t * 2. * pi;
    
    // TODO mettre votre courbe ici
    vec2 position = vec2(cos(angle), sin(angle));
    
    if (i != 0) // During the first iteration we don't yet have two points to draw a segment between
    {
      float segment = sdSegment(uv, previous_position, position, thickness);
      dist_to_curve = min(dist_to_curve, segment);
    }

    previous_position = position;
  }

  return dist_to_curve;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  uv -= 0.5;
  uv *= 2.;
  uv.x *= iResolution.x / iResolution.y;

  float color = step(get_dist(uv), 0.);

  // Output to screen
  fragColor = vec4(vec3(color), 1.0);
}
```

## Step 8 : Courbes (à vous de jouer)

[Voir les slides](https://julesfouchy.github.io/Faire-de-l-art-avec-des-maths/#/23/0/0)
