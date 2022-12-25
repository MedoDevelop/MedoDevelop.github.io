function skilcol(){
	var colors = ['#4AA3A2','#F27438','#212E53','#5784BA','#384454','#212E53','#117170'];

	var random_color;

	var els =document.getElementsByClassName('skill');
	var el;
	for(var i in els){
		el = els[i];
		random_color = colors[Math.floor(Math.random() * colors.length)];
		if(i<els.length){
			el.style.background = random_color;	
		}
	}
}

function copie(value){
	navigator.clipboard.writeText(value);
	alert('la valeur suivante a été copié dans le presse papier : '+value);
}
