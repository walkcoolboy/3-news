$(document).ready(function(e) {

	/*
	 * User logins
	 */

	//apply login specific features
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
		//set link to current users profile
		$('.profile').attr('href','/users/'+user);
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
		 alertFail("<strong>Username and password required</strong>");;
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
					alertFail("<strong>Login failed!</strong> " + response);
				}
				else{
					alertSuccess("<strong>Login Success!</strong>");
					window.localStorage.setItem('username', username);
					hideLoginOpts();
				}

	    },
	    error: function(xhr) {
				//create error message
	    }
		});
	});

	$('#google-sign-in').click( function(event){
		event.preventDefault();
		console.log("google-sign-in");
		window.location = "/auth/google";
	});

  $('#sign-out').click( function(event){
	 event.preventDefault();

	 //GET login token
	 $.ajax({
	    url: "/auth/logout",
	    type: "POST",
	    xhrFields: { withCredentials: true },
	    success: function(data, textStatus, xhr) {
				console.log('sign-out data:'+data);
				if (!data.success) return;
				showLoginOpts();
				location.reload();
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
		 alertFail("<strong>Username and password required</strong>");
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
					 alertFail("<strong>Registration failed!</strong> " + response);
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
		$(".tag-input").text('');
		$('.tag-list-footer').find('.tag-link').each(function(index, element){
			$(".tag-input").append($(this).text().trim()+ " ");
		});
		window.scrollBy(0,200);
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
	    				"<span><a class=\"tag-link\" href=\"/search/"+tagsArray[i]+"\">"+tagsArray[i] +"</a></span>"
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
	*User
	*/

	//apply user specific href on click nav to profile
	$('.profile').click(function(event){
		event.preventDefault();
		 window.location = $(this).attr('href');
	});

	//update username/password
	$('.update-profile').click(function(event){
		event.preventDefault();
		var username = $('#update-username').val();
		var password = $('#new-pass').val();
		if(username.length < 3 || password.length < 3){
			alertFail("<strong>Update failed! </strong> login or password too short.");
			return;
		}
		console.log("Updating account");
		$.ajax({
	    url: window.location.pathname, //users/username
	    data: {
	        "username": username,
	        "password": password
	    },
	    cache: false,
	    type: "PUT",
	    success: function(response){
	    	console.log("Account updated");
	    	if(response.success){
	    		console.log("updated successfully");
	    		alertSuccess("<strong>Account updated successfully!</strong>");
	    		window.localStorage.setItem('username', username);
	    	}
	    	else{
	    		alertFail("<strong>Update failed! </strong>" + response);
	    	}

	    },
	    error: function(xhr) {
				//create error message
	    }
		});
	});

	//stop links working
	$('.disabled').click(false);
	$('form').submit(function(event){
		event.preventDefault();
	});
	
	function alertFail(message){
					$('.alert-danger').empty();
					$('.alert-danger').append(message);
					$('.alert-danger').show().delay(3000).fadeOut(100);
	}	

	function alertSuccess(message){
					$('.alert-success').empty();
					$('.alert-success').append(message);
					$('.alert-success').show().delay(2000).fadeOut(100);
	}

});//End doc.ready
