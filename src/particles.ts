import Game from "./game";

export default class ParticlesFactory {
    private readonly game: Game;

    private particles: Particle[] = [];
    private readonly maxParticles: number = 200;

    constructor(game: Game) {
        this.game = game;
    }

    public update(): void {
        this.particles.forEach(particle => {
            particle.update();
            if (particle.markedForDeletion) {
                this.particles.splice(this.particles.indexOf(particle), 1);
            }
        });
        if (this.particles.length > 50) {
            this.particles = this.particles.slice(0, 50);
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.particles.forEach(particle => particle.draw(context));
    }

    public add(particle: ParticleType, x: number, y: number): void {
        switch (particle) {
            case "dust":
                this.particles.unshift(new Dust(this.game, x, y));
                break;
            case "fire":
                this.particles.unshift(new Fire(this.game, x, y));
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
        this.size *= 0.9;
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

// export class Splash extends Particle {
//     public draw(context: CanvasRenderingContext2D): void {
//         throw new Error("Method not implemented.");
//     }
// }

export class Fire extends Particle {
    private readonly image: CanvasImageSource;
    private angle: number;
    private va: number;

    constructor(game: Game, x: number, y: number) {
        super(game);
        this.image = document.getElementById("fireImg") as CanvasImageSource;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 100 + 50;
        this.vx = 1;
        this.vy = 1;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
    }

    public override update(): void {
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 5);
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
        context.restore();
    }
}
