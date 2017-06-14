$(document).ready(function(e) {
	/*
	 * User logins
	 */
	 $('.sign-in').on('click', function(event){
		 //GET
		 $.get(, '', function(data){

		 });

 	 });

	$('.resgister').on('click', function(event){

  });


	/*
	 * search-box - process request
	 */
   $('.search-box').keypress('keypress', function(event){
     $('.search-box').submit();
     var search_term;
     if ( event.keyCode == 13 ) {  // enter key
       search_term = $('.search-box').val();
       window.location = "/search/"+search_term; //view engine sanitisation
     }
	});

	/*
	 *Create article functions
	 */
	//set option selected for categories
	$("#category-selected input[name=options]").click(
		function(){
		$('#category-selected').children('label').removeClass('active');
		$(this).attr('checked', 'checked');
		$(this).parent().addClass("active");
		}
	);

	//get form data and call post request
	$("input[name='commit']").click(
		function(){
			var title = $('#article_title').val();
			var body = $('textarea#article_body').val();
			if(title.trim()=="" || body.trim()=="") return; //TODO: give warning
			var tags = $('#article_tags').val().split(" ");
			var category = $('input[name=options]:checked', '#category-selected').val();

			var jsonData = {
				title: title,
				body: body,
				tags: tags,
				category: category
			}
			console.log(jsonData); //TODO: send to post request + add user field
		}
	);
});
