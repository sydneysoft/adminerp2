const path = require('path');
const { exec } = require('child_process');

// subdominio repository port token secret
const createSubDomain = (subdominio = '', port = 3000, repository = "", token = 0, secret = 'secretInka' ) => {

    // const a = newSubdomain.split(' ').join('_');

    exec(`bash "${path.resolve(__dirname, '../bash-scripts/copy-repository.sh')}" "${subdominio}" "${repository}" "${port}" "${token}" "${secret}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            // return;
        }

        console.log(`stdout:\n${stdout}`);
        // sino se crea el repositorio no se crea el subdominio
        exec(`bash "${path.resolve(__dirname, '../bash-scripts/create-new-domain.sh')}" "${subdominio}" "${port}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
                return;
            }
    
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
    
            console.log(`stdout:\n${stdout}`);
            console.log("Se creo el subdominio");
        });

    });

}


module.exports = {
    createSubDomain
}
