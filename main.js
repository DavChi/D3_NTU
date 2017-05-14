function random(N, M){
    N += 1;
    return Math.floor(Math.random()*(M-N+1)+N);
}

function launch(){
    var r = random(1911, 2016);
    d3.select('#ipt_c04_hw1').text(r);
}

function genStaff(){
    var s = d3.select('#svg');
    s
        .style({'background':'oldlace'})
        .append('text')
        .attr({
            'x': 135,
            'y': 200,
            'font-size': 40,
            'font-family': 'arial'
        })
        .text('A');
    for(var i=0;i<5;i++){
        s
            .append('rect')
            .attr({
                'x': 0,
                'y': 40+i*30,
                'width': 300,
                'height': 5
            });
    }
}

function genBar(){
    d3.select('#svg_c04_pr2')
        .append('svg')
        .attr({
            'width':300,
            'height':200,
            'id':'svgBar'
        });
    var s = d3.select('#svgBar');
    for(var i=0;i<20;i++){
        var num = random(20, 300);
        s
            .append('rect')
            .attr({
                'x':10,
                'y':10+15*i,
                'width':num,
                'height':10,
                'fill':'red'
            });
        s.append('text')
            .attr({
                'x':10+num+3,
                'y':10+15*i+10,
                'font-size':9
            })
            .text(num);
    }
}

function genLine(){
    d3.select('#svg_c04_pr2')
        .append('svg')
        .attr({
            'width':300,
            'height':270,
            'id':'svgLine'
        });
    var s = d3.select('#svgLine'),
        points = '10,0 ';
    for(var i=0;i<20;i++){
        var num = random(20, 250);
        points = points+(10+num)+','+(10+12*i)+' ';
        s
            .append('circle')
            .attr({
                'cx':10+num,
                'cy':10+12*i,
                'r':4,
                'height':10,
                'fill':'red'
            });
        s.append('text')
            .attr({
                'x':10+num+5,
                'y':10+12*i+3,
                'font-size':9
            })
            .text(num);
    }
    //console.log(points);
    points += 10+','+(10+12*21);
    s
        .append('polyline')
        .attr({
            'points':points,
            'stroke':'black',
            'fill':'rgba(0,0,0,0)'
        });
}

function genTaipeiBar(){
    var filepath = 'invoice-taipei.json',
        s = d3.select('#svg_c05_hw1');
    d3.json(filepath, function(dataset){
        var fData = dataset.filter(function(d){
            return d.amount>1000000000 && d.date==='2016/8/1' && d.cid==='A';//(d.city ==='台北市' || d.city==='臺北市');
        });
        
//        var xScale = d3.scale.linear().domain([100000000,10000000000]).range([0,100]);
        var xScale = d3.scale.linear().domain([d3.min(fData, function(d){return +d.amount;}),d3.max(fData, function(d){return +d.amount;})]).range([10,300]);

        for(var i in fData){
            s
                .append('text')
                .attr({
                    'x': 10,
                    'y': 20+i*20,
                    'font-size': 15
                })
                .text(fData[i].industry);
            s
                .append('rect')
                .attr({
                    'x': 250,
                    'y': 10+i*20,
                    'height': 10,
                    'width': xScale(fData[i].amount),//fData[i].amount/100000000,
                    'fill': 'red'
                });
        }
        var h = fData.length*20+20,
            padding = 10;
        var xAxis = d3.svg.axis().scale(xScale).orient('bottom')
        .tickFormat(function(d){
            return (d/1000000000)+'G';
        }).ticks(5);
        s.append('g').attr({
				'class':'axis',
				'transform':'translate('+(250-padding)+','+(h-padding)+')'
			}).call(xAxis);
    });
    /*
    //d3.csv(filepath, preProcess, function(dataset){...};
    function preProcess(d){
        //convert string to number...
    }
    */
}

function genScore(){
    var arr = [85,60,99,49,77,82],
        txt = d3.select('#atc_c06_hw1'),
        s,
        p = 100,
        h = 300,
        w = 800;
    txt
        .selectAll('div')
        .data(arr)
        .enter()
        .append('div');
    txt
        .selectAll('div')
        .data(arr)
        .exit()
        .remove();
    txt
        .selectAll('div')
        .text(function(d,i){return Number(i)+1+':'+d;})
        .style({'color':function(d){return d<70?'red':'black';}});
    
    var arr2 = arr;
    d3.select('#atc_c06_hw2').append('svg').attr({width:w, height:h, id:'svg_c06_hw2'});
    s = d3.select('#svg_c06_hw2');
    
    function bind(){
        var selection = s.selectAll('rect').data(arr2);
        selection.enter().append('rect');
        selection.exit().remove();
        var s_txt = s.selectAll('text').data(arr2);
        s_txt.enter().append('text');
        s_txt.exit().remove();
    }
    function render(){
        s.selectAll('rect').attr({
             x: function(d,i){
                return p+(40+2)*i+10;
            },
            y: function(d,i){
                return h-p-d;
            },
            width: 40,
            height: function(d,i){return d;},
            fill: function(d,i){
                if(d<70){return 'red';}
                else{return 'lightgreen';}
            }
        });
        s.selectAll('text').attr({
            x: function(d,i){
                return p+(40+2)*i+10;
            },
            y: function(d,i){
                return h-p+20;
            }
        }).text(function(d){return d;});
    }
    function update_add(){
        var num = random(10,100);
        arr2.push(num);
        bind();
        render();
    }
    function update_rm(){
        arr2.shift();
        bind();
        render();
    }
    $('#ipt_c06_hw2_1').on('click', update_add);
    $('#ipt_c06_hw2_2').on('click', update_rm);
    bind();
    render();
}

function partyColor(){
    var index = ['中國國民黨','民主進步黨','時代力量','無黨團結聯盟','親民黨'],
        color = ['blue','green','orange','gray','yellow','請選擇'];
    var xScale = d3.scale.ordinal()
          .domain(index)
          .range(color);

    xScale(0);
    xScale(1);
    xScale(4);
    xScale(3);
    xScale(2);
    xScale(5);
    $('#sel_c07_hw1 select').change(function(e){
        $('#sel_c07_hw1 p').text(xScale($(this).val()));
//        console.log(xScale($(this).val()));
    });
}

$(function(){
    genStaff();
    genBar();
    genLine();
    $('#btn_c04_hw1').on('click', launch);
    genTaipeiBar();
    genScore();
    partyColor();
})