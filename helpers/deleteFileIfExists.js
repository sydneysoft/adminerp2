
const fs = require('fs');


const deleteFileIfExists = filePath => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
}

module.exports = { deleteFileIfExists }