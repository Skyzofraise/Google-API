var i = 2;
function nvonglet(){
	i = i+1;
	// Copier
	var form2 = document.getElementById("formulaire").cloneNode(true);
	// nouvel id pour le nouveau formulaire copié
	form2.id="formulaire"+(i-1);
	// coller
	document.getElementById("formulaire").parentNode.appendChild(form2);

	// création d'un nouvel onglet qui sera copié dans son conteneur parent
	var onglet = document.getElementById("affiche-contenu-2").cloneNode(true);
	document.getElementById("affiche-contenu-2").parentNode.appendChild(onglet);

	// changement d'id, de class et de onclick du nouvel onglet en dynamique (var i) 
	document.getElementById("affiche-contenu-2").parentNode.lastChild.id = "affiche-contenu-"+i;
	document.getElementById("affiche-contenu-2").parentNode.lastChild.className = "inactif onglet";
	document.getElementById("affiche-contenu-2").parentNode.lastChild.onClick="test(this.id)";
	//on donne un nom dynamique aux markers
	document.getElementById("affiche-contenu-2").parentNode.lastChild.innerHTML = "Marker "+(i-1)+" <a onClick='suppOnglet(this)'>x</a>";

	// à présent il faut display none les formulairses inactifs

	var form = document.getElementsByClassName("formulaire");
	for (var j = 0; j < form.length; j++) {
			    form[j].style.display="none";
		}
	form2.style.display = 'inline-block';
}
	
function test(id){
		
		// Active la couleur de l'id sur lequel on clic, désactive tous les autres.
    var test = document.getElementById(id);
    var li = document.getElementsByTagName('li');
		for (var i = 0; i < li.length; i++) {
		    li[i].className="inactif onglet";
	}
    test.className = "onglet";
    /////////////////////////////////////////////////////////////////////////

}

//suppression des onglets
function suppOnglet(a){
	a.parentNode.parentNode.removeChild(a.parentNode);

}

//il faut faire en sorte que lorsque l'on supprime un onglet, son formulaire se supprime et l'onglet d'avant devienne actif 





// function Affiche(Nom) {

//     document.getElementById('affiche-contenu-' + Onglet_afficher).className = 'inactif onglet';
//     document.getElementById('affiche-contenu-' + Nom).className = 'affiche-contenu-1 onglet';
//     document.getElementById('contenu_' + Onglet_afficher).style.display = 'none';
//     document.getElementById('contenu_' + Nom).style.display = 'block';
//     Onglet_afficher = Nom;
// }

var geocoder;
var service;
var map;
var autocomplete;
var address;

function initializeAutocomplete() {
    var element = document.getElementById('address');
    if (element) {
        var autocomplete = new google.maps.places.Autocomplete(element, {
            types: ['geocode']
        });
        google.maps.event.addListener(autocomplete);
    }
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }
}

service = new google.maps.places.PlacesService(map);
service.textSearch(address, callback);

function initialize() {

    //RÉCUPÉRATION DES DONNÉES
    var address = document.getElementById("address").value;

    var titre = document.getElementById('titre').value;
    var texte = document.getElementById('texte').value;

    var zoom = document.getElementById('zoom').value;

    var infobulle = "<h1 style='font-size:14px'>" + titre + "</h1><p>" + texte + "</p>";

    var rayon = document.getElementById('rayonrayon').value;
    var fond = document.getElementById('fond').value;
    var bordure = document.getElementById('bordure').value;
    var strokeopac = document.getElementById('strokeopac').value;
    var fillopac = document.getElementById('fillopac').value;

    var imgurl = document.getElementById('image').value;
    var wimg = document.getElementById('wimg').value;
    var himg = document.getElementById('himg').value;
    var ancre1 = document.getElementById('ancimg1').value;
    var ancre2 = document.getElementById('ancimg2').value;


    geocoder = new google.maps.Geocoder();
    var latLng = new google.maps.LatLng(48.8534100, 2.3488000);

    var mapProp = {
        center: latLng,
        zoom: parseFloat(zoom),
        //pour retirer le panneau de zoom etc avec la valeur true
        disableDefaultUI: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    geocoder.geocode({
        'address': address
    }, function(results, status) {
        map.setCenter(results[0].geometry.location);

        //IMAGE DU MARKER

        var image = {
            // Adresse de l'icône personnalisée
            url: imgurl,
            // Taille de l'icône personnalisée
            size: new google.maps.Size(parseFloat(wimg), parseFloat(himg)),
            // Origine de l'image, souvent (0, 0)
            origin: new google.maps.Point(0, 0),
            // L'ancre de l'image. Correspond au point de l'image que l'on raccroche à la carte. Par exemple, si votre îcone est un drapeau, cela correspond à son mâts
            anchor: new google.maps.Point(parseFloat(ancre1), parseFloat(ancre2))
        };

        //MARKER

        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            title: 'Cliquer pour zoomer',
            icon: image,
            animation: google.maps.Animation.DROP
        });

        //RADIUS

        var zoneradius = new google.maps.Circle({
            map: map,
            center: marker.getPosition(),
            radius: parseFloat(rayon) * 1000,
            strokeColor: bordure,
            strokeOpacity: parseFloat(strokeopac),
            strokeWeight: 2,
            fillColor: fond,
            fillOpacity: parseFloat(fillopac)
        });

        // INFOBULLE
        var infowindow = new google.maps.InfoWindow({
            content: infobulle,
            maxWidth: 200,
        });

        //si le titre est vide
        if (titre == '') {
        //alors rien
        } else {
        //s'il n'est pas vide, on affiche l'infobulle
            infowindow.open(map, marker);
        }

        //ZOOM
        google.maps.event.addListener(marker, 'click', function() {
            map.setZoom(13);
            map.setCenter(marker.getPosition());
        })

    });

    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

}
google.maps.event.addDomListener(window, 'load', initialize);