var main_size = {w:"1920", h:"1080"};

if( typeof contentWrapper === "undefined" || !contentWrapper ) {
    var contentWrapper = {};
    contentWrapper.scale = 0;
    contentWrapper.old_w = 0;
    contentWrapper.old_h = 0;
    contentWrapper.resize = function() {
        var iframe = $( "#viewerFrame" );
        if( iframe[0] ) {
            
        }else {
    
            var win_width = $( window ).width();
            var win_height = $( window ).height();
    
            var scale = 1;
            if(  win_width > win_height ) {
                if( (win_height / win_width) > ( main_size.h / main_size.w)  )
                    scale =  win_width / main_size.w;
                else scale = win_height / main_size.h;
            }else {
                if( (win_height / win_width) > ( main_size.h / main_size.w)  )
                    scale =  win_width / main_size.w;
                else scale = win_height / main_size.h;
            }       
            if( contentWrapper.old_w !== win_width|| contentWrapper.old_h !==  win_height ) {
                var scale_top = (( win_height -  main_size.h*scale ) / 2);
                var scale_left = (( win_width -  main_size.w*scale ) / 2);
                contentWrapper.scale = scale;
                $( "body" ).css( {
                    "position": "fixed",
                    "top": "0px",
                    "left": scale_left,
                    "transform-origin": "0% 0%",
                    "transform" : "scale(" + scale + ")",
                    "overflow":"hidden"
                });
                contentWrapper.old_w = win_width;
                contentWrapper.old_h = win_height;
            }
        }
            
    }
    contentWrapper.init = function() {
        contentWrapper.resize();
        $( "body" ).attr( "scroll", "no" );
        $( "body" ).css({
            "overflow" : "hidden",
            "visibility" : "visible"
        });
    //     setInterval( contentWrapper.resize , 500 );
    }
    
    contentWrapper.getScale = function() {
        return contentWrapper.scale;
    }

    $( document ).ready(function() {
//         $( "body" ).css( {
//             "transition": "0.5s all ease-out"
//         });

        contentWrapper.resize();
        $( window ).resize( function() {
            contentWrapper.resize();
        });
        // setInterval( 
        //     function()
        //     {
        //     setTimeout( function(){ contentWrapper.resize() }, 200);   
        //     }, 500 );
    });
}; // end