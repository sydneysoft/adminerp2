const { v4: uuidv4 } = require('uuid');
const path = require('path');
// const cloudinary = require ('./cloudinary');


const handleUploads = (req, res, next) => {
    if (req.files && Object.keys(req.files).length !== 0) {
        let error = null
        Object.keys(req.files).forEach(key => {
            req.files[key].name = uuidv4() + req.files[key].name;
            req.files[key].mv(path.join(__dirname, '../public/uploads/', req.files[key].name), function (err) {
                if (err) {
                    error = err;
                }
            })
        })

        if (error) {
         
            throw new Error('Error al subir los archivos');
        }
    }

    next();
}

module.exports = {
    handleUploads
}