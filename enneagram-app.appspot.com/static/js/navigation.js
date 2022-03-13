$(function() {
  var selector = 'nav ul li';
  $(selector).hover(function() {
    $(this).addClass("hover");
  }, function() {
    $(this).removeClass("hover");
  });

  $(selector).click(function() {
    $(selector).removeClass("selected");
    $(this).addClass("selected");
  });
});
