const { getDataSistema, listarTableDinamic } = require("./db");


//New defined sendDataView
const sendDataViewNew = async (tableName, res, view, req) => {
    let token = req.session.token;
    let dataSession = req.session;
    let dataSistema = await getDataSistema(req.session.token);

 
        let bookStore = await listarTableDinamic(tableName);
        let tiendas = await listarTableDinamic("tiendas");
        if (bookStore.status === "error") {
            res.json(bookStore);
        } else {
            res.render(view, {
                bookStore,
                tiendas,
                dataSession, dataSistema
            });
        }
   
}

//New defined sendDataView
const sendDataTwoViewNew=async(tableName,tableName2,res,view,req)=>{
    let token = req.session.token;
    let dataSistema = await getDataSistema(req.session.token);

    if (role == 1 || role == 2 || role == 3) {
        let bookStore= await listarTableDinamic(tableName);
        let bookStore2= await listarTableDinamic(tableName2);

        if(bookStore.status==="error" || bookStore2.status==="error"){
            res.json(bookStore);
        }else{
            res.render(view, {
                bookStore,
                bookStore2,
                dataSistema
            });
        }
    } else {
        res.status(403);
        res.render('403');
    }
}


//Old DataView
const sendDataView=(urlAPI,res,msgerror,view,req)=>{
    let token = req.session.token;

    let bookStore = [];
    let datosJSON;
    if (role == 1 || role == 2 || role == 3) {
        https.get(urlAPI, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                datosJSON = JSON.parse(data);
                    res.json(datosJSON);
            });
        }).on("error", (err) => {
      
            error = 1;
    
            let json_response = {
                "error": error,
                "message": msgerror
            };
            res.json(json_response);
        });
    } else {
        res.status(403);
        res.render('403');
    }

}



const sendOnlyView=async(view,res,req)=>{
    let token = req.session.token;
    let dataSistema = await getDataSistema(req.session.token);

    if (role == 1 || role == 2 || role == 3) {
        res.render(view,{ dataSistema});
    } else {
        res.status(403);
        res.render('403');
    }
}


module.exports = {
    sendDataViewNew,
    sendDataTwoViewNew,
    sendDataView,
    sendOnlyView
}