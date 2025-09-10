$(document).ready(function () {
  // header
  // image change on hove of links
  // var headerImg = $('.imgWrap img');
  // $('.menu a').on('mouseenter', function () {
  //   var imgMenu = $(this).data('img');
  //   headerImg.attr('src', imgMenu);
  // });
  // $('.menu a').on('mouseleave', function () {
  //   headerImg.attr('src', 'images/projectspix1.jpg');
  // });

  //
  $('li.hasDropdown').mouseenter(function () {
    var target = $(this).attr('rel');
    console.log(target);
    $(target).toggleClass('active');
  });

  $('.hasDropdown').mouseleave(function () {
    $('.ag-menu').removeClass('active');
  });

  $(document).on('click', function (e) {
    if ($(e.target).closest('.hasDropdown').length === 0) {
      $('.ag-menu').removeClass('active');
    }
  });

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 50) {
      $('.ag-menu').removeClass('active');
    }
  });
});
