import $ from "jquery";
//script for controlling the open state of floating action button
$(document).ready(function () {
  // Event handler for the floating button click
  $(".floatingButtonWrap").on("click", function (e) {
    e.preventDefault();
    $(this).toggleClass("open");

    if ($(this).children(".fa").hasClass("fa-plus")) {
      $(this).children(".fa").removeClass("fa-plus").addClass("fa-close");
    } else if ($(this).children(".fa").hasClass("fa-close")) {
      $(this).children(".fa").removeClass("fa-close").addClass("fa-plus");
    }

    $(".floatingMenu").stop().slideToggle();
  });

  // Event handler for clicks outside the floating button and menu
  $(document).on("click", function (e) {
    var container = $(".floatingButton");

    if (
      !container.is(e.target) &&
      $(".floatingButtonWrap").has(e.target).length === 0
    ) {
      if (container.hasClass("open")) {
        container.removeClass("open");
      }
      if (container.children(".fa").hasClass("fa-close")) {
        container.children(".fa").removeClass("fa-close").addClass("fa-plus");
      }
      $(".floatingMenu").hide();
    }

    if (
      !container.is(e.target) &&
      $(".floatingMenu").has(e.target).length > 0
    ) {
      $(".floatingButton").removeClass("open");
      $(".floatingMenu").stop().slideToggle();
    }
  });
});
