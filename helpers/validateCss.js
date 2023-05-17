// validate css code with regex
function validateCssCode(cssCode) {
  let result = false
  let regex = /(@media[^{]*\{((?:[^{}]*\{[^{}]*\}[^{}]*|\s)+)\})|([^{]*\{([^{}]*\{[^{}]*\}[^{}]*)*[^{}]*\})/g
  let match = regex.test(cssCode)
  if (match) {
    result = true
  }
  return result
}

function compressCSS(css) {
  let compressed = css.replace(/\s+/g, ' '); // reemplazar espacios en blanco con un espacio simple
  compressed = compressed.replace(/{ /g, '{'); // eliminar espacio después de llave de apertura
  compressed = compressed.replace(/; /g, ';'); // eliminar espacio después de punto y coma
  compressed = compressed.replace(/ }/g, '}'); // eliminar espacio antes de llave de cierre
  return compressed;
}


function matchedCss (cssCode) {
  const regex = /([a-z0-9\s\S]+)\{([a-z0-9\s\S]*:[a-z0-9\s\S]*;)+\}/gi;
  const matches = cssCode.match(regex);

  if (matches) {
    matches.forEach(match => {
      const openingBraces = (match.match(/{/g) || []).length;
      const closingBraces = (match.match(/}/g) || []).length;

      if (openingBraces !== closingBraces) {
        console.log('La regla CSS no es válida. Las llaves no coinciden.');
        return false;
      }

      return true;
    });
  } else {
    return false;
  }
}

module.exports = {
  validateCssCode,
  compressCSS,
  matchedCss
}