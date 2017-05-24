/*
Corretor ortográfico usando o algoritimo de distância de Lehvnstein.

Allan Araujo RM73730
Gustavo H. Zava 74478
Guilherme Carmona 75030
Victor Barros Bologna 74171
Romulo Soares de Sousa 75447
Gabriel Freitas 74081
Rodrigo Martinez Rodrigues 74835

*/

function calcularDistancia(a, b){
  if(a.length == 0){
	return b.length; 
  } 
  if(b.length == 0){
	return a.length; 
  } 

  var matrix = [];

  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, 
                                Math.min(matrix[i][j-1] + 1, 
                                         matrix[i-1][j] + 1));
      }
    }
  }

  return matrix[b.length][a.length];
};
var wordArray;
var probabilidades = [];

function loadList(){
	$.get('wordlist.txt', function(data){
		var array = wordList2Array(data);
	});
}

function wordList2Array(txt){
	wordArray = txt.split('\n');
}

function findMatches(word){
	wordArray.forEach(function(wordInList){
		var distancia = calcularDistancia(word, wordInList);
		if(distancia < 2){			
			probabilidades.push({ d : distancia, palavra : wordInList });	
		}

	});
	console.log(probabilidades);
}

function sortProbabilites(){
	probabilidades.sort(function(a,b) {return (a.d > b.d) ? 1 : ((b.d > a.d) ? -1 : 0);} ); 
}

function showProbabilidades(){
	var html = "";
	$.each(probabilidades, function(key, obj){
		html += obj.palavra + "<br />";
	});
	$("#resultados").html(html);
}


function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function main(){
	loadList();
	$('#input-palavra').keyup(debounce(function(){
		probabilidades = [];
		console.log("oe");
		findMatches($('#input-palavra').val().toLowerCase());
		console.log("here we are");		
		sortProbabilites();
		console.log(probabilidades);
		showProbabilidades();
	}, 200));
}
$(main());

