import { Coordinate } from "../models/coordinate";

export abstract class GeographicHelper {

    public static isInPolygon(coordinate: Coordinate, polygon: Coordinate[]): boolean
        {
            const x = coordinate.latitude;
            const y = coordinate.longitude;

            let inside = false;

            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++)
            {
                const xi = polygon[i].latitude;
                const yi = polygon[i].longitude;

                const xj = polygon[j].latitude;
                const yj = polygon[j].longitude;

                const intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

                if (intersect) inside = !inside;
            }

            return inside;
        }

        public static calculeDistanceInMeters(coordinate1: Coordinate, coordinate2: Coordinate): number
        {
            const d1 = coordinate1.latitude * (Math.PI / 180.0);
            const num1 = coordinate1.longitude * (Math.PI / 180.0);

            const d2 = coordinate2.latitude * (Math.PI / 180.0);
            const num2 = coordinate2.longitude * (Math.PI / 180.0) - num1;

            const d3 = Math.pow(Math.sin((d2 - d1) / 2.0), 2.0) + Math.cos(d1) * Math.cos(d2) * Math.pow(Math.sin(num2 / 2.0), 2.0);

            return (6376500.0 * (2.0 * Math.atan2(Math.sqrt(d3), Math.sqrt(1.0 - d3))));
        }
}