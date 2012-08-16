



// create ruler track
var ruler = new mashome.RulerTrack({name: "ruler", 
                                    height: 20, 
                                    select: function (pos) {
    alert("You clicked position " + ruler.view.chrom + ":" + pos); }});
mashome.addTrack(ruler);


// simple html/text track
var track1 = new mashome.Track({name: "track1",
                                height: 50});
track1.onViewChange = function (view) {
    this.main.html("<b>current view is: " + 
                   view.chrom + ":" + view.start + "-" + view.end + "</b>");
};
mashome.addTrack(track1);



// generate dummy region data
var regions = [];
var x = 0;
for (var i=0; i<100; i++) {
    x += Math.round(Math.random() * 1000);
    var x2 = x + Math.round(Math.random() * 100);
    regions.push([x, x2]);
    x = x2;
}


// simple plotting track with canvas
var track2 = new mashome.CanvasTrack({name: "track2", height: 100});
track2.onViewChange = function (view) {
    var c = this.ctx;
    var scale = (view.end - view.start) / this.width;

    // translate coordinate system so that we can draw in terms of base pairs
    this.beginTransform(view);
    
    // draw each region in regions array
    c.fillStyle= "#5f5";
    c.lineWidth /= scale;
    c.beginPath();
    for (var i in regions) {
        var x = regions[i][0];
        var x2 = regions[i][1];
        c.moveTo(x, 5);
        c.lineTo(x2, 5);
        c.lineTo(x2, this.height-5);
        c.lineTo(x, this.height-5);
        c.lineTo(x, 5);
    }
    c.fill();
    c.closePath();               
    
    // restore drawing transformation context
    this.endTransform();
};
mashome.addTrack(track2);
