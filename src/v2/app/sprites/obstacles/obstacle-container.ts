import Obstacle from "./obstacle";

export default interface ObstacleContainer {
    obstacles: Obstacle[];
    update(): void;
    draw(context: CanvasRenderingContext2D): void;
}