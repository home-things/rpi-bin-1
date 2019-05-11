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

const lang = process.argv[2] || 'en'
const parse = html => new (require('jsdom').JSDOM)(html);
const html = read('./genres.html') || execSync(`ssh root@invntrm.ru "curl 'http://pleer.net/${ lang }/tags?rand=1500151747312' -H 'Accept: application/json' -H 'X-Requested-With: XMLHttpRequest' 2>/dev/null | jq -r .html"`);
write('./genres.html', html)
const {window:{document}} = parse(html)
const genres = Array.from(document.querySelectorAll('.genre')).map(el => ({
	id: el.getAttribute('data-genre-id'),
	title: el.querySelector('.genre-txt').childNodes[0].data.trim(),
	descr: el.querySelector('.data-genre-descrb').innerHTML
}))
console.log(JSON.stringify(genres, null, 4))
