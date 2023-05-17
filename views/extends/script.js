
$(document).ready(function(){


    $(".bar-menu").click(function(){
        $(".contDesplegable").css("display","block");
        $(".bar-menu").css("display","none");
        $(".bar-close").css("display","");
    });
   
    $(".bar-close").click(function(){
        $(".contDesplegable").css("display","none");
        $(".bar-menu").css("display","");
        $(".bar-close").css("display","none");
    });

    if($("#estrella").attr("estado")==1){
        $("#estrella").html("<span id='star' class='glyphicon glyphicon-star'></span>");
    }else{
        $("#estrella").html("<span id='star' class='glyphicon glyphicon-star-empty'></span>");
    }

    $("#estrella").click(function(){

        if($(this).attr("estado")==1){
            $("#star").remove();
            $(this).attr("estado","0");
            $(this).html("<span id='star' class='glyphicon glyphicon-star-empty'></span>");
            
        }else{
            $("#star").remove();
            $(this).attr("estado","1");
            $(this).html("<span id='star' class='glyphicon glyphicon-star'></span>");

        }
        

    });

    $(".tres").click(function(){
        $(".campoOculto").css("display","");
        setTimeout(function () {
            $("body").addClass("cerrarModal");
        }, 10);
    });

    $(".btnAbrir").click(function(){
        
        $(".campoAdmin").css("display","");
        setTimeout(function () {
            $("body").addClass("cerrarModal");
        }, 10);

    });
  
  
    $(document).on("click",".cerrarModal",function(){
        $(".campoOculto").css("display","none");
        $(".campoAdmin").css("display","none");
        setTimeout(function () {
            $("body").removeClass("cerrarModal");
        }, 10);  
    });

    $(".inputFormulario").change(function(){

        if($(this).val()!= ""){

            $(".inputFormulario + h5").focus(function(){
                $(".inputFormulario + h5").css("opacity","1");
            });

            $(".inputFormulario + h5").focusout(function(){
                $(".inputFormulario + h5").css("opacity","0");
            });

        }

    });

});

function printDiv(nombreDiv) {
    var contenido= document.getElementById(nombreDiv).innerHTML;
    var contenidoOriginal= document.body.innerHTML;

    document.body.innerHTML = contenido;

    window.print();

    // location.href="admin-pacientes";
}
