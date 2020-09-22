import {LineSegment, Point} from "../interfaces/geometry";
import {FUDGE_FACTOR} from "../constants";
import {distance} from "./math.utils";

export function drawPoint(ctx: CanvasRenderingContext2D, p: Point) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.ellipse(p.x, p.y, 5, 5, 0, 0, 360);
    ctx.stroke();
    ctx.closePath();
}

export function drawSlimCurve(ctx: CanvasRenderingContext2D, points: Point[]) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    ctx.moveTo(points[0].x, points[0].y);
    ctx.bezierCurveTo(
        points[1].x, points[1].y,
        points[2].x, points[2].y,
        points[3].x, points[3].y,
    )
    ctx.stroke();
}

export function drawSegment(ctx: CanvasRenderingContext2D,
                            curve1: Point[], curve2: Point[]) {
    ctx.beginPath();
    ctx.moveTo(curve1[0].x, curve1[0].y);
    ctx.bezierCurveTo(
        curve1[1].x, curve1[1].y,
        curve1[2].x, curve1[2].y,
        curve1[3].x, curve1[3].y
    )
    ctx.lineTo(curve2[3].x, curve2[3].y);
    ctx.bezierCurveTo(
        curve2[2].x, curve2[2].y,
        curve2[1].x, curve2[1].y,
        curve2[0].x, curve2[0].y
    )
    ctx.closePath();
    ctx.fill();
}

export function drawThickCurve(ctx: CanvasRenderingContext2D, points: Point[]) {
    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);
    ctx.bezierCurveTo(
        points[1].x, points[1].y,
        points[2].x, points[2].y,
        points[3].x, points[3].y,
    )

    let speed = 0;
    for (let i = 0; i < 3; i++) {
        speed += distance(points[i + 1], points[i]);
    }
    const width = FUDGE_FACTOR / speed;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function drawLine(ctx: CanvasRenderingContext2D, line: LineSegment) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(line.p1.x, line.p1.y);
    ctx.lineTo(line.p2.x, line.p2.y);
    ctx.stroke();
}
