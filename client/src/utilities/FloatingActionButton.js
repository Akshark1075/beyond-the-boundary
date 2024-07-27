import $ from "jquery";

$(document).ready(function () {
  // Event handler for the floating button click
  $(".floatingButtonWrap").on("click", function (e) {
    e.preventDefault();
    $(this).toggleClass("open");

    // Toggle the icon class
    if ($(this).children(".fa").hasClass("fa-plus")) {
      $(this).children(".fa").removeClass("fa-plus").addClass("fa-close");
    } else if ($(this).children(".fa").hasClass("fa-close")) {
      $(this).children(".fa").removeClass("fa-close").addClass("fa-plus");
    }

    // Toggle the floating menu
    $(".floatingMenu").stop().slideToggle();
  });

  // Event handler for clicks outside the floating button and menu
  $(document).on("click", function (e) {
    var container = $(".floatingButton");

    // If the target of the click isn't the container nor a descendant of the container
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

    // If the target of the click isn't the container but is a descendant of the menu
    if (
      !container.is(e.target) &&
      $(".floatingMenu").has(e.target).length > 0
    ) {
      $(".floatingButton").removeClass("open");
      $(".floatingMenu").stop().slideToggle();
    }
  });
});
