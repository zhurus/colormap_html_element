(function(){
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class Rect {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        leftBottom() {
            return new Point(this.x, this.y);
        }
        leftTop() {
            return new Point(this.x, this.y + this.height);
        }
        rightBottom() {
            return new Point(this.x + this.width, this.y);
        }
        rightTop() {
            return new Point(this.x + this.width, this.y + this.height);
        }
        intersects(otherRect) {
            return this.contains(otherRect.leftBottom()) && 
                this.contains(otherRect.rightBottom()) &&
                this.contains(otherRect.leftTop()) &&
                this.contains(otherRect.rightTop());
        }
        contains(point) {
            if(point.x < this.x || point.x > this.x + this.width)
                return false;
            if(point.y < this.y || point.y > this.y + this.height)
                return false;
            return true;
        }
    }


    class GPoint extends Point {
        static width = 20;
        static height = 20;

        constructor(x, y) {
            super(x, y);
            this.selected = false;
        }
        draw(scene) {
            let ctx = scene.canvasDom.getContext("2d");
            ctx.strokeStyle = this.selected? "red" : "black";
            ctx.strokeRect(
                this.x - GPoint.width/2,
                this.y - GPoint.height/2,
                GPoint.width,
                GPoint.height
            );
        }
        outlineRect() {
            return new Rect(
                this.x - GPoint.width/2,
                this.y - GPoint.height/2,
                GPoint.width,
                GPoint.height
            );
        }
        isHovered(point) {
            return this.outlineRect().contains(point);
        }
        setSelected(selected = true) {
            this.selected = selected;
        }
    }

    class DraggableGPoint extends GPoint {
        constructor(x, y) {
            super(x, y);
        }
        translate(dx, dy) {
            this.x += dx;
            this.y += dy;
        }
        moveTo(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class PointWithLimits extends DraggableGPoint {
        constructor(x, y) {
            super(x, y);
            this.limitingRect = null;
        }
        translate(dx, dy) {
            let newPos = new Point(this.x + dx, this.y);
            if(this.limitingRect.contains(newPos))
                super.translate(dx, 0);
            newPos.y += dy;
            if(this.limitingRect.contains(newPos))
                super.translate(0, dy);
        }
        moveTo(x, y) {
            if(this.limitingRect.contains(new Point(x, this.y)))
                this.x = x;
            if(this.limitingRect.contains(new Point(this.x, y)))
                this.y = y;
        }
    }


    class Scene {
        constructor(canvasDom) {
            this.items = [];
            this.canvasDom = canvasDom;
            
            this.pointerInside = false;
            this.selectedPoint = null;
        }
        addItem(item) {
            this.items.push(item);
        }
        draw() {
            if(this.canvasDom) {
                this.items.forEach(i => i.draw(this));
            }
        }
        repaint() {
            if(this.canvasDom) {
                this.canvasDom.getContext("2d").clearRect(0, 0, this.canvasDom.width, this.canvasDom.height);
                this.draw();
            }
        }
        checkContaining(point) {
            this.hoverPoint = this.items.find(item => {
                if(item instanceof GPoint) {
                    return item.isHovered(point);
                }
            });
        }
        hoverPoint(pointerPos) {
            return this.items.find(item => {
                if(item instanceof GPoint)
                    return item.isHovered(pointerPos);
                else
                    return false;
            });
        }
        selectPoint(point) {
            if(this.selectedPoint)
                this.selectedPoint.setSelected(false);
            
            this.selectedPoint = point;
            if(point)
                point.setSelected();
        }
        moveSelectedTo(x, y) {
            if(this.selectedPoint)
                this.selectedPoint.moveTo(x, y);
        }
    }

    canvasJQ = $("#opacity-editor");
    canvasJQ[0].width = canvasJQ.width();
    canvasJQ[0].height = canvasJQ.height();
    let scene = new Scene(canvasJQ[0]);
    let p = new PointWithLimits(250, 250);
    p.limitingRect = new Rect(100, 100, 300, 300);
    scene.addItem(p);
    scene.draw();

    let mouseClicked = false;
    canvasJQ.mouseover(()=>{
        scene.pointerInside = true;        
    });
    canvasJQ.mouseleave(()=>{
        scene.pointerInside = false;
    });

    canvasJQ.mousedown((e)=>{
        mouseClicked = true;
        let pointerPos = new Point(e.offsetX, e.offsetY);
        let p = scene.hoverPoint(pointerPos);
        scene.selectPoint(p? p : null);
        scene.repaint();
    });
    canvasJQ.mouseup(() => mouseClicked = false);
    canvasJQ.mousemove((e)=>{
        if(mouseClicked) {
            let x = e.originalEvent.offsetX;
            let y = e.originalEvent.offsetY;
            scene.moveSelectedTo(x, y);
            scene.repaint();
        }
    });

})()