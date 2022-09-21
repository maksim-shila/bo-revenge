type DimensionProps = {
    sw: number;
    sh: number;
    width?: number;
    height?: number;
    scale?: number;
}

export default class Dimension {

    public readonly sw: number;
    public readonly sh: number;
    public readonly width: number;
    public readonly height: number;

    constructor(props: DimensionProps) {
        this.sw = props.sw;
        this.sh = props.sh;
        this.width = props.width ?? props.sw * (props.scale ?? 1);
        this.height = props.height ?? props.sh * (props.scale ?? 1);
    }
}