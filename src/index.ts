import {LineSegment, Point} from "./interfaces/geometry";
import {drawThickCurve, drawLine, drawPoint, drawSegment, drawSlimCurve} from "./utils/draw.utils";
import {distance, minMax, perpendicular} from "./utils/math.utils";
import {FUDGE_FACTOR, MAX_THIKNESS, MIN_THIKNESS, SCALE} from "./constants";

const points: Point[] = [];
let currentPoint = 0;
let perp0: LineSegment;

window.addEventListener('DOMContentLoaded', main);

function main() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas) subscribeForMouseEvents(canvas);
}

function drawProcess(ctx: CanvasRenderingContext2D, e: MouseEvent) {
    const p: Point = {x: e.clientX, y: e.clientY};

    /** Just put a point in a place of click */
    drawPoint(ctx, p);

    /** Storing each point into an array using *currentPoint* index */
    points[currentPoint] = p;
    currentPoint++;

    /** 4 points is enough to draw a Bezier curve */
    if (currentPoint === 4) {

        /** Calculating width of each chunk of curve */
        let frac1 = SCALE * FUDGE_FACTOR/minMax(distance(points[0], points[1]), MIN_THIKNESS, MAX_THIKNESS);
        let frac2 = SCALE * FUDGE_FACTOR/minMax(distance(points[1], points[2]), MIN_THIKNESS, MAX_THIKNESS);
        let frac3 = SCALE * FUDGE_FACTOR/minMax(distance(points[2], points[3]), MIN_THIKNESS, MAX_THIKNESS);

        /** If we don't have the zero perpendicular just calculate it sames as the first one */
        if (!perp0) {
            perp0 = perpendicular({
                p1: {
                    x: points[0].x - (points[1].x - points[0].x),
                    y: points[0].y - (points[1].y - points[0].y)},
                p2: points[0]}, frac1)
        }

        /** Calculate perpendiculars for each other chunks of the curve */
        const perp1 = perpendicular({p1: points[0], p2: points[1]}, frac1);
        const perp2 = perpendicular({p1: points[1], p2: points[2]}, frac2);
        const perp3 = perpendicular({p1: points[2], p2: points[3]}, frac3);

        /**
         *  Drawing the obtained perpendiculars.
         *  These are helper lines for better understanding. Not needed in production mode
         */
        drawLine(ctx, perp0);
        drawLine(ctx, perp1);
        drawLine(ctx, perp2);
        drawLine(ctx, perp3);

        /**
         *  Drawing the edge Bezier curves.
         *  These are helper lines for better understanding. Not needed in production mode
         */
        drawSlimCurve(ctx, [perp0.p1, perp1.p1, perp2.p1, perp3.p1]);
        drawSlimCurve(ctx, [perp0.p2, perp1.p2, perp2.p2, perp3.p2]);

        /**
         *  This draws a filled segment of the future drawing based on two edge bezier curves
         */
        drawSegment(ctx,
            [perp0.p1, perp1.p1, perp2.p1, perp3.p1],
            [perp0.p2, perp1.p2, perp2.p2, perp3.p2]
            )
        /**
         *  Storing the last perpendicular as the first one in order the Bezier curves to be
         *  perfectly joined one to each other
         */
        perp0 = perp3;

        /**
         *  This is a thick line from the first part of article
         *  {@link https://code.tutsplus.com/tutorials/ios-sdk-advanced-freehand-drawing-techniques--mobile-15602}
         *  Not needed in production mode
         */
        drawThickCurve(ctx, points);

        /** Storing the last point as the first one for the next iteration for the curves joining */
        points[0] = points[3];

        /** Reset the index */
        currentPoint = 1;
    }
}



function subscribeForMouseEvents(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw Error('Canvas not initialized');

    canvas.addEventListener('click', (e: MouseEvent) => {
        drawProcess(ctx, e);
    });
    // canvas.addEventListener('mousemove', e => {
    //     drawProcess(ctx, e);
    // });
}
