(function (window) {

function GenomeBrowser() {
    this.view = {chrom: "chr", start: 0, end: 1000};
    this.viewtext = "";

    this.init = function () {
	var that = this;
	this.viewinput = $("input[name='view']");
	
	$("#go").click(function () { that.goToView(); });

	// moving
	$("#move_left3").click(function () { that.moveByFactor(-.95); });
	$("#move_left2").click(function () { that.moveByFactor(-.475); });
	$("#move_left1").click(function () { that.moveByFactor(-.10); });
	$("#move_right3").click(function () { that.moveByFactor(.95); });
	$("#move_right2").click(function () { that.moveByFactor(.475); });
	$("#move_right1").click(function () { that.moveByFactor(.10); });

	// zoom
	$("#zoomin1").click(function () { that.zoomBy(1.5); });
	$("#zoomin2").click(function () { that.zoomBy(3); });
	$("#zoomin3").click(function () { that.zoomBy(10); });
	$("#zoomin4").click(function () { that.zoomBase(); });
	$("#zoomout1").click(function () { that.zoomBy(1/1.5); });
	$("#zoomout2").click(function () { that.zoomBy(1/3); });
	$("#zoomout3").click(function () { that.zoomBy(1/10); });
    };

    //-----------------------------------------------------------------
    // view functions

    this.goToView = function (view) {
	if (!view) {
	    this.viewtext = this.getViewText();
	    this.view = this.parsePosition(this.viewtext);
	} else {
	    var viewtext = this.viewToString(view);
	    this.viewtext = viewtext;
	    this.viewinput.val(viewtext);
	}
    };

    this.getViewText = function () {
	return this.viewinput.val();
    };

    this.moveByFactor = function (factor) {
	var len = this.view.end - this.view.start;
	var step = Math.round(factor * len);

	// clamp
	if (this.view.start + step < 0)
	    step = -this.view.start;

	this.view.start += step;
	this.view.end += step;

	this.goToView(this.view);
    };

    this.zoomBy = function (factor) {
	var len = this.view.end - this.view.start;
	var center = (this.view.start + this.view.end) / 2.0;
	len /= factor;

	this.view.start = Math.round(center - len / 2.0);
	this.view.end = Math.round(center + len / 2.0);

	if (this.view.start < 0) {
	    this.view.end -= this.view.start;
	    this.view.start = 0;
	}

	this.goToView(this.view);
    };

    //-----------------------------------------------------------------
    // view/position string functions

    this.pad = function(str, char, len) {
        while (str.length < len)
            str = char + str;
        return str;
    };

    this.positionToString = function(pos) {
        var s = "";
        while (pos > 1000) {
            s = "," + this.pad("" + (pos % 1000), "0", 3) + s;
            pos = Math.floor(pos / 1000);
        }
        s = pos + s;
        return s;
    };

    this.viewToString = function(view) {
        return view.chrom + ":" + this.positionToString(view.start+1) + "-" + 
        this.positionToString(view.end);
    };

    this.parsePosition = function (text) {
        var tokens = text.split(":");
        if (tokens.length != 2) {
            tokens = ["chr", "0-0"];
        }

        var tokens2 = tokens[1].split("-");
        var start = parseInt(tokens2[0].replace(/,/g, ""));
        var end = parseInt(tokens2[1].replace(/,/g, ""));

        return {chrom: tokens[0], start: start, end: end};
    };


};

window.GenomeBrowser = GenomeBrowser;

})(window);


$(document).ready(function () {
    window.browser = new GenomeBrowser();
    window.browser.init();
});