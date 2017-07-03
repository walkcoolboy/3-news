$(document).ready(function(e) {

	/*
	 * User logins
	 */

	//apply login specific features
	if(document.cookie){
		console.log('cookie '+document.cookie);
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

	function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

	function hideLoginOpts(){
		$('#nav-no-login').hide();
		//display create/user account options
		$('.nav-logged-in').each(function(index){
			$(this).show();
		});
		//username stored in local storage
		var user = window.localStorage.getItem('username');
		if (!user) {
			//GET username
			var user = getCookie("username");
			console.log('username: '+user);
		}
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
				window.location="/";
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
		console.log(input.split(" "));

		var tagsArr = JSON.stringify(input.split(" "));
		console.log(tagsArr);
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
	    		var tagsArray = response.data.tags;
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
	//Timeout
	//https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
	//Will log the user out if the page is continously open and in focus for a duration

	const IDLE_TIME_BEFORE_LOGOUT = 3600000; //One hour

	// Set the name of the hidden property and the change event for visibility
	var hidden, visibilityChange;

	if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	}

	var logoutTimer; //Holds a ticking timer
	if(document.cookie)logoutTimer = setTimeout(logout, IDLE_TIME_BEFORE_LOGOUT);

	function handleVisibilityChange() {
		if (document[hidden]) {
			clearTimeout(logoutTimer);
			logoutTimer = null;
		} else {

			if(!document.cookie || logoutTimer)return;

			//Sets the timeout to 1 hour
			logoutTimer = setTimeout(logout, IDLE_TIME_BEFORE_LOGOUT);
		}
	}

	// Warn if the browser doesn't support addEventListener or the Page Visibility API
	if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
		console.log("Timeout function requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
	} else {
		// Handle page visibility change
		document.addEventListener(visibilityChange, handleVisibilityChange, false);
	}

	function logout(){
		//If user is not logged in
		if (!document.cookie)return;
		$.ajax({
	    url: "/auth/logout",
	    type: "POST",
	    xhrFields: { withCredentials: true },
	    success: function(data, textStatus, xhr) {
				if (!data.success) return;
				showLoginOpts();
				location.reload();
	    },
	    error: function(xhr) {
				//create error message
	    }
	});
	}
});//End doc.ready
