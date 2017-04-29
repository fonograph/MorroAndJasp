define(function(require){

    var NewspaperView = function(ending, variation){
        createjs.Container.call(this);
        this.type = 'newspaper';

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'newspaper', src:'assets/img/ending/newspaper-'+variation+'.png'});
        queue.addEventListener("complete", function() {
            var newspaperBg = new createjs.Bitmap(queue.getResult('newspaper'));
            this.addChild(newspaperBg);

            // TITLE

            var title = new createjs.Text(ending.title.toUpperCase().trim().replace(/\.$/,''));
            title.x = 115;
            title.y = 383;
            title.color = '#000000';
            title.lineWidth = 548;
            title.alpha = 0.9;
            this.addChild(title);

            var heightAvailable = ending.subtitle ? 225 : 289;

            var fontSize = 100;
            do {
                title.lineHeight = fontSize * 0.9;
                title.font = 'bold ' + fontSize + 'px Times';
                fontSize--;
            } while ( title.getMetrics().height > heightAvailable || title.getMetrics().width > title.lineWidth );

            // SUBTITLE

            if ( ending.subtitle ) {
                var subtitle = new createjs.Text(ending.subtitle.toUpperCase().trim().replace(/\.$/,''));
                subtitle.x = 115;
                subtitle.y = 619;
                subtitle.color = '#000000';
                subtitle.lineWidth = 548;
                subtitle.alpha = 0.9;
                this.addChild(subtitle);

                heightAvailable = 53;

                fontSize = 40;
                do {
                    subtitle.lineHeight = fontSize * 0.9;
                    subtitle.font = 'italic ' + fontSize + 'px Times';
                    fontSize--;
                } while ( subtitle.getMetrics().height > heightAvailable || subtitle.getMetrics().width > subtitle.lineWidth );
            }

            // SIDEBAR

            var sidebar = new createjs.Text(ending.unrelated.toUpperCase().trim().replace(/\.$/,''));
            sidebar.x = 710;
            sidebar.y = 625;
            sidebar.color = '#000000';
            sidebar.lineWidth = 202;
            sidebar.alpha = 0.7;
            this.addChild(sidebar);

            heightAvailable = 65;

            fontSize = 30;
            do {
                sidebar.lineHeight = fontSize * 0.9;
                sidebar.font = 'bold ' + fontSize + 'px Times';
                fontSize--;
            } while ( sidebar.getMetrics().height > heightAvailable || sidebar.getMetrics().width > sidebar.lineWidth );


            // end

            this.cache(0, 0, newspaperBg.image.width, newspaperBg.image.height);
            this.regX = newspaperBg.image.width/2;
            this.regY = newspaperBg.image.height/2;
        }.bind(this));

    };
    NewspaperView.prototype = Object.create(createjs.Container.prototype);
    NewspaperView.prototype.constructor = NewspaperView;

    createjs.promote(NewspaperView, "super");
    return NewspaperView;
});