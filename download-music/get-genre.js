#!/usr/bin/env node
/*
once: generate genres map
GET http://pleer.net/en/tags?rand=1500151747312
-> JSON
.html
-> HTML
.genre[data-genre-id] > .genre-txt, .data-genre-descrb
*-> answer to genre with music links
  GET http://pleer.net/tags/find/?q=$GENRE_ID
  -> JSON
  .html
  -> HTML
  ID = ol/li*[link]
  *-> Int
    POST http://pleer.net/site_api/files/get_url 'action=download' 'id=$ID'
    ->
    .track_link
    *->
        innerText
*/

const child_process = require('child_process')
    const spawn = child_process.spawn.bind(child_process)
    const execSync = (cmd) => child_process.execSync(cmd, {encoding: 'utf8'});
const write = (file, content) => require('fs').writeFileSync(file, content);
const read = name => { try{ return require('fs').readFileSync(name, 'utf8'); }catch(e){return null} };
const Levenshtein = require('levenshtein')
	const getRelDist = (s1, s2) => new Levenshtein(s1, s2).distance / Math.max(s1.length, s2.length);
	const almostSame = (s1, s2) => getRelDist(s1, s2) <= .4 || s1.includes(s2) || s2.includes(s1);

const genreTitle = process.argv[2];
const matchedGenreIds = require('./genres')
.filter(genre => almostSame(genre.title, genreTitle))
.map(genre => Object.assign({similarity: 1/getRelDist(genre.title, genreTitle)}, genre))
.sort((a, b) => b.similarity - a.similarity)

console.log(matchedGenreIds)

