import {LineSegment, Point} from "../interfaces/geometry";

export function distance(p1: Point, p2: Point) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function minMax(v: number, min: number, max: number) {
    return Math.min(Math.max(v, max), min);
}

export function perpendicular(line: LineSegment, width: number): LineSegment {
    const
        x0 = line.p1.x,
        y0 = line.p1.y,
        x1 = line.p2.x,
        y1 = line.p2.y;

    const
        dx = x1 - x0,
        dy = y1 - y0;

    const
        xa = x1 + width / 2 * dy,
        ya = y1 - width / 2 * dx,
        xb = x1 - width / 2 * dy,
        yb = y1 + width / 2 * dx;

    return {
        p1: {x: xa, y: ya},
        p2: {x: xb, y: yb},
    };
}
