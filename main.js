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

$(function(){
    genStaff();
    genBar();
    genLine();
    $('#btn_c04_hw1').on('click', launch);
})