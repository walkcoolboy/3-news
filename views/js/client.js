$(document).ready(function(e) {
	/*
	 * User logins
	 */

	if(document.cookie){
		console.log(document.cookie);
		hideLoginOpts();
		if($('body').is('.article-content')){
			//show article options for logged in user
			$('.add-tag').show();
		}
	}
	else{
		showLoginOpts();
	}

	function getLoginToken(){
		return document.cookie;
	}

	function hideLoginOpts(){
		$('#nav-no-login').hide();
		//display create/user account options
		$('.nav-logged-in').each(function(index){
			$(this).show();
		});
		//username stored in local storage
		var user = window.localStorage.getItem('username');
		$('#username').text(user).css("color", "white");
	}
	function showLoginOpts(){
		$('#nav-no-login').show();
		//display create/user account options
		$('.nav-logged-in').hide();
	}

 $('#sign-in').click( function(event){
	 event.preventDefault();
	 var username = $('#user').val();
	 var password = $('#password').val();
	 if(username.length == 0 || password.length == 0){
		 alert("Username and password required");
		 return;
	 }
	 //GET login token
	 $.ajax({
	    url: "/auth/login",
	    data: {
	        "username": username,
					"password": password
	    },
	    cache: false,
	    type: "POST",
	    success: function(response) {

				if(!response.success){
					console.log(response);
					return;
				}
				window.localStorage.setItem('username', username);
				hideLoginOpts();

	    },
	    error: function(xhr) {
				//create error message
	    }
	});
	 });

  $('#sign-out').click( function(event){
	 event.preventDefault();

	 //GET login token
	 $.ajax({
	    url: "/auth/logout",
	    type: "POST",
	    xhrFields: { withCredentials: true },
	    success: function(data, textStatus, xhr) {
				if(!data.success)return;
				showLoginOpts();
	    },
	    error: function(xhr) {
				//create error message
	    }
	});
	 });
	
	$('.register').click(function(){
		event.preventDefault();
		var username = $('#user').val();
		var password = $('#password').val();
		if(username.length == 0 || password.length == 0){
		 alert("Username and password required");
		 return;
	 	}
		//GET login token
		$.ajax({
			 url: "users/createUser",
			 data: {
					 "username": username,
					 "password": password
			 },
			 cache: false,
			 type: "POST",
			 success: function(response) {
				 //check token received
				 if(!response.success){
					 console.log(response);
					 return;
				 }
				 //Save token in cookie, it expires in 1 day
				 window.localStorage.setItem('username', username);
				 hideLoginOpts();
			 },
			 error: function(xhr) {
				 //create error message
			 }
	 });

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
  *Article interactions
	*/

	$('.add-tag').click(function(){
		$(".tag-input").fadeIn(1000);
		$(".submit-tag").fadeIn(1000);
		$('.tag-list-footer').find('.tag-link').each(function(index, element){
			console.log($(this).text().trim());
			$(".tag-input").append($(this).text().trim()+ " ");
		});
	});

	$(".submit-tag").click(function(){
		var input = $(".tag-input").val();
		$(".tag-input").hide();
		$(".submit-tag").hide();
		if(input=="")return;
		addTagProcess(input);
	});

	function addTagProcess(input){
		console.log(input);
		var tagsArr = JSON.stringify(input.split(" "));
		var restURL = window.location.pathname; //article/:id
		requestAddTags(tagsArr, restURL);
	}

	function requestAddTags(tagsArray, restURL){
			$.ajax({
	    url: restURL, //article/:article_id
	    data: {
	        "tags": tagsArray
	    },
	    cache: false,
	    type: "PUT",
	    success: function(response){
	    	if(response.success){
	    		var tagsArray = response.tags;
	    		$('.tag-list-footer').children('p').replaceWith("<p></p>"); //removes existing tags
	    		for(var i= 0; i< tagsArray.length; i++){
	    			$('.tag-list-footer').children('p').append(
	    				"<span><a href= class=\"tag-link\" \"/search/"+tagsArray[i]+"\">"+tagsArray[i] +"</a></span>"
	    				);
	    		}
	    	}

	    },
	    error: function(xhr) {
				//create error message
	    }
		});
	}

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


