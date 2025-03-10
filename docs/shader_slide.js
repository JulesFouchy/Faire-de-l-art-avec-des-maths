const blah = (fragment_shader_code, span_id) => {
  const canvas = document.getElementById(`shaderCanvas${span_id}`)
  const gl = canvas.getContext("webgl")

  // Vertex Shader
  const vertexShaderSource = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`

  function createShader(gl, type, source) {
    const shader = gl.createShader(type)
    // console.log(source)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile failed: " + gl.getShaderInfoLog(shader))
      return null
    }
    return shader
  }

  function createProgram(gl, vertexShaderSource, fragment_shader_code) {
    const program = gl.createProgram()
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragment_shader_code
    )

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link failed: " + gl.getProgramInfoLog(program))
      return null
    }
    return program
  }

  const program = createProgram(gl, vertexShaderSource, fragment_shader_code)
  gl.useProgram(program)

  // Create a full-screen quad
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  )

  const positionLocation = gl.getAttribLocation(program, "position")
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

  const timeUniform = gl.getUniformLocation(program, "time")
  const resolutionUniform = gl.getUniformLocation(program, "resolution")

  const valueUniform = gl.getUniformLocation(program, "u_value")

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gl.viewport(0, 0, canvas.width, canvas.height)
  }
  window.addEventListener("resize", resizeCanvas)
  resizeCanvas()

  const slider = document.getElementById(`slider${span_id}`)
  //   const sliderValue = document.getElementById("sliderValue");
  // const obj = {value: 0.}
  let valuuuu = parseFloat(slider.value)
  slider.addEventListener("input", function () {
    valuuuu = parseFloat(slider.value)
    // sliderValue.textContent = obj.value.toFixed(1)
  })

  function render(time) {
    gl.uniform1f(timeUniform, time / 1000)
    gl.uniform1f(valueUniform, valuuuu /* obj.val */)
    gl.uniform2f(resolutionUniform, canvas.width, canvas.height)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

const shader_slide = ({
  code,
  initial_value,
  min_value,
  max_value,
  span_id,
}) => {
  const ele = document.getElementById(span_id)
  ele.innerHTML = `
          <label for="slider" style="color: white; font-size: 1.em;">
            <pre><code class="hljs" id="mycode${span_id}" data-trim>
</code></pre>
          </label>
          <input
            type="range"
            id="slider${span_id}"
            min="${min_value}"
            max="${max_value}"
            step="0.001"
            value="${initial_value}"
            style="width: 100%;"
          />
          <canvas id="shaderCanvas${span_id}" style="width: 100%;"></canvas>
    `
  const slider = document.getElementById(`slider${span_id}`)
  const codehtml = document.getElementById(`mycode${span_id}`)
  //   const sliderValue = document.getElementById("sliderValue");
  // const obj = {value: 0.}
  let valuuuu = parseFloat(slider.value)
  codehtml.innerHTML = code(valuuuu)
  slider.addEventListener("input", function () {
    valuuuu = parseFloat(slider.value)
    codehtml.innerHTML = code(valuuuu)
    // sliderValue.textContent = obj.value.toFixed(1)
  })

  blah(
    `
        precision mediump float;
        uniform float time;
      uniform float u_value;
        uniform vec2 resolution;
        const float pi = 3.141592653;

        
        float pattern(vec2 pos) {
  float patternX = 0.5 + 0.5 * cos(pos.x * 20.);
  float patternY = 0.5 + 0.5 * cos(pos.y * 20.);
  return 0.5 * (patternX + patternY);
}
vec2 rotate(vec2 position, float angle)
{
vec2 new_X_axis = vec2(
    cos(angle),
    sin(angle)
);
vec2 new_Y_axis = vec2(
    -sin(angle),
    cos(angle)
);
return position.x * new_X_axis
         + position.y * new_Y_axis;
  }

  float noise(vec2 position)
  {
  
  return pattern(rotate(position, 0. * 0.458) * 2.) / 2.
      + pattern(rotate(position, 1. * 0.458) * 3.64) / 4.
      + pattern(rotate(position, 2. * 0.458) * 7.15645) / 8.;}

        void main() {
            vec2 position = gl_FragCoord.xy / resolution.y;
            ${code("u_value")};
        gl_FragColor = vec4(fract(position* 3.), 0., 1.0);
                        }
                        `,
    span_id
  )
}
const shader_slide_noise = ({
  code,
  initial_value,
  min_value,
  max_value,
  span_id,
}) => {
  const ele = document.getElementById(span_id)
  ele.innerHTML = `
          <label for="slider" style="color: white; font-size: 1.em;">
            <pre><code class="hljs" id="mycode${span_id}" data-trim>
</code></pre>
          </label>
          <input
            type="range"
            id="slider${span_id}"
            min="${min_value}"
            max="${max_value}"
            step="0.001"
            value="${initial_value}"
            style="width: 100%;"
          />
          <canvas id="shaderCanvas${span_id}" style="width: 100%;"></canvas>
    `
  const slider = document.getElementById(`slider${span_id}`)
  const codehtml = document.getElementById(`mycode${span_id}`)
  //   const sliderValue = document.getElementById("sliderValue");
  // const obj = {value: 0.}
  let valuuuu = parseFloat(slider.value)
  codehtml.innerHTML = code(valuuuu)
  slider.addEventListener("input", function () {
    valuuuu = parseFloat(slider.value)
    codehtml.innerHTML = code(valuuuu)
    // sliderValue.textContent = obj.value.toFixed(1)
  })

  blah(
    `
        precision mediump float;
        uniform float time;
      uniform float u_value;
        uniform vec2 resolution;
        const float pi = 3.141592653;

        float pattern(vec2 pos) {
  float patternX = 0.5 + 0.5 * cos(pos.x * 20.);
  float patternY = 0.5 + 0.5 * cos(pos.y * 20.);
  return 0.5 * (patternX + patternY);
}
vec2 rotate(vec2 position, float angle)
{
vec2 new_X_axis = vec2(
    cos(angle),
    sin(angle)
);
vec2 new_Y_axis = vec2(
    -sin(angle),
    cos(angle)
);
return position.x * new_X_axis
         + position.y * new_Y_axis;
  }

        void main() {
            vec2 position = gl_FragCoord.xy / resolution.y;
            float color;
            ${code("u_value")};
        gl_FragColor = vec4(vec3(color), 1.0);
                        }
                        `,
    span_id
  )
}

const curve_shader_code = (code,curve_color, point_color) => `

#define saturate(v) clamp(v, 0., 1.)
// https://iquilezles.org/articles/distfunctions2d/
float sdSegment(vec2 p, vec2 a, vec2 b, float thickness)
{
    vec2  pa = p - a, ba = b - a;
    float h = saturate(dot(pa, ba) / dot(ba, ba));
    return length(pa - ba * h) - thickness;
}

float get_dist(vec2 uv)
{
    float dist_to_curve = 9999999.;
    vec2  previous_position; // Will be filled during the first iteration of the loop

    const int  nb_segments = 100; // TODO 40
    const float thickness = 0.005;

    for (int i = 0; i <= nb_segments; i++)
    {
        float t = float(i) / float(nb_segments) * 2. * pi; // 0 to 1

        vec2 position;
        ${code("u_value")};
        if (i != 0) // During the first iteration we don't yet have two points to draw a segment between
        {
            float segment   = sdSegment(uv, previous_position, position, thickness);
            dist_to_curve   = min(dist_to_curve, segment);
        }

        previous_position = position;
    }

    return dist_to_curve;
}

void main() {
    vec2 pos = gl_FragCoord.xy / resolution.xy;
pos -= 0.5;
pos *= 2.;
pos.x *= resolution.x / resolution.y;

    float bob =float(${curve_color}) < 0.001 ? 0. :(  float(${curve_color}) * step(get_dist(pos), 0.));
  if(float(${point_color}) > 0.001)  {
    float t = time;
    vec2 position = vec2(0.);
    ${code("u_value")};
    bob += float(${point_color}) * step(distance(position, pos),0.02);
    }
    gl_FragColor = vec4(vec3(bob), 1.0);
                }
`
const shader_slide_curve = ({
  code,
  initial_value,
  min_value,
  max_value,
  curve_color,
  point_color,
  span_id,
}) => {
  const ele = document.getElementById(span_id)
  ele.innerHTML = `
          <label for="slider" style="color: white; font-size: 1.em;">
            <pre><code class="hljs" id="mycode${span_id}" data-trim>
</code></pre>
          </label>
          <input
            type="range"
            id="slider${span_id}"
            min="${min_value}"
            max="${max_value}"
            step="0.001"
            value="${initial_value}"
            style="width: 100%;"
          />
          <canvas id="shaderCanvas${span_id}" style="width: 100%;"></canvas>
    `
  const slider = document.getElementById(`slider${span_id}`)
  const codehtml = document.getElementById(`mycode${span_id}`)
  //   const sliderValue = document.getElementById("sliderValue");
  // const obj = {value: 0.}
  let valuuuu = parseFloat(slider.value)
  codehtml.innerHTML = code(valuuuu)
  slider.addEventListener("input", function () {
    valuuuu = parseFloat(slider.value)
    codehtml.innerHTML = code(valuuuu)
    // sliderValue.textContent = obj.value.toFixed(1)
  })

  blah(
    `
        precision mediump float;
        uniform float time;
      uniform float u_value;
        uniform vec2 resolution;
        const float pi = 3.141592653;


        ${curve_shader_code(code, curve_color, point_color)}
                        `,
    span_id
  )
}
