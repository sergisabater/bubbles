var Example = Example || {};

Example.rounded = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Events = Matter.Events;

    var width = 800,
        height = 600;

    // create engine
    var engine = Engine.create();
    engine.world.gravity.y = 0; // sin gravedad
    var world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: width,
            height: height,
            showAxes: true,
            wireframes: false,
            background: '#fff'
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add walls
    Composite.add(world, [
        Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
        Bodies.rectangle(width / 2, height, width, 50, { isStatic: true }),
        Bodies.rectangle(width, height / 2, 50, height, { isStatic: true }),
        Bodies.rectangle(0, height / 2, 50, height, { isStatic: true })
    ]);

    // Las mismas formas que antes con chamfer, añado un texto custom en el render para cada una:
    var shapes = [
        Bodies.rectangle(200, 200, 100, 100, { chamfer: { radius: 20 }, render: { fillStyle: '#f88', text: 'Texto 1' } }),
        Bodies.rectangle(300, 200, 100, 100, { chamfer: { radius: [90, 0, 0, 0] }, render: { fillStyle: '#8f8', text: 'Texto 2' } }),
        Bodies.rectangle(400, 200, 200, 200, { chamfer: { radius: [150, 20, 40, 20] }, render: { fillStyle: '#88f', text: 'Texto 3' } }),
        Bodies.rectangle(200, 200, 200, 200, { chamfer: { radius: [150, 20, 150, 20] }, render: { fillStyle: '#fa8', text: 'Texto 4' } }),
        Bodies.rectangle(300, 200, 200, 50, { chamfer: { radius: [25, 25, 0, 0] }, render: { fillStyle: '#af8', text: 'Texto 5' } }),
        Bodies.polygon(200, 100, 8, 80, { chamfer: { radius: 30 }, render: { fillStyle: '#a8f', text: 'Texto 6' } }),
        Bodies.polygon(300, 100, 5, 80, { chamfer: { radius: [10, 40, 20, 40, 10] }, render: { fillStyle: '#8af', text: 'Texto 7' } }),
        Bodies.polygon(400, 200, 3, 50, { chamfer: { radius: [20, 0, 20] }, render: { fillStyle: '#fa0', text: 'Texto 8' } }),
    ];
    Composite.add(world, shapes);

    // mouse control
    var mouse = Mouse.create(render.canvas);
    var mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // Función para evitar que los cuerpos escapen del canvas (la que habíamos añadido antes)
    function initEscapedBodiesRetrieval(allBodies, startCoordinates) {
        function hasBodyEscaped(body) {
            var x = body.position.x;
            var y = body.position.y;
            return x < 0 || x > width || y < 0 || y > height;
        }

        setInterval(function() {
            for (var i = 0; i < allBodies.length; i++) {
                var body = allBodies[i];
                if (hasBodyEscaped(body)) {
                    var dx = startCoordinates.x - body.position.x;
                    var dy = startCoordinates.y - body.position.y;
                    Matter.Body.translate(body, { x: dx, y: dy });
                    Matter.Body.setVelocity(body, { x: 0, y: 0 }); // parar su velocidad al resetear
                }
            }
        }, 300);
    }

    var allBodies = Composite.allBodies(world).filter(b => !b.isStatic);
    initEscapedBodiesRetrieval(allBodies, { x: width / 2, y: height / 2 });

    // Aquí está la clave: dibujar el texto dentro de cada forma
    Events.on(render, 'afterRender', function() {
        var context = render.context;
        context.font = "20px Arial";
        context.fillStyle = "#000";
        context.textAlign = "center";
        context.textBaseline = "middle";

        for (var i = 0; i < shapes.length; i++) {
            var body = shapes[i];
            if (body.render.text) {
                var pos = body.position;
                context.fillText(body.render.text, pos.x, pos.y);
            }
        }
    });

    // centrar vista en todo el canvas
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
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

Example.rounded.title = 'Rounded Corners (Chamfering)';
Example.rounded.for = '>=0.14.2';

if (typeof module !== 'undefined') {
    module.exports = Example.rounded;
}
