var Example = Example || {};

Example.rounded = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Body = Matter.Body;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // SIN GRAVEDAD
    engine.gravity.y = 0;
    engine.gravity.x = 0;

    var canvasWidth = 800;
    var canvasHeight = 600;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: canvasWidth,
            height: canvasHeight,
            showAxes: true,
            background: '#fafafa'
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add walls
    var walls = [
        Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 50, { isStatic: true }),
        Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 50, { isStatic: true }),
        Bodies.rectangle(canvasWidth, canvasHeight / 2, 50, canvasHeight, { isStatic: true }),
        Bodies.rectangle(0, canvasHeight / 2, 50, canvasHeight, { isStatic: true })
    ];
    Composite.add(world, walls);

    // add dynamic bodies
    var shapes = [
        Bodies.rectangle(200, 200, 100, 100, { chamfer: { radius: 20 } }),
        Bodies.rectangle(300, 200, 100, 100, { chamfer: { radius: [90, 0, 0, 0] } }),
        Bodies.rectangle(400, 200, 200, 200, { chamfer: { radius: [150, 20, 40, 20] } }),
        Bodies.rectangle(200, 200, 200, 200, { chamfer: { radius: [150, 20, 150, 20] } }),
        Bodies.rectangle(300, 200, 200, 50, { chamfer: { radius: [25, 25, 0, 0] } }),
        Bodies.polygon(200, 100, 8, 80, { chamfer: { radius: 30 } }),
        Bodies.polygon(300, 100, 5, 80, { chamfer: { radius: [10, 40, 20, 40, 10] } }),
        Bodies.polygon(400, 200, 3, 50, { chamfer: { radius: [20, 0, 20] } })
    ];

    Composite.add(world, shapes);

    // add mouse control
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

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: canvasWidth, y: canvasHeight }
    });

    // Recupera cuerpos que se escapan del canvas
    function initEscapedBodiesRetrieval(allBodies, startCoordinates, canvasWidth, canvasHeight) {
        function hasBodyEscaped(body) {
            var x = body.position.x;
            var y = body.position.y;
            return x < 0 || x > canvasWidth || y < 0 || y > canvasHeight;
        }

        setInterval(function () {
            allBodies.forEach(function (body) {
                if (!body.isStatic && hasBodyEscaped(body)) {
                    Body.translate(body, {
                        x: startCoordinates.x - body.position.x,
                        y: startCoordinates.y - body.position.y
                    });
                }
            });
        }, 300);
    }

    var dynamicBodies = Composite.allBodies(world).filter(function (body) {
        return !body.isStatic;
    });

    initEscapedBodiesRetrieval(dynamicBodies, { x: canvasWidth / 2, y: canvasHeight / 2 }, canvasWidth, canvasHeight);

    // context for MatterTools.Demo
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
