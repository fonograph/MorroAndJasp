define(function(require){

    var NewspaperTimeView = function(ending, variation){
        createjs.Container.call(this);
        this.type = 'magazine';

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'newspaper', src:'assets/img/ending/magazine-time-'+variation+'.png'});
        queue.addEventListener("complete", function() {
            var newspaperBg = new createjs.Bitmap(queue.getResult('newspaper'));
            this.addChild(newspaperBg);

            // TITLE

            var titleX;
            var titleY;
            var titleLineWidth;
            var titleHeightAvailable;

            var subtitleX;
            var subtitleLineWidth;
            var subtitleHeightAvailable;

            if ( variation == 1 ) {
                titleX = 192;
                titleY = 332;
            }
            else if ( variation == 2 ) {
                titleX = 192;
                titleY = 300;
            }
            else if ( variation == 3 ) {
                titleX = 325;
                titleY = 250;
            }
            titleLineWidth = 250;
            titleHeightAvailable = 237;
            subtitleX = titleX;
            subtitleLineWidth = 210;
            subtitleHeightAvailable = 203;

            var title = new createjs.Text(ending.title.toUpperCase().trim().replace(/\.$/,''));
            title.x = titleX;
            title.y = titleY;
            title.color = '#ffffff';
            title.lineWidth = titleLineWidth;
            title.textAlign = 'center';
            this.addChild(title);

            var fontSize = 50;
            do {
                title.lineHeight = fontSize * 0.85;
                title.font = 'bold ' + fontSize + 'px Times';
                fontSize--;
            } while ( title.getMetrics().height > titleHeightAvailable || title.getMetrics().width > title.lineWidth );

            // SUBTITLE

            if ( ending.subtitle ) {
                var line = new createjs.Shape();
                line.graphics.beginFill('#ffffff');
                line.graphics.drawRect(0, 0, 100, 3);
                line.regX = 100/2;
                line.x = titleX;
                line.y = titleY + title.getMetrics().height + 15;
                this.addChild(line);

                var subtitle = new createjs.Text(ending.subtitle.trim().replace(/(\w)\.$/,'$1'));
                subtitle.x = subtitleX;
                subtitle.y = line.y + 10;
                subtitle.color = '#ffffff';
                subtitle.lineWidth = subtitleLineWidth;
                subtitle.textAlign = 'center';
                this.addChild(subtitle);

                heightAvailable = subtitleHeightAvailable;

                fontSize = 30;
                do {
                    subtitle.lineHeight = fontSize * 0.85;
                    subtitle.font = fontSize + 'px Times';
                    fontSize--;
                } while ( subtitle.getMetrics().height > heightAvailable || subtitle.getMetrics().width > subtitle.lineWidth );
            }

            // SIDEBAR

            var sidebar = new createjs.Text(ending.unrelated);
            sidebar.x = 325;
            sidebar.y = 71;
            sidebar.color = '#ffffff';
            sidebar.maxWidth = 480; //squashes single line text
            sidebar.textAlign = 'center';
            sidebar.font = '18px Helvetica';
            this.addChild(sidebar);

            // end

            this.cache(0, 0, newspaperBg.image.width, newspaperBg.image.height);
            this.regX = newspaperBg.image.width/2;
            this.regY = newspaperBg.image.height/2;
        }.bind(this));

    };
    NewspaperTimeView.prototype = Object.create(createjs.Container.prototype);
    NewspaperTimeView.prototype.constructor = NewspaperTimeView;

    createjs.promote(NewspaperTimeView, "super");
    return NewspaperTimeView;
});