const PeliculaController = require('./filmes/pelicula.controller');
const DocumentalController = require('./filmes/documental.controller');
const SerieController = require('./filmes/serie.controller');

const ActorController = require('./persona/actor.controller');
const DirectorController = require('./persona/director.controller');
const ProductorController = require('./persona/productor.controller');

module.exports = {
  PeliculaController,
  DocumentalController,
  SerieController,
  ActorController,
  DirectorController,
  ProductorController
}