define(function(require){

    var NewspaperPeopleView = function(ending, variation){
        createjs.Container.call(this);
        this.type = 'magazine';

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'newspaper', src:'assets/img/ending/magazine-people-'+variation+'.png'});
        queue.addEventListener("complete", function() {
            var newspaperBg = new createjs.Bitmap(queue.getResult('newspaper'));
            this.addChild(newspaperBg);

            // TITLE

            var titleX = 45;
            var titleY = 452;
            var titleLineWidth = 320;
            var titleHeightAvailable = 240;

            var subtitleX = titleX;
            var subtitleLineWidth = titleLineWidth;
            var subtitleHeightAvailable = 130;

            var title = new createjs.Text(ending.title.toUpperCase().trim().replace(/\.$/,''));
            title.x = titleX;
            title.y = titleY;
            title.color = '#faf42f';
            title.lineWidth = titleLineWidth;
            title.shadow = new createjs.Shadow('rgba(0,0,0,0.7)', 2, 2, 2);
            this.addChild(title);

            var fontSize = 73;
            do {
                title.lineHeight = fontSize * 0.787;
                title.font = fontSize + 'px GothamCondensedBold';
                fontSize--;
            } while ( title.getMetrics().height > titleHeightAvailable || title.getMetrics().width > title.lineWidth );

            // SUBTITLE

            if ( ending.subtitle ) {
                var subtitle = new createjs.Text(ending.subtitle.trim().replace(/\.$/,''));
                subtitle.x = subtitleX;
                subtitle.y = titleY + title.getMetrics().height + 15;
                subtitle.color = '#ffffff';
                subtitle.lineWidth = subtitleLineWidth;
                subtitle.shadow = new createjs.Shadow('rgba(0,0,0,0.7)', 2, 2, 2);
                this.addChild(subtitle);

                heightAvailable = subtitleHeightAvailable;

                fontSize = 38;
                do {
                    subtitle.lineHeight = fontSize * 0.827;
                    subtitle.font = fontSize + 'px GothamCondensedBold';
                    fontSize--;
                } while ( subtitle.getMetrics().height > heightAvailable || subtitle.getMetrics().width > subtitle.lineWidth );
            }

            // SIDEBAR

            var sidebar = new createjs.Text(ending.unrelated.toUpperCase().trim().replace(/\.$/,''));
            sidebar.x = 616;
            sidebar.y = 41;
            sidebar.color = '#faf42f';
            sidebar.maxWidth = 480; //squashes single line text
            sidebar.font = '22px GothamCondensedBold';
            sidebar.textAlign = 'right';
            sidebar.shadow = new createjs.Shadow('rgba(0,0,0,0.7)', 2, 2, 2);
            this.addChild(sidebar);

            // end

            this.cache(0, 0, newspaperBg.image.width, newspaperBg.image.height);
            this.regX = newspaperBg.image.width/2;
            this.regY = newspaperBg.image.height/2;
        }.bind(this));

    };
    NewspaperPeopleView.prototype = Object.create(createjs.Container.prototype);
    NewspaperPeopleView.prototype.constructor = NewspaperPeopleView;

    createjs.promote(NewspaperPeopleView, "super");
    return NewspaperPeopleView;
});