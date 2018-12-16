// ----------------------------------------------------
// NOTE: DO NOT REMOVE OR ALTER ANY LINE IN THIS SCRIPT
// ----------------------------------------------------

// Fill in the script as shown below:
print ("Query 00")				// the number of the question
// List all the documets		// the text of the question En
// Lister tous les documets		// the text of the question Fr
db.movieDetails.find()			// your answer on one 
								// or more lines
 				
// Ecrivez les requetes MongoDB qui retournent les informations ci-dessous,
// avec le schema de sortie demande :
// Write the MongoDB queries that return the information below,
// with the specified output schema:

print("Query 01")
// le "title" et le "runtime" des films dont le "runtime" est dans [100, 175[
// the "title" and the "runtime" of the movies with a "runtime" in [100, 175[
// output schema: {_id: ..., runtime: ...}

print("Query 02")
// l'ID et le "genres" des films dont le "genres" est Western uniquement
// the ID and the "genres" of the movies whose "genres" is Western only
// output schema: {_id: ..., genres: ...}

print("Query 03")
// l'ID et le "genres" des films dont le "genres" contient Western
// the ID and the "genres" of the movies whose "genres" contains Western
// output schema: {_id: ..., genres: ...}

print("Query 04")
// l'ID etle "genres" des films dont le "genres" contient Western ou Comedy
// the ID and the "genres" of the movies whose "genres" contains Western or Comedy
// output schema: {_id: ..., genres: ...}

print("Query 05")
// l'ID et le "genres" des films dont le "genres" contient Western et Comedy (dans un ordre quelconque)
// the ID and the "genres" of the movies whose "genres" contains Western and Comedy (in any order)
// output schema: {_id: ..., genres: ...}

print("Query 06")
// l'ID et le "genres" des films dont le "genres" contient Action en 1er element, suivi de 2 autres éléments quelconques
// the ID and the "genres" of the movies whose "genres" contains Action as the first element, followed by two random elements
// output schema: {_id: ..., genres: ...}

print("Query 07")
// le plus grand "runtime" de tous les films
// the greatest "runtime" of all movies
// output schema: {maxRuntime: ...}

print("Query 08")
// le plus grand "runtime" des films avec "genres" contenant Western
// the greatest "runtime" of the movies whose "genres" contains Western
// output schema: {maxRuntime: ...}

print("Query 09")
// le "title" d'un des films ayant le plus grand "runtime"
// the "title" of one of the movies with the greatest "runtime"
// output schema: {title: ...}

print("Query 10")
// le "title" de tous les films ayant le plus grand "runtime"
// the "title" of all the movies with the greatest "runtime"
// output schema: {title: ...}

print("Query 11")
// pour chaque catégorie "rated" (null exclue), cette catégorie et le nombre de films correspondant à cette catégorie
// for each "rated" category (null excluded), that category and the number of movies in that category
// output schema: {rated: ..., movieCount: ...}

print("Query 12")
// le plus grand nombre de films dans une catégorie "rated" (null exclue)
// the greatest number of movies in some "rated" category (null excluded)
// output schema: {maxMovieCount: ...}

print("Query 13")
// l'une des catégories "rated" (null exclue) ayant le plus grand nombre de films
// one of the "rated" category (null excluded) with the greatest number of movies
// output schema: {rated: ...}

print("Query 14")
// la somme des "runtime" des films de la catégorie "rated" PG-13
// the "runtime" sum of the movies in the PG-13 category
// output schema: {totalRuntime: ...}

print("Query 15")
// le "title" et les "actors" des films dans lesquels joue un(e) (au moins) acteur(rice) ayant comme initiales C C
// the "title" and the "actors" of the movies in which some (at least one) actor/actress with initials "C C" plays
// output schema: {title: ..., actors: ...}

print("Query 16")
// le "title" et les "actors" des films dans lesquels l'acteur(rice) principal(e) (i.e. 1er(e) listé(e)) a comme initiales C C
// the "title" and the "actors" of the movies in which the lead actor/actress (i.e. the first in the least) has initials "C C"
// output schema: {title: ..., actors: ...}

print("Query 17")
// le "title", le "imdb" et le "tomato" des films ayant un "rating" "imdb" ou "tomato" dans l'intervalle [4, 6]
// the "title", the "imdb" and the "tomato" of the movies whose "imdb" or "tomato" "rating" is in the range [4, 6]
// output schema: {title: ..., imdb: ..., tomato: ...} (if one the field is missing, do not display it)

print("Query 18")
// pour chaque "actors" listé dans la base, son nom et le nombre de films dans lesquels il/elle joue
// for each "actors" in the datase, his/her name and the number of movies he/she plays in
// output schema: {actor: ..., movieCount: ...}

print("Query 19")
// le nombre de films ayant un champ "year" renseigne a une valeur non null
// the number of movies with a "year" set to a non-null value
// output: an integer

print("Query 20")
// le nombre de films pour lesquels "Sergio Leone" n'est pas un des "writers"
// the number of movies for which "Sergio Leone" is not one of the "writers"
// output: an integer








