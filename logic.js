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
        left() {
            return this.x;
        }
        right() {
            return this.x + this.width;
        }
        top() {
            return this.y + this.height;
        }
        bottom() {
            return this.y;
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
            this.minX = null;
            this.maxX = null;
            this.minY = null;
            this.maxY = null;
        }
        setMinX(minX) {
            this.minX = minX;
            if(this.maxX != null && minX >= this.maxX)
                this.maxX = minX;
            if(this.x < minX)
                this.x = minX;
        }
        setMaxX(maxX) {
            this.maxX = maxX;
            if(this.minX != null && maxX <= this.minX)
                this.minX = maxX;
            if(this.x > maxX)
                this.x = maxX;
        }
        setMinY(minY) {
            this.minY = minY;
            if(this.maxY != null && minY >= this.maxY)
                this.maxY = minY;
            if(this.y < minY)
                this.y = minY;
        }
        setMaxY(maxY) {
            this.maxY = maxY;
            if(this.minY != null && maxY <= this.minY)
                this.minY = maxY;
            if(this.y > maxY)
                this.y = maxY;
        }
        setFixedX(x) {
            this.x = x;
            this.minX = x;
            this.maxX = x;
        }
        translate(dx, dy) {
            let newX = this.x + dx;
            let newY = this.y + dy;
            this.moveTo(newX, newY);
        }
        moveTo(x, y) {
            let fitVal = (val, range) => {
                if(range[0] != null && range[1] != null) {
                    if(val >= range[0] && val <= range[1])
                        return val;
                    else if(val < this.minX)
                        return range[0];
                    else if(val > range[1])
                        return range[1];
                }
                else if(range[0] != null) {
                    if(val > range[0])
                        return val;
                    else
                        return range[0];
                }
                else if(range[1] != null) {
                    if(val < range[1])
                        return val;
                    else
                        return range[1];
                }
                else
                    return val;
            };
            this.x = fitVal(x, [this.minX, this.maxX]);
            this.y = fitVal(y, [this.minY, this.maxY]);
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
            this.points = this.points.sort((i1, i2) => i1.x - i2.x);
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
            this.selectedPoint = {
                point: null,
                dragged: null
            };
            this.mousePressed = false;
            this.mousein = false;
            this.init();
        }
        init() {
            let canvasJQ = $(this.canvasDom);
            this.canvasDom.width = canvasJQ.width();
            this.canvasDom.height = canvasJQ.height();
            let self = this;
            canvasJQ.mouseover(e => self.mousein = true);
            canvasJQ.mouseleave(e => self.mousein = false);
            
            $(document).mousedown(e => {
                if(!this.mousein)
                    return;
                self.mousedown(e.offsetX, e.offsetY)
            });
            $(document).mouseup(e => self.mouseup(e.offsetX, e.offsetY));
            $(document).mousemove(e => {
                let pos = $(self.canvasDom).position();
                let x = e.pageX - pos.left;
                let y = e.pageY - pos.top;
                let dx = e.originalEvent.movementX;
                let dy = e.originalEvent.movementY;
                self.mouseMoved(x, y, dx, dy);
            });

            
            let p1 = new PointWithLimits(0, this.canvasDom.height);
            p1.setFixedX(0);
            p1.setMinY(0);
            p1.setMaxY(this.canvasDom.height);
            p1.y = this.canvasDom.height/2;
            this.addPoint(p1);
            this.scene.repaint();
            let p2 = new PointWithLimits(0, this.canvasDom.height);
            p2.setFixedX(this.canvasDom.width);
            p2.setMinY(0);
            p2.setMaxY(this.canvasDom.height);
            p2.y = this.canvasDom.height/2;
            this.addPoint(p2);
            this.scene.repaint();
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
                point.setMinX(0);
                point.setMaxX(this.canvasDom.width);
                point.setMinY(0);
                point.setMaxY(this.canvasDom.height);
                this.addPoint(point);
            }
            return point;
        }
        addPoint(point) {
            this.points.push(point);
            this.scene.addItem(point);
            this.scene.selectPoint(point);
        }
        mousedown(x, y) {
            if(!this.mousein)
                return;
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
                    this.selectedPoint.point = point;
                    this.selectedPoint.dragged = true;
                    this.scene.selectPoint(point);
                }
            } else {
                this.selectedPoint.point = this.emplacePoint(x, y);
                this.selectedPoint.dragged = true;
            }
            this.scene.repaint();
        }
        mouseup(x, y) {
            this.mousePressed = false;
            if(this.selectedPoint)
                this.selectedPoint.dragged = false;
        }
        mouseMoved(x, y, dx, dy) {
            if(!this.mousePressed)
                return;
            if(!this.selectedPoint.point && !this.selectedPoint.dragged)
                return;
            this.selectedPoint.point.moveTo(x, y);
            this.scene.repaint();
        }
        getValues() {
            let w = $(this.canvasDom).width();
            let h = $(this.canvasDom).height();
            return this.points
                .sort((p1, p2) => p1.x - p2.x)
                .map(p => [p.x/w, 1-p.y/h]);
        }
        getPoint(x, y) {
            return this.points.find(gp => gp.outlineRect().contains(new Point(x,y)));
        }
        removeSelectedPoint() {
            if(!this.selectedPoint.point)
                return;
            this.scene.removeItem(this.selectedPoint.point);
            let index = this.points.findIndex(p => p == this.selectedPoint.point);
            if(index != -1)
                this.points.splice(index, 1);
            this.selectedPoint.point = null;
            this.scene.repaint();
        }
    }

    let opacityEditor = new OpacityEditor();
    
    $("#delete-selected-btn").click(e => opacityEditor.removeSelectedPoint());
})()