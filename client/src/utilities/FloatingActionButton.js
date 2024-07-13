import $ from "jquery";
$(document).ready(function () {
  $(".floatingButton").on("click", function (e) {
    e.preventDefault();
    $(this).toggleClass("open");
    if ($(this).children(".fa").hasClass("fa-plus")) {
      $(this).children(".fa").removeClass("fa-plus");
      $(this).children(".fa").addClass("fa-close");
    } else if ($(this).children(".fa").hasClass("fa-close")) {
      $(this).children(".fa").removeClass("fa-close");
      $(this).children(".fa").addClass("fa-plus");
    }
    $(".floatingMenu").stop().slideToggle();
  });
  $(this).on("click", function (e) {
    var container = $(".floatingButton");
    // if the target of the click isn't the container nor a descendant of the container
    if (
      !container.is(e.target) &&
      $(".floatingButtonWrap").has(e.target).length === 0
    ) {
      if (container.hasClass("open")) {
        container.removeClass("open");
      }
      if (container.children(".fa").hasClass("fa-close")) {
        container.children(".fa").removeClass("fa-close");
        container.children(".fa").addClass("fa-plus");
      }
      $(".floatingMenu").hide();
    }

    // if the target of the click isn't the container and a descendant of the menu
    if (
      !container.is(e.target) &&
      $(".floatingMenu").has(e.target).length > 0
    ) {
      $(".floatingButton").removeClass("open");
      $(".floatingMenu").stop().slideToggle();
    }
  });
});
