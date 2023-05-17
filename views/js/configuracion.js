var url_base="/";

$(function(){
	$("#btn_mostrar_datos").on('click',function(){
		mostrarDatos();
	})
});


function mostrarDatos()
{
	var psw = prompt("Ingrese contraseña");
	if(psw==null || psw==""){
		alert("Ingrese un valor correcto");
	}else{
		var xhr = $.ajax({
			url:"/validateInputPassword",
			method:"GET",
			data:{psw:psw},
			dataType:"json"
		});

		xhr.done(function(data){
			if(data.error==0){
				//cambia el tipo del input a text para hacer visible los datos
				$("#celular").attr('type',"text");
				$("#email").attr('type',"text");
				var time = 10000;//10 segundos
				//despues de 10 segundos se oculta nuevamente la informacion
				setTimeout(function(){
					$("#celular").attr('type',"password");
					$("#email").attr('type',"password");		
				}, time);
			}else if(data.error==1){
				alert(data.message);
			}else if(data.error==2){
				//sesion expirada retorna al login
				location.href=url_base;
			}
		});
		
	}
}


function updateContraseña()
{	
	var new_psw = $("#password").val();
	var new_psw2 = $("#password2").val();
	//valida que la contraseña nueva no este vacia
	if(new_psw==""){
		alert("Ingrese una nueva contraseña");
		return;
	}
	//valida que la contraseña de confirmacion no este vacia
	if(new_psw2==""){
		alert("Confirme su contraseña");
		return;
	}
	if(new_psw!=new_psw2){
		alert("Contraseñas no coinciden");
		return;
	}else{
		//muestra un input dialog para ingresar la contraseña actual
		var actual_psw = prompt("Ingrese su contraseña actual");
		if(actual_psw == null || actual_psw == "")
		{
			alert("Ingrese un valor correcto");
			return;
		}else{
			var xhr = $.ajax({
				url:"/updatePacientePassword",
				method:"GET",
				data:{psw:new_psw,old_psw:actual_psw},
				dataType:"json"
			});

			xhr.done(function(data){
				//cuando la sesion expiro, regresa al login
				if(data.error==2){
					location.href=url_base;
				}else if(data.error==1){
					alert(data.message);
				}else{
					//la actualizacion correcta fuerza el inicio de sesion nuevamente
					alert(data.message+"\nSu sesión se cerrará en unos segundos");
					setTimeout(function(){
						location.href=url_base+"cerrarsesion"
					},3000)
					
				}
			});	
		}		
	}
	// if(new_psw!="" && new_psw2=!""){
		
	// }	
}