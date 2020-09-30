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


    class GrPoint extends Point {
        static width = 10;
        static height = 10;

        constructor(x, y) {
            super(x, y);
            this.selected = false;
        }
        draw(scene) {
            let ctx = scene.canvasDom.getContext("2d");
            ctx.strokeStyle = this.selected? "green" : "black";
            ctx.strokeRect(
                this.x - GrPoint.width/2,
                this.y - GrPoint.height/2,
                GrPoint.width,
                GrPoint.height
            );
        }
        outlineRect() {
            return new Rect(
                this.x - GrPoint.width/2,
                this.y - GrPoint.height/2,
                GrPoint.width,
                GrPoint.height
            );
        }
        isHovered(point) {
            return this.outlineRect().contains(point);
        }
        setSelected(selected = true) {
            this.selected = selected;
        }
    }

    class DraggableGrPoint extends GrPoint {
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

    class PointWithLimits extends DraggableGrPoint {
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
            this.points = [];
            this.canvasDom = canvasDom;
            
            this.pointerInside = false;
            this.selectedPoint = null;
        }
        draw() {
            if(this.canvasDom) {
                this.points.forEach((item, index, arr) => {
                    item.draw(this);
                    if(index != 0)
                        this.drawLine(arr[index - 1], arr[index]);
                }, this);
            }
        }
        drawLine(point1, point2) {
            let ctx = this.canvasDom.getContext("2d");
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.stroke();
        }
        repaint() {
            if(this.canvasDom) {
                this.canvasDom.getContext("2d").clearRect(0, 0, this.canvasDom.width, this.canvasDom.height);
                this.draw();
            }
        }
        checkContaining(point) {
            this.hoverPoint = this.points.find(item => {
                if(item instanceof GrPoint) {
                    return item.isHovered(point);
                }
            });
        }
        hoverPoint(pointerPos) {
            return this.points.find(item => {
                if(item instanceof GrPoint)
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
        contains(item) {
            return this.points.some(i => i == item);
        }
        addItem(item) {
            this.points.push(item);
            this.points = this.points.sort((i1, i2) => i1.x - i2.x);
        }
        removeItem(item) {
            if(!item)
                return;
            let itemIndex = this.points.findIndex(i => item == i);
            if(itemIndex == -1)
                return;
            
            if(item == this.selectedPoint)
                this.selectedPoint = item;
            this.points.splice(itemIndex, 1);
        }
    }


    class OpacityEditor {
        constructor() {
            this.canvasDom = $("#opacity-editor")[0];
            this.scene = new Scene(this.canvasDom);

            this.points = [];
            this.selectedPointIndex = null;
            this.init();            
            this.mousePressed = false;
        }
        init() {
            let canvasJQ = $(this.canvasDom);
            this.canvasDom.width = canvasJQ.width();
            this.canvasDom.height = canvasJQ.height();
            let self = this;
            // canvasJQ.mouseover(e => self.mousein = true);
            // canvasJQ.mouseleave(e => self.mousein = false);
            canvasJQ.mousedown(e => self.mousedown(e.offsetX, e.offsetY));
            canvasJQ.mouseup(e => self.mouseup(e.offsetX, e.offsetY));
            canvasJQ.mousemove(e => self.mouseMoved(
                e.offsetX, e.offsetY,
                e.originalEvent.movementX, e.originalEvent.movementY));
        }
        emplacePoint(x, y) {
            let point = this.points.find(p => {
                if(x < p.x - GrPoint.width / 2)
                    return false;
                if(x > p.x + GrPoint.width / 2)
                    return false;
                return true;
            });
            if(!point) {
                point = new PointWithLimits(x, y);
                this.addPoint(point);
            }
        }
        addPoint(point) {
            this.points.push(point);
            this.scene.addItem(point);
            this.scene.selectPoint(point);
        }
        mousedown(x, y) {
            this.mousePressed = true;

            let point = this.points.find(p => {
                if(x < p.x - GrPoint.width / 2)
                    return false;
                if(x > p.x + GrPoint.width / 2)
                    return false;
                return true;
            });
            if(point) {
                if(point.outlineRect().contains(new Point(x, y))) {
                    this.selectedPoint = point;
                    this.scene.selectPoint(point);
                }
            } else {
                this.emplacePoint(x, y);
            }
            this.scene.repaint();
        }
        mouseup(x, y) {
            this.mousePressed = false;
        }
        mouseMoved(x, y, dx, dy) {
            if(!this.mousePressed)
                return;
            if(this.selectedPoint) {
                this.selectedPoint.x = x;
                this.selectedPoint.y = y;
            }
            this.scene.repaint();
        }
        getValues() {
            // TODO
        }
        getPoint(x, y) {
            return this.points.find(gp => gp.outlineRect().contains(new Point(x,y)));
        }
        removeSelectedPoint() {
            if(!this.selectedPoint)
                return;
            this.scene.removeItem(this.selectedPoint);
            let index = this.points.findIndex(p => p == this.selectedPoint);
            this.selectedPoint = null;
            if(index != -1)
                this.points.splice(index, 1);
        }
    }

    let opacityEditor = new OpacityEditor();
})()