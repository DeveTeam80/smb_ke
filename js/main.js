$(document).ready(function(){

	$('body').on('click', '#myModal button.btn-close', function () {
		$("#myModal").hide();	 
	});

		var current_page = $(location).attr('href');
		//console.log(current_page);
		var resource_type = '';
		var currentPDF = '';
		$('.downloadPDF').click(function(){
			resource_type = $(this).attr('link');
			currentPDF = $(this).attr('pdf');
		});
		jQuery.validator.addMethod("lettersonly", function(value, element) {
			return this.optional(element) || /^[a-z\s]+$/i.test(value);
		}, "Only alphabetical characters allowed");

		$.validator.addMethod('customphone', function (value, element) {
			return this.optional(element) || /^(\+91-|\+91|0)?\d{10}$/.test(value);
		}, "Please enter a valid phone number");

		$.validator.addMethod('customphone2', function (value, element) {
			return this.optional(element) || /^[6789]\d{9}$/.test(value);
		}, "Please enter a valid phone number");
		
		jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
			return arg != value;
		}, "Please select a value");
		
		jQuery.validator.addMethod("valueNotEquals2", function(value, element, arg){
			return arg != value;
		}, "Select code");
		
		function validateNumber(evt) {
			var e = evt || window.event;
			var key = e.keyCode || e.which;
			if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
			// numbers   
			key >= 48 && key <= 57 ||
			// Numeric keypad
			key >= 96 && key <= 105 ||
			// + symbol
			key == 107 || key == 43 ||
			// Backspace and Tab and Enter
			key == 8 || key == 9 || key == 13 ||
			// Home and End
			key == 35 || key == 36 ||
			// left and right arrows
			key == 37 || key == 39 ||
			// Del and Ins
			key == 46 || key == 45) {
				// input is VALID
			} else {
				// input is INVALID
				e.returnValue = false;
				if (e.preventDefault) e.preventDefault();
			}
		}

		$( "#referralPhoneNumber, #phoneNumber, #enquire_phoneNumber, #project_phoneNumber" ).on("keydown", function(e) {
			validateNumber(e);
		});
		
		/* Enquire now form validation start */
		$('#enquireNow').validate({
			rules:{
				enquire_name:{ required: true, lettersonly: true, minlength:3 },
				enquire_email:{ required: true, email: true },
				enquire_phoneNumber:{ required: true, customphone: true, customphone2: true, minlength:10, maxlength:10 },
				code: { required: true, valueNotEquals2: "0" },
				enquire_message:{ required: true },
				enquiry_terms_conditions:{ required: true }
			},
			messages:{ 
				enquire_name:{ required:'Please enter name'},
				enquire_email:{ email: 'Enter correct e-mail id', required:'Please enter email' },
				enquire_phoneNumber:{ customphone:'Please enter a valid phone number', required:'Please enter phone number' },
				code:{ required:'Please select code'},
				enquire_message:{ required:'Please enter message' },
				enquiry_terms_conditions:{ required:'Please select option' },
			}, 	
			submitHandler: function () {
				$('#enquireNow .SubmitBt').prop('disabled', true);
				$('#enquireNow .form-process').text('Processing the details. Please wait...');
				var name=encodeURIComponent($('[name="enquire_name"]').val());
				var email=encodeURIComponent($('[name="enquire_email"]').val());
				var phoneNumber=encodeURIComponent($('[name="enquire_phoneNumber"]').val());
				var code=encodeURIComponent($('[name="code"]').val());
				var message=encodeURIComponent($('[name="enquire_message"]').val());
				let r = Math.random().toString(36).substring(7);
				var project=encodeURIComponent($('[name="Project"]').val());
				var IPAdresss=encodeURIComponent($('[name="IPAdresss"]').val());
				$.cookie("csrf_token", r);
				metrolead_script();
				$.ajax({
					type:'POST',
					url:'process-enquireNow.php',
					data:'name='+name+'&email='+email+'&phoneNumber='+phoneNumber+'&code='+code+'&message='+message+'&current_page='+current_page+'&csrf='+r+'&project='+project+'&IPAdresss='+IPAdresss,
					success:function(data){
						console.log(data);
						$('#enquireNow .SubmitBt').prop('disabled', false);
						if($.trim(data)=='Success'){							  
							
							// Enquire Now form 
							var form = document.getElementById('enquireNow'); 
							var formData = form2js(document.getElementById('enquireNow'), 'enquireNow', '::'); 
							mg.trackUncommonForm('enquireNow', 'Enquire Now', formData, function() { 
								// Your custom submission code goes here   
								//onAjaxFormSubmitHandler(); 
								// call the form submit handler function as a callback to mg.trackUncommonForm   
								console.log('Metroleads called');   
								form.submit();     
							});
							
							//$('#enquireNow .form-process').text('Thank you for reaching out to us, we will get back to you soon.');
							$('input[type="text"]').val('');
							$('textarea').val('');
							setTimeout(function() { 
								$('#enquireNow .form-process').text('');
								window.location.href = 'enquire-now-thank-you.php';
							}, 3000);
						}else{
						}
					}
				})
			}
		}); 
		/* Enquire now form validation end */
		
		/* SSV form validation start */
		$('#ssvenquireNow').validate({
			rules:{
				ssv_enquire_name:{ required: true, lettersonly: true, minlength:3 },
				ssv_enquire_email:{ required: true, email: true },
				ssv_enquire_phoneNumber:{ required: true, customphone: true, customphone2: true, minlength:10, maxlength:10 },
				ssv_code: { required: true, valueNotEquals2: "0" },
				ssv_enquire_message:{ required: true },
				ssv_enquiry_terms_conditions:{ required: true }
			},
			messages:{ 
				ssv_enquire_name:{ required:'Please enter name'},
				ssv_enquire_email:{ email: 'Enter correct e-mail id', required:'Please enter email' },
				ssv_enquire_phoneNumber:{ customphone:'Please enter a valid phone number', required:'Please enter phone number' },
				ssv_code:{ required:'Please select code'},
				ssv_enquire_message:{ required:'Please enter message' },
				ssv_enquiry_terms_conditions:{ required:'Please select option' },
			}, 	
			submitHandler: function () {
				$('#ssvenquireNow .SubmitBt').prop('disabled', true);
				$('#ssvenquireNow .form-process').text('Processing the details. Please wait...');
				var name=encodeURIComponent($('[name="ssv_enquire_name"]').val());
				var email=encodeURIComponent($('[name="ssv_enquire_email"]').val());
				var phoneNumber=encodeURIComponent($('[name="ssv_enquire_phoneNumber"]').val());
				var code=encodeURIComponent($('[name="ssv_code"]').val());
				var message=encodeURIComponent($('[name="ssv_enquire_message"]').val());
				let r = Math.random().toString(36).substring(7);
				var project=encodeURIComponent($('[name="Project"]').val());
				var IPAdresss=encodeURIComponent($('[name="IPAdresss"]').val());
				$.cookie("csrf_token", r);
				metrolead_script();
				$.ajax({
					type:'POST',
					url:'process-scheduleSiteVisit.php',
					data:'name='+name+'&email='+email+'&phoneNumber='+phoneNumber+'&code='+code+'&message='+message+'&current_page='+current_page+'&csrf='+r+'&project='+project+'&IPAdresss='+IPAdresss,
					success:function(data){
						console.log(data);
						$('#ssvenquireNow .SubmitBt').prop('disabled', false);
						if($.trim(data)=='Success'){
							
							// SSV form 
							var form = document.getElementById('ssvenquireNow'); 
							var formData = form2js(document.getElementById('ssvenquireNow'), 'ssvenquireNow', '::'); 
							mg.trackUncommonForm('ssvenquireNow', 'Schedule Site Visit Enquiries', formData, function() {   
								console.log('Metroleads called');   
								form.submit();     
							});
							
							//$('#ssvenquireNow .form-process').text('Thank you for reaching out to us, we will get back to you soon.');
							$('input[type="text"]').val('');
							$('textarea').val('');
							setTimeout(function() { 
								$('#ssvenquireNow .form-process').text('');
								window.location.href = 'schedule-site-visit-thank-you.php';
							}, 3000);
						}else{
						}
					}
				})
			}
		});
		/* SSV form validation end */
		
		
		/* Project form validation start */
		$('#projectEnquiry').validate({
			rules:{
				project_name:{ required: true, lettersonly: true, minlength:3 },
				project_email:{ required: true, email: true },
				project_phoneNumber:{ required: true, customphone: true, customphone2: true, minlength:10, maxlength:10 },
				project_code: { required: true, valueNotEquals2: "0" },
				project_message:{ required: true },
				project_terms_conditions:{ required: true }
			},
			messages:{ 
				project_name:{ required:'Please enter name'},
				project_email:{ email: 'Enter correct e-mail id', required:'Please enter email' },
				project_phoneNumber:{ customphone:'Please enter a valid phone number', required:'Please enter phone number' },
				project_code:{ required:'Please select code'},
				project_message:{ required:'Please enter message' },
				project_terms_conditions:{ required:'Please select option' },
			}, 	
			submitHandler: function () {
				$('#projectEnquiry .SubmitBt').prop('disabled', true);
				$('#projectEnquiry .form-process').text('Processing the details. Please wait...');
				var name=encodeURIComponent($('[name="project_name"]').val());
				var email=encodeURIComponent($('[name="project_email"]').val());
				var phoneNumber=encodeURIComponent($('[name="project_phoneNumber"]').val());
				var code=encodeURIComponent($('[name="project_code"]').val());
				var message=encodeURIComponent($('[name="project_message"]').val());
				var project=encodeURIComponent($('[name="Project"]').val());
				var IPAdresss=encodeURIComponent($('[name="IPAdresss"]').val());
				let r = Math.random().toString(36).substring(7);
				$.cookie("csrf_token", r);
				metrolead_script();
				$.ajax({
					type:'POST',
					url:'process-projectEnquiry.php',
					data:'name='+name+'&email='+email+'&phoneNumber='+phoneNumber+'&code='+code+'&message='+message+'&current_page='+current_page+'&resource_type='+resource_type+'&csrf='+r+'&project='+project+'&IPAdresss='+IPAdresss,
					success:function(data){
						console.log(data);
						$('#projectEnquiry .SubmitBt').prop('disabled', false);
						if($.trim(data)=='Success'){
							
							// Project form 
							var form = document.getElementById('projectEnquiry'); 
							var formData = form2js(document.getElementById('projectEnquiry'), 'projectEnquiry', '::'); 
							mg.trackUncommonForm('projectEnquiry', resource_type+' Enquiries', formData, function() {   
								console.log('Metroleads called');   
								form.submit();     
							});
							
							//$('#projectEnquiry .form-process').text('Thank you for reaching out to us, we will get back to you soon.');
							$('input[type="text"]').val('');
							$('textarea').val('');
							window.open('https://vstudiobizz.com/smb_ke/pdfs/'+currentPDF);
							setTimeout(function() { 
								$('#enquireNow .form-process').text('');
								window.location.href = 'projects-thank-you.php';
							}, 3000);
						}else{
						}
						/* $('input[type="text"]').val('');
						$('textarea').val('');
						setTimeout(function() { 
							$('#projectEnquiry .form-process').text('');
						}, 1000); */
					}
				})
			}
		});
		/* Project form validation end */
	
	
	
//  $("#header").load("menu.php");
$("#footer").load("footer.php");


$( ".megamenu" ).load( "header.php", function() {
});




/*    $('body').append('<div id="toTop" class="btn btn-info">Top</div>');
$(window).scroll(function () {
if ($(this).scrollTop() != 0) {
$('#toTop').fadeIn();
} else {
$('#toTop').fadeOut();
}
});
$('#toTop').click(function(){
$("html, body").animate({ scrollTop: 0 }, 600);
return false;
}); */


$(window).scroll(function() {
if ($(window).scrollTop() >= 50) {
$('#header').addClass('fixed');
} else {
$('#header').removeClass('fixed');
}

});

$(function(){
    var lastScrollTop = 0, delta = 15;
    $(window).scroll(function(event){
       var st = $(this).scrollTop();

       if(Math.abs(lastScrollTop - st) <= delta)
          return;
if ((st > lastScrollTop) && (lastScrollTop>0)) {
       // downscroll code
      $("#header").css("top","-200px");

   } else {
      // upscroll code
      $("#header").css("top","0px");
   }
       lastScrollTop = st;
    });
});


$('.navbar-toggler').click(function(){
   $('body').toggleClass('overflow')
})

});

/* Menu */

window.onload=()=>{
   const $ = document.querySelector.bind(document);
const $All = document.querySelectorAll.bind(document);

$('#menu').onclick=()=>{
 $('#menu').classList.toggle('rotate')
 $('.nav-page1').classList.toggle('transform')
 $('.nav-page2').classList.toggle('transform')
 $('.menu-line1').classList.toggle('rotate1')
  $('.menu-line2').classList.toggle('rotate2')
}
}


// $('.menuClosed').click(function(){

//  $('.nav-page1').removeClass('transform')
//  $('.nav-page2').removeClass('transform')

// });


$('body').on('click', '.menuClosed', function () {
   $('.nav-page1').removeClass('transform')
   $('.nav-page2').removeClass('transform')

});



  

$('.ProjectNav').mouseenter(function(){
//$('.MegaMenuContainer').removeClass('MegaMenuActive')
$('.ProjectNav').removeClass('ActiveLink')
var target = $(this).attr('rel');
$("."+target).show('slow').toggleClass('MegaMenuActive');
$(this).parent().find('.ProjectNav').toggleClass('ActiveLink');
});

$('.MegaMenuContainer').mouseleave(function(){
$('.MegaMenuContainer').removeClass('MegaMenuActive')
$('.MegaMenuContainer').removeClass('MegaMenuActive2')
});


$('.ProjectNav2').on('click', function(){
//$('.MegaMenuContainer').removeClass('MegaMenuActive')
$('.ProjectNav2').removeClass('ActiveLink')
var target = $(this).attr('rel');
$("."+target).show('slow').toggleClass('MegaMenuActive2');
$(this).parent().find('.ProjectNav2').toggleClass('ActiveLink');
});



$('#banner .caption h1').addClass('active')

/* $('.ProjectNav').on('click', function(){
$('.MegaMenuContainer').removeClass('MegaMenuActive')
$('.ProjectNav').removeClass('ActiveLink')
var target = $(this).attr('rel');
$("."+target).show('slow').toggleClass('MegaMenuActive');
$(this).parent().find('.ProjectNav').toggleClass('ActiveLink');
});
 */


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("modalbx");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
/* span.onclick = function() {
  modal.style.display = "none";
} */

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
/* 
$('#myModal').on('click', 'button.btn-close', function (eventObject) {
	alert('sssss');
    $('#myModal').modal('hide');
});

 */

	/* function submitForm(){ // attach this function as the event trigger when you want to submit the form
		var form = document.getElementById('ssvenquireNow');
		var formData = form2js(document.getElementById('ssvenquireNow'));
		mg.trackUncommonForm('ssvenquireNow', 'Schedule Site Visit Enquiries', formData, function() {
		// Your custom submission code goes here
		onAjaxFormSubmitHandler(); // call the form submit handler function as a callback to mg.trackUncommonForm
		});
	}
	function submitForm(){ // attach this function as the event trigger when you want to submit the form
		var form = document.getElementById('enquireNow');
		var formData = form2js(document.getElementById('enquireNow'));
		mg.trackUncommonForm('enquireNow', 'Enquire Now', formData, function() {
		// Your custom submission code goes here
		onAjaxFormSubmitHandler(); // call the form submit handler function as a callback to mg.trackUncommonForm
		});
	}
	function submitForm(){ // attach this function as the event trigger when you want to submit the form
		var form = document.getElementById('projectEnquiry');
		var formData = form2js(document.getElementById('projectEnquiry'));
		mg.trackUncommonForm('projectEnquiry', resource_type+' Enquiries', formData, function() {
		// Your custom submission code goes here
		onAjaxFormSubmitHandler(); // call the form submit handler function as a callback to mg.trackUncommonForm
		});
	} */
	/* function submitForm(){
		var form = document.getElementById('ssvenquireNow');
		var formData = form2js(document.getElementById('ssvenquireNow'), 'ssvenquireNow', '::');
		mg.trackUncommonForm('ssvenquireNow', 'Schedule Site Visit Enquiries', formData);
		form.submit();
	}
	
	function submitForm(){
		var form = document.getElementById('enquireNow');
		var formData = form2js(document.getElementById('enquireNow'), 'enquireNow', '::');
		mg.trackUncommonForm('enquireNow', 'Enquire Now', formData);
		form.submit();
	}
	
	function submitForm(){
		var form = document.getElementById('projectEnquiry');
		var formData = form2js(document.getElementById('projectEnquiry'), 'projectEnquiry', '::');
		mg.trackUncommonForm('projectEnquiry', resource_type+' Enquiries', formData);
		form.submit();
	} */
	
	//(function() {      
	//})();
	function metrolead_script(){
		var mgElement = document.createElement('script');
		mgElement.type = 'text/javascript';
		mgElement.async = true;
		mgElement.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 's3.amazonaws.com/metroleads/quasar.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(mgElement, s);
		// Handle Script loading        
		var done = false;        
		var head = document.getElementsByTagName("head")[0] || document.documentElement;       
		mgElement.onload = mgElement.onreadystatechange = function() {         
			if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
				done = true;             
				mg = new MG({}, '30255a29-9e90-4150-9f89-80f5eb0ea723', 'a5f5c344-62a2-4877-91e8-286320411391');
				mg.init();
				// Handle memory leak in IE              
				mgElement.onload = mgElement.onreadystatechange = null;
				if ( head && mgElement.parentNode ) { 
				//head.removeChild( mgElement ); 
				}        
			}       
		};		
	}	  
	
 


