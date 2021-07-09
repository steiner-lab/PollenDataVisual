var cdata = {
    type : "null",
    backgroundColor : "#fff",
    flat : true,
    tooltip : {
        padding : '5 10',
        fontSize : 11,
        callout : true,
        calloutWidth : 10,
        calloutHeight : 6,
        calloutPosition : 'bottom'
    },
    heatmap : {
        alpha : 1,
        tooltip : {
            decimals : 0,
            thousandsSeparator : ',',
            text : '~ %value people'
        },
        sortData : true,
        async : false,
        brushType : 'square',
        size : 3,
        blur : 1
    },
    colorScale : {
        aspect : 'gradient',
        gradientStops : '0.0 0.4 0.6 0.7 0.8 1.0',
        gradientColors : 'rgba(0,0,255,0) #0000ff #00ffff #bfff00 #ffff00 #ff0000',
        backgroundColor : null,
        alpha : 0.8
    },
    shapes:[
        {
            type : "zingchart.maps",
            options : {
                id : "mapmain",
                name : "usa",
                scale : true,
                zooming : false,
                panning : false,
                scrolling : false,
                style : {
                    flat : true,
                    controls : {
                        visible : false
                    },
                    borderAlpha : 1,
                    borderColor : "#fff",
                    label : {
                        overlap : false,
                        text : "%long-text"
                    },
                    hoverState : {
                        visible : false,
                        backgroundColor : "none",
                        shadowAlpha : 0.2,
                        shadowDistance : 2,
                        shadow : true,
                        shadowColor : "#333"
                    }
                }
            }
        }
    ]
};

zingchart.bind('myChart', 'load', function() {
    paintHeatmap();
});

window.paintHeatmap = function(iMax, bSmallBrush) {
    var aData = [];
    var iMaxPop = 0;
    for (var i=0;i<FR_POP_2010.length;i++) {
        if (iMax && FR_POP_2010[i][2] > iMax) {
            continue;
        }
        var fLon = FR_POP_2010[i][0], fLat = FR_POP_2010[i][1], iPop = FR_POP_2010[i][2];
        var aXY = zingchart.maps.getXY('mapmain', [fLon, fLat]);
        aData.push([aXY[0], aXY[1], iPop]);
        iMaxPop = Math.max(iMaxPop, iPop);
    }
    zingchart.exec('myChart', 'colorscale.update', {
        data : {
            maxValue : iMaxPop
        }
    });
    var oCSInfo = zingchart.exec('myChart', 'colorscale.getinfo');
    zingchart.exec('myChart', 'heatmap.setdata', {
        minValue : 0,
        maxValue : oCSInfo.max,
        data : aData,
        size : bSmallBrush?4:12,
        blur : bSmallBrush?0:6
    });
}

zingchart.bind('myChart', 'heatmap.mousemove', function(oInfo) {
    if (oInfo.value !== null) {
        zingchart.exec(oInfo.id, 'colorscale.setvalue', {
          graphid : oInfo.graphid,
    		  value : oInfo.value
    	});
    } else {
        zingchart.exec(oInfo.id, 'colorscale.clear', {
            graphid : oInfo.graphid    
        });
    }
});

// commenting this out because I don't want the "show up to ___ population"
// document.querySelector('#sc').addEventListener('click', function() {
//     if (this.checked) {
//         paintHeatmap(100000, true);
//       let maxpopRef = document.querySelector('#maxpop');
//         maxpopRef.value = 100000;
//         maxpopRef.removeAttribute('disabled')
//     } else {
//         paintHeatmap();
//         let maxpopRef = document.querySelector('#maxpop');
//         maxpopRef.setAttribute('disabled', 'disabled')
//     }
// });

// document.querySelector('#maxpop').addEventListener('change', function() {
//     paintHeatmap(this.value, true);
// });

zingchart.loadModules('heatmap,color-scale,maps,maps-usa', function() {

  var w = window.innerWidth;

  zingchart.render({
      id : 'myChart',
      width : w*4/5,
      height : w*4/5,
      output : 'canvas',
      data : cdata,
      modules : 'heatmap,color-scale'
  });
  
});