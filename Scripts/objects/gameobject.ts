module objects{
    export class GameObject extends createjs.Sprite {
               
        constructor(imageString:string, x: number, y: number) {
            super(atlas, imageString);
            this.x = x;
            this.y = y;          
        }
    }
}