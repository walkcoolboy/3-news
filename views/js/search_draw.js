$(document).ready(function(e) {
	/*
	 * Listen for search input onto tag drawer.
	 */
   $('.search-box').keypress('keypress', function(event){
     $('.search-box').submit();
     var search_term;
     if ( event.keyCode == 13 ) {  // enter key
       search_term = $('.search-box').val();
       window.location = "/search/"+search_term;
     }
	});
});
