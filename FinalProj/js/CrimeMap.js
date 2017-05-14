/**
 * Created by user on 2017/5/8.
 */
var w = 400,
    h = 300,
    padding = 40;
var pointArray = new google.maps.MVCArray(),
    pArrCtl = {},
    seqAxis = {
        month: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        time: ['01~03', '04~06', '07~09', '10~12', '13~15', '16~18', '19~21', '22~24'],
        year: ['97', '98', '99', '100', '101', '102', '103', '104', '105', '106']
    };

// var a1 = [
//     new google.maps.LatLng(25.041590, 121.520898),
//     new google.maps.LatLng(25.047908,121.517315),
//     new google.maps.LatLng(25.037760, 121.523752),
//     new google.maps.LatLng(25.040521, 121.525662),
//     new google.maps.LatLng(25.043184, 121.517680)
// ];
// var a3 = [
//     new google.maps.LatLng(25.045847, 121.522529),
//     new google.maps.LatLng(25.039354, 121.513474),
//     new google.maps.LatLng(25.037954, 121.515191),
//     new google.maps.LatLng(25.037235, 121.535039),
//     new google.maps.LatLng(25.040035, 121.527336)
// ];
// var a2 = [new google.maps.LatLng(25.041590, 121.520898)];

function svg(n){
    d3.select("body").append("svg").attr({width:w,height:h,id:n,'class':'overlay'});
}

function mid(d){
    d.LatLng = d.LatLng==='查無經緯度'?
        (function(){delete this;})()
        :[+d.LatLng.split(',')[0],+d.LatLng.split(',')[1]];
    if(d.date.length>6){
        d.year = +d.date.substring(0,3);
        d.month = seqAxis['month'][+d.date.substring(3,5)-1];
        // d.month = +d.date.substring(3,5);
    }else{
        d.year = +d.date.substring(0,2);
        d.month = seqAxis['month'][+d.date.substring(2,4)-1];
        // d.month = +d.date.substring(2,4)
    }
    return d;
}

function mClick(d,i){
    var t = d3.select(this),
        gArr=LLTransfer(d.values),
        tData =[],
        tmp;
    if(t.attr('class')==='bar'){
        t.attr('class', 'bar selected');
        gMap.pushArr(gArr);
        pArrCtl[d.key] = gArr;
    }else{
        t.attr('class', 'bar');
        gMap.popArr(pArrCtl[d.key]);
        delete pArrCtl[d.key];
    }
    tmp = d3.selectAll('.bar.selected').data();
    for (let i in tmp) {
        tData = tData.concat(tmp[i]['values']);
    }
    genSubSvg('EvYear', 'year', tData);
}

function genBarSvg(n, k, dataSet) {
    (document.getElementById(n))||(svg(n));
    var s = d3.select(('#'+n)),
        tDataSet = d3.nest()
            .key(function (d) {
                return d[k];
            })
            .sortKeys(d3.ascending)
            .entries(dataSet);

    bind(s,tDataSet);
    render(s,tDataSet);

    function bind(svg, dataSet){
        var t = svg.selectAll('text').data(dataSet);
        t.enter().append('text').attr('class','bar');
        t.exit().remove();
        var s = svg.selectAll('rect').data(dataSet);
        s.enter().append('rect').attr('class','bar').on('click',mClick);
        s.exit().remove();
    }
    function render(svg, dataSet){
        var xScale = d3.scale.ordinal()
                .domain(dataSet.map(function(d){return d.key;}))
                .rangeRoundPoints([padding,w-padding],1,0),
            yScale = d3.scale.linear()
                .domain([0,d3.max(dataSet,function(d){return d.values.length;})])
                .range([h,padding*2]),
            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom'),
            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left').ticks(5);
        svg.selectAll('rect')
            .attr({
                x: function(d){return xScale(d.key);},
                y: h-padding,
                width: 80,
                height: 0,
                transform: function (d) {
                    return 'translate('+(-40)+',0)';
                }
            })
            .transition()
            .duration(1500)
            .attr({
                y: function(d){return yScale(d.values.length)-padding;},
                height: function(d){return h-yScale(d.values.length);}
            });
        svg.selectAll('text')
            .attr({
                x: function(d){return xScale(d.key);},
                y: h-padding,
                transform: function (d) {
                    return 'translate('+(-10)+',0)';
                }
            })
            .transition()
            .duration(1500)
            .attr({
                y: function(d){return yScale(d.values.length)-padding-5;}
            })
            .tween('number',function(d){
                var i = d3.interpolateRound(0, d.values.length);
                return function(t) {
                    this.textContent = i(t);
                };
            });
        svg.selectAll('g').remove();
        svg.append('g').attr({
            'class':'axis',
            transform: 'translate('+0+','+(h-padding)+')'
        }).call(xAxis);
        svg.append('g').attr({
            'class':'axis',
            transform: 'translate('+(padding)+','+(-padding)+')'
        }).call(yAxis);
    }
}

function genSubSvg(n, k, dataSet) {
    if(dataSet.length==0){
        $(('#'+n)).remove()
    }else {
        (document.getElementById(n)) || (svg(n));
        var s = d3.select(('#' + n)),
            tDataSet = d3.nest()
                .key(function (d) {
                    return d[k];
                })
                // .sortKeys(d3.ascending)
                .sortKeys(function (a, b) {
                    return seqAxis[k].indexOf(a) - seqAxis[k].indexOf(b);
                })
                .entries(dataSet);
        bind(s, tDataSet);
        render(s, tDataSet);
    }
    function bind(svg, dataSet){
        var t = svg.selectAll('text').data(dataSet);
        t.enter().append('text').attr('class','bar').on('click',updateSubSvg);
        t.exit().remove();
        var p = svg.selectAll('path').data(dataSet);
        p.enter().append('path').attr('class','path');
        p.exit().remove();
    }
    function render(svg, dataSet){
        var xScale = d3.scale.ordinal()
                .domain(dataSet.map(function(d){return d.key;}))
                .rangeRoundPoints([padding,w-padding],0.5,0),
            yScale = d3.scale.linear()
                .domain([0,d3.max(dataSet,function(d){return d.values.length;})])
                .range([h,padding*2]),
            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom'),
            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left').ticks(5);
        svg.selectAll('text')
            .transition()
            .duration(1500)
            .attr({
                x: function(d){return xScale(d.key);},
                y: function(d){return yScale(d.values.length)-padding-5;},
                transform: function (d) {
                    return 'translate('+(-10)+',0)';
                }
            })
            .tween('number',function(d){
                var i = d3.interpolateRound(0, d.values.length);
                return function(t) {
                    this.textContent = i(t);
                };
            });
        svg.selectAll('g').remove();
        svg.append('g').attr({
            'class':'axis',
            transform: 'translate('+0+','+(h-padding)+')'
        }).call(xAxis);
        svg.append('g').attr({
            'class':'axis',
            transform: 'translate('+(padding)+','+(-padding)+')'
        }).call(yAxis);

        var line = d3.svg.line()
            .x(function(d,i){
                return xScale(d.key);
            })
            .y(function(d,i){
                return yScale(d.values.length)-padding;
            });
        svg.select('path.path').data([dataSet])
            .transition()
            .duration(1500)
            .attr({
                'd': line
            });
    }
    function updateSubSvg(dataset){
        let nDataset = [],
            fDataset,
            filterKey,
            svgKey;
        d3.selectAll('.bar.selected').data().forEach(function(d){
            nDataset = nDataset.concat(d.values);
        });
        for(let i in seqAxis){
            if(seqAxis[i].indexOf(dataset.key)!=-1) {
                filterKey = i;
                break;
            }
        }
        if(filterKey==='year'){
            svgKey='month';
            fDataset = nDataset.filter(function(d){
                return d[filterKey]==dataset.key;
            });
        }else {
            svgKey='time';
            fDataset = dataset.values.filter(function (d) {
                return d[filterKey] == dataset.key;
            });
        }
        genSubSvg('EvYear',svgKey,fDataset);
    }
}

// updateSubSvg = (dataset) =>{
//     let nDataset = [],
//         fDataset;
//     d3.selectAll('.bar.selected').data().forEach(function(d){
//         nDataset = nDataset.concat(d.values);
//     });
//     fDataset = nDataset.filter(function(d){
//         console.log(d['year']+':'+dataset.key);
//         return d['year']==dataset.key;
//     });
//     bind(d3.select('#EvYear',fDataset));
//     render(d3.select('#EvYear',fDataset));
// };

function LLTransfer(d){
    for(var h=[],i=0;i<d.length;i=i+1){
        (d[i]['LatLng'])&&(h.push(new google.maps.LatLng(d[i]['LatLng'][0], d[i]['LatLng'][1])));
    }
    return h;
}

function Map(mapID,LatLng){
    var map,
        heatmap;
    this.pushArr = function(t){
        for(var i=0;i<t.length;i++){
            pointArray.push(t[i]);
        }
    };
    this.replaceArr = function (o,n){
        var i=0,
            j=0;
        for(;i<o.length && j<n.length;i++,j++){
            pointArray.setAt(pointArray.indexOf(o[i]),n[j]);
        }
        for(;j<n.length;j++){
            pointArray.push(n[j]);
        }
    };
    this.popArr = function(t){
        for(var i=0;i<t.length;i++){
            pointArray.removeAt(pointArray.indexOf(t[i]));
        }
    };
    this.init = function (){
        var myLatlng = new google.maps.LatLng(LatLng[0],LatLng[1]);
        var mapOptions = {
            zoom: 12,
            center: myLatlng,
            mapTypeId: 'roadmap',
            //Set map style to night mode
            styles: [
                {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{color: '#263c3f'}]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#6b9a76'}]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{color: '#38414e'}]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#212a37'}]
                },
                {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#9ca5b3'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{color: '#746855'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#1f2835'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#f3d19c'}]
                },
                {
                    featureType: 'transit',
                    elementType: 'geometry',
                    stylers: [{color: '#2f3948'}]
                },
                {
                    featureType: 'transit.station',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{color: '#17263c'}]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#515c6d'}]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [{color: '#17263c'}]
                }
            ]
        };
        // map = new google.maps.Map(document.getElementById(mapID), mapOptions);
        map = new google.maps.Map(d3.select(('#'+mapID)).node(), mapOptions);

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: pointArray,
            'radius': 30
        });
        heatmap.setMap(map);
    };
    this.reset = function(){
        // heatmap.setMap(null);
        pointArray.clear();
    };
    this.createDots = function(dataSet){
        var overlay = new google.maps.OverlayView();
        // console.log(dataSet);
        // 當overlay加入後，增加一個分層layer

        overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                .attr("class", "stations");

            // 畫出獨立的每一個資料點
            overlay.draw = function() {
                var projection = this.getProjection(),
                    padding = 10;

                var marker = layer.selectAll("svg")
                    .data(d3.entries(dataSet))
                    .each(transform)
                    .enter().append("svg")
                    .each(transform)
                    .attr("class", "marker");

                // 增加圓點，並打開滑鼠事件，讓文字在滑鼠移入時出現
                marker.append("circle")
                    .attr("r", 10)
                    .attr("cx", padding)
                    .attr("cy", padding)
                    .on("mouseover",function(d){
                        d3.select(this.parentNode).select("text").attr({
                            opacity: 1
                        });
                    })
                    .on("mouseout",function(d){
                        d3.select(this.parentNode).select("text").attr({
                            opacity: 0
                        });
                    });

                // 增加文字說明
                marker.append("text")
                    .attr({
                        x:padding + 20,
                        y: padding,
                        "font-size": "20px",
                        opacity: 0,
                        fill: 'rgba(184, 173, 255, 0.55)'
                    })
                    .text(function(d) { return d.value.type+'\r\n'+d.value.location; })


                function transform(d) {
                     // console.log(d);
                    if(d.value.LatLng) {
                        d = new google.maps.LatLng(d.value.LatLng[0], d.value.LatLng[1]);

                        d = projection.fromLatLngToDivPixel(d);

                        return d3.select(this)
                            .style("left", (d.x - padding) + "px")
                            .style("top", (d.y - padding) + "px");
                    }else{return;}
                }
            };
        };

        // 綁定overlay到地圖中
        overlay.setMap(map);
    };
}

$(function(){
    // var gMap = new Map('map',[25.047908,121.517315]);
    gMap.init();
    d3.csv('source/北市竊盜點位資訊_10401-10602.csv', mid, function(dataSet){
        // console.log(dataSet);
        gMap.createDots(dataSet);
        genBarSvg('EvType','type',dataSet);
    });

});
