<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Rounded Corners with Text - Matter.js</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    html, body {
      margin: 0; padding: 0; overflow: hidden;
      width: 100%; height: 100%;
      background: #fafafa; /* Fondo claro, puedes cambiar */
    }
    canvas {
      display: block;
      margin: 0 auto; /* Centrar canvas horizontalmente */
      background: #fafafa; /* mismo fondo en canvas para evitar parpadeos */
      display: block;
    }
  </style>
</head>
<body>

<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
<script>
var Example = Example || {};

Example.rounded = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Events = Matter.Events,
        Body = Matter.Body;

    var width = 800,
        height = 600;

    // Crear motor y mundo
    var engine = Engine.create();
    var world = engine.world;

    // Quitar gravedad para que floten
    engine.world.gravity.y = 0;

    // Crear renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: false,
            showAxes: true,
            background: '#fafafa'  // Fondo claro
        }
    });

    Render.run(render);

    // Crear runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // Paredes estáticas (bordes)
    Composite.add(world, [
        Bodies.rectangle(width/2, 0, width, 50, { isStatic: true }),
        Bodies.rectangle(width/2, height, width, 50, { isStatic: true }),
        Bodies.rectangle(width, height/2, 50, height, { isStatic: true }),
        Bodies.rectangle(0, height/2, 50, height, { isStatic: true })
    ]);

    // Crear formas con colores y textos
    var shapes = [
        Bodies.rectangle(200, 200, 100, 100, { 
            chamfer: { radius: 20 },
            render: { fillStyle: '#ff6f69', text: 'Texto 1' }
        }),

        Bodies.rectangle(300, 200, 100, 100, { 
            chamfer: { radius: [90, 0, 0, 0] },
            render: { fillStyle: '#ffcc5c', text: 'Texto 2' }
        }),

        Bodies.rectangle(400, 200, 200, 200, { 
            chamfer: { radius: [150, 20, 40, 20] },
            render: { fillStyle: '#88d8b0', text: 'Texto 3' }
        }),

        Bodies.rectangle(200, 200, 200, 200, { 
            chamfer: { radius: [150, 20, 150, 20] },
            render: { fillStyle: '#96ceb4', text: 'Texto 4' }
        }),

        Bodies.rectangle(300, 200, 200, 50, { 
            chamfer: { radius: [25, 25, 0, 0] },
            render: { fillStyle: '#ffeead', text: 'Texto 5' }
        }),

        Bodies.polygon(200, 100, 8, 80, { 
            chamfer: { radius: 30 },
            render: { fillStyle: '#d9534f', text: 'Texto 6' }
        }),

        Bodies.polygon(300, 100, 5, 80, { 
            chamfer: { radius: [10, 40, 20, 40, 10] },
            render: { fillStyle: '#5bc0de', text: 'Texto 7' }
        }),

        Bodies.polygon(400, 200, 3, 50, { 
            chamfer: { radius: [20, 0, 20] },
            render: { fillStyle: '#5cb85c', text: 'Texto 8' }
        })
    ];

    Composite.add(world, shapes);

    // Control con ratón
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // Ajustar viewport
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    });

    // Función para evitar que las formas salgan del canvas
    function keepBodiesInsideCanvas(bodies, bounds) {
        bodies.forEach(body => {
            let pos = body.position;
            let correction = { x: 0, y: 0 };
            const padding = 20; // margen para que no queden pegadas

            if (pos.x < padding) correction.x = padding - pos.x;
            else if (pos.x > bounds.width - padding) correction.x = (bounds.width - padding) - pos.x;

            if (pos.y < padding) correction.y = padding - pos.y;
            else if (pos.y > bounds.height - padding) correction.y = (bounds.height - padding) - pos.y;

            if (correction.x !== 0 || correction.y !== 0) {
                Body.translate(body, correction);
                Body.setVelocity(body, { x: 0, y: 0 }); // detener movimiento para que no siga saliendo
            }
        });
    }

    // Revisa cada 300ms si alguna forma está fuera
    setInterval(() => {
        keepBodiesInsideCanvas(shapes, {width: width, height: height});
    }, 300);

    // Evento para pintar los colores personalizados
    Events.on(render, 'beforeRender', function() {
        var context = render.context;

        shapes.forEach(function(body) {
            context.fillStyle = body.render.fillStyle || '#666';
            context.beginPath();
            var vertices = body.vertices;
            context.moveTo(vertices[0].x, vertices[0].y);
            for (var j = 1; j < vertices.length; j++) {
                context.lineTo(vertices[j].x, vertices[j].y);
            }
            context.closePath();
            context.fill();
        });
    });

    // Evento para dibujar texto dentro de cada forma
    Events.on(render, 'afterRender', function() {
        var context = render.context;
        context.font = "18px Arial";
        context.fillStyle = "#000";
        context.textAlign = "center";
        context.textBaseline = "middle";

        shapes.forEach(function(body) {
            if (body.render.text) {
                var pos = body.position;
                context.fillText(body.render.text, pos.x, pos.y);
            }
        });
    });

    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

Example.rounded();

</script>

</body>
</html>
