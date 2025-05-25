var Example = Example || {};

Example.rounded = function () {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Events = Matter.Events,
        Body = Matter.Body;

    var width = 800;
    var height = 600;

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
            wireframes: false,
            background: '#ffffff'
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add walls
    var walls = [
        Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
        Bodies.rectangle(width / 2, height, width, 50, { isStatic: true }),
        Bodies.rectangle(width, height / 2, 50, height, { isStatic: true }),
        Bodies.rectangle(0, height / 2, 50, height, { isStatic: true })
    ];
    Composite.add(world, walls);

    // shapes with text
    var shapes = [
        Bodies.circle(200, 200, 50, {
            chamfer: { radius: 50 },
            render: { fillStyle: '#aaf', customText: "Texto 1" }
        }),
        Bodies.circle(300, 200, 50, {
            chamfer: { radius: 50 },
            render: { fillStyle: '#afa', customText: "Texto 2" }
        }),
        Bodies.circle(400, 200, 50, {
            chamfer: { radius: 50 },
            render: { fillStyle: '#faa', customText: "Texto 3" }
        })
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

    // evitar que se escapen del canvas
    function initEscapedBodiesRetrieval(bodies, startCoordinates) {
        function hasBodyEscaped(body) {
            var x = body.position.x;
            var y = body.position.y;
            return x < 0 || x > width || y < 0 || y > height;
        }

        setInterval(function () {
            bodies.forEach(function (body) {
                if (hasBodyEscaped(body)) {
                    Body.translate(body, {
                        x: startCoordinates.x - body.position.x,
                        y: startCoordinates.y - body.position.y
                    });
                }
            });
        }, 300);
    }

    initEscapedBodiesRetrieval(shapes, { x: width / 2, y: height / 2 });

    // dibujar texto en cada burbuja
    Events.on(render, 'afterRender', function () {
        var context = render.context;
        context.font = '16px Arial';
        context.fillStyle = '#000';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        shapes.forEach(function (body) {
            var text = body.render.customText;
            var pos = body.position;
            context.fillText(text, pos.x, pos.y);
        });
    });

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    });

    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Render.stop(render);
            Runner.stop(runner);
        }
    };
};

Example.rounded.title = 'Rounded Corners with Text';
Example.rounded.for = '>=0.14.2';

if (typeof module !== 'undefined') {
    module.exports = Example.rounded;
}
