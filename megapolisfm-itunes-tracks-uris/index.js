/*
open http://podbay.fm/show/1070520307 # megapolisfm
urls = Array.from(document.querySelectorAll('.span8 table .btn')).map(e=>e.href)
for url in urls.slice(0, 6)
  open url
  mp3 = document.querySelector('.pull-right .btn').href
  yield mp3
*/

const thrw = require('throw');
const fetch = require('isomorphic-fetch');
  const open = (uri) => fetch(uri).then(r => r.status >= 400 ? thrw (r.status) : r.text());
const parse = html => new (require('jsdom').JSDOM)(html);

const podMap = {
	'megapolis': 1070520307,
	'montecarlo': 595523537, 
};

let podId;
if (isNaN(+process.argv[2]) && typeof process.argv[2] === 'string') {
	podId = podMap[process.argv[2]]
} else {
	podId = +process.argv[2] || 1070520307;
}
const podcastUri = `http://podbay.fm/show/${ podId }`;

const mapIndex = (document) => {
  const tracksUris = (Array.from(document.querySelectorAll('.span8 table .btn')).map(e=>e.href)||[]).slice(0, 6);
  tracksUris.map(uri => open(uri)
    .then(html => parse(html))
    .then(({window:{document}}) => mapTrackPage(document))
  );
};
const mapTrackPage = (document) => {
  setTimeout(() => console.log(document.querySelector('.pull-right .btn').href), 600);
};

const main = () =>
  open(podcastUri)
  .then(html => parse(html))
  .then(({window:{document}}) => mapIndex(document));

main();
