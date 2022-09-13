import Game from "./game";

export default class ParticlesFactory {
    public readonly particles: Particle[];
    game: Game;

    constructor(game: Game) {
        this.game = game;
        this.particles = [];
    }

    public update(): void {
        this.particles.forEach(particle => {
            particle.update();
            if (particle.markedForDeletion) {
                this.particles.splice(this.particles.indexOf(particle), 1);
            }
        });
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.particles.forEach(particle => particle.draw(context));
    }

    public push(particle: ParticleType, x: number, y: number): void {
        switch (particle) {
            case "dust":
                this.particles.push(new Dust(this.game, x, y));
                break;
        }
    }
}

export type ParticleType = "dust" | "splash" | "fire";

abstract class Particle {

    protected readonly game: Game;
    protected x = 0;
    protected y = 0;
    protected vx = 0;
    protected vy = 0;
    protected size = 1;
    public markedForDeletion = false;

    constructor(game: Game) {
        this.game = game;
    }

    public update(): void {
        this.x -= this.vx + this.game.speed;
        this.y -= this.vy;
        this.size *= 0.95;
        if (this.size < 0.5) {
            this.markedForDeletion = true;
        }
    }

    public abstract draw(context: CanvasRenderingContext2D): void;
}

export class Dust extends Particle {

    private readonly color: string;

    constructor(game: Game, x: number, y: number) {
        super(game);
        this.size = Math.random() * 10 + 10;
        this.x = x;
        this.y = y;
        this.vx = Math.random();
        this.vy = Math.random();
        this.color = "rgba(0, 0, 0, 0.2)";
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }
}