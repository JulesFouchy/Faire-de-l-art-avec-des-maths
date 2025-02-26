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
            <pre><code class="hljs glsl" id="mycode${span_id}" data-trim>
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
            <pre><code class="hljs glsl" id="mycode${span_id}" data-trim>
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
